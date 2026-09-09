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

export type ShopifyAdminOrderDetail = ShopifyAdminOrderSummary & {
  email: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  shippingAddress: { name: string | null; address1: string | null; address2: string | null; city: string | null; province: string | null; zip: string | null; country: string | null; phone: string | null } | null;
  lineItems: Array<{ title: string; variantTitle: string | null; sku: string | null; quantity: number; unitPrice: { amount: string; currencyCode: string } }>;
  transactions: Array<{ status: string; kind: string; gateway: string; amount: { amount: string; currencyCode: string } }>;
  fulfillments: Array<{ status: string; tracking: Array<{ company: string | null; number: string | null; url: string | null }> }>;
};

type OrderDetailResponse = { order: {
  id: string; name: string; createdAt: string; displayFinancialStatus: string; displayFulfillmentStatus: string; email: string | null; cancelledAt: string | null; cancelReason: string | null;
  currentTotalPriceSet: { shopMoney: { amount: string; currencyCode: string } }; customer: { displayName: string; email: string | null } | null;
  shippingAddress: ShopifyAdminOrderDetail["shippingAddress"];
  lineItems: { nodes: Array<{ title: string; sku: string | null; quantity: number; variant: { title: string } | null; originalUnitPriceSet: { shopMoney: { amount: string; currencyCode: string } } }> };
  transactions: Array<{ status: string; kind: string; gateway: string; amountSet: { shopMoney: { amount: string; currencyCode: string } } }>;
  fulfillments: Array<{ status: string; trackingInfo: Array<{ company: string | null; number: string | null; url: string | null }> }>;
} | null };

const ORDER_DETAIL_QUERY = `
  query OrderDetail($id: ID!) {
    order(id: $id) {
      id name createdAt displayFinancialStatus displayFulfillmentStatus email cancelledAt cancelReason
      currentTotalPriceSet { shopMoney { amount currencyCode } }
      customer { displayName email }
      shippingAddress { name address1 address2 city province zip country phone }
      lineItems(first: 100) { nodes { title sku quantity variant { title } originalUnitPriceSet { shopMoney { amount currencyCode } } } }
      transactions(first: 50) { status kind gateway amountSet { shopMoney { amount currencyCode } } }
      fulfillments { status trackingInfo { company number url } }
    }
  }
`;

/** Real order detail for an authorized admin. Payment information is limited to Shopify's safe transaction summary. */
export async function getShopifyAdminOrder(id: string): Promise<ShopifyAdminOrderDetail | null> {
  const response = await shopifyAdminFetch<OrderDetailResponse>(ORDER_DETAIL_QUERY, { id });
  const order = response?.order;
  if (!order) return null;
  return {
    id: order.id, name: order.name, createdAt: order.createdAt, financialStatus: order.displayFinancialStatus, fulfillmentStatus: order.displayFulfillmentStatus,
    total: order.currentTotalPriceSet.shopMoney, customer: order.customer, email: order.email, cancelledAt: order.cancelledAt, cancelReason: order.cancelReason, shippingAddress: order.shippingAddress,
    lineItems: order.lineItems.nodes.map(item => ({ title: item.title, variantTitle: item.variant?.title || null, sku: item.sku, quantity: item.quantity, unitPrice: item.originalUnitPriceSet.shopMoney })),
    transactions: order.transactions.map(transaction => ({ status: transaction.status, kind: transaction.kind, gateway: transaction.gateway, amount: transaction.amountSet.shopMoney })),
    fulfillments: order.fulfillments.map(fulfillment => ({ status: fulfillment.status, tracking: fulfillment.trackingInfo }))
  };
}

export type ShopifyInventorySummary = { totalInventory: number; lowStockProducts: number; outOfStockProducts: number };
export type ShopifyInventoryVariant = { id: string; productTitle: string; title: string; sku: string | null; quantity: number; inventoryPolicy: string };
export type ShopifyInventoryData = { summary: ShopifyInventorySummary; variants: ShopifyInventoryVariant[] };

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

const INVENTORY_VARIANTS_QUERY = `
  query InventoryVariants($first: Int!) {
    productVariants(first: $first, sortKey: INVENTORY_QUANTITY, reverse: false) {
      nodes { id title sku inventoryQuantity inventoryPolicy product { title } }
    }
  }
`;

/** Returns sellable variants rather than product totals, which is the level at which Shopify stock is actually held. */
export async function getShopifyInventory(first = 100): Promise<ShopifyInventoryData | null> {
  const response = await shopifyAdminFetch<{ productVariants: { nodes: Array<{ id: string; title: string; sku: string | null; inventoryQuantity: number | null; inventoryPolicy: string; product: { title: string } }> } }>(INVENTORY_VARIANTS_QUERY, { first });
  if (!response) return null;
  const variants = response.productVariants.nodes.map(variant => ({ id: variant.id, productTitle: variant.product.title, title: variant.title, sku: variant.sku, quantity: Math.max(0, variant.inventoryQuantity || 0), inventoryPolicy: variant.inventoryPolicy }));
  return { summary: { totalInventory: variants.reduce((sum, variant) => sum + variant.quantity, 0), lowStockProducts: variants.filter(variant => variant.quantity > 0 && variant.quantity <= 5).length, outOfStockProducts: variants.filter(variant => variant.quantity === 0).length }, variants };
}

export type ShopifyAnalytics = { orderCount: number; revenue: number; currencyCode: string; averageOrderValue: number; topProducts: Array<{ title: string; units: number }> };
const ANALYTICS_QUERY = `query AnalyticsOrders($first: Int!) { orders(first: $first, sortKey: PROCESSED_AT, reverse: true) { nodes { cancelledAt displayFinancialStatus currentTotalPriceSet { shopMoney { amount currencyCode } } lineItems(first: 50) { nodes { title quantity } } } } }`;
/** Recent-order reporting only: values are computed from Shopify records, never seeded demo metrics. */
export async function getShopifyAnalytics(first = 100): Promise<ShopifyAnalytics | null> {
  const response = await shopifyAdminFetch<{ orders: { nodes: Array<{ cancelledAt: string | null; displayFinancialStatus: string; currentTotalPriceSet: { shopMoney: { amount: string; currencyCode: string } }; lineItems: { nodes: Array<{ title: string; quantity: number }> } }> } }>(ANALYTICS_QUERY, { first });
  if (!response) return null;
  const orders = response.orders.nodes.filter(order => !order.cancelledAt);
  const currencyCode = orders[0]?.currentTotalPriceSet.shopMoney.currencyCode || "";
  const revenue = orders.reduce((sum, order) => sum + Number(order.currentTotalPriceSet.shopMoney.amount || 0), 0);
  const units = new Map<string, number>(); orders.forEach(order => order.lineItems.nodes.forEach(line => units.set(line.title, (units.get(line.title) || 0) + line.quantity)));
  return { orderCount: orders.length, revenue, currencyCode, averageOrderValue: orders.length ? revenue / orders.length : 0, topProducts: Array.from(units, ([title, quantity]) => ({ title, units: quantity })).sort((a, b) => b.units - a.units).slice(0, 5) };
}

export type ShopifyCollectionSummary = { id: string; title: string; handle: string; productsCount: number };
const COLLECTIONS_QUERY = `query Collections($first: Int!) { collections(first: $first, sortKey: TITLE) { nodes { id title handle productsCount { count } } } }`;
export async function getShopifyCollections(first = 100): Promise<ShopifyCollectionSummary[] | null> {
  const response = await shopifyAdminFetch<{ collections: { nodes: Array<{ id: string; title: string; handle: string; productsCount: { count: number } }> } }>(COLLECTIONS_QUERY, { first });
  return response?.collections.nodes.map(collection => ({ ...collection, productsCount: collection.productsCount.count })) ?? null;
}
