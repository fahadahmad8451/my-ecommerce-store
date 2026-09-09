import { notFound } from "next/navigation";
import { ContentPage } from "@/components/content/ContentPage";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getSiteConfig } from "@/lib/site-config";
import { getSiteContent } from "@/lib/site-content";

export async function ContentRoute({ slug, cta }: { slug: string; cta?: { label: string; href: string } }) {
  const [config, content] = await Promise.all([getSiteConfig(), getSiteContent()]);
  const page = content.pages[slug];
  if (!page) notFound();

  return <><ContentPage page={page} cta={cta}/><SiteFooter config={config}/></>;
}
