"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, ClipboardCheck, History, AlertTriangle } from "lucide-react";

interface TestAttempt {
  id: string;
  score: number;
  total: number;
  passed: boolean;
  createdAt: string;
}

interface WeakAnswer {
  id: string;
  questionId: string;
  wrongCount: number;
  lastSeenAt: string;
  question: {
    id: string;
    aok: string;
    text: string;
  } | null;
}

type Tab = "take" | "history" | "weak";

export default function PARTestHubClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("take");
  const [history, setHistory] = useState<TestAttempt[]>([]);
  const [weak, setWeak] = useState<WeakAnswer[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [weakLoading, setWeakLoading] = useState(false);
  const [startingTest, setStartingTest] = useState(false);

  useEffect(() => {
    if (tab === "history" && history.length === 0) {
      setHistoryLoading(true);
      fetch("/api/par/test/history")
        .then((r) => r.json())
        .then((d) => setHistory(d.attempts || []))
        .finally(() => setHistoryLoading(false));
    }
    if (tab === "weak" && weak.length === 0) {
      setWeakLoading(true);
      fetch("/api/par/weak-answers")
        .then((r) => r.json())
        .then((d) => setWeak(d.weakAnswers || []))
        .finally(() => setWeakLoading(false));
    }
  }, [tab, history.length, weak.length]);

  async function handleStartTest() {
    setStartingTest(true);
    router.push("/par-test/take");
  }

  function handleMiniTest() {
    const ids = weak.map((w) => w.questionId).join(",");
    router.push(`/par-test/take?mini=true&ids=${ids}`);
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "take", label: "Take a Test", icon: ClipboardCheck },
    { id: "history", label: "My History", icon: History },
    { id: "weak", label: "Questions to Work On", icon: AlertTriangle },
  ];

  // Group weak questions by AOK
  const weakByAok = weak.reduce<Record<string, WeakAnswer[]>>((acc, wa) => {
    const aok = wa.question?.aok || "Unknown";
    if (!acc[aok]) acc[aok] = [];
    acc[aok].push(wa);
    return acc;
  }, {});

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-0.5 border-b border-border mb-6">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      {/* Take a Test */}
      {tab === "take" && (
        <div className="max-w-lg">
          <div className="rounded-lg border border-border bg-card p-6 text-center mb-4">
            <div className="text-4xl mb-4">✈</div>
            <h2 className="text-lg font-semibold mb-2">Ready to test yourself?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              60 random questions from all areas of knowledge. You need{" "}
              <span className="font-semibold text-foreground">70% (42/60)</span> to pass — the
              same threshold as the real FAA knowledge test.
            </p>
            <button
              onClick={handleStartTest}
              disabled={startingTest}
              className="flex items-center justify-center gap-2 w-full rounded-md bg-primary text-primary-foreground py-3 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {startingTest && <Loader2 className="h-4 w-4 animate-spin" />}
              Generate 60-Question Test
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center">
            Your results are saved and appear in your history tab.
          </p>
        </div>
      )}

      {/* History */}
      {tab === "history" && (
        <div>
          {historyLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-8">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading history...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-4xl mb-4">📋</div>
              <p className="text-sm">No tests taken yet. Take your first test to see your history here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="text-left pb-3 pr-4">Date</th>
                    <th className="text-left pb-3 pr-4">Score</th>
                    <th className="text-left pb-3 pr-4">Percent</th>
                    <th className="text-left pb-3 pr-4">Result</th>
                    <th className="text-left pb-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {history.map((attempt) => {
                    const pct = Math.round((attempt.score / attempt.total) * 100);
                    return (
                      <tr key={attempt.id} className="hover:bg-card/50">
                        <td className="py-3 pr-4 text-muted-foreground">
                          {new Date(attempt.createdAt).toLocaleDateString("en-US", {
                            month: "short", day: "numeric", year: "numeric",
                          })}
                        </td>
                        <td className="py-3 pr-4 font-medium">
                          {attempt.score}/{attempt.total}
                        </td>
                        <td className="py-3 pr-4">{pct}%</td>
                        <td className="py-3 pr-4">
                          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${
                            attempt.passed
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}>
                            {attempt.passed ? "PASSED" : "FAILED"}
                          </span>
                        </td>
                        <td className="py-3">
                          <Link
                            href={`/par-test/results/${attempt.id}`}
                            className="text-xs text-primary hover:underline"
                          >
                            View Results →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Weak Questions */}
      {tab === "weak" && (
        <div>
          {weakLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground py-8">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading your weak areas...</span>
            </div>
          ) : weak.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <div className="text-4xl mb-4">🎯</div>
              <p className="text-sm">No weak areas identified yet.</p>
              <p className="text-xs mt-1">Questions you miss 2 or more times will appear here.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {weak.length} question{weak.length !== 1 ? "s" : ""} to focus on
                </p>
                <button
                  onClick={handleMiniTest}
                  className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Start Mini-Test ({weak.length} questions)
                </button>
              </div>
              <p className="text-xs text-muted-foreground -mt-4">
                Mini-tests are not tracked in your history.
              </p>

              {Object.entries(weakByAok).map(([aok, items]) => (
                <div key={aok}>
                  <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
                    {aok} ({items.length})
                  </h3>
                  <div className="space-y-2">
                    {items.map((wa) => (
                      <div key={wa.id} className="rounded-lg border border-border bg-card p-3">
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-xs text-foreground/80 leading-relaxed line-clamp-2">
                            {wa.question?.text}
                          </p>
                          <span className="text-[10px] text-red-400 shrink-0 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded">
                            ×{wa.wrongCount}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
