import Link from "next/link";
import { hasShopifyAdminConnection } from "@/lib/shopify-admin";

export function ShopifyConnectionStatus() {
  const connected = hasShopifyAdminConnection();
  return <section className={`shopify-connection-card ${connected ? "connected" : "not-connected"}`}>
    <span className="eyebrow">SHOPIFY COMMERCE</span>
    <h2>{connected ? "Admin API credentials detected." : "Shopify Admin API needs configuration."}</h2>
    <p>{connected ? "The secure server-side commerce layer is ready. Admin data views will be enabled after admin authentication is configured." : "Add the private Admin API token in .env.local before enabling live orders, inventory, collections, discounts and fulfilment."}</p>
    <Link href="/admin/site">Open website settings</Link>
  </section>;
}
