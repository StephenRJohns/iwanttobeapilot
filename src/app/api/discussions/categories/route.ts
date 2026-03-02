import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await db.discussionCategory.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { posts: true } } },
    });

    return NextResponse.json({ categories });
  } catch (err) {
    console.error("Categories GET error:", err);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
