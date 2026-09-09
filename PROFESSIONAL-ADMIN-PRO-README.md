# DESKAVYN — Professional Admin Pro Patch

Apply after Full Admin CMS patch.

## 1. Carousel blur fixed

The depth carousel no longer uses CSS blur on side cards.
Depth is now communicated through:
- scale
- opacity
- perspective
- z-order

Product images stay sharp.

## 2. Product placement system

Each product can independently appear in:

- Shop Page
- Homepage Featured Products
- Homepage Best Sellers
- Homepage 3D Carousel
- Homepage Featured Slider
- Homepage Horizontal Story

Admin shows exactly where the product will appear.

## 3. Future product controls

Every manual product now supports:

- Draft / Active / Archived
- SKU
- Sort order
- Badge
- Category
- Price
- Compare price
- Stock
- Description
- Colors
- Materials
- Multiple images
- GLB model
- SEO title
- SEO description
- Per-section placement

### Default future rule

A new product is placed in Shop by default.
All premium homepage placements are opt-in.

This prevents a future product from unexpectedly appearing everywhere.

## 4. Website Map

Open:

`http://localhost:3000/admin/site`

Then choose:

`Website Map`

It explains where each admin setting changes the storefront.

## 5. Product admin

Open:

`http://localhost:3000/admin/products`

Tabs:
- Basic
- Placement
- Media
- SEO

## 6. Publishing behavior

Draft:
- saved in admin
- not visible to customers

Active:
- visible only in selected placements

Archived:
- retained in data
- hidden from storefront

## 7. Product ordering

Use Sort Order:
- 10 appears before 20
- 20 before 30
- etc.

This makes future product ordering manageable without code.

## 8. Important production architecture

This local JSON CMS is excellent for VS Code development.

When moving to production:
- Shopify Admin should become the source for products, variants, stock, orders and customers
- a real CMS/database should store custom homepage content if you need server-side persistent editing
- payment and checkout stay with Shopify
- admin authentication must be added before exposing a custom admin panel online

## Apply in VS Code PowerShell

```powershell
Expand-Archive -Path "$HOME\Downloads\DESKAVYN-V3-PROFESSIONAL-ADMIN-PRO-PATCH.zip" -DestinationPath "$HOME\Downloads\DESKAVYN-PRO" -Force
Copy-Item "$HOME\Downloads\DESKAVYN-PRO\deskavyn-v3-professional-admin-pro-patch\*" . -Recurse -Force
npm run dev
```

No new npm packages are required.
