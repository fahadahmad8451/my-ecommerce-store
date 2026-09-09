# DESKAVYN V3 — Advanced Experience Patch

Apply this AFTER the DESKAVYN V3 Commerce Patch.

## Adds

- Auto/manual featured product slider
- Animated numerical figures / stats strip
- Infinite premium marquee
- Richer category visual figures
- Enhanced desk-transformation geometry
- Interactive finish/material configurator preview
- Customer review slider
- More editorial motion and responsive styling

## Existing systems intentionally retained

- Hero 3D scene
- GSAP ScrollStory
- Shop filters/search
- Product details
- Cart
- Customer account scaffold
- Shopify adapter
- Existing project config

## Apply from VS Code / PowerShell

From your DESKAVYN project root:

```powershell
Expand-Archive -Path "$HOME\Downloads\DESKAVYN-V3-ADVANCED-PATCH.zip" -DestinationPath "$HOME\Downloads\DESKAVYN-ADVANCED" -Force
Copy-Item "$HOME\Downloads\DESKAVYN-ADVANCED\deskavyn-v3-advanced-patch\*" . -Recurse -Force
npm run dev
```

If your ZIP is saved somewhere else, adjust the first path.

No new npm packages are required.
