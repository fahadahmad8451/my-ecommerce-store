import { NextResponse } from "next/server";
import { getSiteConfig, saveSiteConfig } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getSiteConfig());
}

export async function PUT(request: Request) {
  try {
    const config = await request.json();
    await saveSiteConfig(config);
    return NextResponse.json({ saved: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Could not save site settings." },
      { status: 400 }
    );
  }
}
