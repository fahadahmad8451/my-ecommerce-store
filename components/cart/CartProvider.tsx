"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

type CartItem = Product & { quantity: number; selectedColor?: string };

type CartContextType = {
  items: CartItem[];
  count: number;
  subtotal: number;
  discountCode: string;
  discountAmount: number;
  total: number;
  open: boolean;
  setOpen: (open: boolean) => void;
  addItem: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  applyDiscount: (code: string) => boolean;
  checkout: () => Promise<{ checkoutUrl?: string; error?: string }>;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);
  const [discountCode, setDiscountCode] = useState("");

  function addItem(product: Product, quantity = 1, selectedColor?: string) {
    if (product.stock <= 0) return;
    setItems((current) => {
      const existing = current.find((item) => item.id === product.id && item.selectedColor === selectedColor);
      if (existing) {
        return current.map((item) =>
          item.id === product.id && item.selectedColor === selectedColor
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      }
      return [...current, { ...product, quantity: Math.min(quantity, product.stock), selectedColor }];
    });
    setOpen(true);
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    setItems((current) =>
      current
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, Math.min(quantity, item.stock)) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function applyDiscount(code: string) {
    const normalized = code.trim().toUpperCase();
    if (normalized) {
      setDiscountCode(normalized);
      return true;
    }
    setDiscountCode("");
    return false;
  }

  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Final discount amounts are calculated by Shopify at checkout.
  const discountAmount = 0;
  const total = Math.max(0, subtotal - discountAmount);

  const checkout = useCallback(async () => {
    const lines = items.map(item => ({ merchandiseId: item.shopifyVariantId, quantity: item.quantity }));
    if (lines.some(line => !line.merchandiseId)) return { error: "Some cart items are local products and cannot be checked out through Shopify yet." };
    try {
      const response = await fetch("/api/cart/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines, discountCodes: discountCode ? [discountCode] : [] }) });
      const data = await response.json();
      return response.ok ? { checkoutUrl: data.checkoutUrl } : { error: data.error || "Checkout could not be started." };
    } catch { return { error: "Checkout could not be started. Please try again." }; }
  }, [items, discountCode]);

  const value = useMemo(
    () => ({
      items,
      count,
      subtotal,
      discountCode,
      discountAmount,
      total,
      open,
      setOpen,
      addItem,
      removeItem,
      updateQuantity,
      applyDiscount,
      checkout
    }),
    [items, count, subtotal, discountCode, discountAmount, total, open, checkout]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const value = useContext(CartContext);
  if (!value) throw new Error("useCart must be used inside CartProvider");
  return value;
}
