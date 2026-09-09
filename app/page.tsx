import Link from "next/link";
import { Hero3D } from "@/components/hero/Hero3D";
import { ScrollStory } from "@/components/sections/ScrollStory";
import { ProductShowcase } from "@/components/products/ProductShowcase";
import { FeaturedSlider } from "@/components/sections/FeaturedSlider";
import { BrandMarquee } from "@/components/sections/BrandMarquee";
import { ReviewSlider } from "@/components/sections/ReviewSlider";
import { ConfiguratorPreview } from "@/components/sections/ConfiguratorPreview";
import { HorizontalStory } from "@/components/sections/HorizontalStory";
import { CinematicSequence } from "@/components/sections/CinematicSequence";
import { DepthGallery } from "@/components/sections/DepthGallery";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { getProducts } from "@/lib/shopify-products";
import { getSiteConfig } from "@/lib/site-config";
import { productsForPlacement } from "@/lib/product-placement";

export default async function HomePage() {
  const [allProducts,config]=await Promise.all([getProducts(),getSiteConfig()]);
  const featured=productsForPlacement(allProducts,"featuredProducts");
  const bestsellers=productsForPlacement(allProducts,"bestsellers");
  const carouselProducts=productsForPlacement(allProducts,"depthGallery");
  const sliderProducts=productsForPlacement(allProducts,"featuredSlider");
  const horizontalProducts=productsForPlacement(allProducts,"horizontalStory");
  const shopProducts=productsForPlacement(allProducts,"shop");
  const categories=Array.from(new Set(shopProducts.map(p=>p.category)));
  const s=config.sections;

  return (
    <main>
      <Hero3D config={config}/>
      {s.marquee&&<BrandMarquee config={config}/>} 

      {s.statement&&<section className="statement section-pad">
        <div className="eyebrow">{config.statement.eyebrow}</div>
        <h2 className="display-xl">{config.statement.title1}<br/><em>{config.statement.title2}</em></h2>
        <p className="lede">{config.statement.description}</p>
      </section>}

      {s.featuredProducts&&featured.length>0&&<section className="section-pad home-editors-picks"><div className="section-head"><div><span className="eyebrow">FEATURED PRODUCTS</span><h2 className="display-lg">Editor’s picks.</h2></div><Link className="text-link" href="/shop">View all products ↗</Link></div><ProductShowcase products={featured.slice(0,4)}/></section>}
      {s.featuredSlider&&sliderProducts.length>0&&<FeaturedSlider products={sliderProducts}/>} 
      {s.cinematic&&<CinematicSequence config={config}/>}
      {s.scrollStory&&<ScrollStory config={config}/>}
      {s.horizontalStory&&horizontalProducts.length>0&&<HorizontalStory products={horizontalProducts} config={config}/>}


      {s.depthGallery&&carouselProducts.length>0&&<DepthGallery products={carouselProducts} config={config}/>}

      {s.categories&&<section className="category-section section-pad">
        <span className="eyebrow">{config.categories.eyebrow}</span><h2 className="display-lg">{config.categories.title}</h2>
        <div className="category-grid">{categories.map((category,index)=><Link href="/shop" className="category-card" key={category}><span>{String(index+1).padStart(2,"0")}</span><div className="category-figure"><i/><i/><i/></div><strong>{category}</strong><small>{config.categories.button} ↗</small></Link>)}</div>
      </section>}

      {s.transformation&&<section className="transformation-section">
        <div className="transformation-copy"><span className="eyebrow">{config.transformation.eyebrow}</span><h2 className="display-lg">{config.transformation.title}</h2><p className="lede">{config.transformation.description}</p></div>
        <div className="transformation-visual"><div className="transform-ring ring-a"/><div className="transform-ring ring-b"/><div className="transform-object one"/><div className="transform-object two"/><div className="transform-object three"/><div className="transform-axis axis-x"/><div className="transform-axis axis-y"/></div>
      </section>}

      {s.configurator&&<ConfiguratorPreview config={config}/>}

      {s.bestsellers&&bestsellers.length>0&&<section className="section-pad">
        <div className="section-head"><div><span className="eyebrow">{config.bestsellers.eyebrow}</span><h2 className="display-lg">{config.bestsellers.title}</h2></div><Link className="text-link" href="/shop">{config.bestsellers.button} ↗</Link></div>
        <ProductShowcase products={bestsellers.slice(0,4)}/>
      </section>}

      {s.reviews&&<ReviewSlider config={config}/>}

      {s.principle&&<section className="manifesto section-pad" id="principle">
        <div className="manifesto-grid"><div className="manifesto-number">03</div><div><span className="eyebrow">{config.principle.eyebrow}</span><h2 className="display-lg">{config.principle.title}</h2><p className="lede">{config.principle.description}</p></div></div>
      </section>}

      {s.newsletter&&<section className="newsletter section-pad">
        <span className="eyebrow">{config.newsletter.eyebrow}</span><h2 className="display-lg">{config.newsletter.title}</h2>
        <NewsletterForm inputId="home-newsletter-email" placeholder={config.newsletter.placeholder} button={config.newsletter.button}/>
      </section>}

      <SiteFooter config={config}/>
    </main>
  );
}
