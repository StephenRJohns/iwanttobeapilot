import type { Metadata } from "next";
import SchoolsClient from "./SchoolsClient";

export const metadata: Metadata = {
  title: "Find Flight Schools Near Me",
  description: "Search for FAA-certified flight schools near you. View on a map, get contact info, and read ratings from real pilots.",
  alternates: { canonical: "/schools" },
  openGraph: {
    title: "Find Flight Schools Near Me | I Want To Be A Pilot",
    description: "Search for FAA-certified flight schools near you. View on a map, get contact info, and read ratings from real pilots.",
  },
};

export default function SchoolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Find Flight Schools</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Search for FAA-certified flight schools by zip code
        </p>
      </div>
      <SchoolsClient />
    </div>
  );
}
