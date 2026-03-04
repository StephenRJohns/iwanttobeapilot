/**
 * Weekly cron job — syncs DPE data from FAA Airmen Inquiry
 * Schedule: every Sunday at 02:00 UTC (configured in vercel.json)
 *
 * Protected by Authorization: Bearer <CRON_SECRET>
 * Vercel cron calls automatically include this header when CRON_SECRET is set.
 *
 * What it does:
 * 1. Health-check the FAA Airmen Inquiry (GET — always works)
 * 2. If up, attempt to enrich each DPE record by searching by name + state
 *    (POST may be blocked by Akamai Bot Manager — failure is logged, not fatal)
 * 3. Log results to AuditLog
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendCronAlertEmail } from "@/lib/email";
import {
  checkAirmenInquiryStatus,
  searchAirman,
  AirmenSearchResult,
} from "@/lib/airmen-inquiry";

export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 min — Vercel Pro limit

const CRON_SECRET = process.env.CRON_SECRET;

function authorized(req: NextRequest): boolean {
  if (!CRON_SECRET) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${CRON_SECRET}`;
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results = {
    checkedAt: new Date().toISOString(),
    airmenInquiryStatus: null as Awaited<ReturnType<typeof checkAirmenInquiryStatus>> | null,
    enriched: 0,
    skipped: 0,
    blocked: false,
    errors: [] as string[],
  };

  // Step 1: Health check
  const status = await checkAirmenInquiryStatus();
  results.airmenInquiryStatus = status;

  await db.auditLog.create({
    data: {
      action: "cron:airmen-inquiry:health-check",
      details: JSON.stringify(status),
    },
  });

  if (!status.up) {
    try {
      await sendCronAlertEmail(
        "DPE sync FAILED — FAA Airmen Inquiry is down",
        `Sync attempted at ${results.checkedAt}\n\nThe FAA Airmen Inquiry site is unreachable. Enrichment was skipped this cycle.\n\nStatus: ${JSON.stringify(status, null, 2)}`,
      );
    } catch { /* non-fatal */ }
    return NextResponse.json({
      ...results,
      message: "FAA Airmen Inquiry is down — skipping enrichment",
    });
  }

  // Step 2: Enrich DPE records — try one test search first to check bot detection
  const testResult: AirmenSearchResult = await searchAirman("Smith", "", "TX");

  if (testResult.blocked) {
    results.blocked = true;
    await db.auditLog.create({
      data: {
        action: "cron:airmen-inquiry:blocked",
        details: "Akamai Bot Manager blocked POST — skipping enrichment this cycle",
      },
    });
    try {
      await sendCronAlertEmail(
        "DPE sync FAILED — bot detection blocked requests",
        `Sync attempted at ${results.checkedAt}\n\nAkamai Bot Manager blocked POST requests to FAA Airmen Inquiry. Enrichment was skipped this cycle.`,
      );
    } catch { /* non-fatal */ }
    return NextResponse.json({
      ...results,
      message: "Site is up but POST requests are bot-blocked — health check logged",
    });
  }

  // Step 3: If not blocked, process all DPEs in batches
  // Only enrich records that have a real-looking name (not DPE-XXXXX seed format)
  const dpes = await db.dPERecord.findMany({
    where: { state: { not: null } },
    select: { id: true, name: true, state: true, city: true },
  });

  for (const dpe of dpes) {
    const nameParts = dpe.name.trim().split(/\s+/);
    const lastName = nameParts[nameParts.length - 1];
    const firstName = nameParts[0];
    const state = dpe.state ?? "";

    if (!lastName || !state) {
      results.skipped++;
      continue;
    }

    try {
      const result = await searchAirman(lastName, firstName, state);

      if (result.blocked) {
        results.blocked = true;
        break; // Bot detection triggered mid-run — stop
      }

      if (result.success && result.records.length === 1) {
        const record = result.records[0];
        // Only update fields we got from the lookup
        const update: Record<string, string> = {};
        if (record.city && !dpe.city) update.city = record.city;
        if (record.zipCode) update.zipCode = record.zipCode;

        if (Object.keys(update).length > 0) {
          await db.dPERecord.update({ where: { id: dpe.id }, data: update });
          results.enriched++;
        } else {
          results.skipped++;
        }
      } else {
        results.skipped++;
      }

      // Polite delay — 2s between requests to avoid hammering
      await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      results.errors.push(`${dpe.name}: ${err instanceof Error ? err.message : String(err)}`);
      results.skipped++;
    }
  }

  // Record the last time data was actually updated (enriched > 0)
  await db.auditLog.create({
    data: {
      action: "cron:airmen-inquiry:sync-complete",
      details: JSON.stringify({
        enriched: results.enriched,
        skipped: results.skipped,
        blocked: results.blocked,
        errorCount: results.errors.length,
        dataUpdated: results.enriched > 0,
      }),
    },
  });

  const summary = `Sync completed at ${results.checkedAt}\n\nEnriched: ${results.enriched}\nSkipped:  ${results.skipped}\nBlocked:  ${results.blocked}\nErrors:   ${results.errors.length}` +
    (results.errors.length > 0 ? `\n\nError details:\n${results.errors.join("\n")}` : "");

  try {
    if (results.errors.length > 0) {
      await sendCronAlertEmail(
        `DPE sync completed with ${results.errors.length} error(s)`,
        summary,
      );
    } else if (results.enriched > 0) {
      await sendCronAlertEmail(
        `DPE sync complete — ${results.enriched} records enriched`,
        summary,
      );
    }
  } catch {
    // Non-fatal — don't fail the cron if email delivery fails
  }

  return NextResponse.json({
    ...results,
    message: results.blocked
      ? "Bot detection triggered mid-run — partial sync"
      : `Sync complete — ${results.enriched} records enriched`,
  });
}
