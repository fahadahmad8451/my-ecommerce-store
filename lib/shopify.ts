const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION || "2026-07";

export async function shopifyFetch<T>({
  query,
  variables = {}
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T | null> {
  if (!domain || !token) return null;

  const response = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Shopify request failed: ${response.status}`);
  }

  const json = await response.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));

  return json.data as T;
}

export const PRODUCTS_QUERY = `
  query Products($first: Int!) {
    products(first: $first) {
      nodes {
        id
        handle
        title
        description
        featuredImage { url altText }
        priceRange { minVariantPrice { amount currencyCode } }
      }
    }
  }
`;
