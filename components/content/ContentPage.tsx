import Link from "next/link";
import type { ContentPage as ContentPageData } from "@/lib/site-content";

export function ContentPage({ page, cta }: { page: ContentPageData; cta?: { label: string; href: string } }) {
  return (
    <main className="page-top content-page">
      <section className="content-page-hero section-pad">
        <span className="eyebrow">{page.eyebrow}</span>
        <h1 className="display-xl">{page.title}</h1>
        <p className="lede page-intro">{page.intro}</p>
        {cta && <Link className="btn-primary" href={cta.href}>{cta.label}</Link>}
      </section>
      <section className="content-page-body section-pad">
        {page.sections.map((section, index) => (
          <article key={`${section.heading}-${index}`}>
            <h2>{section.heading}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
