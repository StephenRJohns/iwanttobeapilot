"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface Stats {
  totalUsers: number;
  proUsers: number;
  freeUsers: number;
  totalStories: number;
  totalDiscussionPosts: number;
  activePromoCodes: number;
  recentUsers: { id: string; name: string | null; email: string | null; tier: string; createdAt: string }[];
  recentStories: { id: string; title: string; createdAt: string; user: { email: string | null } }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setStats(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!stats) {
    return <p className="text-sm text-muted-foreground">Failed to load stats.</p>;
  }

  const cards = [
    { label: "Total Users", value: stats.totalUsers },
    { label: "Pro Users", value: stats.proUsers },
    { label: "Free Users", value: stats.freeUsers },
    { label: "Stories", value: stats.totalStories },
    { label: "Discussion Posts", value: stats.totalDiscussionPosts },
    { label: "Active Codes", value: stats.activePromoCodes },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {cards.map(({ label, value }) => (
          <div key={label} className="border border-border rounded-lg p-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-2">
              {label}
            </div>
            <div className="text-2xl font-bold">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Recent Registrations
          </h3>
          <div className="space-y-2">
            {stats.recentUsers.map((u) => (
              <div key={u.id} className="border border-border rounded p-2.5">
                <div className="text-sm font-medium truncate">{u.email}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span className={u.tier === "pro" ? "text-primary" : ""}>{u.tier}</span>
                  <span>{new Date(u.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {stats.recentUsers.length === 0 && (
              <p className="text-xs text-muted-foreground">No users yet.</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Recent Stories
          </h3>
          <div className="space-y-2">
            {stats.recentStories.map((s) => (
              <div key={s.id} className="border border-border rounded p-2.5">
                <div className="text-sm font-medium truncate">{s.title}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                  <span>{s.user.email}</span>
                  <span>{new Date(s.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
            {stats.recentStories.length === 0 && (
              <p className="text-xs text-muted-foreground">No stories yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
