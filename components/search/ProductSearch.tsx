"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";

export function ProductSearch({ products }: { products: Product[] }) {
  const [open, setOpen] = useState(false); const [query, setQuery] = useState("");
  useEffect(() => { const key = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setOpen(true); } }; window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key); }, []);
  const results = useMemo(() => products.filter(product => `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase())).slice(0, 6), [products, query]);
  return <><button className="nav-action" aria-label="Search products" onClick={() => setOpen(true)}><span className="nav-action-icon">⌕</span><small>Search</small></button>{open && <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Product search"><div className="search-panel"><div className="search-input-row"><input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Search products or categories" aria-label="Search products"/><button onClick={() => setQuery("")}>Clear</button><button onClick={() => setOpen(false)} aria-label="Close search">×</button></div><div className="search-results">{query && results.map(product => <Link href={`/product/${product.slug}`} onClick={() => setOpen(false)} key={product.id}><span>{product.name}</span><small>{product.category} · ${product.price}</small></Link>)}{query && !results.length && <p>No products match “{query}”.</p>}{!query && <p>Search the DESKAVYN collection. Press Esc to close.</p>}</div></div></div>}</>;
}
