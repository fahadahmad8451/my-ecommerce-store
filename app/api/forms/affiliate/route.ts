import { NextResponse } from "next/server";
import { saveFormSubmission } from "@/lib/form-submissions";

export async function POST(request: Request) {
  try { const body = await request.json(); const fields = Object.fromEntries(["name", "email", "website", "message"].map(key => [key, String(body[key] || "").trim()])); if (Object.values(fields).some(value => !value) || !/^\S+@\S+\.\S+$/.test(fields.email)) return NextResponse.json({ error: "Please complete all fields with a valid email address." }, { status: 400 }); await saveFormSubmission({ type: "affiliate", createdAt: new Date().toISOString(), fields }); return NextResponse.json({ saved: true }); } catch { return NextResponse.json({ error: "Your application could not be sent." }, { status: 500 }); }
}
