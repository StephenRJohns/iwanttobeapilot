import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 });
    }

    const userId = (session.user as { id: string }).id;

    const promo = await db.promoCode.findFirst({
      where: { code: { equals: code.trim().toUpperCase() } },
    });

    if (!promo) {
      return NextResponse.json({ error: "Invalid promo code" }, { status: 400 });
    }

    if (promo.revoked) {
      return NextResponse.json({ error: "This promo code has been revoked" }, { status: 400 });
    }

    if (promo.expiresAt && promo.expiresAt < new Date()) {
      return NextResponse.json({ error: "This promo code has expired" }, { status: 400 });
    }

    if (promo.uses >= promo.maxUses) {
      return NextResponse.json({ error: "This promo code has already been used" }, { status: 400 });
    }

    // Apply promo
    await db.promoCode.update({
      where: { id: promo.id },
      data: { uses: { increment: 1 } },
    });

    await db.user.update({
      where: { id: userId },
      data: { tier: "pro", promoCodeId: promo.id },
    });

    await db.auditLog.create({
      data: {
        userId,
        action: "promo_code_redeemed",
        target: promo.id,
        details: `Code: ${promo.code}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Promo apply error:", err);
    return NextResponse.json({ error: "Failed to apply promo code" }, { status: 500 });
  }
}
