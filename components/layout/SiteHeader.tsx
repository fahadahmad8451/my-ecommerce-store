"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import type { SiteConfig } from "@/lib/site-config";
import { ProductSearch } from "@/components/search/ProductSearch";
import { products } from "@/lib/products";
import { useWishlist } from "@/components/wishlist/WishlistProvider";

export function SiteHeader({ config }: { config: SiteConfig }) {
  const { count, setOpen } = useCart();
  const { items: wishlist } = useWishlist();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  const isHome = pathname === "/";
  const shopActive = pathname.startsWith("/shop") || pathname.startsWith("/product");
  const accountActive = pathname.startsWith("/account");

  const navItems = [
    { id: "00", label: config.nav.home, href: "/", active: isHome },
    { id: "01", label: config.nav.shop, href: "/shop", active: shopActive },
    { id: "02", label: config.nav.workspace, href: "/#story", active: false },
    { id: "03", label: config.nav.approach, href: "/#principle", active: false }
  ];

  return (
    <>
      <header className={`site-header premium-navbar ${scrolled ? "is-scrolled" : ""}`}>
        <div className="navbar-brand-wrap">
          <Link href="/" className="logo premium-logo">{config.brand.name}<sup>TM</sup></Link>
          <span className="brand-coordinate">{config.brand.coordinate}</span>
        </div>

        <nav className="nav premium-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link className={item.active ? "active" : ""} href={item.href} key={item.id}>
              <span>{item.label}</span><small>{item.id}</small>
            </Link>
          ))}
        </nav>

        <div className="header-actions premium-actions">
          <ProductSearch products={products}/>
          <Link className={`nav-action ${accountActive ? "active" : ""}`} href="/account">
            <span className="nav-action-icon">◎</span><small>{config.nav.account}</small>
          </Link>
          <Link className="nav-action" href="/account" aria-label="Wishlist"><span className="nav-action-icon">♡</span>{wishlist.length > 0 && <b className="nav-count">{wishlist.length}</b>}<small>Wishlist</small></Link>
          <button className="premium-cart" onClick={() => setOpen(true)}>
            <span>{config.nav.cart}</span><b>{String(count).padStart(2,"0")}</b>
          </button>
          <button className={`mobile-menu-button ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(v=>!v)}>
            <i/><i/>
          </button>
        </div>
      </header>

      <div className={`mobile-nav-panel ${mobileOpen ? "open" : ""}`}>
        <nav>
          {navItems.map((item) => (
            <Link href={item.href} key={item.id}><span>{item.id}</span> {item.label}</Link>
          ))}
          <Link href="/account"><span>04</span> {config.nav.account}</Link>
        </nav>
        <div className="mobile-nav-bottom">
          <span>{config.brand.name}™</span><small>{config.brand.tagline}</small>
        </div>
      </div>
    </>
  );
}
