import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatCurrency, formatDate, getInitials } from "@/lib/utils";
import { PILOT_LEVELS } from "@/data/pilot-levels";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = await db.story.findUnique({
    where: { id },
    select: { title: true, body: true },
  });
  if (!story) return { title: "Story" };
  const description = story.body
    ? story.body.replace(/\s+/g, " ").trim().slice(0, 160)
    : "A pilot training story shared on I Want To Be A Pilot.";
  return {
    title: story.title,
    description,
    openGraph: { title: story.title, description },
  };
}

export default async function StoryDetailPage({ params }: Props) {
  const { id } = await params;

  const story = await db.story.findUnique({
    where: { id },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!story) notFound();

  let levels: string[] = [];
  try {
    levels = JSON.parse(story.pilotLevels) as string[];
  } catch {}

  const author = story.user.name || story.user.email || "";
  const initials = getInitials(author);

  return (
    <div>
      <Link href="/community/stories" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
        ← Back to Stories
      </Link>

      <article className="rounded-lg border border-border bg-card p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
            {initials}
          </div>
          <div>
            <h1 className="text-xl font-bold">{story.title}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              By {author} · {formatDate(story.createdAt.toISOString())}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
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

        <div className="flex gap-6 text-sm text-muted-foreground mb-6 flex-wrap">
          {story.totalMonths && (
            <div>
              <span className="font-medium text-foreground">{story.totalMonths}</span> months
            </div>
          )}
          {story.totalCost && (
            <div>
              <span className="font-medium text-foreground">{formatCurrency(story.totalCost)}</span> total cost
            </div>
          )}
          {story.salaryRange && (
            <div>
              <span className="font-medium text-foreground">{story.salaryRange}</span> salary
            </div>
          )}
        </div>

        <div className="prose prose-sm prose-invert max-w-none">
          {story.body.split("\n\n").map((para, i) => (
            <p key={i} className="text-sm text-foreground leading-relaxed mb-4 last:mb-0">
              {para}
            </p>
          ))}
        </div>
      </article>
    </div>
  );
}
