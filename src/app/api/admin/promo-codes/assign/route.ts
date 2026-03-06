import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function adminGuard() {
  const session = await auth();
  if (!session?.user?.email) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session.user as any).role !== "admin") return null;
  return session;
}

/**
 * POST /api/admin/promo-codes/assign
 *
 * Assigns one or more promo codes to a user as distributor.
 * The user can then share the code(s) with others to redeem.
 *
 * Body:
 *   { email: string, codeId: string }          — assign a single code
 *   { email: string, blockName: string }        — assign all codes in a block
 *   { email: null|"", codeId|blockName: ... }  — unassign (clear distributor)
 */
export async function POST(req: NextRequest) {
  if (!(await adminGuard())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = (await req.json()) as {
      email?: string | null;
      codeId?: string;
      blockName?: string;
    };

    const { email, codeId, blockName } = body;

    if (!codeId && !blockName) {
      return NextResponse.json({ error: "Provide codeId or blockName" }, { status: 400 });
    }

    // Resolve target user (null/empty email = unassign)
    let userId: string | null = null;
    if (email && email.trim()) {
      const user = await db.user.findFirst({
        where: { email: { equals: email.trim(), mode: "insensitive" } },
        select: { id: true, email: true, name: true },
      });
      if (!user) {
        return NextResponse.json({ error: "No user found with that email" }, { status: 404 });
      }
      userId = user.id;
    }

    if (codeId) {
      const promo = await db.promoCode.findUnique({ where: { id: codeId } });
      if (!promo) {
        return NextResponse.json({ error: "Code not found" }, { status: 404 });
      }
      await db.promoCode.update({ where: { id: codeId }, data: { assignedToUserId: userId } });
      return NextResponse.json({ assigned: 1 });
    } else {
      const result = await db.promoCode.updateMany({
        where: { blockName: blockName! },
        data: { assignedToUserId: userId },
      });
      return NextResponse.json({ assigned: result.count });
    }
  } catch (error) {
    console.error("Admin promo assign error:", error);
    return NextResponse.json({ error: "Failed to assign code(s)" }, { status: 500 });
  }
}
