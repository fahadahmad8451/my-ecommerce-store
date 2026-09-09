import "server-only";

type ShopifyAdminResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

const apiVersion = process.env.SHOPIFY_API_VERSION || "2026-07";

function getAdminConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN || process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  if (!domain || !token) return null;
  return { domain: domain.replace(/^https?:\/\//, "").replace(/\/$/, ""), token };
}

/** Server-only wrapper for Shopify Admin GraphQL. Never expose its token to the browser. */
export async function shopifyAdminFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  const config = getAdminConfig();
  if (!config) return null;

  const response = await fetch(`https://${config.domain}/admin/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Shopify-Access-Token": config.token },
    body: JSON.stringify({ query, variables }),
    cache: "no-store"
  });

  if (!response.ok) throw new Error(`Shopify Admin API request failed (${response.status}).`);
  const payload = await response.json() as ShopifyAdminResponse<T>;
  if (payload.errors?.length) throw new Error(payload.errors.map(error => error.message).join("; "));
  return payload.data ?? null;
}

export function hasShopifyAdminConnection() {
  return Boolean(getAdminConfig());
}
