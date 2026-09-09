import { NextResponse } from "next/server";
import { getSiteContent, saveSiteContent, type SiteContent } from "@/lib/site-content";
import { writeAuditEntry } from "@/lib/audit-log";

export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json(await getSiteContent()); }
export async function PUT(request: Request) {
  try { const content = await request.json() as SiteContent; if (!content.contactEmail || !content.pages || !Array.isArray(content.blogs)) return NextResponse.json({ error: "Invalid content payload." }, { status: 400 }); await saveSiteContent(content); await writeAuditEntry({ action: "content.updated", target: "site-content" }); return NextResponse.json({ saved: true }); } catch { return NextResponse.json({ error: "Content could not be saved." }, { status: 400 }); }
}
