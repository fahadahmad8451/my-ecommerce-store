# DESKAVYN V3 — Cinematic Experience Patch

Apply this AFTER:
1. DESKAVYN V3 base
2. Commerce Patch
3. Advanced Patch

## Adds

- Full-screen animated preloader
- Cinematic GSAP typography sequence
- Horizontal pinned product storytelling
- 3D-style depth product gallery
- More advanced product figures / geometry
- Refined header interactions
- Magnetic-ready interaction component
- Extra perspective, grids, orbits and motion layers

## No new npm packages required

Uses the GSAP, React and Next.js packages already in the project.

## PowerShell apply command

From your DESKAVYN project root:

```powershell
Expand-Archive -Path "$HOME\Downloads\DESKAVYN-V3-CINEMATIC-PATCH.zip" -DestinationPath "$HOME\Downloads\DESKAVYN-CINEMATIC" -Force
Copy-Item "$HOME\Downloads\DESKAVYN-CINEMATIC\deskavyn-v3-cinematic-patch\*" . -Recurse -Force
npm run dev
```

## Important production notes

The patch uses original geometric product representations. For the final premium version:
- replace them with real optimized GLB models
- connect Shopify product media / variants
- use real checkoutUrl from Shopify Cart API
- use real product photography
- add real GLSL shader transitions only after performance testing
