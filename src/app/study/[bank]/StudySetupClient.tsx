"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface StudySetupClientProps {
  bank: string;
  areasOfKnowledge: readonly string[];
}

export default function StudySetupClient({ bank, areasOfKnowledge }: StudySetupClientProps) {
  const router = useRouter();
  const bankLower = bank.toLowerCase();
  const [selectedAoks, setSelectedAoks] = useState<string[]>([...areasOfKnowledge]);
  const [count, setCount] = useState(20);

  function toggleAok(aok: string) {
    setSelectedAoks((prev) =>
      prev.includes(aok) ? prev.filter((a) => a !== aok) : [...prev, aok]
    );
  }

  function handleStart() {
    if (selectedAoks.length === 0) return;
    const params = new URLSearchParams({
      aoks: selectedAoks.join(","),
      count: count.toString(),
    });
    router.push(`/study/${bankLower}/session?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
            Areas of Knowledge
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedAoks([...areasOfKnowledge])}
              className="text-xs text-primary hover:underline"
            >
              Select All
            </button>
            <button
              onClick={() => setSelectedAoks([])}
              className="text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              Deselect All
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {areasOfKnowledge.map((aok) => (
            <label key={aok} className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={selectedAoks.includes(aok)}
                onChange={() => toggleAok(aok)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm group-hover:text-foreground text-foreground/80 transition-colors">
                {aok}
              </span>
            </label>
          ))}
        </div>
        {selectedAoks.length === 0 && (
          <p className="text-xs text-red-400 mt-3">Select at least one area of knowledge.</p>
        )}
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-3">
          Number of Questions
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="flex-1 accent-primary"
          />
          <span className="text-sm font-semibold w-10 text-right">{count}</span>
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>10</span>
          <span>100</span>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card/50 p-4">
        <p className="text-xs text-muted-foreground">
          Practice questions provide instant feedback after each answer. Your responses are{" "}
          <span className="font-medium text-foreground/70">not tracked</span> — practice as many
          times as you like without affecting your history.
        </p>
      </div>

      <button
        onClick={handleStart}
        disabled={selectedAoks.length === 0}
        className="w-full rounded-md bg-primary text-primary-foreground py-2.5 text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        Start Practice ({count} questions)
      </button>
    </div>
  );
}
