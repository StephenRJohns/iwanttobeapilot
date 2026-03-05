import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPro } from "@/lib/tier";
import { isValidTestBank } from "@/lib/test-banks";
import { loadTestBankQuestions } from "@/data/load-questions";
import type { TestBankCode } from "@/lib/test-banks";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
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
  const { aoks, count } = await req.json();
  const { questions: allQuestions } = await loadTestBankQuestions(code);

  const pool = Array.isArray(aoks) && aoks.length > 0
    ? allQuestions.filter((q) => aoks.includes(q.aok))
    : allQuestions;

  const requested = Math.min(Math.max(1, count || 20), 100);

  // Fisher-Yates shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const questions = shuffled.slice(0, requested);
  return NextResponse.json({ questions });
}
