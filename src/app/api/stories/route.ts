import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPro } from "@/lib/tier";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = parseInt(searchParams.get("offset") || "0");
    const pilotLevel = searchParams.get("pilotLevel") || undefined;

    const stories = await db.story.findMany({
      where: pilotLevel
        ? { pilotLevels: { contains: pilotLevel } }
        : undefined,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    return NextResponse.json({ stories });
  } catch (err) {
    console.error("Stories GET error:", err);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
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
    const { title, pilotLevels, totalMonths, totalCost, salaryRange, body } = await req.json();

    if (!title || !body || !pilotLevels?.length) {
      return NextResponse.json(
        { error: "title, body, and pilotLevels are required" },
        { status: 400 }
      );
    }

    const story = await db.story.create({
      data: {
        userId,
        title,
        pilotLevels: JSON.stringify(pilotLevels),
        totalMonths: totalMonths || null,
        totalCost: totalCost || null,
        salaryRange: salaryRange || null,
        body,
      },
    });

    return NextResponse.json({ story }, { status: 201 });
  } catch (err) {
    console.error("Stories POST error:", err);
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
  }
}
