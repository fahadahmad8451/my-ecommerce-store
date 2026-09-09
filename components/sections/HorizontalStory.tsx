"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Product } from "@/lib/products";
import type { SiteConfig } from "@/lib/site-config";

export function HorizontalStory({ products, config }: { products: Product[]; config: SiteConfig }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!section.current || !track.current) return;
    const ctx = gsap.context(() => {
      const getDistance = () => Math.max(0, track.current!.scrollWidth - window.innerWidth);
      gsap.to(track.current,{
        x:()=>-getDistance(),ease:"none",
        scrollTrigger:{trigger:section.current,start:"top top",end:()=>`+=${getDistance()+window.innerHeight*.65}`,scrub:1,pin:true,invalidateOnRefresh:true}
      });
    },section);
    return () => ctx.revert();
  },[]);

  return (
    <section className="horizontal-story" ref={section}>
      <div className="horizontal-track" ref={track}>
        <article className="horizontal-intro horizontal-panel">
          <span className="eyebrow">{config.horizontalStory.eyebrow}</span>
          <h2>{config.horizontalStory.title}</h2>
          <p>{config.horizontalStory.description}</p>
          <div className="horizontal-cue">{config.horizontalStory.cue}</div>
        </article>

        {products.slice(0,5).map((product,index)=>(
          <article className="horizontal-card horizontal-panel" key={product.id}>
            <div className="horizontal-card-number">{String(index+1).padStart(2,"0")}</div>
            <div className="horizontal-product-visual">
              <img src={product.images?.[0] || "/images/product-placeholder-1.svg"} alt="" className="horizontal-product-photo"/>
              <div className="horizontal-orbit one"/><div className="horizontal-orbit two"/>
            </div>
            <div className="horizontal-card-copy">
              <span>{product.category}</span><h3>{product.name}</h3><p>{product.description}</p>
              <div className="horizontal-card-footer"><strong>${product.price}</strong><Link href={`/product/${product.slug}`}>Explore ↗</Link></div>
            </div>
          </article>
        ))}

        <article className="horizontal-outro horizontal-panel">
          <span className="eyebrow">{config.horizontalStory.outroEyebrow}</span>
          <h2>{config.horizontalStory.outroTitle}</h2>
          <Link href="/shop" className="btn-primary">{config.horizontalStory.outroButton}</Link>
        </article>
      </div>
    </section>
  );
}
