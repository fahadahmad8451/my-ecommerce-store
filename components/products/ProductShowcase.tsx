import type { Product } from "@/lib/products";
import { ProductCard } from "@/components/products/ProductCard";

export function ProductShowcase({ products }: { products: Product[] }) {
  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
