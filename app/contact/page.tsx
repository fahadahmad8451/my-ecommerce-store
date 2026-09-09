import { SupportForm } from "@/components/forms/SupportForms";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getSiteConfig } from "@/lib/site-config";
import { getSiteContent } from "@/lib/site-content";

export default async function ContactPage() {
  const [config, content] = await Promise.all([getSiteConfig(), getSiteContent()]);
  return <><main className="page-top section-pad form-page"><section><span className="eyebrow">SUPPORT CENTER</span><h1 className="display-xl">How can we help?</h1><p className="lede page-intro">For product, order or partnership questions, send us a message at {content.contactEmail} or use the form below.</p><SupportForm kind="contact"/></section></main><SiteFooter config={config}/></>;
}
