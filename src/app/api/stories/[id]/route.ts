import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/tier";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const story = await db.story.findUnique({
      where: { id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!story) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ story });
  } catch (err) {
    console.error("Story GET error:", err);
    return NextResponse.json({ error: "Failed to fetch story" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const userId = (session.user as { id: string }).id;

    const story = await db.story.findUnique({ where: { id }, select: { userId: true } });
    if (!story) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (story.userId !== userId && !isAdmin(session as any)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.story.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Story DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete story" }, { status: 500 });
  }
}
