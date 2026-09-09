import { shopifyAdminFetch } from "@/lib/shopify-admin";

type TrackingResult = { orderName: string; fulfillmentStatus: string; tracking: Array<{ company: string | null; number: string | null; url: string | null }> };
const TRACKING_QUERY = `query TrackOrder($query: String!) { orders(first: 5, query: $query, sortKey: CREATED_AT, reverse: true) { nodes { name email displayFulfillmentStatus fulfillments { trackingInfo { company number url } } } } }`;

/** Looks up only an order whose checkout email exactly matches the supplied email. */
export async function getPublicOrderTracking(orderNumber: string, email: string): Promise<TrackingResult | null> {
  const normalizedOrder = orderNumber.trim().replace(/^#/, ""); const normalizedEmail = email.trim().toLowerCase();
  const response = await shopifyAdminFetch<{ orders: { nodes: Array<{ name: string; email: string | null; displayFulfillmentStatus: string; fulfillments: Array<{ trackingInfo: Array<{ company: string | null; number: string | null; url: string | null }> }> }> } }>(TRACKING_QUERY, { query: `name:${normalizedOrder} email:${normalizedEmail}` });
  const order = response?.orders.nodes.find(item => item.email?.trim().toLowerCase() === normalizedEmail && item.name.replace(/^#/, "") === normalizedOrder);
  if (!order) return null;
  return { orderName: order.name, fulfillmentStatus: order.displayFulfillmentStatus, tracking: order.fulfillments.flatMap(fulfillment => fulfillment.trackingInfo) };
}
