import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pilot Training Discussion Forums",
  description:
    "Connect with other aspiring pilots. Ask questions, share experiences, and get advice on flight training, certifications, and careers.",
  openGraph: {
    title: "Pilot Training Discussion Forums",
    description:
      "Connect with other pilots. Ask questions and get advice on flight training and aviation careers.",
  },
};

export default async function DiscussionsPage() {
  const categories = await db.discussionCategory.findMany({
    orderBy: { order: "asc" },
    include: {
      _count: { select: { posts: true } },
    },
  });

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Discussion Categories</h2>

      {categories.length === 0 ? (
        <EmptyState
          icon={<MessageSquare className="h-12 w-12" />}
          title="No discussion categories yet"
          description="Forums are being set up. Check back soon!"
        />
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/community/discussions/${cat.slug}`}
              className="block rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-medium text-sm">{cat.name}</h3>
                  {cat.description && (
                    <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>
                  )}
                </div>
                <div className="text-xs text-muted-foreground shrink-0">
                  {cat._count.posts} {cat._count.posts === 1 ? "post" : "posts"}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
