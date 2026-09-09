"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteConfig } from "@/lib/site-config";

export function CinematicSequence({ config }: { config: SiteConfig }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(".cinematic-title-line",{yPercent:120,opacity:0},{
        yPercent:0,opacity:1,stagger:.12,
        scrollTrigger:{trigger:root.current,start:"top 72%",end:"45% 38%",scrub:1}
      });
      gsap.fromTo(".cinematic-figure",{scale:.68,rotate:-18,opacity:.3},{
        scale:1.12,rotate:8,opacity:1,
        scrollTrigger:{trigger:root.current,start:"top 70%",end:"bottom 25%",scrub:1}
      });
    },root);
    return () => ctx.revert();
  },[]);

  return (
    <section className="cinematic-sequence" ref={root}>
      <div className="cinematic-grid"/>
      <div className="cinematic-copy">
        <span className="eyebrow">{config.cinematic.eyebrow}</span>
        <h2>
          <span className="cinematic-title-line">{config.cinematic.line1}</span>
          <span className="cinematic-title-line">{config.cinematic.line2}</span>
          <span className="cinematic-title-line"><em>{config.cinematic.line3}</em></span>
        </h2>
      </div>
      <div className="cinematic-stage">
        <div className="cinematic-figure"><div className="cinematic-screen"/><div className="cinematic-column"/><div className="cinematic-base"/></div>
        <div className="cinematic-caption"><span>01</span><p>{config.cinematic.caption}</p></div>
      </div>
    </section>
  );
}
