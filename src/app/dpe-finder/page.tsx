import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DPEFinderClient from "./DPEFinderClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DPE Finder",
};

export default async function DPEFinderPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">DPE Finder</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Find Designated Pilot Examiners near you and view FAA pass rate data
        </p>
      </div>

      <DPEFinderClient />
    </div>
  );
}
