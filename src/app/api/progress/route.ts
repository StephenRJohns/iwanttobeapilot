import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    const progress = await db.userProgress.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ progress });
  } catch (err) {
    console.error("Progress GET error:", err);
    return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const { milestone, status, notes } = await req.json();

    if (!milestone || !status) {
      return NextResponse.json({ error: "milestone and status are required" }, { status: 400 });
    }

    const progress = await db.userProgress.upsert({
      where: { userId_milestone: { userId, milestone } },
      create: {
        userId,
        milestone,
        status,
        notes: notes || null,
        completedAt: status === "completed" ? new Date() : null,
      },
      update: {
        status,
        notes: notes !== undefined ? notes : undefined,
        completedAt: status === "completed" ? new Date() : status === "pending" ? null : undefined,
      },
    });

    return NextResponse.json({ progress });
  } catch (err) {
    console.error("Progress POST error:", err);
    return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
  }
}
