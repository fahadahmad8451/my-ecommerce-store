"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/products";

export function FeaturedSlider({ products }: { products: Product[] }) {
  const slides = useMemo(() => products.slice(0, 5), [products]);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [paused, slides.length]);

  if (!slides.length) return null;

  const product = slides[active];

  return (
    <section
      className="feature-slider"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Featured product slider"
    >
      <div className="feature-slider-copy">
        <span className="eyebrow">FEATURED OBJECT / {String(active + 1).padStart(2, "0")}</span>
        <h2>{product.name}</h2>
        <p>{product.description}</p>

        <div className="feature-slider-meta">
          <span>{product.category}</span>
          <strong>${product.price}</strong>
        </div>

        <div className="feature-slider-actions">
          <Link href={`/product/${product.slug}`} className="btn-primary">Explore object</Link>
          <Link href="/shop" className="btn-ghost">View collection</Link>
        </div>

        <div className="slider-controls">
          <button
            aria-label="Previous slide"
            onClick={() => setActive((active - 1 + slides.length) % slides.length)}
          >
            ←
          </button>
          <div className="slider-dots">
            {slides.map((item, index) => (
              <button
                aria-label={`Go to ${item.name}`}
                key={item.id}
                className={index === active ? "active" : ""}
                onClick={() => setActive(index)}
              >
                <span />
              </button>
            ))}
          </div>
          <button
            aria-label="Next slide"
            onClick={() => setActive((active + 1) % slides.length)}
          >
            →
          </button>
        </div>
      </div>

      <div className="feature-slider-stage">
        <div className="slider-grid-lines" />
        <div className="slider-glow" />

        {slides.map((item, index) => {
          const offset = index - active;
          return (
            <Link
              href={`/product/${item.slug}`}
              key={item.id}
              className={`slider-product-figure ${index === active ? "active" : ""}`}
              style={{
                transform: `translate3d(${offset * 46}%, ${Math.abs(offset) * 8}%, 0) rotate(${offset * 9}deg) scale(${index === active ? 1 : .74})`,
                opacity: Math.abs(offset) > 2 ? 0 : index === active ? 1 : .22,
                zIndex: 10 - Math.abs(offset)
              }}
              aria-hidden={index !== active}
              tabIndex={index === active ? 0 : -1}
            >
              <div className="slider-figure-screen" />
              <div className="slider-figure-base" />
              <span>{item.name}</span>
            </Link>
          );
        })}

        <div className="feature-slider-index">
          <strong>{String(active + 1).padStart(2, "0")}</strong>
          <span>/ {String(slides.length).padStart(2, "0")}</span>
        </div>
      </div>
    </section>
  );
}
