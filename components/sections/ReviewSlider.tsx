"use client";
import { useState } from "react";
import type { SiteConfig } from "@/lib/site-config";

export function ReviewSlider({ config }: { config: SiteConfig }) {
  const reviews = config.reviews;
  const [active,setActive] = useState(0);
  if (!reviews.length) return null;
  const review = reviews[active];

  return (
    <section className="review-slider section-pad">
      <div className="review-slider-top">
        <span className="eyebrow">{config.reviewsSection.eyebrow}</span>
        <div className="review-nav">
          <button onClick={()=>setActive((active-1+reviews.length)%reviews.length)}>←</button>
          <span>{String(active+1).padStart(2,"0")} / {String(reviews.length).padStart(2,"0")}</span>
          <button onClick={()=>setActive((active+1)%reviews.length)}>→</button>
        </div>
      </div>
      <div className="review-slider-body">
        <div className="review-score"><strong>{review.score}</strong><span>★★★★★</span></div>
        <blockquote>“{review.quote}”</blockquote>
        <div className="review-author"><strong>{review.name}</strong><span>{review.role}</span></div>
      </div>
      <div className="review-progress">
        {reviews.map((_,index)=><button key={index} className={index===active?"active":""} onClick={()=>setActive(index)}/>)}
      </div>
    </section>
  );
}
