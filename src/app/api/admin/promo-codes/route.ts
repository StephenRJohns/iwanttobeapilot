import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import crypto from "crypto";

export const dynamic = "force-dynamic";

function generateCode(prefix?: string): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const len = prefix ? 6 : 8;
  let random = "";
  const bytes = crypto.randomBytes(len);
  for (let i = 0; i < len; i++) random += chars[bytes[i] % chars.length];
  return prefix ? `${prefix}-${random}` : random;
}

async function adminGuard() {
  const session = await auth();
  if (!session?.user) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session.user as any).role !== "admin") return null;
  return session;
}

export async function GET(req: NextRequest) {
  if (!(await adminGuard())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const url = new URL(req.url);
    const status = url.searchParams.get("status") || "";
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "50")));
    const skip = (page - 1) * limit;
    const now = new Date();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (status === "active") { where.revoked = false; where.OR = [{ expiresAt: null }, { expiresAt: { gt: now } }]; }
    else if (status === "revoked") { where.revoked = true; }
    else if (status === "expired") { where.revoked = false; where.expiresAt = { lte: now }; }

    const [codes, total] = await Promise.all([
      db.promoCode.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      db.promoCode.count({ where }),
    ]);

    return NextResponse.json({ codes, total });
  } catch (err) {
    console.error("Admin promo GET error:", err);
    return NextResponse.json({ error: "Failed to fetch promo codes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!(await adminGuard())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { code, blockName, count, expiresAt } = await req.json();
    const expires = expiresAt ? new Date(expiresAt) : null;

    if (count && count > 0) {
      const batchCount = Math.min(count, 500);
      const prefix = blockName?.trim().toUpperCase() || undefined;
      const created = [];
      for (let i = 0; i < batchCount; i++) {
        let attempts = 0;
        let newCode: string;
        do {
          newCode = generateCode(prefix);
          attempts++;
        } while (attempts < 10 && (await db.promoCode.findUnique({ where: { code: newCode } })));
        created.push(await db.promoCode.create({ data: { code: newCode, blockName: prefix || null, maxUses: 1, expiresAt: expires } }));
      }
      return NextResponse.json({ codes: created, count: created.length }, { status: 201 });
    }

    if (!code || typeof code !== "string") return NextResponse.json({ error: "Code is required" }, { status: 400 });
    const normalized = code.trim().toUpperCase();
    const existing = await db.promoCode.findUnique({ where: { code: normalized } });
    if (existing) return NextResponse.json({ error: "Code already exists" }, { status: 409 });

    const created = await db.promoCode.create({
      data: { code: normalized, blockName: blockName?.trim().toUpperCase() || null, maxUses: 1, expiresAt: expires },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("Admin promo POST error:", err);
    return NextResponse.json({ error: "Failed to create promo code" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!(await adminGuard())) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { ids } = await req.json();
    if (!ids?.length) return NextResponse.json({ error: "No IDs provided" }, { status: 400 });

    const codes = await db.promoCode.findMany({ where: { id: { in: ids } }, select: { id: true, code: true, uses: true } });
    const deletable = codes.filter((c) => c.uses === 0).map((c) => c.id);
    const skipped = codes.filter((c) => c.uses > 0).length;

    if (deletable.length > 0) await db.promoCode.deleteMany({ where: { id: { in: deletable } } });

    return NextResponse.json({ deleted: deletable.length, skipped });
  } catch (err) {
    console.error("Admin promo DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete promo codes" }, { status: 500 });
  }
}
