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

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        tier: true,
        role: true,
        pilotGoal: true,
        zipCode: true,
        hashedPassword: true,
        stripeCurrentPeriodEnd: true,
        stripeSubscriptionId: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      ...user,
      hasPassword: !!user.hashedPassword,
      hashedPassword: undefined,
    });
  } catch (err) {
    console.error("Settings GET error:", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;
    const body = await req.json();

    const allowed = ["name", "zipCode", "pilotGoal"];
    const data: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) data[key] = body[key];
    }

    const updated = await db.user.update({
      where: { id: userId },
      data,
      select: { id: true, name: true, email: true, pilotGoal: true, zipCode: true },
    });

    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error("Settings PATCH error:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
