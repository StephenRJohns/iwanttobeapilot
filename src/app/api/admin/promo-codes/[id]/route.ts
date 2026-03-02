import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session.user as any).role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    const { revoked, maxUses, expiresAt } = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {};
    if (typeof revoked === "boolean") data.revoked = revoked;
    if (typeof maxUses === "number") data.maxUses = maxUses;
    if (expiresAt !== undefined) data.expiresAt = expiresAt ? new Date(expiresAt) : null;

    const updated = await db.promoCode.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (err) {
    console.error("Admin promo PATCH error:", err);
    return NextResponse.json({ error: "Failed to update promo code" }, { status: 500 });
  }
}
