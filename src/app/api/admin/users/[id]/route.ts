import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function adminGuard() {
  const session = await auth();
  if (!session?.user) return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session.user as any).role !== "admin") return null;
  return session;
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await adminGuard();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionUser = session.user as any;
    const { tier, role, mustChangePassword } = await req.json();

    if (role && role !== "admin" && sessionUser.id === id) {
      return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {};
    if (tier) { data.tier = tier; if (tier === "free") data.promoCodeId = null; }
    if (role) data.role = role;
    if (typeof mustChangePassword === "boolean") data.mustChangePassword = mustChangePassword;

    const updated = await db.user.update({
      where: { id },
      data,
      select: { id: true, name: true, email: true, tier: true, role: true, createdAt: true },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Admin user PATCH error:", err);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await adminGuard();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionUser = session.user as any;

    if (sessionUser.id === id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id }, select: { email: true, role: true } });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (user.email === "admin@iwanttobeapilot.online") {
      return NextResponse.json({ error: "The primary admin account cannot be deleted" }, { status: 400 });
    }

    await db.$transaction([
      db.auditLog.deleteMany({ where: { userId: id } }),
      db.termsAcceptance.deleteMany({ where: { userId: id } }),
      db.userProgress.deleteMany({ where: { userId: id } }),
      db.story.deleteMany({ where: { userId: id } }),
      db.discussionReply.deleteMany({ where: { userId: id } }),
      db.discussionPost.deleteMany({ where: { userId: id } }),
      db.rating.deleteMany({ where: { userId: id } }),
      db.account.deleteMany({ where: { userId: id } }),
      db.session.deleteMany({ where: { userId: id } }),
      db.user.delete({ where: { id } }),
    ]);

    await db.auditLog.create({
      data: {
        userId: sessionUser.id,
        action: "admin_deleted_user",
        target: user.email || id,
        details: JSON.stringify({ deletedUserId: id }),
      },
    });

    return NextResponse.json({ message: "User deleted" });
  } catch (err) {
    console.error("Admin user DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  }
}
