import { NextResponse } from "next/server";
import { getShopifyAdminOrder } from "@/lib/shopify-admin/commerce";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const order = await getShopifyAdminOrder(decodeURIComponent(id));
    if (!order) return NextResponse.json({ error: "Order was not found or Shopify is not connected." }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Order detail could not be loaded." }, { status: 502 }); }
}
