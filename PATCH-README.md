# DESKAVYN V3 — Commerce Patch

This ZIP contains ONLY changed/new files.

## Apply

1. Close the dev server if it is running.
2. Back up your current project once.
3. Extract this ZIP.
4. Copy the contents of the `deskavyn-v3-patch` folder into the ROOT of your existing DESKAVYN project.
5. Allow Windows to **Replace files in destination**.
6. Run:

```bash
npm install
npm run dev
```

## Added / upgraded

### Homepage
- Featured products
- Best sellers
- Product categories
- Desk transformation section
- Customer reviews
- Newsletter retained
- Full footer / policies / contact links

### Shop
- Search
- Category filters
- Price/name sorting
- Discount display
- Color indicators
- Stock status
- Add to Cart directly from card

### Product details
- Multiple gallery states
- 3D viewer-ready area
- Price + discount
- Color/material selection
- Quantity selector
- Stock availability
- Estimated delivery
- Add to Cart
- Buy Now
- Related products
- Reviews

### Cart
- Quantity + / -
- Remove
- Discount code field
- Demo code: `DESK10`
- Subtotal
- Discount total
- Checkout button ready for Shopify Cart API

### Customer account
- `/account` page scaffold
- Login/register placeholder
- Orders
- Saved addresses
- Wishlist
- Shopify Customer Account API connection points

## Important

The commerce UI is functional with demo/local product data.

For real production:
- Products/variants/inventory should come from Shopify Storefront API.
- Checkout button must create/use a Shopify cart and redirect to Shopify `checkoutUrl`.
- Customer account should connect to Shopify Customer Account API.
- Replace placeholder SVG/gallery/3D geometry with real product images and GLB models.

No unrelated hero, GSAP story, Three.js scene, project config, or existing design files were intentionally changed.
