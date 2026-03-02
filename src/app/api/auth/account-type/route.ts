import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ provider: null });
    }

    const emailLower = email.toLowerCase().trim();
    const user = await db.user.findUnique({
      where: { email: emailLower },
      include: { accounts: true },
    });

    if (!user) {
      return NextResponse.json({ provider: null });
    }

    const googleAccount = user.accounts.find((a) => a.provider === "google");
    if (googleAccount && !user.hashedPassword) {
      return NextResponse.json({ provider: "google" });
    }

    return NextResponse.json({ provider: "credentials" });
  } catch {
    return NextResponse.json({ provider: null });
  }
}
