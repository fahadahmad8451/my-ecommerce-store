import { NextResponse } from "next/server";
import { getShopifyInventorySummary } from "@/lib/shopify-admin/commerce";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const summary = await getShopifyInventorySummary();
    return NextResponse.json({ connected: Boolean(summary), summary });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Inventory could not be loaded." }, { status: 502 }); }
}
