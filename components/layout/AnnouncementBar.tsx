import Link from "next/link";
import type { SiteConfig } from "@/lib/site-config";

export function AnnouncementBar({ config }: { config: SiteConfig }) {
  const bar = config.announcement;
  if (!bar.enabled || !bar.items.length) return null;

  const items = [...bar.items, ...bar.items];

  return (
    <div
      className="announcement-bar"
      style={{
        background: bar.background,
        color: bar.textColor,
        ["--announcement-speed" as any]: `${Math.max(6, bar.speedSeconds)}s`
      }}
    >
      <div className="announcement-track">
        {items.map((item, index) => (
          <Link href={item.link || "#"} key={`${item.text}-${index}`}>
            <span>{item.text}</span><i>✦</i>
          </Link>
        ))}
      </div>
    </div>
  );
}
