import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export const PLANS = {
  pro_monthly: {
    priceId: process.env.STRIPE_PRO_MONTHLY_PRICE_ID!,
    label: "Pro Monthly",
    price: 9.99,
    interval: "month" as const,
  },
  pro_yearly: {
    priceId: process.env.STRIPE_PRO_YEARLY_PRICE_ID!,
    label: "Pro Yearly",
    price: 99.99,
    interval: "year" as const,
  },
} as const;

export type PlanKey = keyof typeof PLANS;
