import { products as localProducts, type Product, type ProductVariant } from "@/lib/products";
import { shopifyFetch } from "@/lib/shopify";
import { getManualProducts } from "@/lib/manual-products";

type ShopifyProductsResponse = {
  products: {
    nodes: Array<{
      id: string;
      handle: string;
      title: string;
      description: string;
      productType: string;
      featuredImage?: { url: string; altText?: string | null } | null;
      images: { nodes: Array<{ url: string; altText?: string | null }> };
      priceRange: {
        minVariantPrice: { amount: string; currencyCode: string };
      };
      compareAtPriceRange: {
        minVariantPrice: { amount: string; currencyCode: string };
      };
      totalInventory?: number | null;
      options: Array<{ name: string; values: string[] }>;
      variants: {
        nodes: Array<{
          id: string;
          title: string;
          availableForSale: boolean;
          quantityAvailable?: number | null;
          sku?: string | null;
          selectedOptions: Array<{ name: string; value: string }>;
          image?: { url: string } | null;
          price: { amount: string };
          compareAtPrice?: { amount: string } | null;
        }>;
      };
    }>;
  };
};

const LIVE_PRODUCTS_QUERY = `
  query DeskavynProducts($first: Int!) {
    products(first: $first) {
      nodes {
        id
        handle
        title
        description
        productType
        featuredImage { url altText }
        images(first: 6) { nodes { url altText } }
        priceRange { minVariantPrice { amount currencyCode } }
        compareAtPriceRange { minVariantPrice { amount currencyCode } }
        totalInventory
        options { name values }
        variants(first: 20) {
          nodes {
          id
          title
          availableForSale
          quantityAvailable
          sku
          selectedOptions { name value }
          image { url }
          price { amount }
          compareAtPrice { amount }
          }
        }
      }
    }
  }
`;

function normalizeShopifyProduct(node: ShopifyProductsResponse["products"]["nodes"][number]): Product {
  const colorOption = node.options.find((option) => option.name.toLowerCase() === "color");
  const materialOption = node.options.find((option) => option.name.toLowerCase() === "material");
  const price = Number(node.priceRange.minVariantPrice.amount);
  const compareAt = Number(node.compareAtPriceRange.minVariantPrice.amount || 0);
  const stock =
    typeof node.totalInventory === "number"
      ? Math.max(0, node.totalInventory)
      : node.variants.nodes.reduce(
          (sum, variant) => sum + Math.max(0, variant.quantityAvailable || 0),
          0
        );

  const images = node.images.nodes.map((image) => image.url);
  if (!images.length && node.featuredImage?.url) images.push(node.featuredImage.url);

  const variants: ProductVariant[] = node.variants.nodes.map(variant => ({
    id: variant.id,
    title: variant.title,
    availableForSale: variant.availableForSale,
    stock: typeof variant.quantityAvailable === "number" ? Math.max(0, variant.quantityAvailable) : undefined,
    sku: variant.sku || undefined,
    image: variant.image?.url,
    price: Number(variant.price.amount),
    compareAtPrice: variant.compareAtPrice && Number(variant.compareAtPrice.amount) > Number(variant.price.amount) ? Number(variant.compareAtPrice.amount) : undefined,
    selectedOptions: variant.selectedOptions
  }));

  return {
    id: node.id,
    slug: node.handle,
    name: node.title,
    category: node.productType || "Essentials",
    price,
    compareAtPrice: compareAt > price ? compareAt : undefined,
    description: node.description || "Designed for a focused workspace.",
    materials: materialOption?.values?.length ? materialOption.values : ["Premium material"],
    colors: colorOption?.values?.length ? colorOption.values : ["Graphite"],
    stock,
    featured: true,
    bestseller: false,
    images: images.length ? images : ["/images/product-placeholder-1.svg"],
    rating: 4.9,
    reviewCount: 0,
    shopifyVariantId: node.variants.nodes[0]?.id,
    variants
  };
}

function dedupeProducts(products: Product[]) {
  const seen = new Set<string>();
  return products.filter((product) => {
    const key = product.slug.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function getProducts(): Promise<Product[]> {
  const manualProducts = await getManualProducts();

  try {
    const data = await shopifyFetch<ShopifyProductsResponse>({
      query: LIVE_PRODUCTS_QUERY,
      variables: { first: 50 }
    });

    const baseProducts = data?.products?.nodes?.length
      ? data.products.nodes.map(normalizeShopifyProduct)
      : localProducts;

    return dedupeProducts([...manualProducts, ...baseProducts]);
  } catch {
    return dedupeProducts([...manualProducts, ...localProducts]);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const all = await getProducts();
  return all.find((product) => product.slug === slug);
}
