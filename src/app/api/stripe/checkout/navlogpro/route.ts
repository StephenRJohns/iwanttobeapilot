import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

/**
 * POST /api/stripe/checkout/navlogpro
 *
 * Stripe checkout for NavLog Pro users upgrading to iwanttobeapilot Pro.
 * Does NOT require an existing iwanttobeapilot account.
 * After checkout, the webhook creates or upgrades the account by email.
 *
 * Body: { email: string }
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const emailLower = email.trim().toLowerCase();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

    // Verify the email belongs to a NavLog Pro user
    const navlogproUrl = process.env.NAVLOGPRO_URL;
    const partnerSecret = process.env.PARTNER_API_SECRET;
    if (navlogproUrl && partnerSecret) {
      const verifyRes = await fetch(`${navlogproUrl}/api/partner/verify-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-partner-secret": partnerSecret },
        body: JSON.stringify({ email: emailLower }),
      });
      if (verifyRes.ok) {
        const data = await verifyRes.json();
        if (!data.exists) {
          return NextResponse.json({ error: "No NavLog Pro account found with that email. Please check the email you use on NavLog Pro." }, { status: 404 });
        }
      }
      // If NavLog Pro is unreachable, proceed anyway (graceful degradation)
    }

    const priceId = process.env.STRIPE_NAVLOGPRO_UPGRADE_PRICE_ID;
    if (!priceId) {
      return NextResponse.json({ error: "NavLog Pro upgrade not configured" }, { status: 503 });
    }

    const checkoutSession = await getStripe().checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: emailLower,
      success_url: `${appUrl}/pricing?navlogpro_success=1`,
      cancel_url: `${appUrl}/pricing`,
      metadata: {
        navlogpro_email: emailLower,
        source: "navlogpro_upgrade",
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err) {
    console.error("NavLog Pro checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
