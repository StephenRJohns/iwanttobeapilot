"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import type { TestBankQuestion } from "@/data/test-bank-types";

type AnswerMap = Record<string, string>;

export default function TestTakePage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-16 flex items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Preparing your test...</span>
        </div>
      }
    >
      <TestTakeInner />
    </Suspense>
  );
}

function TestTakeInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { bank } = useParams<{ bank: string }>();
  const bankLower = bank.toLowerCase();
  const bankUpper = bank.toUpperCase();
  const isMini = searchParams.get("mini") === "true";
  const idsParam = searchParams.get("ids") || "";

  const [questions, setQuestions] = useState<TestBankQuestion[]>([]);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchQuestions = useCallback(async () => {
    try {
      if (isMini && idsParam) {
        const ids = idsParam.split(",");
        const res = await fetch(`/api/test-bank/${bankLower}/questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aoks: [], count: 100 }),
        });
        const data = await res.json();
        const all: TestBankQuestion[] = data.questions || [];
        const filtered = ids
          .map((id) => all.find((q) => q.id === id))
          .filter(Boolean) as TestBankQuestion[];
        setQuestions(filtered.length > 0 ? filtered : all.slice(0, 20));
      } else {
        // Default to examQuestionCount — we pass 100 and let the API cap it,
        // but the test hub page already configured the right count via URL
        const res = await fetch(`/api/test-bank/${bankLower}/questions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aoks: [], count: 100 }),
        });
        if (!res.ok) {
          const d = await res.json();
          setError(d.error || "Failed to load test");
          return;
        }
        const data = await res.json();
        setQuestions(data.questions);
      }
    } catch {
      setError("Failed to load test. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [isMini, idsParam, bankLower]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;
  const answeredCount = Object.keys(answers).length;
  const unansweredCount = totalQ - answeredCount;

  function selectAnswer(questionId: string, key: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: key }));
  }

  async function handleSubmit() {
    setShowConfirm(false);
    setSubmitting(true);

    const payload = questions.map((q) => ({
      questionId: q.id,
      selectedAnswer: answers[q.id] || "",
    }));

    try {
      const res = await fetch(`/api/test-bank/${bankLower}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload, isMiniTest: isMini }),
      });
      const data = await res.json();

      if (isMini) {
        router.push(
          `/study/${bankLower}/session?aoks=&count=0&mini=done&score=${data.score}&total=${data.total}`
        );
        return;
      }

      if (data.attemptId) {
        router.push(`/test-prep/${bankLower}/results/${data.attemptId}`);
      } else {
        setError("Failed to save results. Please try again.");
      }
    } catch {
      setError("Failed to submit test. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Preparing your test...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
        <button
          onClick={() => router.push(`/test-prep/${bankLower}`)}
          className="mt-4 text-sm text-primary hover:underline"
        >
          &larr; Back to {bankUpper} Test
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-sm font-semibold">
            {isMini ? "Mini-Test" : `${bankUpper} Sample Test`}
            {isMini && (
              <span className="ml-2 text-xs text-muted-foreground font-normal">(not tracked)</span>
            )}
          </h1>
          <p className="text-xs text-muted-foreground">
            Question {currentIndex + 1} of {totalQ}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">
            {answeredCount}/{totalQ} answered
          </p>
          {unansweredCount > 0 && (
            <p className="text-xs text-amber-400">{unansweredCount} remaining</p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-border rounded-full mb-6">
        <div
          className="h-1.5 bg-primary rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / totalQ) * 100}%` }}
        />
      </div>

      {/* Question */}
      {currentQ && (
        <>
          <div className="mb-3">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {currentQ.aok}
            </span>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 mb-4">
            <p className="text-sm font-medium leading-relaxed">{currentQ.text}</p>
          </div>

          <div className="space-y-2 mb-6">
            {currentQ.choices.map((choice) => {
              const isSelected = answers[currentQ.id] === choice.key;
              return (
                <button
                  key={choice.key}
                  onClick={() => selectAnswer(currentQ.id, choice.key)}
                  className={`w-full text-left rounded-lg border p-4 text-sm transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-border bg-card text-foreground/80 hover:border-primary/40 hover:bg-primary/5"
                  }`}
                >
                  <span className="font-semibold mr-2">{choice.key}.</span>
                  {choice.text}
                </button>
              );
            })}
          </div>

          {/* Question status dots */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {questions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(i)}
                title={`Question ${i + 1}`}
                className={`w-6 h-6 rounded text-[10px] font-semibold transition-colors ${
                  i === currentIndex
                    ? "bg-primary text-primary-foreground"
                    : answers[q.id]
                    ? "bg-primary/30 text-primary border border-primary/30"
                    : "bg-border text-muted-foreground hover:bg-secondary"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 px-4 py-2.5 rounded-md border border-border text-sm text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </button>

        {currentIndex < totalQ - 1 ? (
          <button
            onClick={() => setCurrentIndex((i) => Math.min(totalQ - 1, i + 1))}
            className="flex items-center gap-1 px-4 py-2.5 rounded-md border border-border text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={() => setShowConfirm(true)}
            disabled={submitting}
            className="flex items-center gap-2 px-6 py-2.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Submit Test
          </button>
        )}
      </div>

      {/* Submit anywhere button */}
      {currentIndex < totalQ - 1 && (
        <div className="mt-4 text-center">
          <button
            onClick={() => setShowConfirm(true)}
            disabled={submitting}
            className="text-xs text-muted-foreground hover:text-foreground underline transition-colors"
          >
            Submit test early
          </button>
        </div>
      )}

      {/* Confirm dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" onClick={() => setShowConfirm(false)} />
          <div className="relative z-10 w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-xl">
            <h3 className="text-base font-semibold mb-2">Submit Test?</h3>
            {unansweredCount > 0 ? (
              <p className="text-sm text-muted-foreground mb-4">
                You have {unansweredCount} unanswered question{unansweredCount !== 1 ? "s" : ""}.
                Unanswered questions will be marked incorrect.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mb-4">
                All {totalQ} questions answered. Ready to submit?
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 rounded-md border border-border text-sm text-muted-foreground hover:bg-secondary transition-colors"
              >
                Keep Reviewing
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
