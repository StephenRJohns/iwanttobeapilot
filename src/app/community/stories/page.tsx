import StoriesClient from "./StoriesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pilot Stories",
};

export default function StoriesPage() {
  return <StoriesClient />;
}
