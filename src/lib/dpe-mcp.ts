import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

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

// Simple in-memory cache with TTL
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}
const cache = new Map<string, CacheEntry<unknown>>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (entry && entry.expiresAt > Date.now()) return entry.data;
  cache.delete(key);
  return null;
}

function setCached<T>(key: string, data: T): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

async function callMcpTool<T>(toolName: string, params: Record<string, unknown> = {}): Promise<T> {
  const mcpPath = process.env.DPE_MCP_PATH;
  if (!mcpPath) throw new Error("DPE_MCP_PATH environment variable not set");

  const transport = new StdioClientTransport({
    command: "node",
    args: [mcpPath],
  });

  const client = new Client(
    { name: "iwanttobeapilot", version: "1.0.0" },
    { capabilities: {} }
  );

  try {
    await client.connect(transport);
    const result = await client.callTool({ name: toolName, arguments: params });
    const textContent = (result.content as Array<{ type: string; text: string }>).find(
      (c) => c.type === "text"
    );
    if (!textContent) throw new Error("No text content in MCP response");
    return JSON.parse(textContent.text) as T;
  } finally {
    await client.close();
  }
}

export async function getPassRates(params: GetPassRatesParams = {}): Promise<GetPassRatesResult> {
  const cacheKey = `pass_rates:${JSON.stringify(params)}`;
  const cached = getCached<GetPassRatesResult>(cacheKey);
  if (cached) return cached;

  const result = await callMcpTool<GetPassRatesResult>("get_pass_rates", params as Record<string, unknown>);
  setCached(cacheKey, result);
  return result;
}

export async function listYears(): Promise<{ availableYears: number[]; dataLastUpdated: string }> {
  const cacheKey = "list_years";
  const cached = getCached<{ availableYears: number[]; dataLastUpdated: string }>(cacheKey);
  if (cached) return cached;

  const result = await callMcpTool<{ availableYears: number[]; dataLastUpdated: string }>("list_years");
  setCached(cacheKey, result);
  return result;
}

export async function listCertificateTypes(year?: number): Promise<{ certificateTypes: string[] }> {
  const cacheKey = `cert_types:${year ?? "all"}`;
  const cached = getCached<{ certificateTypes: string[] }>(cacheKey);
  if (cached) return cached;

  const result = await callMcpTool<{ certificateTypes: string[] }>(
    "list_certificate_types",
    year ? { year } : {}
  );
  setCached(cacheKey, result);
  return result;
}
