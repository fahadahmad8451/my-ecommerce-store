import { NextResponse } from "next/server";
import { getShopifyAnalytics } from "@/lib/shopify-admin/commerce";
export const dynamic = "force-dynamic";
export async function GET() { try { const analytics = await getShopifyAnalytics(); return NextResponse.json({ connected: Boolean(analytics), analytics }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Analytics could not be loaded." }, { status: 502 }); } }
