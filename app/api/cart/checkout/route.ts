import { NextResponse } from "next/server";
import { shopifyFetch } from "@/lib/shopify";

type CartResponse = { cartCreate: { cart: { checkoutUrl: string } | null; userErrors: Array<{ message: string }> } };

const CART_CREATE = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart { checkoutUrl }
      userErrors { message }
    }
  }
`;

export async function POST(request: Request) {
  try {
    const body = await request.json() as { lines?: Array<{ merchandiseId?: string; quantity?: number }>; discountCodes?: string[] };
    const lines = (body.lines || []).filter(line => line.merchandiseId && Number(line.quantity) > 0).map(line => ({ merchandiseId: line.merchandiseId, quantity: Math.max(1, Math.floor(Number(line.quantity))) }));
    if (!lines.length) return NextResponse.json({ error: "Your cart has no Shopify products ready for checkout." }, { status: 400 });
    const data = await shopifyFetch<CartResponse>({ query: CART_CREATE, variables: { input: { lines, discountCodes: (body.discountCodes || []).filter(Boolean) } } });
    if (!data) return NextResponse.json({ error: "Shopify checkout is not configured yet." }, { status: 503 });
    const errors = data.cartCreate.userErrors;
    if (errors.length || !data.cartCreate.cart?.checkoutUrl) return NextResponse.json({ error: errors.map(item => item.message).join(" ") || "Shopify could not create checkout." }, { status: 400 });
    return NextResponse.json({ checkoutUrl: data.cartCreate.cart.checkoutUrl });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Shopify checkout could not be started." }, { status: 502 });
  }
}
