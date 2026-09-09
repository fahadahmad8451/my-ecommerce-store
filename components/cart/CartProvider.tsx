"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

const CART_STORAGE_KEY = "deskavyn-cart-v1";
type CartItem = Product & { quantity: number; selectedColor?: string; lineKey: string };
type CartContextType = {
  items: CartItem[]; count: number; subtotal: number; discountCode: string; discountAmount: number; total: number; open: boolean;
  setOpen: (open: boolean) => void; addItem: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeItem: (lineKey: string) => void; updateQuantity: (lineKey: string, quantity: number) => void;
  applyDiscount: (code: string) => boolean; checkout: () => Promise<{ checkoutUrl?: string; error?: string }>;
  buyNow: (product: Product, quantity: number) => Promise<{ checkoutUrl?: string; error?: string }>;
};
const CartContext = createContext<CartContextType | null>(null);
const lineKeyFor = (product: Product, selectedColor?: string) => `${product.shopifyVariantId || product.id}::${selectedColor || "default"}`;

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      if (saved) { const parsed = JSON.parse(saved) as CartItem[]; if (Array.isArray(parsed)) setItems(parsed.filter(item => item && item.id && item.quantity > 0).map(item => ({ ...item, lineKey: item.lineKey || lineKeyFor(item, item.selectedColor) }))); }
    } catch { /* A malformed local cart must not block shopping. */ }
    setHydrated(true);
  }, []);
  useEffect(() => { if (hydrated) window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items)); }, [hydrated, items]);

  function addItem(product: Product, quantity = 1, selectedColor?: string) {
    const stock = Math.max(0, product.stock); if (!stock) return;
    const lineKey = lineKeyFor(product, selectedColor);
    setItems(current => { const existing = current.find(item => item.lineKey === lineKey); return existing ? current.map(item => item.lineKey === lineKey ? { ...item, quantity: Math.min(item.quantity + quantity, stock) } : item) : [...current, { ...product, quantity: Math.min(quantity, stock), selectedColor, lineKey }]; });
    setOpen(true);
  }
  const removeItem = (lineKey: string) => setItems(current => current.filter(item => item.lineKey !== lineKey));
  const updateQuantity = (lineKey: string, quantity: number) => setItems(current => current.map(item => item.lineKey === lineKey ? { ...item, quantity: Math.max(0, Math.min(quantity, item.stock)) } : item).filter(item => item.quantity > 0));
  function applyDiscount(code: string) { const normalized = code.trim().toUpperCase(); setDiscountCode(normalized); return Boolean(normalized); }

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = 0; const total = Math.max(0, subtotal - discountAmount);
  const checkout = useCallback(async () => {
    const lines = items.map(item => ({ merchandiseId: item.shopifyVariantId, quantity: item.quantity }));
    if (lines.some(line => !line.merchandiseId)) return { error: "Some cart items are local products and cannot be checked out through Shopify yet." };
    try { const response = await fetch("/api/cart/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines, discountCodes: discountCode ? [discountCode] : [] }) }); const data = await response.json(); return response.ok ? { checkoutUrl: data.checkoutUrl } : { error: data.error || "Checkout could not be started." }; } catch { return { error: "Checkout could not be started. Please try again." }; }
  }, [items, discountCode]);
  const buyNow = useCallback(async (product: Product, quantity: number) => {
    if (!product.shopifyVariantId) return { error: "This product is not connected to Shopify checkout yet." };
    try { const response = await fetch("/api/cart/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: [{ merchandiseId: product.shopifyVariantId, quantity: Math.max(1, Math.min(Math.floor(quantity), product.stock)) }] }) }); const data = await response.json(); return response.ok ? { checkoutUrl: data.checkoutUrl } : { error: data.error || "Checkout could not be started." }; } catch { return { error: "Checkout could not be started. Please try again." }; }
  }, []);
  const value = useMemo(() => ({ items, count, subtotal, discountCode, discountAmount, total, open, setOpen, addItem, removeItem, updateQuantity, applyDiscount, checkout, buyNow }), [items, count, subtotal, discountCode, discountAmount, total, open, checkout, buyNow]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() { const value = useContext(CartContext); if (!value) throw new Error("useCart must be used inside CartProvider"); return value; }
