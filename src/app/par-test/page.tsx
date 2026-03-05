import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import ProGate from "@/components/layout/ProGate";
import PARTestHubClient from "./PARTestHubClient";
import { PAR_DATA_UPDATED } from "@/data/par-questions";

export const metadata: Metadata = {
  title: "PAR Sample Test",
  description: "Take simulated 60-question Private Pilot Airplane knowledge tests and track your results.",
  robots: { index: false },
};

export default async function PARTestPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">PAR Sample Tests</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Simulated 60-question Private Pilot knowledge tests — 70% required to pass
        </p>
        {PAR_DATA_UPDATED && (
          <p className="text-xs text-muted-foreground/60 mt-1">
            Question bank last updated: {new Date(PAR_DATA_UPDATED).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        )}
      </div>

      <ProGate feature="PAR Sample Tests">
        <PARTestHubClient />
      </ProGate>
    </div>
  );
}
