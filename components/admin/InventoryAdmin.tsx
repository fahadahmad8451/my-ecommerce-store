"use client";
import { useEffect, useState } from "react";
import type { ShopifyInventorySummary, ShopifyInventoryVariant } from "@/lib/shopify-admin/commerce";

export function InventoryAdmin() {
  const [summary, setSummary] = useState<ShopifyInventorySummary | null>(null); const [variants, setVariants] = useState<ShopifyInventoryVariant[]>([]); const [message, setMessage] = useState("Loading Shopify inventory...");
  useEffect(() => { fetch("/api/admin/inventory", { cache: "no-store" }).then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Inventory could not be loaded."); if (!data.connected) { setMessage("Connect SHOPIFY_ADMIN_ACCESS_TOKEN with inventory scopes to load live inventory."); return; } setSummary(data.summary); setVariants(data.variants); }).catch(error => setMessage(error instanceof Error ? error.message : "Inventory could not be loaded.")); }, []);
  if (!summary) return <p className="admin-help">{message}</p>;
  return <><div className="inventory-summary-grid"><article><span>Total units</span><strong>{summary.totalInventory}</strong></article><article><span>Low stock variants</span><strong>{summary.lowStockProducts}</strong></article><article><span>Out of stock variants</span><strong>{summary.outOfStockProducts}</strong></article></div><div className="inventory-variant-list">{variants.length === 0 ? <p className="admin-empty">No inventory-tracked variants were returned by Shopify.</p> : variants.map(variant => <article key={variant.id}><div><strong>{variant.productTitle}</strong><span>{variant.title}{variant.sku ? ` · SKU ${variant.sku}` : " · No SKU"}</span></div><div><span className={`inventory-count ${variant.quantity === 0 ? "out" : variant.quantity <= 5 ? "low" : ""}`}>{variant.quantity} in stock</span><span>{variant.inventoryPolicy === "CONTINUE" ? "Oversell allowed" : "Stop when sold out"}</span></div></article>)}</div></>;
}
