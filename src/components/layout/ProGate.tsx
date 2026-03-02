"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { isPro } from "@/lib/tier";

interface ProGateProps {
  children: React.ReactNode;
  feature?: string;
  fallback?: React.ReactNode;
}

export default function ProGate({ children, feature, fallback }: ProGateProps) {
  const { data: session } = useSession();

  if (isPro(session)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 text-center">
      <div className="text-2xl mb-3">✈</div>
      <h3 className="text-base font-semibold mb-1">Pro Feature</h3>
      <p className="text-sm text-muted-foreground mb-4">
        {feature
          ? `${feature} is available to Pro members.`
          : "This feature is available to Pro members."}
        {" "}Upgrade to unlock your full pilot training toolkit.
      </p>
      <Link
        href="/pricing"
        className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        Upgrade to Pro
      </Link>
    </div>
  );
}
