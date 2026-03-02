"use client";

import { useState } from "react";
import { PILOT_LEVELS, HOBBY_PATH_IDS, CAREER_PATH_IDS } from "@/data/pilot-levels";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";

export default function CostsPage() {
  const [tab, setTab] = useState<"hobby" | "career">("career");
  const [expanded, setExpanded] = useState<string | null>(null);

  const levels = (tab === "hobby" ? HOBBY_PATH_IDS : CAREER_PATH_IDS)
    .map((id) => PILOT_LEVELS.find((l) => l.id === id))
    .filter(Boolean) as typeof PILOT_LEVELS;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Pilot Training Costs & Timelines</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Real estimates for every certification level — from student pilot to airline captain
        </p>
      </div>

      {/* Path toggle */}
      <div className="flex gap-2 mb-8 border-b border-border pb-4">
        <button
          onClick={() => setTab("hobby")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "hobby"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Hobby Path
        </button>
        <button
          onClick={() => setTab("career")}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === "career"
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Career Path
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-muted" />
          Non-career
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          Career milestone
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-0">
        {levels.map((level, index) => (
          <div key={level.id} id={level.id} className="flex gap-4">
            {/* Timeline spine */}
            <div className="flex flex-col items-center">
              <div
                className={`w-4 h-4 rounded-full mt-5 shrink-0 border-2 ${
                  level.typicalCareer
                    ? "bg-primary border-primary"
                    : "bg-background border-border"
                }`}
              />
              {index < levels.length - 1 && (
                <div className="w-0.5 flex-1 bg-border mt-1" />
              )}
            </div>

            {/* Card */}
            <div className="flex-1 mb-4">
              <button
                onClick={() => setExpanded(expanded === level.id ? null : level.id)}
                className="w-full text-left rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-sm">{level.label}</h3>
                      {level.typicalCareer && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                          Career
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{level.description}</p>
                  </div>

                  {/* Stats summary */}
                  <div className="flex gap-4 shrink-0 text-right">
                    <div>
                      <div className="text-xs text-muted-foreground">Time</div>
                      <div className="text-sm font-medium">
                        {level.estimatedMonths.min === level.estimatedMonths.max
                          ? `${level.estimatedMonths.min}mo`
                          : `${level.estimatedMonths.min}–${level.estimatedMonths.max}mo`}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Cost</div>
                      <div className="text-sm font-medium">
                        {formatCurrency(level.estimatedCost.min)}–{formatCurrency(level.estimatedCost.max)}
                      </div>
                    </div>
                    {level.salaryRange && (
                      <div className="hidden sm:block">
                        <div className="text-xs text-muted-foreground">Salary</div>
                        <div className="text-sm font-medium text-primary">
                          {formatCurrency(level.salaryRange.min)}–{formatCurrency(level.salaryRange.max)}
                          <span className="text-xs text-muted-foreground">{level.salaryRange.unit}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expand indicator */}
                <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                  <span>{expanded === level.id ? "▲" : "▼"}</span>
                  <span>{expanded === level.id ? "Hide details" : "Show what's next"}</span>
                </div>
              </button>

              {/* Expanded content */}
              {expanded === level.id && (
                <div className="mt-2 rounded-lg border border-border bg-card/50 p-4 text-sm space-y-4">
                  {level.salaryRange && (
                    <div className="sm:hidden">
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-1">
                        Salary Range
                      </p>
                      <p className="text-primary font-semibold">
                        {formatCurrency(level.salaryRange.min)}–{formatCurrency(level.salaryRange.max)}{level.salaryRange.unit}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
                      What to do next
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

                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
                      FAA Requirements
                    </p>
                    <ul className="space-y-1">
                      {level.faaRequirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                          <span className="text-primary shrink-0 mt-0.5">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 rounded-lg border border-border bg-card/50 p-4 text-xs text-muted-foreground">
        <p className="font-medium text-foreground mb-1">Cost Disclaimer</p>
        <p>
          Costs are national estimates and vary significantly by location, aircraft type, instructor rates,
          and individual progress. Actual costs may be higher or lower. Always get quotes from local flight
          schools. These figures are for educational planning purposes only.
        </p>
        <p className="mt-2">
          Ready to start?{" "}
          <Link href="/schools" className="text-primary hover:underline">
            Find a flight school near you
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
