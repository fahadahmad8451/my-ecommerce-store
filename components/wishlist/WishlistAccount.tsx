"use client";

import Link from "next/link";
import { useWishlist } from "@/components/wishlist/WishlistProvider";

export function WishlistAccount() {
  const { items, toggle } = useWishlist();
  return <section className="account-card wishlist-account"><span>04</span><h2>Wishlist</h2><p>{items.length ? `${items.length} saved product${items.length === 1 ? "" : "s"} on this device.` : "Save favorite DESKAVYN objects for later."}</p>{items.length ? <div className="wishlist-list">{items.map(product => <div key={product.id}><Link href={`/product/${product.slug}`}>{product.name}</Link><button type="button" onClick={() => toggle(product)}>Remove</button></div>)}</div> : null}<small>Sign in with Shopify Customer Accounts to sync saved products across devices when customer authentication is enabled.</small></section>;
}
