import type { Metadata } from "next";
import CostsClient from "./CostsClient";

export const metadata: Metadata = {
  title: "Pilot Training Costs & Timelines",
  description:
    "Real cost and time estimates for every pilot certification level — from student pilot ($8K–$15K) to airline captain. Includes FAA requirements and next steps.",
  openGraph: {
    title: "Pilot Training Costs & Timelines",
    description:
      "How much does it cost to become a pilot? Real estimates from student pilot to airline captain, including timelines and FAA requirements.",
  },
  alternates: { canonical: "/costs" },
};

export default function CostsPage() {
  return <CostsClient />;
}
