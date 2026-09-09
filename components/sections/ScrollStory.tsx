"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SiteConfig } from "@/lib/site-config";

export function ScrollStory({ config }: { config: SiteConfig }) {
  const section = useRef<HTMLElement>(null);
  const object = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(object.current,{rotate:-18,scale:.72,y:120},{
        rotate:18,scale:1.15,y:-50,ease:"none",
        scrollTrigger:{trigger:section.current,start:"top top",end:"bottom bottom",scrub:1}
      });
      gsap.fromTo(heading.current,{opacity:.35,y:70},{
        opacity:1,y:-20,
        scrollTrigger:{trigger:section.current,start:"top 65%",end:"45% 35%",scrub:true}
      });
    },section);
    return () => ctx.revert();
  },[]);

  return (
    <section className="story" id="story" ref={section}>
      <div className="story-sticky">
        <div className="story-copy">
          <span className="eyebrow">{config.scrollStory.eyebrow}</span>
          <h2 ref={heading} className="display-lg">{config.scrollStory.title}</h2>
          <p className="lede">{config.scrollStory.description}</p>
        </div>
        <div className="story-stage">
          <div className="story-orbit"><div ref={object} className="story-object"/></div>
          <div className="story-label">{config.scrollStory.stageLabel}</div>
        </div>
      </div>
    </section>
  );
}
