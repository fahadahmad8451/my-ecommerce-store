import { ReturnRequestForm } from "@/components/forms/ReturnRequestForm";
import { ContentPage } from "@/components/content/ContentPage";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getSiteConfig } from "@/lib/site-config";
import { getSiteContent } from "@/lib/site-content";
export default async function ReturnsPage() { const [config, content] = await Promise.all([getSiteConfig(), getSiteContent()]); const page = content.pages.returns; return <><ContentPage page={page}/><main className="section-pad form-page"><section><span className="eyebrow">RETURN REQUEST</span><h2 className="display-lg">Start a return.</h2><p className="lede">Submit your request and our team will confirm the next steps by email.</p><ReturnRequestForm/></section></main><SiteFooter config={config}/></>; }
