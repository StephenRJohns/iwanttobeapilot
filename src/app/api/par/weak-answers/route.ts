import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPro } from "@/lib/tier";
import { db } from "@/lib/db";
import { PAR_QUESTIONS } from "@/data/par-questions";

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

  const weakAnswers = await db.pARWrongAnswer.findMany({
    where: { userId, wrongCount: { gte: 2 } },
    orderBy: { wrongCount: "desc" },
    take: 50,
  });

  const qMap = new Map(PAR_QUESTIONS.map((q) => [q.id, q]));

  const enriched = weakAnswers
    .map((wa) => ({
      ...wa,
      question: qMap.get(wa.questionId) ?? null,
    }))
    .filter((wa) => wa.question !== null);

  return NextResponse.json({ weakAnswers: enriched });
}
