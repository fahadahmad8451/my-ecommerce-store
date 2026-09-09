import { NextResponse } from "next/server";
import { saveFormSubmission } from "@/lib/form-submissions";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    const value = String(email || "").trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(value)) return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    await saveFormSubmission({ type: "newsletter", createdAt: new Date().toISOString(), fields: { email: value } });
    return NextResponse.json({ saved: true });
  } catch { return NextResponse.json({ error: "Subscription could not be completed." }, { status: 500 }); }
}
