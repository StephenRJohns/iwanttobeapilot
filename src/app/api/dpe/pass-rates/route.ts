import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isPro } from "@/lib/tier";
import { getPassRates, listCertificateTypes } from "@/lib/dpe-mcp";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!isPro(session)) {
      return NextResponse.json({ error: "Pro subscription required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const certificateType = searchParams.get("certificateType") || undefined;
    const yearStr = searchParams.get("year");
    const year = yearStr ? parseInt(yearStr) : undefined;
    const examinerType = searchParams.get("examinerType") as "DPE" | "FAA Inspector" | "Total" | undefined;
    const typesOnly = searchParams.get("typesOnly") === "true";

    if (typesOnly) {
      const result = await listCertificateTypes(year);
      return NextResponse.json(result);
    }

    const result = await getPassRates({
      certificate_type: certificateType,
      year,
      examiner_type: examinerType,
    });

    return NextResponse.json(result);
  } catch (err) {
    console.error("DPE pass rates error:", err);
    return NextResponse.json({ error: "Failed to fetch pass rate data" }, { status: 500 });
  }
}
