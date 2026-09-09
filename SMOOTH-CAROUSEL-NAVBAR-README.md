# DESKAVYN — Smooth Carousel + Navbar Patch

Apply AFTER the Final Premium Patch.

## Important change

The Depth Gallery no longer waits for a timer and then changes cards.

It now rotates continuously and slowly using requestAnimationFrame:
- smooth movement every animation frame
- about one full revolution every ~45 seconds
- hover pauses it
- drag controls it
- arrow buttons rotate one product step
- no 3.6-second snapping/jumping

## Navbar upgrade

- premium spacing
- glass/dark navbar
- becomes compact after scrolling
- cleaner active/hover underline
- premium Shop / Workspace / Approach links
- Search and Account controls
- redesigned Cart control
- fully responsive mobile navigation
- animated hamburger menu

## Apply in VS Code PowerShell

From the DESKAVYN project root:

```powershell
Expand-Archive -Path "$HOME\Downloads\DESKAVYN-V3-SMOOTH-CAROUSEL-NAVBAR-PATCH.zip" -DestinationPath "$HOME\Downloads\DESKAVYN-SMOOTH" -Force
Copy-Item "$HOME\Downloads\DESKAVYN-SMOOTH\deskavyn-v3-smooth-carousel-navbar-patch\*" . -Recurse -Force
npm run dev
```

No new npm packages are needed.
