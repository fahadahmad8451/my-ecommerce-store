import { ShopClient } from "@/components/products/ShopClient";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getProducts } from "@/lib/shopify-products";
import { productsForPlacement } from "@/lib/product-placement";
import { getSiteConfig } from "@/lib/site-config";

export default async function ShopPage() {
  const [allProducts,config]=await Promise.all([getProducts(),getSiteConfig()]);
  const products=productsForPlacement(allProducts,"shop");

  return (
    <>
      <main className="page-top section-pad">
        <span className="eyebrow">{config.shopPage.eyebrow}</span>
        <h1 className="display-xl">{config.shopPage.title}</h1>
        <p className="lede page-intro">{config.shopPage.description}</p>
        <ShopClient products={products}/>
      </main>
      <SiteFooter config={config}/>
    </>
  );
}
