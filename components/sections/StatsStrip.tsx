import type { SiteConfig } from "@/lib/site-config";

export function StatsStrip({ config }: { config: SiteConfig }) {
  return (
    <section className="stats-strip">
      {config.stats.map((stat,index)=>(
        <div className="stat-figure" key={`${stat.label}-${index}`}>
          <span className="stat-index">{String(index+1).padStart(2,"0")}</span>
          <strong className="stat-visible">{stat.value}</strong>
          <p>{stat.label}</p>
        </div>
      ))}
    </section>
  );
}
