import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = (session.user as { id: string }).id;

    // Cancel Stripe subscription if exists
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { stripeSubscriptionId: true, email: true },
    });

    if (user?.email === process.env.ADMIN_EMAIL) {
      return NextResponse.json({ error: "The primary admin account cannot be deleted" }, { status: 400 });
    }

    if (user?.stripeSubscriptionId) {
      try {
        const { default: Stripe } = await import("stripe");
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
        await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      } catch (err) {
        console.error("Stripe cancel error (non-fatal):", err);
      }
    }

    // Cancel associated NavLog Pro account (non-fatal)
    if (user?.email) {
      try {
        const navlogproUrl = process.env.NAVLOGPRO_URL;
        const secret = process.env.PARTNER_API_SECRET;
        if (navlogproUrl && secret) {
          await fetch(`${navlogproUrl}/api/partner/cancel-account`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "x-partner-secret": secret },
            body: JSON.stringify({ email: user.email }),
          });
        }
      } catch (err) {
        console.error("NavLog Pro cancel error (non-fatal):", err);
      }
    }

    await db.$transaction([
      db.auditLog.deleteMany({ where: { userId } }),
      db.termsAcceptance.deleteMany({ where: { userId } }),
      db.userProgress.deleteMany({ where: { userId } }),
      db.story.deleteMany({ where: { userId } }),
      db.discussionReply.deleteMany({ where: { userId } }),
      db.discussionPost.deleteMany({ where: { userId } }),
      db.rating.deleteMany({ where: { userId } }),
      db.account.deleteMany({ where: { userId } }),
      db.session.deleteMany({ where: { userId } }),
      db.user.delete({ where: { id: userId } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Account DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
