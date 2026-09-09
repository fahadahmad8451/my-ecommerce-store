# DESKAVYN — Full Store Control CMS Patch

Apply after Professional Admin Pro.

## Admin URLs

- `/admin`
- `/admin/site`
- `/admin/products`

## Navbar order

00 Home → `/`
01 Shop → `/shop`
02 Workspace → `/#story`
03 Approach → `/#principle`

This keeps navigation in a clear step-by-step order and prevents the first link from jumping to the wrong section.

## Advertisement bar

Admin → Site → Advertisement

- enable/disable
- multiple announcements
- text + link
- speed
- background color
- text color

When disabled:
- component is not rendered
- CSS space is `0px`
- no empty gap remains below navbar

When enabled:
- appears directly below navbar

## Footer

Footer is now fully admin-controlled:
- background color
- text color
- multiple columns
- column titles
- links
- newsletter title/input
- social icons/links
- copyright

The structure is inspired by premium multi-column commerce footers, but remains an original DESKAVYN implementation.

## Full content control

Admin now controls:
- brand + navbar
- hero
- marquee
- stats
- statement
- cinematic section
- scroll story
- horizontal story
- featured section headings
- depth gallery headings
- categories
- transformation
- configurator
- best sellers
- reviews
- principle
- newsletter
- shop page
- account page
- advertisement bar
- footer
- theme colors
- carousel sizing/speed
- section visibility

## Future product placement

Use `/admin/products` Placement tab.

A product can independently appear in:
- Shop Page
- Featured Products
- Best Sellers
- 3D Carousel
- Featured Slider
- Horizontal Story

Advertisement bar is intentionally controlled separately because it is promotional content, not automatic product placement.

## Apply in VS Code PowerShell

```powershell
Expand-Archive -Path "$HOME\Downloads\DESKAVYN-V3-FULL-STORE-CONTROL-CMS-PATCH.zip" -DestinationPath "$HOME\Downloads\DESKAVYN-FULL-CMS" -Force
Copy-Item "$HOME\Downloads\DESKAVYN-FULL-CMS\deskavyn-v3-full-store-control-cms-patch\*" . -Recurse -Force
npm run dev
```

No new npm packages required.
