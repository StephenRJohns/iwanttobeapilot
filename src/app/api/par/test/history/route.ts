import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPro } from "@/lib/tier";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!isPro(session)) {
    return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
  }

  const userId = (session.user as { id: string }).id;

  const attempts = await db.pARTestAttempt.findMany({
    where: { userId },
    select: { id: true, score: true, total: true, passed: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ attempts });
}
