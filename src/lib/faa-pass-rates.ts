/**
 * FAA Civil Airmen Statistics scraper & parser.
 * Fetches Table 19 (Practical Test Pass Rates) from faa.gov and stores
 * the parsed results in the PassRateCache DB table.
 *
 * Ported from dpe_data_unifier/src/faa-data.ts — no local file caching
 * (data is persisted in Postgres instead).
 */

import * as XLSX from "xlsx";
import { db } from "@/lib/db";

const FAA_INDEX_URL =
  "https://www.faa.gov/data_research/aviation_data_statistics/civil_airmen_statistics";

interface ExcelLink {
  year: number;
  url: string;
}

export interface RawPassRateRecord {
  year: number;
  certificateType: string;
  examinerType: "DPE" | "FAA Inspector" | "Total";
  taken: number;
  passed: number;
  passRate: number; // 0–100
}

export interface PassRateCacheData {
  lastUpdated: string; // ISO 8601
  records: RawPassRateRecord[];
  availableYears: number[];
  sourceUrls: string[];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Downloads fresh data from FAA, parses it, and writes to PassRateCache.
 * Returns the newly cached data.
 */
export async function refreshPassRates(): Promise<PassRateCacheData> {
  const links = await fetchExcelLinks();
  if (links.length === 0) {
    throw new Error(
      "Could not discover any Excel download links from the FAA statistics page."
    );
  }

  const allRecords: RawPassRateRecord[] = [];
  const sourceUrls: string[] = [];

  for (const link of links) {
    try {
      const records = await fetchAndParseYear(link);
      allRecords.push(...records);
      sourceUrls.push(link.url);
    } catch (err) {
      // Don't fail the whole refresh for one bad year — log and continue.
      console.error(`[faa-pass-rates] Warning: failed to process ${link.url}: ${err}`);
    }
  }

  const availableYears = [...new Set(allRecords.map((r) => r.year))].sort(
    (a, b) => a - b
  );

  const data: PassRateCacheData = {
    lastUpdated: new Date().toISOString(),
    records: allRecords,
    availableYears,
    sourceUrls,
  };

  await db.passRateCache.upsert({
    where: { id: "singleton" },
    update: { data: data as object, lastUpdated: new Date() },
    create: { id: "singleton", data: data as object, lastUpdated: new Date() },
  });

  return data;
}

// ---------------------------------------------------------------------------
// FAA page scraping
// ---------------------------------------------------------------------------

async function fetchExcelLinks(): Promise<ExcelLink[]> {
  const resp = await fetch(FAA_INDEX_URL);
  if (!resp.ok) {
    throw new Error(`FAA index page returned ${resp.status}`);
  }
  const html = await resp.text();

  const seen = new Set<string>();
  const links: ExcelLink[] = [];

  function addLink(url: string, year: number) {
    if (seen.has(url)) return;
    seen.add(url);
    links.push({ year, url });
  }

  // Pattern 1 (years ≤2021): href contains "civil-airmen-statistics" with .xlsx extension
  const xlsxPattern =
    /href="([^"]*(?:civil[-_]airmen[-_]statistics|airmen[-_]statistics)[^"]*\.xlsx?)"/gi;
  for (const match of html.matchAll(xlsxPattern)) {
    let url = match[1];
    if (!url.startsWith("http")) url = `https://www.faa.gov${url}`;
    const yearMatch = url.match(/(\d{4})/);
    if (yearMatch) addLink(url, parseInt(yearMatch[1], 10));
  }

  // Pattern 2 (years ≥2022): anchor text "YYYY Active Civil Airmen Statistics"
  const anchorPattern =
    /<a\b[^>]*\bhref="([^"]+)"[^>]*>\s*(\d{4})(?:\s|&nbsp;)+Active\s+Civil\s+Airmen/gi;
  const subpageLinks: Array<{ year: number; pageUrl: string }> = [];

  for (const match of html.matchAll(anchorPattern)) {
    let url = match[1];
    const year = parseInt(match[2], 10);
    if (!url.startsWith("http")) url = `https://www.faa.gov${url}`;

    if (/\/media\/\d+/.test(url)) {
      addLink(url, year);
    } else if (!url.match(/\.xlsx?$/i)) {
      subpageLinks.push({ year, pageUrl: url });
    } else {
      addLink(url, year);
    }
  }

  // Resolve subpage links
  for (const { year, pageUrl } of subpageLinks) {
    try {
      const subResp = await fetch(pageUrl);
      if (!subResp.ok) continue;
      const subHtml = await subResp.text();

      const xlsMatch = subHtml.match(/href="([^"]*\.xlsx?)"/i);
      if (xlsMatch) {
        let url = xlsMatch[1];
        if (!url.startsWith("http")) url = `https://www.faa.gov${url}`;
        addLink(url, year);
        continue;
      }
      const mediaMatch = subHtml.match(/href="(\/media\/\d+)"/i);
      if (mediaMatch) {
        addLink(`https://www.faa.gov${mediaMatch[1]}`, year);
        continue;
      }
      const jsonFormatUrl = `${pageUrl}?_format=json`;
      const probeResp = await fetch(jsonFormatUrl, { method: "HEAD" });
      const ct = probeResp.headers.get("content-type") ?? "";
      if (probeResp.ok && ct.includes("spreadsheetml")) {
        addLink(jsonFormatUrl, year);
      }
    } catch {
      console.error(`[faa-pass-rates] Warning: could not resolve subpage for year ${year}: ${pageUrl}`);
    }
  }

  links.sort((a, b) => b.year - a.year);
  return links;
}

// ---------------------------------------------------------------------------
// Excel download + parse
// ---------------------------------------------------------------------------

async function fetchAndParseYear(link: ExcelLink): Promise<RawPassRateRecord[]> {
  const resp = await fetch(link.url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status} for ${link.url}`);
  const ab = await resp.arrayBuffer();
  const buffer = Buffer.from(ab);
  return parseExcelBuffer(buffer, link.year);
}

// ---------------------------------------------------------------------------
// Excel parsing — Table 19
// ---------------------------------------------------------------------------

function parseExcelBuffer(buffer: Buffer, year: number): RawPassRateRecord[] {
  const wb = XLSX.read(buffer, { type: "buffer" });

  const sheet = findTable19Sheet(wb);
  if (!sheet) {
    throw new Error(`No Table 19 sheet found in ${year} workbook`);
  }

  const rows = XLSX.utils.sheet_to_json<(string | number | undefined)[]>(
    sheet,
    { header: 1, defval: undefined }
  );

  return extractRecords(rows, year);
}

function findTable19Sheet(wb: XLSX.WorkBook): XLSX.WorkSheet | null {
  for (const name of wb.SheetNames) {
    if (/^t(?:able\s*)?19$/i.test(name)) return wb.Sheets[name];
  }
  for (const name of wb.SheetNames) {
    if (/table\s*19/i.test(name)) return wb.Sheets[name];
  }
  for (const name of wb.SheetNames) {
    const csv = XLSX.utils.sheet_to_csv(wb.Sheets[name]);
    if (/approved/i.test(csv) && /disapproved/i.test(csv) && /examiner/i.test(csv))
      return wb.Sheets[name];
  }
  return null;
}

function extractRecords(
  rows: (string | number | undefined)[][],
  year: number
): RawPassRateRecord[] {
  let groupHeaderIdx = -1;
  for (let i = 0; i < Math.min(rows.length, 20); i++) {
    const rowStr = rows[i].join(" ").toLowerCase();
    if (rowStr.includes("examiner") || rowStr.includes("inspector")) {
      groupHeaderIdx = i;
      break;
    }
  }

  if (groupHeaderIdx === -1) {
    throw new Error("Could not locate group-header row in Table 19");
  }

  const groupRow = rows[groupHeaderIdx];
  let examinerCol = -1;
  let inspectorCol = -1;
  for (let c = 0; c < groupRow.length; c++) {
    const cell = asString(groupRow[c]).toLowerCase();
    if (cell.includes("examiner") && examinerCol === -1) examinerCol = c;
    if (cell.includes("inspector") && inspectorCol === -1) inspectorCol = c;
  }

  if (examinerCol === -1) examinerCol = 1;
  if (inspectorCol === -1) inspectorCol = 5;

  const E = examinerCol;
  const I = inspectorCol;
  const records: RawPassRateRecord[] = [];

  for (let i = groupHeaderIdx + 2; i < rows.length; i++) {
    const row = rows[i];
    const certType = asString(row[0]);
    if (!certType) continue;

    const eApproved = asNumber(row[E]);
    const iApproved = asNumber(row[I]);
    if (eApproved == null && iApproved == null) continue;

    const eDisapproved = asNumber(row[E + 1]) ?? 0;
    const eTotal = asNumber(row[E + 2]) ?? (eApproved ?? 0) + eDisapproved;
    const ePct = asNumber(row[E + 3]);

    if (eApproved != null && eTotal > 0) {
      records.push({
        year,
        certificateType: certType.trim(),
        examinerType: "DPE",
        taken: eTotal,
        passed: eApproved,
        passRate: ePct != null ? ePct * 100 : (eApproved / eTotal) * 100,
      });
    }

    const iDisapproved = asNumber(row[I + 1]) ?? 0;
    const iTotal = asNumber(row[I + 2]) ?? (iApproved ?? 0) + iDisapproved;
    const iPct = asNumber(row[I + 3]);

    if (iApproved != null && iTotal > 0) {
      records.push({
        year,
        certificateType: certType.trim(),
        examinerType: "FAA Inspector",
        taken: iTotal,
        passed: iApproved,
        passRate: iPct != null ? iPct * 100 : (iApproved / iTotal) * 100,
      });
    }

    const tTotal = eTotal + iTotal;
    const tPassed = (eApproved ?? 0) + (iApproved ?? 0);
    if (tTotal > 0) {
      records.push({
        year,
        certificateType: certType.trim(),
        examinerType: "Total",
        taken: tTotal,
        passed: tPassed,
        passRate: (tPassed / tTotal) * 100,
      });
    }
  }

  return records;
}

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function asString(val: unknown): string {
  if (val == null) return "";
  return String(val).trim();
}

function asNumber(val: unknown): number | null {
  if (val == null) return null;
  if (typeof val === "number") return val;
  const n = parseFloat(String(val).replace(/[%,]/g, ""));
  return isNaN(n) ? null : n;
}
