import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPro } from "@/lib/tier";
import { db } from "@/lib/db";
import { PAR_QUESTIONS } from "@/data/par-questions";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!isPro(session)) {
    return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
  }

  const userId = (session.user as { id: string }).id;
  const { id } = await params;

  const attempt = await db.pARTestAttempt.findFirst({
    where: { id, userId },
  });

  if (!attempt) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Enrich answers with full question data
  const qMap = new Map(PAR_QUESTIONS.map((q) => [q.id, q]));
  const enrichedAnswers = (attempt.answers as {
    questionId: string;
    selectedAnswer: string;
    correct: boolean;
    correctAnswer: string;
  }[]).map((a) => ({
    ...a,
    question: qMap.get(a.questionId) ?? null,
  }));

  return NextResponse.json({ ...attempt, answers: enrichedAnswers });
}
