"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

type WishlistContextType = { items: Product[]; has: (id: string) => boolean; toggle: (product: Product) => void };
const WishlistContext = createContext<WishlistContextType | null>(null);
const storageKey = "deskavyn-wishlist";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => { try { const saved = JSON.parse(window.localStorage.getItem(storageKey) || "[]"); if (Array.isArray(saved)) setItems(saved); } catch { /* Ignore unavailable/corrupt local storage. */ } }, []);
  function toggle(product: Product) { setItems(current => { const next = current.some(item => item.id === product.id) ? current.filter(item => item.id !== product.id) : [...current, product]; window.localStorage.setItem(storageKey, JSON.stringify(next)); return next; }); }
  const value = useMemo(() => ({ items, has: (id: string) => items.some(item => item.id === id), toggle }), [items]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() { const value = useContext(WishlistContext); if (!value) throw new Error("useWishlist must be used inside WishlistProvider"); return value; }
