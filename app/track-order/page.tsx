import { TrackOrderForm } from "@/components/forms/SupportForms";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getSiteConfig } from "@/lib/site-config";

export default async function TrackOrderPage() {
  const config = await getSiteConfig();
  return <><main className="page-top section-pad form-page"><section><span className="eyebrow">SUPPORT CENTER</span><h1 className="display-xl">Track your order.</h1><p className="lede page-intro">Enter the details used at checkout. Tracking will be available here as soon as the order-provider integration is connected.</p><TrackOrderForm/></section></main><SiteFooter config={config}/></>;
}
