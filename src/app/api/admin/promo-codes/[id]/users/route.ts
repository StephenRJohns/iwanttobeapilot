import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session.user as any).role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const users = await db.user.findMany({
      where: { promoCodeId: id },
      select: { id: true, name: true, email: true, tier: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin promo users error:", error);
    return NextResponse.json({ error: "Failed to fetch redeemers" }, { status: 500 });
  }
}
