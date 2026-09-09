"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/products/ProductCard";

export function ShopClient({ products }: { products: Product[] }) {
  const params = useSearchParams();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(() => params.get("category") || "All");
  const [sort, setSort] = useState("featured");

  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || product.category === category;
      return matchesSearch && matchesCategory;
    });

    if (sort === "price-low") result = [...result].sort((a, b) => a.price - b.price);
    if (sort === "price-high") result = [...result].sort((a, b) => b.price - a.price);
    if (sort === "name") result = [...result].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "featured") result = [...result].sort((a, b) => Number(b.featured) - Number(a.featured));

    return result;
  }, [products, search, category, sort]);

  return (
    <>
      <div className="shop-toolbar">
        <input
          className="shop-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          aria-label="Search products"
        />

        <div className="filter-scroll">
          {categories.map((item) => (
            <button
              key={item}
              className={`filter-chip ${category === item ? "active" : ""}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <select className="shop-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="featured">Featured</option>
          <option value="price-low">Price: low to high</option>
          <option value="price-high">Price: high to low</option>
          <option value="name">Name</option>
        </select>
      </div>

      <div className="product-grid">
        {filtered.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>

      {filtered.length === 0 && <p className="empty-state">No products match your filters.</p>}
    </>
  );
}
