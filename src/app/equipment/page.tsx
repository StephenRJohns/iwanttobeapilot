import type { Metadata } from "next";
import EquipmentClient from "./EquipmentClient";

export const metadata: Metadata = {
  title: "Pilot Equipment Guide — Headsets, Bags, Apps & More",
  description:
    "Everything a pilot needs — aviation headsets, flight bags, kneeboard apps, sectional charts, sunglasses, and more. Curated gear with reviews from real pilots.",
  openGraph: {
    title: "Pilot Equipment Guide — Headsets, Bags, Apps & More",
    description:
      "Curated pilot gear guide — aviation headsets, flight bags, apps, and everything you need for training and flying.",
  },
  alternates: { canonical: "/equipment" },
};

export default function EquipmentPage() {
  return <EquipmentClient />;
}
