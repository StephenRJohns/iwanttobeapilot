"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { isPro } from "@/lib/tier";

const FREE_FEATURES = [
  "Flight school search by zip code",
  "Interactive map with school locations",
  "Free FAA resources & study guides",
  "Complete equipment guide",
  "Cost & timeline estimator",
  "Salary range information",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Visual progress timeline",
  "Step-by-step milestone guidance",
  "DPE finder with FAA pass rate data",
  "Rate schools and DPEs",
  "Read & write pilot stories",
  "Discussion forums",
  "Rate and review equipment",
  "Free NavLogPro account included",
];

export default function PricingClient() {
  const { data: session } = useSession();
  const isProUser = isPro(session);

  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const [promoCode, setPromoCode] = useState("");
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [navlogCode, setNavlogCode] = useState("");
  const [navlogLoading, setNavlogLoading] = useState(false);
  const [navlogError, setNavlogError] = useState("");

  async function claimNavlogCode() {
    setNavlogLoading(true);
    setNavlogError("");
    try {
      const res = await fetch("/api/partner/navlogpro-code", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setNavlogError(data.error || "Failed to generate code");
      } else if (data.alreadyPro) {
        setNavlogCode("ALREADY_PRO");
      } else {
        setNavlogCode(data.code);
      }
    } catch {
      setNavlogError("Failed to connect. Try again.");
    }
    setNavlogLoading(false);
  }

  async function handleCheckout() {
    if (!session?.user) {
      window.location.href = "/auth/register";
      return;
    }

    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: billing === "monthly" ? "pro_monthly" : "pro_yearly" }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to start checkout. Please try again.");
      }
    } catch {
      alert("Failed to start checkout. Please try again.");
    }
    setCheckoutLoading(false);
  }

  async function handlePromo(e: React.FormEvent) {
    e.preventDefault();
    if (!session?.user) {
      setPromoError("Sign in first to redeem a promo code");
      return;
    }

    setPromoError("");
    setPromoSuccess("");
    setPromoLoading(true);

    try {
      const res = await fetch("/api/promo/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPromoError(data.error || "Invalid promo code");
      } else {
        setPromoSuccess("Promo code applied! You now have Pro access.");
        window.location.reload();
      }
    } catch {
      setPromoError("Failed to apply promo code. Please try again.");
    }

    setPromoLoading(false);
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      {/* NavLogPro bundle callout */}
      <div className="mb-8 rounded-lg bg-rose-600/15 border border-rose-600/40 px-5 py-4 text-center">
        <p className="text-sm font-semibold text-rose-400">
          Pro includes a free NavLogPro account — a $99/year value
        </p>
        <p className="text-xs text-rose-400/80 mt-1">
          NavLogPro is the FAA cross-country nav log builder used by student pilots nationwide.
          Get both tools for the price of one.
        </p>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Simple, Honest Pricing</h1>
        <p className="text-muted-foreground text-sm">
          Start free. Upgrade when you&apos;re ready to go further.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <button
          onClick={() => setBilling("monthly")}
          className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
            billing === "monthly"
              ? "bg-secondary text-foreground"
              : "text-muted-foreground"
          }`}
        >
          Monthly
        </button>
        <button
          onClick={() => setBilling("yearly")}
          className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${
            billing === "yearly"
              ? "bg-secondary text-foreground"
              : "text-muted-foreground"
          }`}
        >
          Yearly{" "}
          <span className="text-xs text-primary font-semibold ml-1">Save 17%</span>
        </button>
      </div>

      {isProUser ? (
        <div className="max-w-md mx-auto text-center rounded-xl border border-primary/30 bg-primary/5 p-8 mb-8">
          <div className="text-3xl mb-3">✈</div>
          <h2 className="text-xl font-bold mb-2">You&apos;re on Pro</h2>
          <p className="text-sm text-muted-foreground mb-4">
            You have full access to all Pro features. Thank you for supporting the site!
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Go to Dashboard
          </Link>

          {/* NavLogPro claim */}
          <div className="mt-5 pt-5 border-t border-border">
            <p className="text-xs text-rose-400 font-medium mb-3">
              Your plan includes a free NavLogPro account
            </p>
            {navlogCode === "ALREADY_PRO" ? (
              <p className="text-xs text-primary">Your email already has a NavLogPro account.</p>
            ) : navlogCode ? (
              <div className="bg-rose-600/10 border border-rose-600/30 rounded-md px-4 py-3">
                <p className="text-xs text-muted-foreground mb-1">Your NavLogPro promo code:</p>
                <p className="text-lg font-mono font-bold text-rose-400 tracking-widest">{navlogCode}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Go to{" "}
                  <a href="https://navlogpro.training/pricing" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    navlogpro.training/pricing
                  </a>{" "}
                  and enter this code to activate your free account.
                </p>
              </div>
            ) : (
              <>
                <button
                  onClick={claimNavlogCode}
                  disabled={navlogLoading}
                  className="inline-flex items-center gap-2 text-sm bg-rose-600/20 text-rose-400 border border-rose-600/30 rounded-md px-4 py-2 hover:bg-rose-600/30 transition-colors disabled:opacity-50"
                >
                  {navlogLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                  {navlogLoading ? "Generating..." : "Get your free NavLogPro code"}
                </button>
                {navlogError && <p className="text-xs text-destructive mt-2">{navlogError}</p>}
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Free tier */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold">Free</h2>
              <div className="text-3xl font-bold mt-1">$0</div>
              <p className="text-xs text-muted-foreground mt-1">Forever free</p>
            </div>

            <ul className="space-y-2 mb-6">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/auth/register"
              className="block w-full text-center border border-border rounded-md py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro tier */}
          <div className="rounded-xl border-2 border-primary bg-card p-6 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                Most Popular
              </span>
            </div>

            <div className="mb-4">
              <h2 className="text-lg font-bold">Pro</h2>
              <div className="text-3xl font-bold mt-1">
                {billing === "monthly" ? "$9.99" : "$8.33"}
                <span className="text-base font-normal text-muted-foreground">/mo</span>
              </div>
              {billing === "yearly" && (
                <p className="text-xs text-muted-foreground mt-1">$99.99 billed annually</p>
              )}
              {billing === "monthly" && (
                <p className="text-xs text-muted-foreground mt-1">Billed monthly, cancel anytime</p>
              )}
            </div>

            <ul className="space-y-2 mb-6">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <span className={f === "Free NavLogPro account included" ? "text-rose-400 mt-0.5" : "text-primary mt-0.5"}>✓</span>
                  <span className={
                    f === "Everything in Free" ? "text-muted-foreground" :
                    f === "Free NavLogPro account included" ? "text-rose-400 font-medium" : ""
                  }>{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={handleCheckout}
              disabled={checkoutLoading}
              className="w-full bg-primary text-primary-foreground rounded-md py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {checkoutLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Redirecting...
                </>
              ) : session?.user ? (
                "Upgrade to Pro"
              ) : (
                "Start with Pro"
              )}
            </button>
          </div>
        </div>
      )}

      {/* Promo code */}
      {!isProUser && (
        <div className="max-w-md mx-auto border border-border rounded-lg p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Have a promo code?</h3>
            <Link href="/help#billing" className="text-xs text-primary hover:underline">Billing FAQ →</Link>
          </div>
          <form onSubmit={handlePromo} className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Enter code"
              className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-primary transition-colors uppercase"
            />
            <button
              type="submit"
              disabled={promoLoading || !promoCode}
              className="bg-secondary text-foreground rounded-md px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {promoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Apply
            </button>
          </form>
          {promoError && (
            <p className="text-xs text-destructive mt-2">{promoError}</p>
          )}
          {promoSuccess && (
            <p className="text-xs text-primary mt-2">{promoSuccess}</p>
          )}
        </div>
      )}

      {/* FAQ */}
      <div className="mt-12 text-center text-xs text-muted-foreground space-y-1">
        <p>Secure payments via Stripe. Cancel anytime from your settings.</p>
        <p>
          Questions?{" "}
          <Link href="/terms" className="text-primary hover:underline">Terms</Link>
          {" · "}
          <Link href="/privacy" className="text-primary hover:underline">Privacy</Link>
        </p>
      </div>
    </div>
  );
}
