import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session.user as any).role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const [
      totalUsers,
      proUsers,
      freeUsers,
      totalStories,
      totalDiscussionPosts,
      activePromoCodes,
      recentUsers,
      recentStories,
    ] = await Promise.all([
      db.user.count(),
      db.user.count({ where: { tier: "pro" } }),
      db.user.count({ where: { tier: "free" } }),
      db.story.count(),
      db.discussionPost.count(),
      db.promoCode.count({ where: { revoked: false } }),
      db.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, name: true, email: true, tier: true, createdAt: true },
      }),
      db.story.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, title: true, createdAt: true, user: { select: { email: true } } },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      proUsers,
      freeUsers,
      totalStories,
      totalDiscussionPosts,
      activePromoCodes,
      recentUsers,
      recentStories,
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
