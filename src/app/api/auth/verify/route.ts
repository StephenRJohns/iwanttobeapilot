import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    const token = await db.verificationToken.findFirst({
      where: { identifier: emailLower },
    });

    if (!token) {
      return NextResponse.json({ error: "Invalid or expired verification code" }, { status: 400 });
    }

    if (token.expires < new Date()) {
      await db.verificationToken.delete({ where: { identifier_token: { identifier: emailLower, token: token.token } } });
      return NextResponse.json({ error: "Verification code has expired. Please register again." }, { status: 400 });
    }

    const valid = await bcrypt.compare(code.trim(), token.token);
    if (!valid) {
      return NextResponse.json({ error: "Invalid verification code" }, { status: 400 });
    }

    await db.user.update({
      where: { email: emailLower },
      data: { emailVerified: new Date() },
    });

    await db.verificationToken.deleteMany({ where: { identifier: emailLower } });

    // Send welcome email (non-blocking)
    const user = await db.user.findUnique({ where: { email: emailLower } });
    if (user) {
      sendWelcomeEmail(emailLower, user.name || "Pilot").catch(() => {});
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verify error:", err);
    return NextResponse.json({ error: "Verification failed. Please try again." }, { status: 500 });
  }
}
