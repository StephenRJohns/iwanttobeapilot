/**
 * FAA Airmen Inquiry scraper
 * Public tool at https://amsrvs.registry.faa.gov/airmeninquiry/
 * ASP.NET WebForms with Akamai Bot Manager — POST requests may be blocked.
 * GET health check always works; data pull requires session cookie + ViewState.
 */

const BASE_URL = "https://amsrvs.registry.faa.gov/airmeninquiry/";
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

export interface AirmenInquiryStatus {
  up: boolean;
  latencyMs: number;
  checkedAt: string;
  error?: string;
}

export interface AirmanRecord {
  name: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  certificates: string[];
}

export interface AirmenSearchResult {
  success: boolean;
  blocked: boolean; // true if Akamai bot detection fired
  records: AirmanRecord[];
  error?: string;
}

/** Quick health check — just a GET, always works even with bot detection */
export async function checkAirmenInquiryStatus(): Promise<AirmenInquiryStatus> {
  const start = Date.now();
  try {
    const resp = await fetch(BASE_URL, {
      method: "GET",
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(10_000),
    });
    const latencyMs = Date.now() - start;
    return {
      up: resp.status === 200,
      latencyMs,
      checkedAt: new Date().toISOString(),
      error: resp.status !== 200 ? `HTTP ${resp.status}` : undefined,
    };
  } catch (err) {
    return {
      up: false,
      latencyMs: Date.now() - start,
      checkedAt: new Date().toISOString(),
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/** Attempt to search for an airman by last name + state.
 *  May return blocked=true if Akamai Bot Manager intercepts the POST. */
export async function searchAirman(
  lastName: string,
  firstName: string,
  state: string
): Promise<AirmenSearchResult> {
  try {
    // Step 1: GET page to get session cookie + hidden fields
    const getResp = await fetch(BASE_URL, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!getResp.ok) {
      return { success: false, blocked: false, records: [], error: `GET ${getResp.status}` };
    }

    // Capture session cookies
    const setCookies = (getResp.headers as Headers & { getSetCookie?: () => string[] })
      .getSetCookie?.() ?? [];
    const cookieHeader = setCookies.map((c: string) => c.split(";")[0]).join("; ");

    const html = await getResp.text();

    // Extract ASP.NET hidden fields
    const vs = html.match(/id="__VIEWSTATE"\s+value="([^"]+)"/)?.[1] ?? "";
    const ev = html.match(/id="__EVENTVALIDATION"\s+value="([^"]+)"/)?.[1] ?? "";
    const vg = html.match(/id="__VIEWSTATEGENERATOR"\s+value="([^"]+)"/)?.[1] ?? "";

    if (!vs || !ev) {
      return { success: false, blocked: false, records: [], error: "Could not extract ViewState" };
    }

    // Step 2: POST search
    const params = new URLSearchParams({
      __VIEWSTATE: vs,
      __EVENTVALIDATION: ev,
      __VIEWSTATEGENERATOR: vg,
      "ctl00$content$ctl01$txtbxLastName": lastName,
      "ctl00$content$ctl01$txtbxFirstName": firstName,
      "ctl00$content$ctl01$ddlSearchState": state,
      "ctl00$content$ctl01$ddlSearchCountry": "USA",
      "ctl00$content$ctl01$btnSearch": "Search",
    });
    const body = params.toString();

    const postResp = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "User-Agent": UA,
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body).toString(),
        Cookie: cookieHeader,
        Referer: BASE_URL,
        Accept: "text/html,application/xhtml+xml",
      },
      body,
      signal: AbortSignal.timeout(15_000),
    });

    const resultHtml = await postResp.text();

    // Detect Akamai block
    if (
      resultHtml.includes("bazadebezolkohpepadr") ||
      resultHtml.includes("cannot be processed at this time") ||
      postResp.status === 403 ||
      postResp.status === 411
    ) {
      return { success: false, blocked: true, records: [], error: "Akamai bot detection blocked request" };
    }

    // Parse "over 50" warning
    if (/over 50 records/i.test(resultHtml)) {
      return { success: false, blocked: false, records: [], error: "Too many results — narrow search criteria" };
    }

    // Parse results table
    const records = parseSearchResults(resultHtml);
    return { success: true, blocked: false, records };
  } catch (err) {
    return {
      success: false,
      blocked: false,
      records: [],
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

function parseSearchResults(html: string): AirmanRecord[] {
  const records: AirmanRecord[] = [];

  // Match rows in the results table — each name appears in a linkbutton
  const nameMatches = html.matchAll(/lnkbtnAirmenName[^>]+>([^<]+)</g);
  for (const match of nameMatches) {
    records.push({
      name: match[1].trim(),
      certificates: [],
    });
  }

  // If detail view (single record), parse address + certificates
  const addressMatch = html.match(/Address[:\s]*<[^>]*>([^<]+)/i);
  const certMatches = html.matchAll(/Certificate[:\s]*<[^>]*>([^<]+)/gi);

  if (addressMatch && records.length === 0) {
    const addrParts = addressMatch[1].trim().split(/,\s*/);
    records.push({
      name: "",
      address: addrParts[0],
      city: addrParts[1],
      state: addrParts[2]?.split(" ")[0],
      zipCode: addrParts[2]?.split(" ")[1],
      certificates: [...certMatches].map((m) => m[1].trim()),
    });
  }

  return records;
}
