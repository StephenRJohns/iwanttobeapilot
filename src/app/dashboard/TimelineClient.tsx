"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { PILOT_LEVELS, CAREER_PATH_IDS, HOBBY_PATH_IDS } from "@/data/pilot-levels";
import { EQUIPMENT_ITEMS, getAffiliateUrl, getVendorLabel } from "@/data/equipment";
import { formatCurrency } from "@/lib/utils";

interface UserProgress {
  id: string;
  milestone: string;
  status: string;
  completedAt: string | null;
  notes: string | null;
}

interface TimelineClientProps {
  userId: string;
  pilotGoal: string | null | undefined;
}

const GOAL_OPTIONS = [
  { value: "hobby", label: "Hobby Pilot (Private Enthusiast to PPL)" },
  { value: "instrument", label: "IFR Pilot (PPL + Instrument Rating)" },
  { value: "commercial", label: "Commercial Pilot" },
  { value: "cfi", label: "Flight Instructor (CFI/CFII)" },
  { value: "charter", label: "Private Charter Pilot" },
  { value: "regional", label: "Regional Airline Pilot" },
  { value: "major", label: "Major Airline Captain" },
  { value: "cargo", label: "Major Cargo Pilot" },
];

function getPathForGoal(goal: string): string[] {
  switch (goal) {
    case "hobby": return HOBBY_PATH_IDS;
    case "instrument": return ["student", "private", "instrument"];
    case "commercial": return ["student", "private", "instrument", "commercial"];
    case "cfi": return ["student", "private", "instrument", "commercial", "cfi"];
    case "charter": return ["student", "private", "instrument", "commercial", "multi-engine", "private-charter"];
    case "regional": return ["student", "private", "instrument", "commercial", "multi-engine", "cfi", "regional"];
    case "major": return CAREER_PATH_IDS.filter(id => id !== "cargo");
    case "cargo": return CAREER_PATH_IDS.filter(id => id !== "major");
    default: return CAREER_PATH_IDS;
  }
}

export default function TimelineClient({ userId, pilotGoal }: TimelineClientProps) {
  const [goal, setGoal] = useState(pilotGoal || "");
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/progress")
      .then((r) => r.json())
      .then((data) => {
        setProgress(data.progress || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleGoalChange(newGoal: string) {
    setGoal(newGoal);
    await fetch("/api/user/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pilotGoal: newGoal }),
    });
  }

  async function updateMilestone(milestoneId: string, status: string) {
    setSaving(milestoneId);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestone: milestoneId, status }),
      });
      const data = await res.json();
      if (data.progress) {
        setProgress((prev) => {
          const exists = prev.find((p) => p.milestone === milestoneId);
          if (exists) {
            return prev.map((p) => p.milestone === milestoneId ? data.progress : p);
          }
          return [...prev, data.progress];
        });
      }
    } catch {}
    setSaving(null);
  }

  const pathIds = goal ? getPathForGoal(goal) : [];
  const pathLevels = pathIds
    .map((id) => PILOT_LEVELS.find((l) => l.id === id))
    .filter(Boolean) as typeof PILOT_LEVELS;

  const getStatus = (id: string) =>
    progress.find((p) => p.milestone === id)?.status || "pending";

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Goal selector */}
      <div className="mb-8 rounded-lg border border-border bg-card p-4">
        <label className="text-xs uppercase tracking-wider text-muted-foreground font-medium block mb-2">
          My Pilot Goal
        </label>
        <select
          value={goal}
          onChange={(e) => handleGoalChange(e.target.value)}
          className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
        >
          <option value="">Select your pilot goal...</option>
          {GOAL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {!goal ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-4xl mb-4">🎯</div>
          <p className="text-sm">Select your pilot goal above to see your personalized training timeline.</p>
        </div>
      ) : (
        <div className="space-y-0">
          {pathLevels.map((level, index) => {
            const status = getStatus(level.id);
            const isExpanded = expanded === level.id;

            return (
              <div key={level.id} className="flex gap-4">
                {/* Timeline spine */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => updateMilestone(level.id, status === "completed" ? "pending" : "completed")}
                    disabled={saving === level.id}
                    className={`w-6 h-6 rounded-full mt-4 shrink-0 border-2 transition-all flex items-center justify-center text-xs ${
                      status === "completed"
                        ? "bg-primary border-primary text-primary-foreground"
                        : status === "in_progress"
                        ? "bg-amber-500/20 border-amber-500 animate-pulse"
                        : "bg-background border-border hover:border-primary/50"
                    }`}
                  >
                    {saving === level.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : status === "completed" ? (
                      "✓"
                    ) : null}
                  </button>
                  {index < pathLevels.length - 1 && (
                    <div className={`w-0.5 flex-1 mt-1 ${status === "completed" ? "bg-primary/40" : "bg-border"}`} />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 mb-3">
                  <button
                    onClick={() => setExpanded(isExpanded ? null : level.id)}
                    className={`w-full text-left rounded-lg border p-4 transition-colors ${
                      status === "completed"
                        ? "border-primary/30 bg-primary/5"
                        : status === "in_progress"
                        ? "border-amber-500/30 bg-amber-500/5"
                        : "border-border bg-card hover:border-primary/20"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium text-sm">{level.label}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${
                            status === "completed"
                              ? "bg-primary/10 text-primary border-primary/20"
                              : status === "in_progress"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}>
                            {status === "completed" ? "Completed" : status === "in_progress" ? "In Progress" : "Pending"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{level.description}</p>
                      </div>

                      <div className="text-right shrink-0 hidden sm:block">
                        <div className="text-xs text-muted-foreground">
                          {level.estimatedMonths.min}–{level.estimatedMonths.max} mo
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatCurrency(level.estimatedCost.min)}+
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-muted-foreground mt-2">
                      {isExpanded ? "▲ Hide steps" : "▼ Show what's next"}
                    </div>
                  </button>

                  {/* Expanded steps */}
                  {isExpanded && (
                    <div className="mt-2 rounded-lg border border-border bg-card/50 p-4 space-y-4 text-sm">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
                          What You Will Learn
                        </p>
                        <ul className="space-y-1">
                          {level.whatYouWillLearn.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <span className="text-primary shrink-0 mt-0.5">✦</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
                          Next Steps
                        </p>
                        <ol className="space-y-1">
                          {level.nextSteps.map((step, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs">
                              <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Recommended products */}
                      {level.recommendedProductIds.length > 0 && (() => {
                        const products = level.recommendedProductIds
                          .map(id => EQUIPMENT_ITEMS.find(e => e.id === id))
                          .filter(Boolean) as typeof EQUIPMENT_ITEMS;
                        return (
                          <div>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
                              Recommended Gear
                            </p>
                            <ul className="space-y-1">
                              {products.map(product => (
                                <li key={product.id}>
                                  <a
                                    href={getAffiliateUrl(product)}
                                    target="_blank"
                                    rel="noopener noreferrer sponsored"
                                    data-asin={product.asin}
                                    className="flex items-center justify-between gap-3 rounded px-2 py-1.5 border border-border bg-background hover:border-primary/40 hover:bg-primary/5 transition-colors"
                                  >
                                    <span className="text-xs text-foreground truncate">{product.name}</span>
                                    <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap">
                                      {getVendorLabel(product)} →
                                    </span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                            <p className="text-[10px] text-muted-foreground/50 mt-1">
                              Some links are affiliate links — helps support the site at no extra cost to you.
                            </p>
                          </div>
                        );
                      })()}

                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => updateMilestone(level.id, "in_progress")}
                          disabled={saving === level.id || status === "in_progress"}
                          className="text-xs px-3 py-1.5 rounded-md border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-colors disabled:opacity-50"
                        >
                          Mark In Progress
                        </button>
                        <button
                          onClick={() => updateMilestone(level.id, status === "completed" ? "pending" : "completed")}
                          disabled={saving === level.id}
                          className={`text-xs px-3 py-1.5 rounded-md transition-colors disabled:opacity-50 ${
                            status === "completed"
                              ? "border border-border text-muted-foreground hover:bg-secondary"
                              : "bg-primary text-primary-foreground hover:bg-primary/90"
                          }`}
                        >
                          {status === "completed" ? "Mark Incomplete" : "Mark Complete"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/schools"
          className="text-sm text-primary hover:underline"
        >
          Find a flight school to get started →
        </Link>
      </div>
    </div>
  );
}
