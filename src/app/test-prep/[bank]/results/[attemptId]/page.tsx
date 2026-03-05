import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db";
import { isPro } from "@/lib/tier";
import { getTestBank, isValidTestBank } from "@/lib/test-banks";
import { loadTestBankQuestions } from "@/data/load-questions";
import Link from "next/link";
import type { Metadata } from "next";
import type { TestBankCode } from "@/lib/test-banks";

export const metadata: Metadata = {
  title: "Test Results",
  robots: { index: false },
};

interface AnswerRecord {
  questionId: string;
  selectedAnswer: string;
  correct: boolean;
  correctAnswer: string;
}

export default async function TestResultsPage({
  params,
}: {
  params: Promise<{ bank: string; attemptId: string }>;
}) {
  const { bank, attemptId } = await params;
  if (!isValidTestBank(bank)) notFound();

  const config = getTestBank(bank)!;
  const code = config.code as TestBankCode;
  const bankLower = bank.toLowerCase();

  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");
  if (!isPro(session)) redirect(`/test-prep/${bankLower}`);

  const userId = (session.user as { id: string }).id;

  const attempt = await db.testBankAttempt.findFirst({
    where: { id: attemptId, userId, testBank: code },
  });

  if (!attempt) notFound();

  const { questions } = await loadTestBankQuestions(code);
  const qMap = new Map(questions.map((q) => [q.id, q]));
  const answers = attempt.answers as unknown as AnswerRecord[];

  // Group by AOK
  const byAok: Record<string, { correct: number; total: number; wrong: AnswerRecord[] }> = {};
  for (const a of answers) {
    const q = qMap.get(a.questionId);
    const aok = q?.aok || "Unknown";
    if (!byAok[aok]) byAok[aok] = { correct: 0, total: 0, wrong: [] };
    byAok[aok].total++;
    if (a.correct) {
      byAok[aok].correct++;
    } else {
      byAok[aok].wrong.push(a);
    }
  }

  const pct = attempt.total > 0 ? Math.round((attempt.score / attempt.total) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Score hero */}
      <div className="rounded-lg border border-border bg-card p-6 text-center mb-8">
        <p className={`text-5xl font-bold mb-2 ${attempt.passed ? "text-green-400" : "text-red-400"}`}>
          {attempt.score}/{attempt.total}
        </p>
        <p className="text-2xl font-semibold mb-3">{pct}%</p>
        <span
          className={`text-lg font-bold px-4 py-1.5 rounded-full border ${
            attempt.passed
              ? "bg-green-500/10 text-green-400 border-green-500/20"
              : "bg-red-500/10 text-red-400 border-red-500/20"
          }`}
        >
          {attempt.passed ? "PASSED" : "FAILED"}
        </span>
        <p className="text-xs text-muted-foreground mt-4">
          {new Date(attempt.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {/* Section breakdown */}
      <div className="rounded-lg border border-border bg-card p-5 mb-6">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-4">
          Breakdown by Area of Knowledge
        </h2>
        <div className="space-y-3">
          {Object.entries(byAok).map(([aok, data]) => {
            const aokPct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
            return (
              <div key={aok}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-foreground/80">{aok}</span>
                  <span className={`font-medium ${aokPct >= 70 ? "text-green-400" : "text-red-400"}`}>
                    {data.correct}/{data.total} ({aokPct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-border rounded-full">
                  <div
                    className={`h-1.5 rounded-full transition-all ${aokPct >= 70 ? "bg-green-500" : "bg-red-500"}`}
                    style={{ width: `${aokPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wrong answers */}
      {answers.filter((a) => !a.correct).length > 0 && (
        <div className="rounded-lg border border-border bg-card p-5 mb-6">
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-4">
            Incorrect Answers ({answers.filter((a) => !a.correct).length})
          </h2>
          <div className="space-y-4">
            {answers
              .filter((a) => !a.correct)
              .map((a) => {
                const q = qMap.get(a.questionId);
                if (!q) return null;
                const yourChoice = q.choices.find((c) => c.key === a.selectedAnswer);
                const correctChoice = q.choices.find((c) => c.key === a.correctAnswer);
                return (
                  <details key={a.questionId} className="group">
                    <summary className="cursor-pointer list-none flex items-start gap-2 text-sm py-1">
                      <span className="text-red-400 shrink-0 mt-0.5">&times;</span>
                      <span className="text-foreground/80 leading-relaxed line-clamp-2 group-open:line-clamp-none">
                        {q.text}
                      </span>
                    </summary>
                    <div className="mt-3 ml-6 space-y-2 text-xs">
                      <div className="rounded-md border border-red-500/20 bg-red-500/10 px-3 py-2">
                        <span className="text-red-400 font-medium">Your answer: </span>
                        <span className="text-red-300">
                          {a.selectedAnswer || "Not answered"}.{" "}
                          {yourChoice?.text || "(no answer)"}
                        </span>
                      </div>
                      <div className="rounded-md border border-green-500/20 bg-green-500/10 px-3 py-2">
                        <span className="text-green-400 font-medium">Correct answer: </span>
                        <span className="text-green-300">
                          {a.correctAnswer}. {correctChoice?.text}
                        </span>
                      </div>
                    </div>
                  </details>
                );
              })}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        <Link
          href={`/test-prep/${bankLower}/take`}
          className="flex-1 text-center rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Take Another Test
        </Link>
        <Link
          href={`/test-prep/${bankLower}`}
          className="flex-1 text-center rounded-md border border-border text-sm text-muted-foreground py-2.5 hover:bg-secondary hover:text-foreground transition-colors"
        >
          Back to {config.code} Test
        </Link>
      </div>
    </div>
  );
}
