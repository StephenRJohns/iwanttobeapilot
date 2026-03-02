import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await db.siteSettings.findUnique({
      where: { id: "singleton" },
    });

    if (!settings) {
      return NextResponse.json({ maintenanceMode: false, message: null });
    }

    return NextResponse.json({
      maintenanceMode: settings.maintenanceMode,
      message: settings.maintenanceMessage,
    });
  } catch {
    return NextResponse.json({ maintenanceMode: false, message: null });
  }
}
