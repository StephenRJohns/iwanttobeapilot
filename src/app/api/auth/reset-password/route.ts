import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, code, password } = await req.json();

    if (!email || !code || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();
    const identifier = `reset:${emailLower}`;

    const token = await db.verificationToken.findFirst({ where: { identifier } });

    if (!token) {
      return NextResponse.json({ error: "Invalid or expired reset code" }, { status: 400 });
    }

    if (token.expires < new Date()) {
      await db.verificationToken.deleteMany({ where: { identifier } });
      return NextResponse.json({ error: "Reset code has expired. Please request a new one." }, { status: 400 });
    }

    const valid = await bcrypt.compare(code.trim(), token.token);
    if (!valid) {
      return NextResponse.json({ error: "Invalid reset code" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.user.update({
      where: { email: emailLower },
      data: { hashedPassword, mustChangePassword: false },
    });

    await db.verificationToken.deleteMany({ where: { identifier } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Reset failed. Please try again." }, { status: 500 });
  }
}
