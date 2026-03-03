import StoriesClient from "./StoriesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pilot Stories — Real Stories from Real Pilots",
  description:
    "Read real stories from pilots about their training journey — how long it took, what it cost, and what they earn. Share your own story.",
  openGraph: {
    title: "Pilot Stories — Real Stories from Real Pilots",
    description:
      "Real stories from pilots about training costs, timelines, and careers. Share yours.",
  },
};

export default function StoriesPage() {
  return <StoriesClient />;
}
