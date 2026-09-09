import { NextResponse } from "next/server";
import {
  addManualProduct,
  deleteManualProduct,
  getManualProducts,
  getTrashedManualProducts,
  restoreManualProduct,
  updateManualProduct
} from "@/lib/manual-products";
import type { Product, ProductPlacement, ProductStatus } from "@/lib/products";
import { writeAuditEntry } from "@/lib/audit-log";

export const dynamic = "force-dynamic";

function arrayFrom(value: unknown, fallback: string[]) {
  if (Array.isArray(value)) return value.map(String).map(v => v.trim()).filter(Boolean);
  const parsed = String(value || "")
    .split(",")
    .map(v => v.trim())
    .filter(Boolean);
  return parsed.length ? parsed : fallback;
}

export async function GET(request: Request) {
  return NextResponse.json(new URL(request.url).searchParams.get("trash") === "1" ? await getTrashedManualProducts() : await getManualProducts());
}

export async function POST(request: Request) {
  const body = await request.json();

  const name = String(body.name || "").trim();
  const slug = String(body.slug || "").trim();
  const category = String(body.category || "Essentials").trim();
  const description = String(body.description || "").trim();
  const price = Number(body.price || 0);
  const compareAtPrice = body.compareAtPrice ? Number(body.compareAtPrice) : undefined;
  const stock = Math.max(0, Number(body.stock || 0));

  if (!name || !slug || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json(
      { error: "Name, slug and valid price are required." },
      { status: 400 }
    );
  }

  const status = (["draft", "active", "archived"].includes(String(body.status))
    ? body.status
    : "active") as ProductStatus;

  const placements: ProductPlacement = {
    shop: body.placements?.shop !== false,
    featuredProducts: Boolean(body.placements?.featuredProducts),
    bestsellers: Boolean(body.placements?.bestsellers),
    depthGallery: Boolean(body.placements?.depthGallery),
    featuredSlider: Boolean(body.placements?.featuredSlider),
    horizontalStory: Boolean(body.placements?.horizontalStory)
  };

  const product: Product = {
    id: `manual-${Date.now()}`,
    slug,
    name,
    category,
    price,
    compareAtPrice:
      compareAtPrice && compareAtPrice > price ? compareAtPrice : undefined,
    description: description || "A DESKAVYN workspace object.",
    materials: arrayFrom(body.materials, ["Premium material"]),
    colors: arrayFrom(body.colors, ["Graphite"]),
    stock,
    featured: Boolean(placements.featuredProducts),
    bestseller: Boolean(placements.bestsellers),
    images: arrayFrom(body.images, ["/images/product-placeholder-1.svg"]),
    rating: Number(body.rating || 4.9),
    reviewCount: Number(body.reviewCount || 0),
    model: String(body.model || "").trim() || undefined,
    status,
    placements,
    sortOrder: Number(body.sortOrder || 100),
    badge: String(body.badge || "").trim() || undefined,
    sku: String(body.sku || "").trim() || undefined,
    seoTitle: String(body.seoTitle || "").trim() || undefined,
    seoDescription: String(body.seoDescription || "").trim() || undefined
  };

  await addManualProduct(product);
  await writeAuditEntry({ action: "product.created", target: product.id, detail: product.name });
  return NextResponse.json(product, { status: 201 });
}

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Product id required." }, { status: 400 });
  }

  const deleted = await deleteManualProduct(id);
  if (deleted) await writeAuditEntry({ action: "product.deleted", target: id });
  return NextResponse.json({ deleted });
}

export async function PUT(request: Request) {
  const body = await request.json();
  const id = String(body.id || "");
  const name = String(body.name || "").trim();
  const slug = String(body.slug || "").trim();
  const price = Number(body.price || 0);
  if (!id || !name || !slug || !Number.isFinite(price) || price <= 0) return NextResponse.json({ error: "Product id, name, slug and valid price are required." }, { status: 400 });
  const current = (await getManualProducts()).find(product => product.id === id);
  if (!current) return NextResponse.json({ error: "Product not found." }, { status: 404 });
  const product: Product = { ...current, ...body, id, name, slug, price, stock: Math.max(0, Number(body.stock ?? current.stock)), images: arrayFrom(body.images, current.images), materials: arrayFrom(body.materials, current.materials), colors: arrayFrom(body.colors, current.colors), placements: { ...current.placements, ...body.placements }, status: (["draft", "active", "archived"].includes(String(body.status)) ? body.status : current.status) as ProductStatus };
  const updated = await updateManualProduct(id, product);
  await writeAuditEntry({ action: "product.updated", target: id, detail: `${product.name} · ${product.price}` });
  return NextResponse.json(updated);
}

export async function PATCH(request: Request) { const { id } = await request.json() as { id?: string }; if (!id) return NextResponse.json({ error: "Product id required." }, { status: 400 }); const product = await restoreManualProduct(id); if (!product) return NextResponse.json({ error: "Product could not be restored." }, { status: 404 }); await writeAuditEntry({ action: "product.restored", target: product.id, detail: product.name }); return NextResponse.json(product); }
