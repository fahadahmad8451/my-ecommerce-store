import { SiteSettingsAdmin } from "@/components/admin/SiteSettingsAdmin";

export const dynamic = "force-dynamic";

export default function SiteSettingsPage() {
  return (
    <main className="page-top section-pad admin-products-page">
      <span className="eyebrow">DESKAVYN ADMIN / WEBSITE</span>
      <h1 className="display-xl">Website settings.</h1>
      <p className="lede page-intro">
        Change the main website content and visual settings from one place.
      </p>
      <SiteSettingsAdmin />
    </main>
  );
}
