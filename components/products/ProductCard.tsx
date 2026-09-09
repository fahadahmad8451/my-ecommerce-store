"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/cart/CartProvider";
import { useWishlist } from "@/components/wishlist/WishlistProvider";

export function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round((1 - product.price / product.compareAtPrice) * 100)
      : 0;

  return (
    <article className="product-card">
      <Link href={`/product/${product.slug}`} className="product-card-link">
        <div className="product-visual">
          <div className="product-index">{String(index + 1).padStart(2, "0")}</div>
          {discount > 0 && <div className="sale-badge">−{discount}%</div>}

          {product.images?.[0] ? (
            <img className="product-photo" src={product.images[0]} alt={product.name} loading="lazy" />
          ) : (
            <div className="fake-product" />
          )}

          <div className="product-visual-overlay" />
        </div>

        <div className="product-meta">
          <div>
            <div className="product-title">{product.name}</div>
            <div className="product-category">
              {product.category} · {product.stock > 0 ? `${product.stock} in stock` : "Sold out"}
            </div>
            <div className="color-dots">
              {product.colors.slice(0, 4).map((color) => <span key={color} title={color} />)}
            </div>
          </div>
          <div className="product-price-wrap">
            {product.compareAtPrice && <span className="compare-price">${product.compareAtPrice}</span>}
            <div className="product-price">${product.price}</div>
          </div>
        </div>
      </Link>

      <button
        className="card-cart-btn"
        disabled={product.stock <= 0}
        onClick={() => addItem(product, 1, product.colors[0])}
      >
        {product.stock > 0 ? "Add to Cart" : "Sold out"}
      </button>
      <button className={`wishlist-button ${has(product.id) ? "saved" : ""}`} type="button" onClick={() => toggle(product)} aria-pressed={has(product.id)}>{has(product.id) ? "Saved" : "Save"}</button>
    </article>
  );
}
