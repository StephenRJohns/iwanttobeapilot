import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import ProGate from "@/components/layout/ProGate";
import StudySetupClient from "./StudySetupClient";
import { getTestBank } from "@/lib/test-banks";
import { loadTestBankQuestions } from "@/data/load-questions";
import type { TestBankCode } from "@/lib/test-banks";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bank: string }>;
}): Promise<Metadata> {
  const { bank } = await params;
  const config = getTestBank(bank);
  if (!config) return { title: "Study" };
  return {
    title: `${config.code} Practice Questions`,
    description: `Practice ${config.name} knowledge test questions by area of knowledge.`,
    robots: { index: false },
  };
}

export default async function StudyPage({
  params,
}: {
  params: Promise<{ bank: string }>;
}) {
  const { bank } = await params;
  const config = getTestBank(bank);
  if (!config) notFound();

  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const code = config.code as TestBankCode;
  const { lastUpdated } = await loadTestBankQuestions(code);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{config.code} Practice Questions</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Practice {config.name} knowledge test questions by area of knowledge
        </p>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground/60 mt-1">
            Official FAA Question Bank last updated:{" "}
            {new Date(lastUpdated).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}
      </div>

      <ProGate feature={`${config.code} Practice Questions`}>
        <StudySetupClient bank={config.code} areasOfKnowledge={config.areasOfKnowledge} />
      </ProGate>
    </div>
  );
}
