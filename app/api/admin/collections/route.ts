import { NextResponse } from "next/server";
import { getShopifyCollections } from "@/lib/shopify-admin/commerce";
export const dynamic = "force-dynamic";
export async function GET() { try { const collections = await getShopifyCollections(); return NextResponse.json({ connected: Boolean(collections), collections: collections || [] }); } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Collections could not be loaded." }, { status: 502 }); } }
