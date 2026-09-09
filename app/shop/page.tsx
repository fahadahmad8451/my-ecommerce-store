import { ShopClient } from "@/components/products/ShopClient";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getProducts } from "@/lib/shopify-products";
import { productsForPlacement } from "@/lib/product-placement";
import { getSiteConfig } from "@/lib/site-config";
import { Suspense } from "react";

export default async function ShopPage() {
  const [allProducts,config]=await Promise.all([getProducts(),getSiteConfig()]);
  const products=productsForPlacement(allProducts,"shop");

  return (
    <>
      <main className="page-top section-pad">
        <span className="eyebrow">{config.shopPage.eyebrow}</span>
        <h1 className="display-xl">{config.shopPage.title}</h1>
        <p className="lede page-intro">{config.shopPage.description}</p>
        <Suspense fallback={<p className="admin-help">Loading products...</p>}>
          <ShopClient products={products}/>
        </Suspense>
      </main>
      <SiteFooter config={config}/>
    </>
  );
}
