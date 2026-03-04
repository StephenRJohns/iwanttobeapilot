import { handlers } from "@/lib/auth";
import { NextRequest } from "next/server";

const origPOST = handlers.POST;

export const GET = handlers.GET;

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  console.log("[auth-route] POST", url.pathname, url.searchParams.toString());
  try {
    const res = await origPOST(req);
    console.log("[auth-route] response status:", res?.status);
    return res;
  } catch (err) {
    console.error("[auth-route] error:", err);
    throw err;
  }
}
