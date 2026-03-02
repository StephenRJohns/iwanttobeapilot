import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

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
    const search = url.searchParams.get("search") || "";
    const tier = url.searchParams.get("tier") || "";
    const role = url.searchParams.get("role") || "";
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "25")));
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    if (search) where.OR = [{ email: { contains: search } }, { name: { contains: search } }];
    if (tier) where.tier = tier;
    if (role) where.role = role;

    const [users, total] = await Promise.all([
      db.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true, name: true, email: true, tier: true, role: true,
          promoCodeId: true, stripeSubscriptionId: true, createdAt: true,
          _count: { select: { stories: true, progress: true } },
        },
      }),
      db.user.count({ where }),
    ]);

    return NextResponse.json({ users, total });
  } catch (err) {
    console.error("Admin users GET error:", err);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await adminGuard();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { email, name, password, role } = await req.json();
    if (!email || !name || !password) {
      return NextResponse.json({ error: "Email, name, and password are required" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await db.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        hashedPassword,
        role: ["user", "admin"].includes(role) ? role : "user",
        tier: "free",
        mustChangePassword: true,
        emailVerified: new Date(),
      },
      select: { id: true, name: true, email: true, tier: true, role: true, createdAt: true },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sessionUser = session.user as any;
    await db.auditLog.create({
      data: {
        userId: sessionUser.id,
        action: "admin_created_user",
        target: newUser.email,
        details: JSON.stringify({ role: newUser.role }),
      },
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (err) {
    console.error("Admin create user error:", err);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}
