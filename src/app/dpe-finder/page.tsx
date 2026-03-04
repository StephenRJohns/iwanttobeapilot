import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import DPEFinderClient from "./DPEFinderClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DPE Finder — Find Designated Pilot Examiners Near You",
  description:
    "Find FAA Designated Pilot Examiners (DPEs) near you. View checkride pass rate data to choose the right examiner for your practical test.",
  openGraph: {
    title: "DPE Finder — Find Designated Pilot Examiners Near You",
    description:
      "Find FAA Designated Pilot Examiners near you and compare checkride pass rates.",
  },
};

async function getDpeSyncStatus(): Promise<{
  lastChecked: string | null;
  lastDataUpdate: string | null;
  totalRecords: number;
}> {
  const [lastCheck, lastSync, totalRecords, newestRecord] = await Promise.all([
    // Last health check (runs weekly whether or not data was updated)
    db.auditLog.findFirst({
      where: { action: "cron:airmen-inquiry:health-check" },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
    // Last sync where data was actually updated
    db.auditLog.findFirst({
      where: {
        action: "cron:airmen-inquiry:sync-complete",
        details: { contains: '"dataUpdated":true' },
      },
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
    db.dPERecord.count(),
    // Fall back to the newest DPE record's updatedAt (covers manual seeds/imports)
    db.dPERecord.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { updatedAt: true },
    }),
  ]);

  return {
    lastChecked: lastCheck?.createdAt.toISOString() ?? null,
    lastDataUpdate:
      lastSync?.createdAt.toISOString() ??
      newestRecord?.updatedAt.toISOString() ??
      null,
    totalRecords,
  };
}

export default async function DPEFinderPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const syncStatus = await getDpeSyncStatus();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold">DPE Finder</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Find Designated Pilot Examiners near you and view FAA pass rate data
          </p>
        </div>
        <div className="text-right text-xs text-muted-foreground space-y-0.5 shrink-0">
          {syncStatus.lastDataUpdate && (
            <p>
              Data last updated:{" "}
              <span className="text-foreground font-medium">
                {new Date(syncStatus.lastDataUpdate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </p>
          )}
          {syncStatus.lastChecked && (
            <p>
              FAA sync last checked:{" "}
              <span className="text-foreground">
                {new Date(syncStatus.lastChecked).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </p>
          )}
          <p className="text-muted-foreground">
            {syncStatus.totalRecords.toLocaleString()} DPEs in database
          </p>
        </div>
      </div>

      {/* Data availability notice — only shown when no DPE records exist yet */}
      {syncStatus.totalRecords === 0 && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 mb-2 text-sm text-amber-300">
          <p className="font-medium mb-0.5">DPE directory data is temporarily unavailable</p>
          <p className="text-amber-300/80 text-xs leading-relaxed">
            We&apos;re waiting on an FAA data release to populate the examiner directory. The search
            and map are disabled until real data is available. FAA aggregate pass rates (below) are
            unaffected.
          </p>
        </div>
      )}

      <DPEFinderClient directoryDisabled={syncStatus.totalRecords === 0} />
    </div>
  );
}
