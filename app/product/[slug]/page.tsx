import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetail } from "@/components/products/ProductDetail";
import { getProductBySlug, getProducts } from "@/lib/shopify-products";
import { isActiveProduct } from "@/lib/product-placement";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.filter(isActiveProduct).map(product => ({ slug: product.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.seoTitle || `${product.name} — DESKAVYN`,
    description: product.seoDescription || product.description
  };
}

export default async function ProductPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product || !isActiveProduct(product)) notFound();

  return (
    <main className="page-top">
      <ProductDetail product={product} />
    </main>
  );
}
