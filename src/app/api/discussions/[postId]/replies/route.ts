import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPro, isAdmin } from "@/lib/tier";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!isPro(session as any)) {
      return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
    }

    const { postId } = await params;
    const userId = (session.user as { id: string }).id;
    const { body } = await req.json();

    if (!body?.trim()) {
      return NextResponse.json({ error: "body is required" }, { status: 400 });
    }

    const post = await db.discussionPost.findUnique({ where: { id: postId }, select: { id: true } });
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const reply = await db.discussionReply.create({
      data: { postId, userId, body: body.trim() },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json({ reply }, { status: 201 });
  } catch (err) {
    console.error("Reply POST error:", err);
    return NextResponse.json({ error: "Failed to create reply" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ postId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { postId } = await params;
    const userId = (session.user as { id: string }).id;
    const { replyId } = await req.json();

    if (!replyId) {
      return NextResponse.json({ error: "replyId is required" }, { status: 400 });
    }

    const reply = await db.discussionReply.findUnique({
      where: { id: replyId },
      select: { userId: true, postId: true },
    });

    if (!reply || reply.postId !== postId) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (reply.userId !== userId && !isAdmin(session as any)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.discussionReply.delete({ where: { id: replyId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reply DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete reply" }, { status: 500 });
  }
}
