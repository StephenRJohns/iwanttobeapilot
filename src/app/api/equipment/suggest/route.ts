import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const session = await auth();
  const body = await req.json();
  const { name, category, description, url } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Item name is required" }, { status: 400 });
  }

  await db.auditLog.create({
    data: {
      userId: session?.user?.id ?? null,
      action: "equipment_suggestion",
      details: JSON.stringify({ name: name.trim(), category: category?.trim() || null, description: description?.trim() || null, url: url?.trim() || null }),
    },
  });

  return NextResponse.json({ ok: true });
}
