import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import ProGate from "@/components/layout/ProGate";
import PARPracticeSetupClient from "./PARPracticeSetupClient";
import { PAR_DATA_UPDATED } from "@/data/par-questions";

export const metadata: Metadata = {
  title: "PAR Practice Questions",
  description: "Practice Private Pilot Airplane knowledge test questions by area of knowledge.",
  robots: { index: false },
};

export default async function PARPracticePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">PAR Practice Questions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Practice Private Pilot knowledge test questions by area of knowledge
        </p>
        {PAR_DATA_UPDATED && (
          <p className="text-xs text-muted-foreground/60 mt-1">
            Question bank last updated: {new Date(PAR_DATA_UPDATED).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        )}
      </div>

      <ProGate feature="PAR Practice Questions">
        <PARPracticeSetupClient />
      </ProGate>
    </div>
  );
}
