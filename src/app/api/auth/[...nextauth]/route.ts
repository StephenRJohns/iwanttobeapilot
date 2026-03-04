import { handlers } from "@/lib/auth";
import { NextRequest } from "next/server";

const origPOST = handlers.POST;

export const GET = handlers.GET;

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const cookies = req.cookies.getAll().map(c => c.name);
  console.log("[auth-route] POST", url.pathname);
  console.log("[auth-route] cookies present:", cookies.join(", "));
  console.log("[auth-route] content-type:", req.headers.get("content-type"));

  // Clone and peek at body
  const clone = req.clone();
  try {
    const body = await clone.text();
    const params = new URLSearchParams(body);
    console.log("[auth-route] body keys:", [...params.keys()].join(", "));
    console.log("[auth-route] has csrfToken:", params.has("csrfToken"));
  } catch {}

  try {
    const res = await origPOST(req);
    console.log("[auth-route] response status:", res?.status);
    return res;
  } catch (err) {
    console.error("[auth-route] error:", err);
    throw err;
  }
}
