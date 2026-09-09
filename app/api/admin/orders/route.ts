import { NextResponse } from "next/server";
import { getShopifyAdminOrders } from "@/lib/shopify-admin/commerce";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const orders = await getShopifyAdminOrders();
    if (!orders) return NextResponse.json({ connected: false, orders: [] });
    return NextResponse.json({ connected: true, orders });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Orders could not be loaded." }, { status: 502 }); }
}
