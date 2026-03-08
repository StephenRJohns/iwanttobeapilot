import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { getResend } from "@/lib/email";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import type Stripe from "stripe";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error("Stripe webhook signature error:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        const subscription = await getStripe().subscriptions.retrieve(
          session.subscription as string
        );

        const stripeData = {
          tier: "pro",
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
        };

        // NavLog Pro upgrade flow — find or create account by email
        const navlogproEmail = session.metadata?.navlogpro_email;
        if (navlogproEmail) {
          const existing = await db.user.findFirst({
            where: { email: { equals: navlogproEmail, mode: "insensitive" } },
          });

          if (existing) {
            await db.user.update({ where: { id: existing.id }, data: stripeData });
          } else {
            // Create new account — user sets password via "forgot password"
            const tempPassword = crypto.randomBytes(24).toString("hex");
            const hashedPassword = await bcrypt.hash(tempPassword, 10);
            await db.user.create({
              data: {
                email: navlogproEmail,
                emailVerified: new Date(),
                hashedPassword,
                mustChangePassword: true,
                ...stripeData,
              },
            });

            // Send setup email
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";
            const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@iwanttobeapilot.com";
            await getResend().emails.send({
              from: FROM,
              to: navlogproEmail,
              subject: "Your IWantToBeAPilot Pro account is ready!",
              html: `
                <div style="font-family:sans-serif;max-width:500px;margin:auto">
                  <h2 style="color:#0ea5e9">Welcome to IWantToBeAPilot Pro!</h2>
                  <p>Your account has been created using your NavLog Pro email address.</p>
                  <p>To sign in, you'll need to set a password. Click below to get started:</p>
                  <a href="${appUrl}/auth/forgot-password" style="display:inline-block;background:#0ea5e9;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;margin-top:16px">Set Your Password</a>
                  <p style="color:#64748b;margin-top:24px">Enter your email (<strong>${navlogproEmail}</strong>) on the forgot password page to receive a reset code.</p>
                </div>`,
            });
          }
          break;
        }

        // Standard flow — userId in metadata
        const userId = session.metadata?.userId;
        if (!userId) break;
        await db.user.update({ where: { id: userId }, data: stripeData });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await db.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (!user) break;

        const isActive = ["active", "trialing"].includes(subscription.status);
        await db.user.update({
          where: { id: user.id },
          data: {
            tier: isActive ? "pro" : "free",
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
          },
        });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const user = await db.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });
        if (!user) break;

        await db.user.update({
          where: { id: user.id },
          data: {
            tier: "free",
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          },
        });
        break;
      }
    }
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
  }

  return NextResponse.json({ received: true });
}
