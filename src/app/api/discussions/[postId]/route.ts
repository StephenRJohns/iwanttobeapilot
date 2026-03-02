import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await params;

    const post = await db.discussionPost.findUnique({
      where: { id: postId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        replies: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Increment view count
    await db.discussionPost.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ post });
  } catch (err) {
    console.error("Discussion post GET error:", err);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}
