"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { isPro } from "@/lib/tier";
import { PILOT_LEVELS } from "@/data/pilot-levels";
import Link from "next/link";

export default function NewStoryPage() {
  const { data: session } = useSession();
  const router = useRouter();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pro = session ? isPro(session as any) : false;

  const [title, setTitle] = useState("");
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [totalMonths, setTotalMonths] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [salaryRange, setSalaryRange] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!pro) {
    return (
      <div className="text-center py-16">
        <p className="text-sm text-muted-foreground mb-4">
          Sharing stories is a Pro feature.
        </p>
        <Link
          href="/pricing"
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Upgrade to Pro
        </Link>
      </div>
    );
  }

  function toggleLevel(id: string) {
    setSelectedLevels((prev) =>
      prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim() || selectedLevels.length === 0) {
      setError("Title, at least one pilot level, and story body are required.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          pilotLevels: selectedLevels,
          totalMonths: totalMonths ? parseInt(totalMonths) : null,
          totalCost: totalCost ? parseFloat(totalCost) : null,
          salaryRange: salaryRange.trim() || null,
          body: body.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to submit story");
        return;
      }
      router.push(`/community/stories/${data.story.id}`);
    } catch {
      setError("Failed to submit story");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <Link href="/community/stories" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
        ← Back to Stories
      </Link>

      <h2 className="text-lg font-semibold mb-4">Share Your Story</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. My journey from zero to ATP in 4 years"
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">
            Pilot Levels Achieved *
          </label>
          <div className="flex flex-wrap gap-2">
            {PILOT_LEVELS.map((level) => (
              <button
                key={level.id}
                type="button"
                onClick={() => toggleLevel(level.id)}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  selectedLevels.includes(level.id)
                    ? "bg-primary/10 text-primary border-primary/40"
                    : "bg-background text-muted-foreground border-border hover:border-primary/30"
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">
              Total Months
            </label>
            <input
              type="number"
              value={totalMonths}
              onChange={(e) => setTotalMonths(e.target.value)}
              placeholder="e.g. 48"
              min="1"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">
              Total Cost ($)
            </label>
            <input
              type="number"
              value={totalCost}
              onChange={(e) => setTotalCost(e.target.value)}
              placeholder="e.g. 85000"
              min="0"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">
              Current Salary Range
            </label>
            <input
              type="text"
              value={salaryRange}
              onChange={(e) => setSalaryRange(e.target.value)}
              placeholder="e.g. $80k–$120k"
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-1.5">
            Your Story *
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={10}
            placeholder="Share your journey, lessons learned, advice for others..."
            className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors resize-y"
          />
        </div>

        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {submitting ? "Publishing..." : "Publish Story"}
          </button>
          <Link
            href="/community/stories"
            className="px-4 py-2 border border-border rounded-md text-sm text-muted-foreground hover:bg-secondary transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
