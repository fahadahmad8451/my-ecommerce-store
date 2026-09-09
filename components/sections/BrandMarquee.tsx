import type { SiteConfig } from "@/lib/site-config";

export function BrandMarquee({ config }: { config: SiteConfig }) {
  const items = config.marquee.items.length ? config.marquee.items : [config.brand.name];
  return (
    <div className="brand-marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...items, ...items].map((item,index)=>(
          <span key={`${item}-${index}`}>{item}<i>✦</i></span>
        ))}
      </div>
    </div>
  );
}
