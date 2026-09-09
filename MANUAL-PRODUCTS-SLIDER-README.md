# DESKAVYN — Manual Products + Compact Slider Patch

Apply AFTER the Carousel Interaction patch.

## Manual product management

Open:

`http://localhost:3000/admin/products`

You can add:
- product name
- slug
- category
- price
- compare/discount price
- stock
- description
- colors
- materials
- image paths / image URLs
- GLB model path
- Featured
- Best seller

Products are saved in:

`data/manual-products.json`

They are merged into the storefront automatically.

You can also delete manual products from the same page.

## Images

Put files in:

`public/images/`

Example:

`public/images/my-stand.jpg`

Then enter:

`/images/my-stand.jpg`

Multiple images:

`/images/one.jpg, /images/two.jpg, /images/three.jpg`

## GLB

Put model in:

`public/models/my-product.glb`

Then enter:

`/models/my-product.glb`

## Slider changes

- smaller overall section
- smaller cards
- tighter carousel radius
- smoother pointer influence
- softer inertia
- auto rotation continues
- supports up to 7 products in carousel

## Apply in PowerShell

```powershell
Expand-Archive -Path "$HOME\Downloads\DESKAVYN-V3-MANUAL-PRODUCTS-SLIDER-PATCH.zip" -DestinationPath "$HOME\Downloads\DESKAVYN-MANUAL" -Force
Copy-Item "$HOME\Downloads\DESKAVYN-MANUAL\deskavyn-v3-manual-products-slider-patch\*" . -Recurse -Force
npm run dev
```

No new npm package is required.

## Note

This file-based admin is intended for your local VS Code development workflow.
For the production Shopify store, Shopify Admin should remain the real product source.
