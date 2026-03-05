import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPro } from "@/lib/tier";
import { PAR_QUESTIONS } from "@/data/par-questions";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  if (!isPro(session)) {
    return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
  }

  const { aoks, count } = await req.json();

  const pool = Array.isArray(aoks) && aoks.length > 0
    ? PAR_QUESTIONS.filter((q) => aoks.includes(q.aok))
    : PAR_QUESTIONS;

  const requested = Math.min(Math.max(1, count || 20), 100);

  // Fisher-Yates shuffle, then take the first `requested`
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const questions = shuffled.slice(0, requested);

  return NextResponse.json({ questions });
}
