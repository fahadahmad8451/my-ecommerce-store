"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { useCart } from "@/components/cart/CartProvider";
import { products as localProducts } from "@/lib/products";
import { ProductShowcase } from "@/components/products/ProductShowcase";
import { ProductModelViewer } from "@/components/three/ProductModelViewer";
import { useWishlist } from "@/components/wishlist/WishlistProvider";

export function ProductDetail({ product }: { product: Product }) {
  const { addItem, buyNow } = useCart();
  const { has, toggle } = useWishlist();
  const initialSelections = Object.fromEntries((product.variants?.[0]?.selectedOptions || []).map(option => [option.name, option.value]));
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(initialSelections);
  const [quantity, setQuantity] = useState(1);
  const [activeMedia, setActiveMedia] = useState<"3d" | number>("3d");

  const related = useMemo(
    () => localProducts.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 2),
    [product.id, product.category]
  );

  const variantOptionGroups = useMemo(() => {
    const groups = new Map<string, string[]>();
    product.variants?.forEach(variant => variant.selectedOptions.forEach(option => {
      const values = groups.get(option.name) || [];
      if (!values.includes(option.value)) values.push(option.value);
      groups.set(option.name, values);
    }));
    return Array.from(groups, ([name, values]) => ({ name, values }));
  }, [product.variants]);

  const selectedVariant = product.variants?.find(variant => variant.selectedOptions.every(option => selectedOptions[option.name] === option.value));
  const activeProduct = selectedVariant ? { ...product, shopifyVariantId: selectedVariant.id, price: selectedVariant.price, compareAtPrice: selectedVariant.compareAtPrice, stock: selectedVariant.stock ?? (selectedVariant.availableForSale ? product.stock : 0), sku: selectedVariant.sku || product.sku, images: selectedVariant.image ? [selectedVariant.image, ...product.images.filter(image => image !== selectedVariant.image)] : product.images } : product;

  const discount =
    activeProduct.compareAtPrice && activeProduct.compareAtPrice > activeProduct.price
      ? Math.round((1 - activeProduct.price / activeProduct.compareAtPrice) * 100)
      : 0;

  async function handleBuyNow() {
    const result = await buyNow(activeProduct, quantity);
    if (result.checkoutUrl) { window.location.assign(result.checkoutUrl); return; }
    window.alert(result.error || "Checkout could not be started.");
  }

  return (
    <>
      <section className="product-detail">
        <div className="product-detail-visual">
          <div className="pdp-gallery premium-pdp-gallery">
            <div className="gallery-main premium-gallery-main">
              {activeMedia === "3d" ? (
                <ProductModelViewer model={product.model} />
              ) : (
                <img
                  src={product.images[activeMedia] || product.images[0]}
                  alt={product.name}
                  className="pdp-real-photo"
                />
              )}
            </div>

            <div className="gallery-thumbs premium-thumbs">
              <button
                className={activeMedia === "3d" ? "active" : ""}
                onClick={() => setActiveMedia("3d")}
              >
                3D
              </button>

              {product.images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  className={activeMedia === index ? "active image-thumb" : "image-thumb"}
                  onClick={() => setActiveMedia(index)}
                  aria-label={`View image ${index + 1}`}
                >
                  <img src={image} alt="" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="product-detail-copy">
          <span className="eyebrow">{product.category}</span>
          <h1>{product.name}</h1>

          <div className="detail-price-row">
            <div className="detail-price">${activeProduct.price}</div>
            {activeProduct.compareAtPrice && <div className="detail-compare">${activeProduct.compareAtPrice}</div>}
            {discount > 0 && <div className="sale-badge inline">Save {discount}%</div>}
          </div>

          <div className="stock-status">
            <span className={activeProduct.stock > 0 ? "stock-dot in" : "stock-dot out"} />
            {activeProduct.stock > 0 ? `${activeProduct.stock} units available` : "Currently sold out"}
          </div>

          <p className="lede">{product.description}</p>

          {variantOptionGroups.length ? variantOptionGroups.map(group => <div key={group.name}><div className="pdp-option-label">{group.name}</div><div className="option-row">{group.values.map(value => <button className={`option-chip ${selectedOptions[group.name] === value ? "active" : ""}`} key={value} onClick={() => setSelectedOptions(current => ({ ...current, [group.name]: value }))}>{value}</button>)}</div></div>) : <><div className="pdp-option-label">Color / Material finish</div><div className="option-row">{product.colors.map((color) => <button className={`option-chip ${selectedOptions.Color === color ? "active" : ""}`} key={color} onClick={() => setSelectedOptions({ Color: color })}>{color}</button>)}</div></>}

          <div className="quantity-row">
            <span>Quantity</span>
            <div className="qty-controls large">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(activeProduct.stock || 1, q + 1))}>+</button>
            </div>
          </div>

          <button
            className="add-btn"
            disabled={activeProduct.stock <= 0 || (variantOptionGroups.length > 0 && !selectedVariant)}
            onClick={() => addItem(activeProduct, quantity, selectedOptions.Color)}
          >
            {activeProduct.stock > 0 ? `Add to Cart — $${(activeProduct.price * quantity).toFixed(2)}` : "Sold out"}
          </button>

          <button
            className="buy-now-btn"
            disabled={activeProduct.stock <= 0 || (variantOptionGroups.length > 0 && !selectedVariant)}
            onClick={handleBuyNow}
          >
            Buy Now
          </button>
          <button className={`wishlist-button detail ${has(product.id) ? "saved" : ""}`} type="button" onClick={() => toggle(product)} aria-pressed={has(product.id)}>{has(product.id) ? "Saved to wishlist" : "Save to wishlist"}</button>

          <div className="delivery-box">
            <strong>Estimated delivery</strong>
            <span>3–7 business days after Shopify shipping calculation</span>
          </div>

          <div className="detail-list">
            <div><span>Materials</span><span>{product.materials.join(" / ")}</span></div>
            <div><span>Rating</span><span>{product.rating} / 5 · {product.reviewCount} reviews</span></div>
            <div><span>3D</span><span>{product.model ? "Real GLB model" : "Fallback until GLB is added"}</span></div>
            <div><span>Shipping</span><span>Calculated at checkout</span></div>
            <div><span>Returns</span><span>30 days</span></div>
          </div>
        </div>
      </section>

      <section className="reviews-section section-pad">
        <span className="eyebrow">CUSTOMER REVIEWS</span>
        <h2 className="display-lg">{product.rating}/5 from {product.reviewCount} customers.</h2>
        <div className="review-grid">
          <article><strong>“Built like a real product.”</strong><p>The finish feels premium and the desk looks much cleaner.</p></article>
          <article><strong>“Exactly the right amount of minimal.”</strong><p>Useful without making the setup feel crowded.</p></article>
          <article><strong>“The workspace finally feels intentional.”</strong><p>Simple design, strong materials and a refined look.</p></article>
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-pad">
          <span className="eyebrow">RELATED PRODUCTS</span>
          <h2 className="display-lg">Complete the system.</h2>
          <ProductShowcase products={related} />
        </section>
      )}
    </>
  );
}
