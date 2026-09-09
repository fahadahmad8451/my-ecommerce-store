import { ProductAdmin } from "@/components/admin/ProductAdmin";

export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  return (
    <main className="page-top section-pad admin-products-page">
      <span className="eyebrow">DESKAVYN ADMIN</span>
      <h1 className="display-xl">Product control.</h1>
      <p className="lede page-intro">
        Add products directly from this local admin screen. The data is saved to
        <code> data/manual-products.json</code> inside your VS Code project.
      </p>

      <ProductAdmin />
    </main>
  );
}
