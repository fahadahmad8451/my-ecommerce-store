export type ProductPlacement = {
  shop?: boolean;
  featuredProducts?: boolean;
  bestsellers?: boolean;
  depthGallery?: boolean;
  featuredSlider?: boolean;
  horizontalStory?: boolean;
};

export type ProductStatus = "draft" | "active" | "archived";

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  price: number;
  compareAtPrice?: number;
  stock?: number;
  sku?: string;
  image?: string;
  selectedOptions: Array<{ name: string; value: string }>;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  materials: string[];
  colors: string[];
  stock: number;
  bestseller?: boolean;
  featured?: boolean;
  images: string[];
  rating: number;
  reviewCount: number;
  model?: string;
  shopifyVariantId?: string;
  variants?: ProductVariant[];

  // Professional CMS fields
  status?: ProductStatus;
  placements?: ProductPlacement;
  sortOrder?: number;
  badge?: string;
  sku?: string;
  seoTitle?: string;
  seoDescription?: string;
};

export const products: Product[] = [
  {
    id: "p1",
    slug: "axis-laptop-stand",
    name: "Axis Laptop Stand",
    category: "Elevation",
    price: 149,
    compareAtPrice: 179,
    description: "A sculptural aluminum stand engineered to lift your screen, clear your desk and improve visual focus.",
    materials: ["Anodized aluminum", "Silicone grip"],
    colors: ["Graphite", "Silver", "Midnight Blue"],
    stock: 18,
    bestseller: true,
    featured: true,
    images: ["/images/product-placeholder-1.svg", "/images/product-placeholder-2.svg", "/images/product-placeholder-3.svg"],
    rating: 4.9,
    reviewCount: 128,
    status: "active",
    placements: {
      shop: true,
      featuredProducts: true,
      bestsellers: true,
      depthGallery: true,
      featuredSlider: true,
      horizontalStory: true
    },
    sortOrder: 10,
    badge: "Featured"
  },
  {
    id: "p2",
    slug: "monolith-desk-tray",
    name: "Monolith Desk Tray",
    category: "Organization",
    price: 89,
    description: "A low-profile organizer for the small tools that usually become visual noise.",
    materials: ["Powder-coated steel", "Microfiber base"],
    colors: ["Graphite", "Stone"],
    stock: 32,
    featured: true,
    images: ["/images/product-placeholder-2.svg", "/images/product-placeholder-1.svg", "/images/product-placeholder-3.svg"],
    rating: 4.8,
    reviewCount: 86,
    status: "active",
    placements: {
      shop: true,
      featuredProducts: true,
      bestsellers: false,
      depthGallery: true,
      featuredSlider: true,
      horizontalStory: true
    },
    sortOrder: 20
  },
  {
    id: "p3",
    slug: "arc-monitor-riser",
    name: "Arc Monitor Riser",
    category: "Elevation",
    price: 219,
    compareAtPrice: 249,
    description: "A wide architectural platform designed to create vertical order beneath your monitor.",
    materials: ["Aluminum", "Oak veneer"],
    colors: ["Black Oak", "Natural Oak"],
    stock: 9,
    bestseller: true,
    images: ["/images/product-placeholder-3.svg", "/images/product-placeholder-1.svg", "/images/product-placeholder-2.svg"],
    rating: 4.9,
    reviewCount: 74,
    status: "active",
    placements: {
      shop: true,
      featuredProducts: false,
      bestsellers: true,
      depthGallery: true,
      featuredSlider: true,
      horizontalStory: true
    },
    sortOrder: 30
  },
  {
    id: "p4",
    slug: "halo-desk-light",
    name: "Halo Desk Light",
    category: "Lighting",
    price: 179,
    description: "An ambient task light with a soft directional beam for late focus sessions.",
    materials: ["Aluminum", "Optical diffuser"],
    colors: ["Graphite", "Soft White"],
    stock: 15,
    bestseller: true,
    featured: true,
    images: ["/images/product-placeholder-1.svg", "/images/product-placeholder-3.svg", "/images/product-placeholder-2.svg"],
    rating: 4.7,
    reviewCount: 61,
    status: "active",
    placements: {
      shop: true,
      featuredProducts: true,
      bestsellers: true,
      depthGallery: true,
      featuredSlider: true,
      horizontalStory: true
    },
    sortOrder: 40
  },
  {
    id: "p5",
    slug: "plane-desk-mat",
    name: "Plane Desk Mat",
    category: "Surface",
    price: 69,
    description: "A precise work surface that visually anchors your keyboard, mouse and writing tools.",
    materials: ["Vegan leather", "Natural rubber"],
    colors: ["Charcoal", "Slate", "Sand"],
    stock: 44,
    images: ["/images/product-placeholder-2.svg", "/images/product-placeholder-3.svg", "/images/product-placeholder-1.svg"],
    rating: 4.8,
    reviewCount: 142,
    status: "active",
    placements: {
      shop: true,
      featuredProducts: false,
      bestsellers: false,
      depthGallery: true,
      featuredSlider: false,
      horizontalStory: true
    },
    sortOrder: 50
  },
  {
    id: "p6",
    slug: "dock-cable-core",
    name: "Dock Cable Core",
    category: "Power",
    price: 129,
    description: "A compact desktop power and cable hub designed to keep the wiring out of sight.",
    materials: ["CNC aluminum", "Soft-touch polymer"],
    colors: ["Graphite"],
    stock: 0,
    images: ["/images/product-placeholder-3.svg", "/images/product-placeholder-2.svg", "/images/product-placeholder-1.svg"],
    rating: 4.6,
    reviewCount: 49,
    status: "active",
    placements: {
      shop: true,
      featuredProducts: false,
      bestsellers: false,
      depthGallery: true,
      featuredSlider: false,
      horizontalStory: false
    },
    sortOrder: 60
  }
];

export const categories = Array.from(new Set(products.map((p) => p.category)));
