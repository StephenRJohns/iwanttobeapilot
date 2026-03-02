"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { isPro } from "@/lib/tier";
import { PILOT_LEVELS } from "@/data/pilot-levels";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";

interface Story {
  id: string;
  title: string;
  pilotLevels: string;
  totalMonths: number | null;
  totalCost: number | null;
  salaryRange: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export default function StoriesClient() {
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pro = session ? isPro(session as any) : false;

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const params = new URLSearchParams();
    if (filter) params.set("pilotLevel", filter);
    fetch(`/api/stories?${params}`)
      .then((r) => r.json())
      .then((d) => {
        setStories(d.stories || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [filter]);

  function parseLevels(json: string): string[] {
    try {
      return JSON.parse(json) as string[];
    } catch {
      return [];
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
        >
          <option value="">All levels</option>
          {PILOT_LEVELS.map((l) => (
            <option key={l.id} value={l.id}>{l.label}</option>
          ))}
        </select>

        {pro ? (
          <Link
            href="/community/stories/new"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Share Your Story
          </Link>
        ) : (
          <Link
            href="/pricing"
            className="px-4 py-2 border border-border rounded-md text-sm text-muted-foreground hover:border-primary/50 transition-colors"
          >
            Upgrade to share your story
          </Link>
        )}
      </div>

      {stories.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm">No stories yet. Be the first to share your journey!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {stories.map((story) => {
            const levels = parseLevels(story.pilotLevels);
            const author = story.user.name || story.user.email;
            const initials = getInitials(author);

            return (
              <Link
                key={story.id}
                href={`/community/stories/${story.id}`}
                className="block rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1">{story.title}</h3>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {levels.map((lid) => {
                        const level = PILOT_LEVELS.find((l) => l.id === lid);
                        return level ? (
                          <span
                            key={lid}
                            className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                          >
                            {level.label}
                          </span>
                        ) : null;
                      })}
                    </div>
                    <div className="flex gap-4 text-xs text-muted-foreground flex-wrap">
                      {story.totalMonths && (
                        <span>{story.totalMonths} months</span>
                      )}
                      {story.totalCost && (
                        <span>{formatCurrency(story.totalCost)}</span>
                      )}
                      {story.salaryRange && (
                        <span>{story.salaryRange}</span>
                      )}
                      <span>{author}</span>
                      <span>{formatDate(story.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
