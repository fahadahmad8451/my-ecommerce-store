import { NextResponse } from "next/server";
import { getShopifyInventory } from "@/lib/shopify-admin/commerce";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const inventory = await getShopifyInventory();
    return NextResponse.json({ connected: Boolean(inventory), summary: inventory?.summary || null, variants: inventory?.variants || [] });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Inventory could not be loaded." }, { status: 502 }); }
}
