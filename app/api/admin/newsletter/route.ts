import { NextResponse } from "next/server";
import { getFormSubmissions } from "@/lib/form-submissions";

export const dynamic = "force-dynamic";
function subscribers(records: Awaited<ReturnType<typeof getFormSubmissions>>) {
  const unique = new Map<string, string>();
  for (const record of records) { const email = record.fields.email?.trim().toLowerCase(); if (email && !unique.has(email)) unique.set(email, record.createdAt); }
  return Array.from(unique, ([email, createdAt]) => ({ email, createdAt }));
}
function csvValue(value: string) { return `"${value.replaceAll('"', '""')}"`; }
export async function GET(request: Request) {
  const list = subscribers(await getFormSubmissions("newsletter", 500));
  if (new URL(request.url).searchParams.get("format") === "csv") {
    const csv = ["email,subscribed_at", ...list.map(item => `${csvValue(item.email)},${csvValue(item.createdAt)}`)].join("\n");
    return new NextResponse(csv, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="deskavyn-newsletter-subscribers.csv"' } });
  }
  return NextResponse.json({ subscribers: list });
}
