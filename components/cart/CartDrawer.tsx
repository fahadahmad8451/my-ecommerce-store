"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";

export function CartDrawer() {
  const {
    items,
    subtotal,
    discountCode,
    total,
    open,
    setOpen,
    removeItem,
    updateQuantity,
    applyDiscount,
    checkout
  } = useCart();

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  function handleDiscount() {
    const ok = applyDiscount(code);
    setMessage(ok ? "Code will be validated by Shopify at checkout." : "Enter a discount code.");
  }

  async function startCheckout() {
    setMessage("Opening secure Shopify checkout...");
    const result = await checkout();
    if (result.checkoutUrl) { window.location.assign(result.checkoutUrl); return; }
    setMessage(result.error || "Checkout could not be started.");
  }

  return (
    <>
      <div className={`cart-backdrop ${open ? "open" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`cart-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="cart-head">
          <strong>Your cart</strong>
          <button className="icon-btn" onClick={() => setOpen(false)} aria-label="Close cart">×</button>
        </div>

        <div className="cart-items">
          {items.length === 0 && <p className="cart-muted">Your desk is still empty.</p>}
          {items.map((item) => (
            <div className="cart-item" key={`${item.id}-${item.selectedColor || "default"}`}>
              <div className="cart-thumb" />
              <div>
                <strong>{item.name}</strong>
                {item.selectedColor && <div className="cart-muted">{item.selectedColor}</div>}
                <div className="qty-controls">
                  <button onClick={() => updateQuantity(item.lineKey, item.quantity - 1)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.lineKey, item.quantity + 1)}>+</button>
                </div>
              </div>
              <button className="icon-btn" onClick={() => removeItem(item.lineKey)} aria-label={`Remove ${item.name}`}>×</button>
            </div>
          ))}
        </div>

        <div className="cart-foot">
          <div className="discount-row">
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Discount code"
              aria-label="Discount code"
            />
            <button onClick={handleDiscount}>Apply</button>
          </div>
          {message && <p className="cart-muted">{message}</p>}

          <div className="cart-summary-line"><span>Subtotal</span><strong>${subtotal.toFixed(2)}</strong></div>
          {discountCode && <div className="cart-summary-line"><span>Discount code</span><strong>{discountCode}</strong></div>}
          <div className="cart-summary-line cart-total"><span>Total</span><strong>${total.toFixed(2)}</strong></div>

          <button className="add-btn" disabled={items.length === 0} onClick={startCheckout}>
            Secure Shopify checkout
          </button>
          <p className="cart-muted">
            Shipping, taxes, payment and final discounts are securely calculated by Shopify.
          </p>
        </div>
      </aside>
    </>
  );
}
