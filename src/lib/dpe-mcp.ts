import fs from "fs/promises";
import path from "path";
import os from "os";

export interface PassRateRecord {
  year: number;
  certificateType: string;
  examinerType: "DPE" | "FAA Inspector" | "Total";
  taken: number;
  passed: number;
  failed: number;
  passRate: string;
}

export interface GetPassRatesParams {
  year?: number;
  certificate_type?: string;
  examiner_type?: "DPE" | "FAA Inspector" | "Total";
}

export interface GetPassRatesResult {
  count: number;
  dataLastUpdated: string;
  records: PassRateRecord[];
}

const CACHE_FILE = path.join(os.homedir(), ".cache", "dpe-data-unifier", "data.json");
const BUNDLED_FILE = path.join(process.cwd(), "src", "data", "dpe-data.json");
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface RawRecord {
  year: number;
  certificateType: string;
  examinerType: string;
  taken: number;
  passed: number;
  passRate: number;
}

interface CacheFile {
  lastUpdated: string;
  records: RawRecord[];
  availableYears: number[];
}

// In-memory cache with TTL
let memCache: { data: CacheFile; loadedAt: number } | null = null;

async function loadCache(): Promise<CacheFile> {
  if (memCache && Date.now() - memCache.loadedAt < 5 * 60 * 1000) {
    return memCache.data;
  }
  let filePath = CACHE_FILE;
  try {
    await fs.access(CACHE_FILE);
  } catch {
    filePath = BUNDLED_FILE;
  }
  const raw = await fs.readFile(filePath, "utf8");
  const data = JSON.parse(raw) as CacheFile;
  memCache = { data, loadedAt: Date.now() };
  return data;
}

export async function getPassRates(params: GetPassRatesParams = {}): Promise<GetPassRatesResult> {
  const cache = await loadCache();

  let records = cache.records;

  if (params.year !== undefined) {
    records = records.filter((r) => r.year === params.year);
  }
  if (params.certificate_type) {
    const q = params.certificate_type.toLowerCase();
    records = records.filter((r) => r.certificateType.toLowerCase().includes(q));
  }
  if (params.examiner_type) {
    records = records.filter((r) => r.examinerType === params.examiner_type);
  }

  // Sort: year desc, cert type asc, examiner type asc
  records = [...records].sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    if (a.certificateType !== b.certificateType)
      return a.certificateType.localeCompare(b.certificateType);
    return a.examinerType.localeCompare(b.examinerType);
  });

  const formatted: PassRateRecord[] = records.map((r) => ({
    year: r.year,
    certificateType: r.certificateType,
    examinerType: r.examinerType as PassRateRecord["examinerType"],
    taken: r.taken,
    passed: r.passed,
    failed: r.taken - r.passed,
    passRate: `${r.passRate.toFixed(1)}%`,
  }));

  return {
    count: formatted.length,
    dataLastUpdated: cache.lastUpdated,
    records: formatted,
  };
}

export async function listYears(): Promise<{ availableYears: number[]; dataLastUpdated: string }> {
  const cache = await loadCache();
  return {
    availableYears: cache.availableYears,
    dataLastUpdated: cache.lastUpdated,
  };
}

export async function listCertificateTypes(year?: number): Promise<{ certificateTypes: string[] }> {
  const cache = await loadCache();
  let records = cache.records;
  if (year !== undefined) {
    records = records.filter((r) => r.year === year);
  }
  const types = [...new Set(records.map((r) => r.certificateType))].sort();
  return { certificateTypes: types };
}
