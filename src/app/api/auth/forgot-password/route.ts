import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Always return 200 to prevent email enumeration
    if (!email) {
      return NextResponse.json({ success: true });
    }

    const emailLower = email.toLowerCase().trim();

    const user = await db.user.findUnique({ where: { email: emailLower } });

    if (!user || !user.emailVerified || !user.hashedPassword) {
      return NextResponse.json({ success: true });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    const identifier = `reset:${emailLower}`;

    await db.verificationToken.deleteMany({ where: { identifier } });

    await db.verificationToken.create({
      data: {
        identifier,
        token: hashedCode,
        expires,
      },
    });

    await sendPasswordResetEmail(emailLower, code);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ success: true }); // Still return success
  }
}
