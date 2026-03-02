import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPro } from "@/lib/tier";

export const dynamic = "force-dynamic";

export async function POST() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }
  if (!isPro(session)) {
    return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
  }

  const navlogproUrl = process.env.NAVLOGPRO_URL;
  const secret = process.env.PARTNER_API_SECRET;
  if (!navlogproUrl || !secret) {
    return NextResponse.json({ error: "Partner integration not configured" }, { status: 503 });
  }

  const res = await fetch(`${navlogproUrl}/api/partner/navlogpro-code`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-partner-secret": secret,
    },
    body: JSON.stringify({ email: session.user.email }),
  });

  const data = await res.json();
  if (!res.ok) {
    return NextResponse.json({ error: data.error || "Failed to generate code" }, { status: 500 });
  }

  return NextResponse.json(data);
}
