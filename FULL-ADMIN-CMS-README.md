# DESKAVYN — Full Website Admin CMS Patch

## New admin URLs

Main control center:
`http://localhost:3000/admin`

Website settings:
`http://localhost:3000/admin/site`

Products:
`http://localhost:3000/admin/products`

## Website settings you can control

- Brand name/tagline
- Navbar labels
- Hero text/buttons
- Homepage headings/descriptions
- Newsletter/footer
- Theme colors
- Stats / figures
- 3D carousel speed
- Carousel radius
- Carousel card size
- Number of carousel products
- Show/hide homepage sections

Saved to:
`data/site-config.json`

Products remain saved to:
`data/manual-products.json`

## Important

This is a local file-based CMS for VS Code development.

For production deployment, use Shopify or a real database/CMS because local JSON writes may not persist on serverless hosting.

Complex changes such as:
- creating a brand-new section
- changing GSAP animation logic
- changing Three.js scene geometry
- new GLSL shader behavior

still require code changes.

## Apply

```powershell
Expand-Archive -Path "$HOME\Downloads\DESKAVYN-V3-FULL-ADMIN-CMS-PATCH.zip" -DestinationPath "$HOME\Downloads\DESKAVYN-CMS" -Force
Copy-Item "$HOME\Downloads\DESKAVYN-CMS\deskavyn-v3-full-admin-cms-patch\*" . -Recurse -Force
npm run dev
```
