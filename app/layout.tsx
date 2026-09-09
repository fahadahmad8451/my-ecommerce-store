import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { Preloader } from "@/components/ui/Preloader";
import { RouteShaderTransition } from "@/components/three/RouteShaderTransition";
import { WishlistProvider } from "@/components/wishlist/WishlistProvider";
import { getSiteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "DESKAVYN — Workspace, Reconsidered",
  description: "Premium desk essentials and interactive workspace objects."
};

export default async function RootLayout({children}:{children:React.ReactNode}) {
  const config=await getSiteConfig();
  const announcementSpace=config.announcement.enabled&&config.announcement.items.length ? "42px" : "0px";

  return (
    <html lang="en">
      <body style={{
        ["--bg" as any]:config.theme.background,
        ["--panel" as any]:config.theme.panel,
        ["--text" as any]:config.theme.text,
        ["--muted" as any]:config.theme.muted,
        ["--blue" as any]:config.theme.accent,
        ["--blue-soft" as any]:config.theme.accentSoft,
        ["--announcement-space" as any]:announcementSpace
      }}>
        <WishlistProvider><CartProvider>
          <Preloader/>
          <RouteShaderTransition/>
          <CustomCursor/>
          <SiteHeader config={config}/>
          <AnnouncementBar config={config}/>
          <CartDrawer/>
          <div className="page-shell">{children}</div>
        </CartProvider></WishlistProvider>
      </body>
    </html>
  );
}
