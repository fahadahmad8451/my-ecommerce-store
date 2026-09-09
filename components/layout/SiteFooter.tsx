import Link from "next/link";
import type { SiteConfig } from "@/lib/site-config";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export function SiteFooter({ config }: { config: SiteConfig }) {
  return (
    <footer
      className="editorial-footer"
      style={{ background: config.footer.background, color: config.footer.textColor }}
    >
      <div className="footer-columns">
        {config.footer.columns.map((column, index) => (
          <div className="footer-column" key={`${column.title}-${index}`}>
            <h3>{column.title}</h3>
            {column.links.map((link, linkIndex) => (
              <Link href={link.href} key={`${link.label}-${linkIndex}`}>
                {link.label}
              </Link>
            ))}
          </div>
        ))}

        <div className="footer-newsletter-block">
          <h3>{config.footer.newsletterTitle}</h3>
          <NewsletterForm placeholder={config.footer.newsletterPlaceholder} button={config.footer.newsletterButton} />

          <div className="footer-socials">
            {config.footer.socials.filter(social => social.href && social.href !== "#").map((social, index) => (
              <Link
                href={social.href}
                aria-label={social.label}
                key={`${social.label}-${index}`}
              >
                {social.icon || social.label.slice(0,1)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom-line">
        <strong>{config.brand.name}</strong>
        <span>{config.footer.copyright}</span>
      </div>
    </footer>
  );
}
