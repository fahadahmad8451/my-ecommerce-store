import { SiteFooter } from "@/components/layout/SiteFooter";
import { getSiteConfig } from "@/lib/site-config";
import { WishlistAccount } from "@/components/wishlist/WishlistAccount";

export default async function AccountPage() {
  const config=await getSiteConfig();
  return (
    <>
      <main className="page-top section-pad account-page">
        <span className="eyebrow">{config.accountPage.eyebrow}</span>
        <h1 className="display-xl">{config.accountPage.title}</h1>
        <p className="lede page-intro">{config.accountPage.description}</p>
        <div className="account-grid">
          <section className="account-card"><span>01</span><h2>Login / Register</h2><p>Connect Shopify Customer Account authentication here.</p><button className="btn-primary">Connect Shopify login</button></section>
          <section className="account-card"><span>02</span><h2>Orders</h2><p>Previous orders and live order status will appear after Shopify connection.</p></section>
          <section className="account-card"><span>03</span><h2>Saved addresses</h2><p>Customer shipping and billing addresses.</p></section>
          <WishlistAccount/>
        </div>
      </main>
      <SiteFooter config={config}/>
    </>
  );
}
