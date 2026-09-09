import Link from "next/link";
import { getManualProducts } from "@/lib/manual-products";
import { getSiteContent } from "@/lib/site-content";
import { ShopifyConnectionStatus } from "@/components/admin/ShopifyConnectionStatus";

export default async function AdminHomePage() {
  const [manualProducts, content] = await Promise.all([getManualProducts(), getSiteContent()]);
  return (
    <main className="page-top section-pad admin-home">
      <span className="eyebrow">DESKAVYN CONTROL CENTER</span>
      <h1 className="display-xl">Manage the site.</h1>
      <p className="lede page-intro">
        Control website content, design, sections and products without editing the source files manually.
      </p>

      <div className="admin-home-grid">
        <Link href="/admin/site" className="admin-home-card">
          <span>01</span>
          <h2>Website Settings</h2>
          <p>Navbar, hero, homepage text, colors, figures, carousel and section visibility.</p>
          <strong>Open settings ↗</strong>
        </Link>

        <Link href="/admin/products" className="admin-home-card">
          <span>02</span>
          <h2>Products</h2>
          <p>Add products, prices, stock, images, materials, colors and GLB paths.</p>
          <small>{manualProducts.length} manually managed products</small>
          <strong>Manage products ↗</strong>
        </Link>

        <Link href="/admin/content" className="admin-home-card">
          <span>03</span>
          <h2>Content & Footer</h2>
          <p>Edit public support pages, legal content, contact details, newsletter copy and social links.</p>
          <small>{Object.keys(content.pages).length} content pages configured</small>
          <strong>Manage content ↗</strong>
        </Link>
        <Link href="/admin/orders" className="admin-home-card"><span>04</span><h2>Orders</h2><p>Review live Shopify orders, payment status and fulfilment status.</p><strong>Open orders ↗</strong></Link>
        <Link href="/admin/inventory" className="admin-home-card"><span>05</span><h2>Inventory</h2><p>Monitor live unit totals, low stock and sold-out products from Shopify.</p><strong>Open inventory ↗</strong></Link>
        <Link href="/admin/collections" className="admin-home-card"><span>06</span><h2>Collections</h2><p>Review Shopify collections and their live product assignments.</p><strong>Open collections ↗</strong></Link>
        <Link href="/admin/inbox" className="admin-home-card"><span>07</span><h2>Support Inbox</h2><p>Read and reply to customer contact requests from the storefront.</p><strong>Open inbox ↗</strong></Link>
        <Link href="/admin/newsletter" className="admin-home-card"><span>08</span><h2>Newsletter</h2><p>Review storefront subscribers and export a clean CSV list.</p><strong>Open subscribers ↗</strong></Link>
        <Link href="/admin/returns" className="admin-home-card"><span>09</span><h2>Returns</h2><p>Review customer return requests and respond by email.</p><strong>Open returns ↗</strong></Link>
        <Link href="/admin/analytics" className="admin-home-card"><span>10</span><h2>Analytics</h2><p>Review real recent-order revenue, AOV and top products.</p><strong>Open analytics ↗</strong></Link>
        <Link href="/admin/audit-log" className="admin-home-card"><span>11</span><h2>Audit Log</h2><p>Review recorded changes to content, settings and manual products.</p><strong>Open audit log ↗</strong></Link>
        <Link href="/admin/trash" className="admin-home-card"><span>12</span><h2>Trash</h2><p>Restore locally managed products deleted by mistake.</p><strong>Open trash ↗</strong></Link>
      </div>
      <ShopifyConnectionStatus/>
    </main>
  );
}
