import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const settings = await db.siteSettings.findUnique({
      where: { id: "singleton" },
    });

    if (!settings) {
      return NextResponse.json({ maintenanceMode: false, message: null, bannerEnabled: false, bannerMessage: null, bannerColor: "blue" });
    }

    return NextResponse.json({
      maintenanceMode: settings.maintenanceMode,
      message: settings.maintenanceMessage,
      bannerEnabled: settings.bannerEnabled,
      bannerMessage: settings.bannerMessage,
      bannerColor: settings.bannerColor,
    });
  } catch {
    return NextResponse.json({ maintenanceMode: false, message: null, bannerEnabled: false, bannerMessage: null, bannerColor: "blue" });
  }
}
