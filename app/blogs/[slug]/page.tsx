import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getSiteConfig } from "@/lib/site-config";
import { getSiteContent } from "@/lib/site-content";

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [config, content] = await Promise.all([getSiteConfig(), getSiteContent()]);
  const post = content.blogs.find(item => item.slug === slug);
  if (!post) notFound();
  return <><main className="page-top content-page"><section className="content-page-hero section-pad"><span className="eyebrow">{post.publishedAt} · {post.readTime}</span><h1 className="display-xl">{post.title}</h1><p className="lede page-intro">{post.excerpt}</p></section><section className="content-page-body section-pad">{post.body.map((section, index)=><article key={`${section.heading}-${index}`}><h2>{section.heading}</h2><p>{section.body}</p></article>)}</section></main><SiteFooter config={config}/></>;
}
