import fs from "node:fs/promises";
import path from "node:path";

export type ContentSection = {
  heading: string;
  body: string;
};

export type ContentPage = {
  eyebrow: string;
  title: string;
  intro: string;
  sections: ContentSection[];
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  body: ContentSection[];
};

export type SiteContent = {
  contactEmail: string;
  pages: Record<string, ContentPage>;
  blogs: BlogPost[];
};

const contentPath = path.join(process.cwd(), "data", "site-content.json");

export async function getSiteContent(): Promise<SiteContent> {
  const raw = await fs.readFile(contentPath, "utf8");
  return JSON.parse(raw) as SiteContent;
}

export async function saveSiteContent(content: SiteContent) {
  await fs.writeFile(contentPath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}
