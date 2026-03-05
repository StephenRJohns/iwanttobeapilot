import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPro } from "@/lib/tier";
import { db } from "@/lib/db";
import { PAR_QUESTIONS } from "@/data/par-questions";

export const dynamic = "force-dynamic";

interface AnswerInput {
  questionId: string;
  selectedAnswer: string;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!isPro(session)) {
    return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
  }

  const userId = (session.user as { id: string }).id;
  const { answers, isMiniTest } = await req.json() as {
    answers: AnswerInput[];
    isMiniTest?: boolean;
  };

  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json({ error: "answers array required" }, { status: 400 });
  }

  const questionMap = new Map(PAR_QUESTIONS.map((q) => [q.id, q]));
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

  // Save attempt (skip for mini-tests)
  let attemptId: string | null = null;
  if (!isMiniTest) {
    const attempt = await db.pARTestAttempt.create({
      data: {
        userId,
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
    await db.pARWrongAnswer.upsert({
      where: { userId_questionId: { userId, questionId: wa.questionId } },
      create: { userId, questionId: wa.questionId, wrongCount: 1, lastSeenAt: new Date() },
      update: { wrongCount: { increment: 1 }, lastSeenAt: new Date() },
    });
  }

  return NextResponse.json({ attemptId, score, total, passed, results });
}
