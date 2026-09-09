import { shopifyAdminFetch } from "@/lib/shopify-admin";

export type ShopifyAdminOrderSummary = {
  id: string;
  name: string;
  createdAt: string;
  financialStatus: string;
  fulfillmentStatus: string;
  total: { amount: string; currencyCode: string };
  customer: { displayName: string; email: string | null } | null;
};

type OrdersResponse = { orders: { nodes: Array<{
  id: string; name: string; createdAt: string; displayFinancialStatus: string; displayFulfillmentStatus: string;
  currentTotalPriceSet: { shopMoney: { amount: string; currencyCode: string } };
  customer: { displayName: string; email: string | null } | null;
}> } };

const ORDERS_QUERY = `
  query AdminOrders($first: Int!) {
    orders(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id name createdAt displayFinancialStatus displayFulfillmentStatus
        currentTotalPriceSet { shopMoney { amount currencyCode } }
        customer { displayName email }
      }
    }
  }
`;

/** Server-only domain operation. Expose it to a UI only after admin authorization exists. */
export async function getShopifyAdminOrders(first = 25): Promise<ShopifyAdminOrderSummary[] | null> {
  const response = await shopifyAdminFetch<OrdersResponse>(ORDERS_QUERY, { first });
  if (!response) return null;
  return response.orders.nodes.map(order => ({
    id: order.id,
    name: order.name,
    createdAt: order.createdAt,
    financialStatus: order.displayFinancialStatus,
    fulfillmentStatus: order.displayFulfillmentStatus,
    total: order.currentTotalPriceSet.shopMoney,
    customer: order.customer
  }));
}

export type ShopifyInventorySummary = { totalInventory: number; lowStockProducts: number; outOfStockProducts: number };

const INVENTORY_SUMMARY_QUERY = `
  query InventorySummary($first: Int!) {
    products(first: $first, query: "status:active") {
      nodes { totalInventory }
    }
  }
`;

/** Computes real inventory summaries from Shopify product inventory totals. */
export async function getShopifyInventorySummary(first = 250): Promise<ShopifyInventorySummary | null> {
  const response = await shopifyAdminFetch<{ products: { nodes: Array<{ totalInventory: number | null }> } }>(INVENTORY_SUMMARY_QUERY, { first });
  if (!response) return null;
  const values = response.products.nodes.map(product => Math.max(0, product.totalInventory || 0));
  return { totalInventory: values.reduce((sum, value) => sum + value, 0), lowStockProducts: values.filter(value => value > 0 && value <= 5).length, outOfStockProducts: values.filter(value => value === 0).length };
}

export type ShopifyCollectionSummary = { id: string; title: string; handle: string; productsCount: number };
const COLLECTIONS_QUERY = `query Collections($first: Int!) { collections(first: $first, sortKey: TITLE) { nodes { id title handle productsCount { count } } } }`;
export async function getShopifyCollections(first = 100): Promise<ShopifyCollectionSummary[] | null> {
  const response = await shopifyAdminFetch<{ collections: { nodes: Array<{ id: string; title: string; handle: string; productsCount: { count: number } }> } }>(COLLECTIONS_QUERY, { first });
  return response?.collections.nodes.map(collection => ({ ...collection, productsCount: collection.productsCount.count })) ?? null;
}
