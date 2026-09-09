"use client";
import { useEffect, useState } from "react";
import type { ShopifyAdminOrderSummary } from "@/lib/shopify-admin/commerce";

export function OrdersAdmin() {
  const [orders, setOrders] = useState<ShopifyAdminOrderSummary[]>([]); const [state, setState] = useState<"loading" | "ready" | "disconnected" | "error">("loading"); const [message, setMessage] = useState("");
  useEffect(() => { fetch("/api/admin/orders", { cache: "no-store" }).then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Orders could not be loaded."); if (!data.connected) { setState("disconnected"); return; } setOrders(data.orders); setState("ready"); }).catch(error => { setMessage(error instanceof Error ? error.message : "Orders could not be loaded."); setState("error"); }); }, []);
  if (state === "loading") return <p className="admin-message">Loading Shopify orders...</p>;
  if (state === "disconnected") return <p className="admin-help">Connect `SHOPIFY_ADMIN_ACCESS_TOKEN` to load real Shopify orders. No demo orders are shown.</p>;
  if (state === "error") return <p className="admin-message">{message}</p>;
  return <div className="orders-admin-list">{orders.length === 0 ? <p className="admin-empty">No Shopify orders found.</p> : orders.map(order => <article key={order.id}><div><strong>{order.name}</strong><span>{new Date(order.createdAt).toLocaleString()} · {order.customer?.displayName || "Guest"}</span></div><div><span className="order-status">{order.financialStatus}</span><span className="order-status">{order.fulfillmentStatus}</span><strong>{order.total.currencyCode} {order.total.amount}</strong></div></article>)}</div>;
}
