import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPro } from "@/lib/tier";
import { db } from "@/lib/db";
import { isValidTestBank } from "@/lib/test-banks";
import { loadTestBankQuestions } from "@/data/load-questions";
import type { TestBankCode } from "@/lib/test-banks";

export const dynamic = "force-dynamic";

interface AnswerInput {
  questionId: string;
  selectedAnswer: string;
}

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
  const userId = (session.user as { id: string }).id;
  const { answers, isMiniTest } = (await req.json()) as {
    answers: AnswerInput[];
    isMiniTest?: boolean;
  };

  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: "answers array required" }, { status: 400 });
  }

  const { questions } = await loadTestBankQuestions(code);
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  let score = 0;
  const results: { questionId: string; selectedAnswer: string; correct: boolean; correctAnswer: string }[] = [];

  for (const a of answers) {
    const q = questionMap.get(a.questionId);
    if (!q) continue;
    const isCorrect = q.correct === a.selectedAnswer;
    if (isCorrect) score++;
    results.push({
      questionId: a.questionId,
      selectedAnswer: a.selectedAnswer,
      correct: isCorrect,
      correctAnswer: q.correct,
    });
  }

  const total = results.length;
  const passed = total > 0 && score / total >= 0.7;

  let attemptId: string | null = null;
  if (!isMiniTest) {
    const attempt = await db.testBankAttempt.create({
      data: {
        userId,
        testBank: code,
        score,
        total,
        passed,
        answers: results as object[],
      },
    });
    attemptId = attempt.id;
  }

  // Update wrong answer counts
  const wrongAnswers = results.filter((r) => !r.correct);
  for (const wa of wrongAnswers) {
    await db.testBankWrongAnswer.upsert({
      where: { userId_testBank_questionId: { userId, testBank: code, questionId: wa.questionId } },
      create: { userId, testBank: code, questionId: wa.questionId, wrongCount: 1, lastSeenAt: new Date() },
      update: { wrongCount: { increment: 1 }, lastSeenAt: new Date() },
    });
  }

  return NextResponse.json({ attemptId, score, total, passed, results });
}
