import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailLower = email.toLowerCase().trim();

    const user = await db.user.findUnique({ where: { email: emailLower } });

    if (!user || user.emailVerified) {
      // Return success anyway to prevent enumeration
      return NextResponse.json({ success: true });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = await bcrypt.hash(code, 10);
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await db.verificationToken.deleteMany({ where: { identifier: emailLower } });

    await db.verificationToken.create({
      data: {
        identifier: emailLower,
        token: hashedCode,
        expires,
      },
    });

    await sendVerificationEmail(emailLower, code);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend code error:", err);
    return NextResponse.json({ error: "Failed to resend code. Please try again." }, { status: 500 });
  }
}
