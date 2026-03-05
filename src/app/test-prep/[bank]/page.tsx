import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import ProGate from "@/components/layout/ProGate";
import TestHubClient from "./TestHubClient";
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
  if (!config) return { title: "Test Prep" };
  return {
    title: `${config.code} Sample Test`,
    description: `Take simulated ${config.examQuestionCount}-question ${config.name} knowledge tests and track your results.`,
    robots: { index: false },
  };
}

export default async function TestPrepPage({
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
  const passCount = Math.ceil(config.examQuestionCount * config.passThreshold);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{config.code} Sample Tests</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Simulated {config.examQuestionCount}-question {config.name} knowledge tests — 70% required to pass
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

      <ProGate feature={`${config.code} Sample Tests`}>
        <TestHubClient
          bank={config.code}
          examQuestionCount={config.examQuestionCount}
          passCount={passCount}
        />
      </ProGate>
    </div>
  );
}
