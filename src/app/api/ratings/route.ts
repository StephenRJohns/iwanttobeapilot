import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isPro } from "@/lib/tier";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const { searchParams } = new URL(req.url);
    const targetType = searchParams.get("targetType");
    const schoolId = searchParams.get("schoolId");
    const dpeId = searchParams.get("dpeId");
    const itemId = searchParams.get("itemId"); // for equipment

    if (!targetType) {
      return NextResponse.json({ error: "targetType is required" }, { status: 400 });
    }

    const where: Record<string, unknown> = { targetType };
    if (schoolId) where.schoolId = schoolId;
    if (dpeId) where.dpeId = dpeId;
    if (itemId) where.title = itemId;

    const ratings = await db.rating.findMany({ where });

    const avgScore =
      ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
        : null;

    const userRating = session?.user?.id
      ? ratings.find((r) => r.userId === (session.user as { id?: string }).id)
      : null;

    return NextResponse.json({
      avgScore,
      count: ratings.length,
      userScore: userRating?.score ?? null,
    });
  } catch (err) {
    console.error("Ratings GET error:", err);
    return NextResponse.json({ error: "Failed to fetch ratings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!isPro(session)) {
      return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
    }

    const { targetType, schoolId, dpeId, itemId, score, title, body } = await req.json();

    if (!targetType || !score || !body) {
      return NextResponse.json({ error: "targetType, score, and body are required" }, { status: 400 });
    }

    if (score < 1 || score > 5) {
      return NextResponse.json({ error: "Score must be between 1 and 5" }, { status: 400 });
    }

    const userId = (session.user as { id: string }).id;

    // Upsert (one rating per user per target)
    const existing = await db.rating.findFirst({
      where: {
        userId,
        targetType,
        ...(schoolId ? { schoolId } : {}),
        ...(dpeId ? { dpeId } : {}),
        ...(itemId ? { title: itemId } : {}),
      },
    });

    let rating;
    if (existing) {
      rating = await db.rating.update({
        where: { id: existing.id },
        data: { score, title: title || itemId || null, body },
      });
    } else {
      rating = await db.rating.create({
        data: {
          userId,
          targetType,
          schoolId: schoolId || null,
          dpeId: dpeId || null,
          score,
          title: title || itemId || null,
          body,
        },
      });
    }

    return NextResponse.json({ rating });
  } catch (err) {
    console.error("Ratings POST error:", err);
    return NextResponse.json({ error: "Failed to save rating" }, { status: 500 });
  }
}
