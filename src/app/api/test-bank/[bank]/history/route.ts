import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPro } from "@/lib/tier";
import { db } from "@/lib/db";
import { isValidTestBank } from "@/lib/test-banks";
import type { TestBankCode } from "@/lib/test-banks";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ bank: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!isPro(session)) {
    return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
  }

  const { bank } = await params;
  if (!isValidTestBank(bank)) {
    return NextResponse.json({ error: "Invalid test bank" }, { status: 400 });
  }

  const code = bank.toUpperCase() as TestBankCode;
  const userId = (session.user as { id: string }).id;

  const attempts = await db.testBankAttempt.findMany({
    where: { userId, testBank: code },
    select: { id: true, score: true, total: true, passed: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ attempts });
}
