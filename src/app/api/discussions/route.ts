import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPro } from "@/lib/tier";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const limit = parseInt(searchParams.get("limit") || "30");
    const offset = parseInt(searchParams.get("offset") || "0");

    const posts = await db.discussionPost.findMany({
      where: categoryId ? { categoryId } : undefined,
      include: {
        user: { select: { id: true, name: true, email: true } },
        _count: { select: { replies: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({ posts });
  } catch (err) {
    console.error("Discussions GET error:", err);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!isPro(session as any)) {
      return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
    }

    const userId = (session.user as { id: string }).id;
    const { categoryId, title, body } = await req.json();

    if (!categoryId || !title || !body) {
      return NextResponse.json(
        { error: "categoryId, title, and body are required" },
        { status: 400 }
      );
    }

    const post = await db.discussionPost.create({
      data: { userId, categoryId, title, body },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    console.error("Discussions POST error:", err);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
