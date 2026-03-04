import { handlers } from "@/lib/auth";
import { NextRequest } from "next/server";

const origPOST = handlers.POST;

export const GET = handlers.GET;

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  console.log("[auth-route] POST", url.pathname);

  // Test DB connectivity directly
  if (url.pathname.endsWith("/callback/credentials")) {
    try {
      const { db } = await import("@/lib/db");
      const testUser = await db.user.findUnique({
        where: { email: "admin@iwanttobeapilot.online" },
        select: { id: true, email: true, status: true, emailVerified: true },
      });
      console.log("[auth-route] DB test:", testUser ? `found ${testUser.email}, status=${testUser.status}, verified=${!!testUser.emailVerified}` : "NOT FOUND");
    } catch (err) {
      console.error("[auth-route] DB test FAILED:", err);
    }
  }

  try {
    const res = await origPOST(req);
    console.log("[auth-route] response status:", res?.status);

    // Log response body for debugging
    const clone = res.clone();
    try {
      const text = await clone.text();
      console.log("[auth-route] response body (first 500):", text.substring(0, 500));
    } catch {}

    return res;
  } catch (err) {
    console.error("[auth-route] handler error:", err);
    throw err;
  }
}
