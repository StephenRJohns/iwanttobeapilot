import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPro } from "@/lib/tier";
import { db } from "@/lib/db";
import { isValidTestBank } from "@/lib/test-banks";
import { loadTestBankQuestions } from "@/data/load-questions";
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

  const weakAnswers = await db.testBankWrongAnswer.findMany({
    where: { userId, testBank: code, wrongCount: { gte: 2 } },
    orderBy: { wrongCount: "desc" },
    take: 50,
  });

  const { questions } = await loadTestBankQuestions(code);
  const qMap = new Map(questions.map((q) => [q.id, q]));

  const enriched = weakAnswers
    .map((wa) => ({
      ...wa,
      question: qMap.get(wa.questionId) ?? null,
    }))
    .filter((wa) => wa.question !== null);

  return NextResponse.json({ weakAnswers: enriched });
}
