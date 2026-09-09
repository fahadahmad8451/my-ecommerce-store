import fs from "node:fs/promises";
import path from "node:path";

export type LinkItem = { label: string; href: string };
export type FooterColumn = { title: string; links: LinkItem[] };
export type ReviewItem = { quote: string; name: string; role: string; score: string };

export type SiteConfig = {
  brand: { name: string; tagline: string; coordinate: string };
  nav: {
    home: string; shop: string; workspace: string; approach: string;
    search: string; account: string; cart: string;
  };
  announcement: {
    enabled: boolean; speedSeconds: number; background: string; textColor: string;
    items: Array<{ text: string; link: string }>;
  };
  hero: {
    eyebrow: string; line1: string; line2: string; description: string;
    primaryButton: string; secondaryButton: string;
  };
  marquee: { items: string[] };
  statement: { eyebrow: string; title1: string; title2: string; description: string };
  featured: { eyebrow: string; title: string; button: string };
  cinematic: { eyebrow: string; line1: string; line2: string; line3: string; caption: string };
  scrollStory: { eyebrow: string; title: string; description: string; stageLabel: string };
  horizontalStory: {
    eyebrow: string; title: string; description: string; cue: string;
    outroEyebrow: string; outroTitle: string; outroButton: string;
  };
  depthGallery: { eyebrow: string; title: string };
  categories: { eyebrow: string; title: string; button: string };
  transformation: { eyebrow: string; title: string; description: string };
  configurator: { eyebrow: string; title: string; description: string; button: string };
  bestsellers: { eyebrow: string; title: string; button: string };
  reviewsSection: { eyebrow: string };
  reviews: ReviewItem[];
  principle: { eyebrow: string; title: string; description: string };
  newsletter: { eyebrow: string; title: string; placeholder: string; button: string };
  shopPage: { eyebrow: string; title: string; description: string };
  accountPage: { eyebrow: string; title: string; description: string };
  footer: {
    background: string; textColor: string;
    newsletterTitle: string; newsletterPlaceholder: string; newsletterButton: string;
    columns: FooterColumn[];
    socials: Array<{ label: string; href: string; icon: string }>;
    copyright: string;
  };
  stats: Array<{ value: string; label: string }>;
  theme: {
    background: string; panel: string; text: string; muted: string;
    accent: string; accentSoft: string;
  };
  carousel: { speed: number; radius: number; cardWidth: number; maxProducts: number };
  sections: Record<string, boolean>;
};

const configPath = path.join(process.cwd(), "data", "site-config.json");

export async function getSiteConfig(): Promise<SiteConfig> {
  const raw = await fs.readFile(configPath, "utf8");
  return JSON.parse(raw) as SiteConfig;
}

export async function saveSiteConfig(config: SiteConfig) {
  await fs.writeFile(configPath, JSON.stringify(config, null, 2) + "\n", "utf8");
}
