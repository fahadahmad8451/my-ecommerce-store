# DESKAVYN V3

A premium interactive commerce starter built with:

- Next.js App Router
- TypeScript
- React Three Fiber + Drei
- GSAP + ScrollTrigger
- Mock commerce data with Shopify Storefront API adapter
- Responsive mobile fallback
- Custom cursor and motion system
- Cart drawer

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Shopify setup

1. Copy `.env.example` to `.env.local`
2. Add your Shopify Storefront domain and token
3. Replace mock products gradually using `lib/shopify.ts`

The current UI works without Shopify using local demo products.

## Main folders

- `app/` routes
- `components/` UI and motion
- `lib/` products + Shopify adapter
- `public/` add images, textures and GLB models here

## Upgrade path

- Add real GLB product models in `/public/models`
- Swap geometric hero objects with `<useGLTF />`
- Add Shopify cart mutation / checkout URL
- Add CMS-driven editorial sections
- Add page transitions and custom shaders

## Note

This project is an original DESKAVYN design direction inspired by premium interactive web experiences; it does not copy Ricardo Chance's code or assets.
