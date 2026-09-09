import { ContentPage } from "@/components/content/ContentPage";
import { SupportForm } from "@/components/forms/SupportForms";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getSiteConfig } from "@/lib/site-config";
import { getSiteContent } from "@/lib/site-content";

export default async function AffiliatePage() {
  const [config, content] = await Promise.all([getSiteConfig(), getSiteContent()]);
  return <><ContentPage page={content.pages.affiliate}/><main className="section-pad form-page"><section><span className="eyebrow">APPLY</span><h2>Tell us about your work.</h2><SupportForm kind="affiliate"/></section></main><SiteFooter config={config}/></>;
}
