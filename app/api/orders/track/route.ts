import { NextResponse } from "next/server";
import { getPublicOrderTracking } from "@/lib/shopify-admin/tracking";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { orderNumber?: string; email?: string };
    const orderNumber = String(body.orderNumber || "").trim(); const email = String(body.email || "").trim().toLowerCase();
    if (!orderNumber || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Enter your order number and a valid order email." }, { status: 400 });
    const tracking = await getPublicOrderTracking(orderNumber, email);
    if (!tracking) return NextResponse.json({ error: "We could not find an order matching those details." }, { status: 404 });
    return NextResponse.json({ tracking });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Order tracking is temporarily unavailable." }, { status: 503 }); }
}
