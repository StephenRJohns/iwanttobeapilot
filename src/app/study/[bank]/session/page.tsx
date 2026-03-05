"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import type { TestBankQuestion } from "@/data/test-bank-types";

export default function StudySessionPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-16 flex items-center justify-center gap-3 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Loading questions...</span>
        </div>
      }
    >
      <StudySessionInner />
    </Suspense>
  );
}

function StudySessionInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { bank } = useParams<{ bank: string }>();
  const bankLower = bank.toLowerCase();

  const [questions, setQuestions] = useState<TestBankQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuestions = useCallback(async () => {
    const aoksParam = searchParams.get("aoks") || "";
    const countParam = Number(searchParams.get("count") || "20");
    const aoks = aoksParam ? aoksParam.split(",") : [];

    try {
      const res = await fetch(`/api/test-bank/${bankLower}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aoks, count: countParam }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to load questions");
        return;
      }
      const data = await res.json();
      setQuestions(data.questions);
    } catch {
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchParams, bankLower]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;

  function handleSelect(key: string) {
    if (submitted) return;
    setSelected(key);
  }

  function handleSubmit() {
    if (!selected || !currentQ) return;
    setSubmitted(true);
    if (selected === currentQ.correct) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentIndex + 1 >= totalQ) {
      setDone(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
      setSubmitted(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 flex items-center justify-center gap-3 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
        <span className="text-sm">Loading questions...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
        <button
          onClick={() => router.push(`/study/${bankLower}`)}
          className="mt-4 text-sm text-primary hover:underline"
        >
          &larr; Back to {bank.toUpperCase()} Practice
        </button>
      </div>
    );
  }

  if (done || questions.length === 0) {
    const pct = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;
    const passed = pct >= 70;
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="rounded-lg border border-border bg-card p-6 text-center">
          <h2 className="text-xl font-bold mb-2">Practice Complete!</h2>
          <p className={`text-3xl font-bold mb-1 ${passed ? "text-green-400" : "text-amber-400"}`}>
            {score} / {totalQ}
          </p>
          <p className="text-muted-foreground text-sm mb-6">
            {pct}% correct
            {passed ? " — Great work!" : " — Keep practicing!"}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => router.push(`/study/${bankLower}`)}
              className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Practice Again
            </button>
            <button
              onClick={() => router.push(`/study/${bankLower}`)}
              className="text-sm px-4 py-2 rounded-md border border-border text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              Change Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isCorrect = submitted && selected === currentQ.correct;
  const isWrong = submitted && selected !== currentQ.correct;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-muted-foreground">
          Question {currentIndex + 1} of {totalQ}
        </span>
        <span className="text-xs text-muted-foreground">
          Score: {score}/{currentIndex + (submitted ? 1 : 0)}
        </span>
      </div>
      <div className="w-full h-1.5 bg-border rounded-full mb-6">
        <div
          className="h-1.5 bg-primary rounded-full transition-all"
          style={{ width: `${((currentIndex + (submitted ? 1 : 0)) / totalQ) * 100}%` }}
        />
      </div>

      {/* AOK badge */}
      <div className="mb-3">
        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
          {currentQ.aok}
        </span>
      </div>

      {/* Question */}
      <div className="rounded-lg border border-border bg-card p-5 mb-4">
        <p className="text-sm font-medium leading-relaxed">{currentQ.text}</p>
      </div>

      {/* Choices */}
      <div className="space-y-2 mb-5">
        {currentQ.choices.map((choice) => {
          const isSelected = selected === choice.key;
          const isCorrectChoice = choice.key === currentQ.correct;

          let cls = "w-full text-left rounded-lg border p-4 text-sm transition-colors ";
          if (!submitted) {
            cls += isSelected
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border bg-card text-foreground/80 hover:border-primary/40 hover:bg-primary/5";
          } else {
            if (isCorrectChoice) {
              cls += "border-green-500 bg-green-500/10 text-green-300";
            } else if (isSelected && !isCorrectChoice) {
              cls += "border-red-500 bg-red-500/10 text-red-300";
            } else {
              cls += "border-border bg-card text-muted-foreground";
            }
          }

          return (
            <button key={choice.key} onClick={() => handleSelect(choice.key)} className={cls}>
              <span className="font-semibold mr-2">{choice.key}.</span>
              {choice.text}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {submitted && (
        <div
          className={`rounded-lg border p-4 mb-4 flex items-start gap-3 ${
            isCorrect
              ? "border-green-500/30 bg-green-500/10"
              : "border-red-500/30 bg-red-500/10"
          }`}
        >
          {isCorrect ? (
            <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
          )}
          <div>
            <p className={`text-sm font-medium ${isCorrect ? "text-green-300" : "text-red-300"}`}>
              {isCorrect ? "Correct!" : "Incorrect"}
            </p>
            {isWrong && (
              <p className="text-xs text-muted-foreground mt-1">
                Correct answer:{" "}
                <span className="text-green-400 font-medium">
                  {currentQ.correct}.{" "}
                  {currentQ.choices.find((c) => c.key === currentQ.correct)?.text}
                </span>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {!submitted ? (
          <>
            <button
              onClick={handleSubmit}
              disabled={!selected}
              className="flex-1 rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              Submit Answer
            </button>
            <button
              onClick={() => router.push(`/study/${bankLower}`)}
              className="px-4 py-2.5 rounded-md border border-border text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              Exit
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleNext}
              className="flex-1 rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {currentIndex + 1 >= totalQ ? "See Results" : "Next Question \u2192"}
            </button>
            <button
              onClick={() => router.push(`/study/${bankLower}`)}
              className="px-4 py-2.5 rounded-md border border-border text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              Exit
            </button>
          </>
        )}
      </div>
    </div>
  );
}
