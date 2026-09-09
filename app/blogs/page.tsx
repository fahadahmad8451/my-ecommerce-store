import Link from "next/link";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getSiteConfig } from "@/lib/site-config";
import { getSiteContent } from "@/lib/site-content";

export default async function BlogsPage() {
  const [config, content] = await Promise.all([getSiteConfig(), getSiteContent()]);
  return <>
    <main className="page-top content-page">
      <section className="content-page-hero section-pad"><span className="eyebrow">JOURNAL</span><h1 className="display-xl">Ideas for a considered workspace.</h1><p className="lede page-intro">Notes on focus, objects and the spaces where meaningful work happens.</p></section>
      <section className="blog-grid section-pad">
        {content.blogs.map(post => <article className="blog-card" key={post.slug}><span>{post.publishedAt} · {post.readTime}</span><h2>{post.title}</h2><p>{post.excerpt}</p><Link href={`/blogs/${post.slug}`}>Read article <span aria-hidden="true">↗</span></Link></article>)}
      </section>
    </main>
    <SiteFooter config={config}/>
  </>;
}
