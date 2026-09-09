import type { Product, ProductPlacement } from "@/lib/products";

export type PlacementKey = keyof ProductPlacement;

export const placementMeta: Record<
  PlacementKey,
  { label: string; location: string; description: string }
> = {
  shop: {
    label: "Shop Page",
    location: "/shop",
    description: "Main product listing with search, filters and sorting."
  },
  featuredProducts: {
    label: "Homepage · Featured Products",
    location: "Home → Selected for the desk",
    description: "Editorial product grid on the homepage."
  },
  bestsellers: {
    label: "Homepage · Best Sellers",
    location: "Home → Best Sellers",
    description: "Best-selling products section near the lower homepage."
  },
  depthGallery: {
    label: "Homepage · 3D Carousel",
    location: "Home → Objects in motion",
    description: "Continuous rotating depth carousel."
  },
  featuredSlider: {
    label: "Homepage · Featured Slider",
    location: "Home → Featured Object slider",
    description: "Large premium hero-style product slider."
  },
  horizontalStory: {
    label: "Homepage · Horizontal Story",
    location: "Home → Horizontal product story",
    description: "Pinned horizontal scroll product storytelling section."
  }
};

export function isActiveProduct(product: Product) {
  return (product.status ?? "active") === "active";
}

export function appearsIn(product: Product, placement: PlacementKey) {
  if (!isActiveProduct(product)) return false;

  if (product.placements && typeof product.placements[placement] === "boolean") {
    return Boolean(product.placements[placement]);
  }

  // Backward-compatible rules for older products.
  if (placement === "shop") return true;
  if (placement === "featuredProducts") return Boolean(product.featured);
  if (placement === "bestsellers") return Boolean(product.bestseller);
  if (placement === "depthGallery") return true;
  if (placement === "featuredSlider") return Boolean(product.featured);
  if (placement === "horizontalStory") return true;

  return false;
}

export function productsForPlacement(products: Product[], placement: PlacementKey) {
  return products
    .filter((product) => appearsIn(product, placement))
    .sort((a, b) => (a.sortOrder ?? 9999) - (b.sortOrder ?? 9999));
}
