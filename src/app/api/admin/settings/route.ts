import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

async function getSettings() {
  return (
    (await db.siteSettings.findUnique({ where: { id: "singleton" } })) ??
    (await db.siteSettings.create({ data: { id: "singleton" } }))
  );
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((session.user as any).role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const settings = await getSettings();
    return NextResponse.json(settings);
  } catch (err) {
    console.error("Admin settings GET error:", err);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionUser = session.user as any;
  if (sessionUser.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { maintenanceMode, maintenanceMessage, bannerEnabled, bannerMessage, bannerColor } = await req.json();
    await getSettings();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {};
    if (typeof maintenanceMode === "boolean") data.maintenanceMode = maintenanceMode;
    if (maintenanceMessage !== undefined) data.maintenanceMessage = maintenanceMessage;
    if (typeof bannerEnabled === "boolean") data.bannerEnabled = bannerEnabled;
    if (bannerMessage !== undefined) data.bannerMessage = bannerMessage;
    if (bannerColor !== undefined) data.bannerColor = bannerColor;

    const updated = await db.siteSettings.update({ where: { id: "singleton" }, data });

    // Audit log for maintenance changes
    if (typeof maintenanceMode === "boolean") {
      await db.auditLog.create({
        data: {
          userId: sessionUser.id,
          action: maintenanceMode ? "maintenance_mode_enabled" : "maintenance_mode_disabled",
          details: JSON.stringify({ maintenanceMode: updated.maintenanceMode }),
        },
      });
    }

    // Audit log for banner changes
    if (typeof bannerEnabled === "boolean" || bannerMessage !== undefined || bannerColor !== undefined) {
      await db.auditLog.create({
        data: {
          userId: sessionUser.id,
          action: updated.bannerEnabled ? "banner_enabled" : "banner_disabled",
          details: JSON.stringify({ bannerEnabled: updated.bannerEnabled, bannerMessage: updated.bannerMessage, bannerColor: updated.bannerColor }),
        },
      });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Admin settings PATCH error:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
