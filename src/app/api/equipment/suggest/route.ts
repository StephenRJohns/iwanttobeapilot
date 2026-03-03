import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { getResend } from "@/lib/email";

const SUGGESTIONS_EMAIL = "suggestions@iwanttobeapilot.online";

export async function POST(req: Request) {
  const session = await auth();
  const body = await req.json();
  const { name, category, description, url } = body;

  if (!name?.trim()) {
    return NextResponse.json({ error: "Item name is required" }, { status: 400 });
  }
  if (!url?.trim()) {
    return NextResponse.json({ error: "Product URL is required" }, { status: 400 });
  }

  await db.auditLog.create({
    data: {
      userId: session?.user?.id ?? null,
      action: "equipment_suggestion",
      details: JSON.stringify({ name: name.trim(), category: category?.trim() || null, description: description?.trim() || null, url: url.trim() }),
    },
  });

  try {
    const resend = getResend();
    const submittedBy = session?.user?.email ?? "anonymous";
    await resend.emails.send({
      from: "noreply@iwanttobeapilot.online",
      to: SUGGESTIONS_EMAIL,
      subject: `Equipment Suggestion: ${name.trim()}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto">
          <h2 style="color:#0ea5e9">New Equipment Suggestion</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#64748b;width:120px">Item Name</td><td style="padding:8px 0;font-weight:600">${name.trim()}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Category</td><td style="padding:8px 0">${category?.trim() || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Product URL</td><td style="padding:8px 0"><a href="${url.trim()}" style="color:#0ea5e9">${url.trim()}</a></td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Description</td><td style="padding:8px 0">${description?.trim() || "—"}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b">Submitted by</td><td style="padding:8px 0">${submittedBy}</td></tr>
          </table>
        </div>`,
    });
  } catch {
    // Email failure is non-fatal — suggestion is already logged
  }

  return NextResponse.json({ ok: true });
}
