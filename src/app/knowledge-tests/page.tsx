import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import ProGate from "@/components/layout/ProGate";
import { TEST_BANKS, getTestBanksByCategory } from "@/lib/test-banks";
import type { TestBankCategory } from "@/lib/test-banks";

export const metadata: Metadata = {
  title: "FAA Knowledge Tests",
  description:
    "Study and practice for 11 FAA knowledge tests — from Sport Pilot to Airline Transport Pilot.",
  robots: { index: false },
};

const CATEGORIES: { category: TestBankCategory; label: string; description: string }[] = [
  {
    category: "Pilot",
    label: "Pilot Certificates",
    description: "Core certificates from Private through ATP",
  },
  {
    category: "Add-on",
    label: "Add-on Ratings",
    description: "Multi-engine, ground instructor, and more",
  },
  {
    category: "Instructor",
    label: "Instructor Certificates",
    description: "CFI, CFII, and FOI test prep",
  },
  {
    category: "Other",
    label: "Other Certificates",
    description: "Sport pilot, recreational pilot, and specialty tests",
  },
];

export default async function KnowledgeTestsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">FAA Knowledge Tests</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Study and take practice exams for {Object.keys(TEST_BANKS).length} FAA knowledge tests
        </p>
      </div>

      <ProGate feature="FAA Knowledge Tests">
        <div className="space-y-8">
          {CATEGORIES.map(({ category, label, description }) => {
            const banks = getTestBanksByCategory(category);
            if (banks.length === 0) return null;
            return (
              <div key={category}>
                <div className="mb-3">
                  <h2 className="text-sm font-semibold">{label}</h2>
                  <p className="text-xs text-muted-foreground">{description}</p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {banks.map((bank) => {
                    const bankLower = bank.code.toLowerCase();
                    return (
                      <div
                        key={bank.code}
                        className="rounded-lg border border-border bg-card p-4 hover:border-primary/30 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-sm font-medium">{bank.name}</h3>
                            <span className="text-xs text-muted-foreground">
                              {bank.code} &middot; {bank.examQuestionCount} questions
                            </span>
                          </div>
                          <span className="text-xs px-2 py-0.5 rounded-full border bg-muted text-muted-foreground border-border">
                            {bank.category}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Link
                            href={`/study/${bankLower}`}
                            className="text-xs px-3 py-1.5 rounded-md border border-primary/30 text-primary hover:bg-primary/10 transition-colors"
                          >
                            Study
                          </Link>
                          <Link
                            href={`/test-prep/${bankLower}`}
                            className="text-xs px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                          >
                            Take Test
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </ProGate>
    </div>
  );
}
