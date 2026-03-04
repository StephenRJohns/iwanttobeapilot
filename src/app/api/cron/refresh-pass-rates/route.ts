/**
 * Weekly cron job — refreshes FAA pass rate data from Civil Airmen Statistics
 * Schedule: every Sunday at 09:00 UTC (configured in .github/workflows/refresh-pass-rates.yml)
 *
 * Protected by Authorization: Bearer <CRON_SECRET>
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendCronAlertEmail } from "@/lib/email";
import { refreshPassRates } from "@/lib/faa-pass-rates";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

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

  const startedAt = new Date().toISOString();

  try {
    const data = await refreshPassRates();

    await db.auditLog.create({
      data: {
        action: "cron:pass-rates:refresh-complete",
        details: JSON.stringify({
          yearsLoaded: data.availableYears,
          recordCount: data.records.length,
          lastUpdated: data.lastUpdated,
        }),
      },
    });

    return NextResponse.json({
      status: "ok",
      startedAt,
      lastUpdated: data.lastUpdated,
      yearsLoaded: data.availableYears,
      recordCount: data.records.length,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    await db.auditLog.create({
      data: {
        action: "cron:pass-rates:refresh-failed",
        details: message,
      },
    });

    try {
      await sendCronAlertEmail(
        "Pass rate refresh FAILED",
        `Refresh attempted at ${startedAt}\n\nError: ${message}`
      );
    } catch { /* non-fatal */ }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
