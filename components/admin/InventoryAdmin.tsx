"use client";
import { useEffect, useState } from "react";
import type { ShopifyInventorySummary } from "@/lib/shopify-admin/commerce";

export function InventoryAdmin() {
  const [summary, setSummary] = useState<ShopifyInventorySummary | null>(null); const [message, setMessage] = useState("Loading Shopify inventory...");
  useEffect(() => { fetch("/api/admin/inventory", { cache: "no-store" }).then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Inventory could not be loaded."); if (!data.connected) { setMessage("Connect SHOPIFY_ADMIN_ACCESS_TOKEN with inventory scopes to load live inventory."); return; } setSummary(data.summary); }).catch(error => setMessage(error instanceof Error ? error.message : "Inventory could not be loaded.")); }, []);
  if (!summary) return <p className="admin-help">{message}</p>;
  return <div className="inventory-summary-grid"><article><span>Total units</span><strong>{summary.totalInventory}</strong></article><article><span>Low stock</span><strong>{summary.lowStockProducts}</strong></article><article><span>Out of stock</span><strong>{summary.outOfStockProducts}</strong></article></div>;
}
