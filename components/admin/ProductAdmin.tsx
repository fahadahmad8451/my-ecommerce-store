"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Product, ProductPlacement, ProductStatus } from "@/lib/products";
import { placementMeta, type PlacementKey } from "@/lib/product-placement";
import { ModelUploader } from "@/components/admin/ModelUploader";

type FormState = {
  name: string;
  slug: string;
  category: string;
  price: string;
  compareAtPrice: string;
  stock: string;
  description: string;
  colors: string;
  materials: string;
  images: string;
  model: string;
  status: ProductStatus;
  placements: Required<ProductPlacement>;
  sortOrder: string;
  badge: string;
  sku: string;
  seoTitle: string;
  seoDescription: string;
};

const defaultPlacements: Required<ProductPlacement> = {
  shop: true,
  featuredProducts: false,
  bestsellers: false,
  depthGallery: false,
  featuredSlider: false,
  horizontalStory: false
};

const initialForm: FormState = {
  name: "",
  slug: "",
  category: "Essentials",
  price: "",
  compareAtPrice: "",
  stock: "10",
  description: "",
  colors: "Graphite",
  materials: "Aluminum",
  images: "/images/product-placeholder-1.svg",
  model: "",
  status: "active",
  placements: defaultPlacements,
  sortOrder: "100",
  badge: "",
  sku: "",
  seoTitle: "",
  seoDescription: ""
};

export function ProductAdmin() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"basic" | "placement" | "media" | "seo">("basic");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ProductStatus>("all");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadError, setLoadError] = useState("");

  async function loadProducts() {
    setLoadingProducts(true);
    setLoadError("");
    try {
      const response = await fetch("/api/manual-products", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Products could not be loaded.");
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      setLoadError(error instanceof Error ? error.message : "Products could not be loaded.");
    } finally {
      setLoadingProducts(false);
    }
  }

  useEffect(() => { loadProducts(); }, []);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm(current => ({ ...current, [key]: value }));
  }

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function togglePlacement(key: PlacementKey, value: boolean) {
    setForm(current => ({
      ...current,
      placements: { ...current.placements, [key]: value }
    }));
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const response = await fetch("/api/manual-products", {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editingId ? { ...form, id: editingId } : form)
    });

    const data = await response.json();

    if (!response.ok) {
      setMessage(data.error || "Product could not be saved.");
      setSaving(false);
      return;
    }

    setMessage(editingId ? "Product updated." : "Product saved. Its selected website placements are now active.");
    setForm(initialForm);
    setEditingId(null);
    await loadProducts();
    setSaving(false);
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this manual product?")) return;
    await fetch(`/api/manual-products?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    await loadProducts();
  }

  function edit(product: Product) {
    setEditingId(product.id);
    setForm({ name: product.name, slug: product.slug, category: product.category, price: String(product.price), compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "", stock: String(product.stock), description: product.description, colors: product.colors.join(", "), materials: product.materials.join(", "), images: product.images.join(", "), model: product.model || "", status: product.status || "active", placements: { ...defaultPlacements, ...product.placements }, sortOrder: String(product.sortOrder || 100), badge: product.badge || "", sku: product.sku || "", seoTitle: product.seoTitle || "", seoDescription: product.seoDescription || "" });
    setTab("basic");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const previewImage = useMemo(
    () => form.images.split(",").map(v => v.trim()).filter(Boolean)[0],
    [form.images]
  );

  const selectedLocations = (Object.keys(form.placements) as PlacementKey[])
    .filter(key => form.placements[key])
    .map(key => placementMeta[key]);
  const visibleProducts = products.filter(product => (statusFilter === "all" || product.status === statusFilter) && `${product.name} ${product.category} ${product.sku || ""}`.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="product-admin-pro-grid">
      <form className="product-admin-form product-admin-pro" onSubmit={submit}>
        <div className="admin-form-head">
          <div>
            <span className="eyebrow">PRODUCT CMS</span>
            <h2>{editingId ? "Edit product." : "Create / publish product."}</h2>
          </div>
          <span className="admin-local-badge">LOCAL CMS</span>
        </div>

        <div className="product-editor-tabs">
          {(["basic","placement","media","seo"] as const).map(item => (
            <button type="button" key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>
              {item}
            </button>
          ))}
        </div>

        {tab === "basic" && (
          <div className="editor-panel">
            <div className="admin-fields two">
              <label>
                Product name
                <input
                  value={form.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setField("name", name);
                    if (!form.slug || form.slug === autoSlug(form.name)) setField("slug", autoSlug(name));
                  }}
                  required
                />
              </label>
              <label>Slug<input value={form.slug} onChange={(e)=>setField("slug",e.target.value)} required/></label>
            </div>

            <div className="admin-fields three">
              <label>Category<input value={form.category} onChange={(e)=>setField("category",e.target.value)}/></label>
              <label>Price ($)<input type="number" min="0" step="0.01" value={form.price} onChange={(e)=>setField("price",e.target.value)} required/></label>
              <label>Compare price<input type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={(e)=>setField("compareAtPrice",e.target.value)}/></label>
            </div>

            <div className="admin-fields three">
              <label>Stock<input type="number" min="0" value={form.stock} onChange={(e)=>setField("stock",e.target.value)}/></label>
              <label>SKU<input value={form.sku} onChange={(e)=>setField("sku",e.target.value)} placeholder="DSK-001"/></label>
              <label>
                Status
                <select value={form.status} onChange={(e)=>setField("status",e.target.value as ProductStatus)}>
                  <option value="draft">Draft</option>
                  <option value="active">Active / Published</option>
                  <option value="archived">Archived</option>
                </select>
              </label>
            </div>

            <label>Description<textarea rows={5} value={form.description} onChange={(e)=>setField("description",e.target.value)}/></label>

            <div className="admin-fields two">
              <label>Colors<input value={form.colors} onChange={(e)=>setField("colors",e.target.value)}/><small>Comma separated</small></label>
              <label>Materials<input value={form.materials} onChange={(e)=>setField("materials",e.target.value)}/><small>Comma separated</small></label>
            </div>

            <div className="admin-fields two">
              <label>Sort order<input type="number" value={form.sortOrder} onChange={(e)=>setField("sortOrder",e.target.value)}/><small>Lower number appears earlier.</small></label>
              <label>Badge<input value={form.badge} onChange={(e)=>setField("badge",e.target.value)} placeholder="New / Featured / Limited"/></label>
            </div>
          </div>
        )}

        {tab === "placement" && (
          <div className="editor-panel">
            <div className="placement-intro">
              <span className="eyebrow">WHERE WILL THIS PRODUCT APPEAR?</span>
              <h3>Select every storefront location.</h3>
              <p>New products can stay only in Shop, or appear in any premium homepage experience.</p>
            </div>

            <div className="placement-grid">
              {(Object.keys(placementMeta) as PlacementKey[]).map(key => {
                const meta = placementMeta[key];
                return (
                  <label className={`placement-card ${form.placements[key] ? "active" : ""}`} key={key}>
                    <input
                      type="checkbox"
                      checked={form.placements[key]}
                      onChange={(e)=>togglePlacement(key,e.target.checked)}
                    />
                    <div>
                      <strong>{meta.label}</strong>
                      <span>{meta.location}</span>
                      <p>{meta.description}</p>
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="placement-summary">
              <strong>Current website impact</strong>
              {selectedLocations.length ? selectedLocations.map(meta => (
                <div key={meta.label}><span>✓</span><div><b>{meta.label}</b><small>{meta.location}</small></div></div>
              )) : <p>This product is not assigned to any storefront section.</p>}
            </div>
          </div>
        )}

        {tab === "media" && (
          <div className="editor-panel">
            <label>
              Product images
              <textarea rows={4} value={form.images} onChange={(e)=>setField("images",e.target.value)} placeholder="/images/front.jpg, /images/side.jpg"/>
              <small>Files in public/images or public image URLs. First image is the main card image.</small>
            </label>
            <ModelUploader value={form.model} onChange={(path) => setField("model", path)}/>

            <div className="media-preview-box">
              {previewImage ? <img src={previewImage} alt="Product preview"/> : <div className="fake-product"/>}
            </div>
          </div>
        )}

        {tab === "seo" && (
          <div className="editor-panel">
            <label>SEO title<input value={form.seoTitle} onChange={(e)=>setField("seoTitle",e.target.value)} placeholder={form.name || "Product title"}/></label>
            <label>SEO description<textarea rows={4} value={form.seoDescription} onChange={(e)=>setField("seoDescription",e.target.value)}/></label>
            <div className="seo-preview">
              <small>SEARCH PREVIEW</small>
              <strong>{form.seoTitle || form.name || "Product title"}</strong>
              <span>/product/{form.slug || "product-slug"}</span>
              <p>{form.seoDescription || form.description || "Product description will appear here."}</p>
            </div>
          </div>
        )}

        <button className="admin-save-button" type="submit" disabled={saving}>
          {saving ? "Saving..." : editingId ? "Save Product Changes" : form.status === "active" ? "Save & Publish Product" : "Save Product"}
        </button>
        {editingId && <button className="admin-secondary-button" type="button" onClick={() => { setEditingId(null); setForm(initialForm); }}>Cancel editing</button>}
        {message && <p className="admin-message">{message}</p>}
      </form>

      <aside className="admin-preview-panel product-admin-side">
        <span className="eyebrow">STOREFRONT PREVIEW</span>
        <div className="admin-preview-card">
          <div className="admin-preview-image">{previewImage ? <img src={previewImage} alt=""/> : <div className="fake-product"/>}</div>
          <div className="admin-preview-meta">
            <div><strong>{form.name || "New DESKAVYN Product"}</strong><span>{form.category}</span></div>
            <b>${form.price || "0"}</b>
          </div>
        </div>

        <div className="where-changes-panel">
          <strong>Where this product will change the website</strong>
          {selectedLocations.length ? selectedLocations.map(meta => (
            <div className="where-row" key={meta.label}>
              <i>✓</i>
              <div><b>{meta.label}</b><span>{meta.location}</span></div>
            </div>
          )) : <p className="admin-empty">Choose placements in the Placement tab.</p>}
        </div>

        <div className="manual-product-list">
          <div className="manual-list-head"><strong>Manual products</strong><span>{products.length}</span></div>
          <div className="admin-product-filters"><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Search products" aria-label="Search manual products"/><select value={statusFilter} onChange={event => setStatusFilter(event.target.value as "all" | ProductStatus)}><option value="all">All statuses</option><option value="active">Published</option><option value="draft">Draft</option><option value="archived">Archived</option></select></div>
          {loadingProducts && <p className="admin-empty">Loading manual products...</p>}
          {!loadingProducts && loadError && <p className="admin-message">{loadError}</p>}
          {!loadingProducts && !loadError && products.length === 0 && <p className="admin-empty">No manual products yet.</p>}
          {!loadingProducts && !loadError && products.length > 0 && visibleProducts.length === 0 && <p className="admin-empty">No products match these filters.</p>}
          {!loadingProducts && !loadError && visibleProducts.map(product => (
            <div className="manual-product-row" key={product.id}>
              <div>
                <strong>{product.name}</strong>
                <span>{product.status ?? "active"} · {product.category} · ${product.price}</span>
              </div>
              <div className="manual-product-actions"><a href={`/product/${product.slug}`} target="_blank" rel="noreferrer">View</a><button type="button" onClick={()=>edit(product)}>Quick edit</button><button type="button" onClick={()=>remove(product.id)}>Delete</button></div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
