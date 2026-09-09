# DESKAVYN — Carousel Interaction Patch

Apply this AFTER the Smooth Carousel + Navbar patch.

## New behavior

- Auto rotation never pauses on hover
- Rotation is faster than before
- Mouse position/movement left and right influences carousel direction/speed
- Dragging gives direct manual rotation
- Releasing drag adds a little inertia
- Auto rotation continues afterward

## Apply

```powershell
Expand-Archive -Path "$HOME\Downloads\DESKAVYN-V3-CAROUSEL-INTERACTION-PATCH.zip" -DestinationPath "$HOME\Downloads\DESKAVYN-INTERACTION" -Force
Copy-Item "$HOME\Downloads\DESKAVYN-INTERACTION\deskavyn-v3-carousel-interaction-patch\*" . -Recurse -Force
npm run dev
```
