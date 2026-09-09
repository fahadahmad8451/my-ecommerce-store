# DESKAVYN V3 — Final Premium Patch

Apply this after the Cinematic Patch.

## What changed

### Depth gallery
- Automatically advances every 3.6 seconds
- Pauses while hovered
- Arrow navigation still works
- Drag/swipe navigation
- Progress indicator
- Real product images supported

### Real product photography
- Product cards use `product.images[0]`
- Horizontal storytelling uses product images
- Product detail gallery supports multiple images
- Shopify image URLs work without Next Image configuration because plain `<img>` is used

### GLB-ready 3D products
- Product detail page now has a real React Three Fiber viewer
- Supports OrbitControls, lighting, shadows and mouse interaction
- If `product.model` is missing, a procedural 3D fallback appears
- Add models to `public/models/` and set for example:
  `model: "/models/axis-laptop-stand.glb"`

### Shopify live data
- Homepage and Shop attempt to load Shopify Storefront API products
- If Shopify env credentials are absent or a request fails, local demo products are used automatically
- Shopify images, prices, inventory, options and first variant ID are normalized

### GLSL shader route transition
- A real Three.js ShaderMaterial is used between route changes
- Includes wave distortion, grain and blue/dark reveal

## Shopify environment

Create `.env.local`:

```env
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=your_storefront_access_token
```

Restart the dev server after changing environment variables.

## Add a real GLB model

Example:

```text
public/models/axis-laptop-stand.glb
```

Then in `lib/products.ts`:

```ts
model: "/models/axis-laptop-stand.glb"
```

For Shopify-driven products, you can later store model URLs in metafields and add them to the Storefront query.

## Apply from VS Code PowerShell

```powershell
Expand-Archive -Path "$HOME\Downloads\DESKAVYN-V3-FINAL-PREMIUM-PATCH.zip" -DestinationPath "$HOME\Downloads\DESKAVYN-FINAL" -Force
Copy-Item "$HOME\Downloads\DESKAVYN-FINAL\deskavyn-v3-final-premium-patch\*" . -Recurse -Force
npm run dev
```

No new npm package is required.
