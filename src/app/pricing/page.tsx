import type { Metadata } from "next";
import PricingClient from "./PricingClient";

export const metadata: Metadata = {
  title: "Pricing — Free & Pro Plans",
  description:
    "Start free and upgrade to Pro for $5.00/month. Pro unlocks the progress timeline, DPE finder, pilot stories, discussion forums, and a free NavLogPro account.",
  openGraph: {
    title: "I Want To Be A Pilot — Pricing",
    description:
      "Free forever or upgrade to Pro for $5.00/month. Includes DPE finder, progress tracker, community, and a free NavLogPro account.",
  },
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return <PricingClient />;
}
