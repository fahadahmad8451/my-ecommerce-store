import { NextResponse } from "next/server";
import { getFormSubmissions } from "@/lib/form-submissions";
export const dynamic = "force-dynamic";
export async function GET() { return NextResponse.json({ requests: await getFormSubmissions("return") }); }
