import { NextResponse } from "next/server";
import { getAuditEntries } from "@/lib/audit-log";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json({ entries: await getAuditEntries() }); }
