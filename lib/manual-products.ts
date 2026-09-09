import fs from "node:fs/promises";
import path from "node:path";
import type { Product } from "@/lib/products";

const filePath = path.join(process.cwd(), "data", "manual-products.json");
const trashPath = path.join(process.cwd(), "data", "manual-products-trash.json");

async function ensureFile() {
  try {
    await fs.access(filePath);
  } catch {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, "[]\n", "utf8");
  }
}

export async function getManualProducts(): Promise<Product[]> {
  await ensureFile();

  try {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function saveManualProducts(products: Product[]) {
  await ensureFile();
  await fs.writeFile(filePath, `${JSON.stringify(products, null, 2)}\n`, "utf8");
}

export async function addManualProduct(product: Product) {
  const products = await getManualProducts();
  products.unshift(product);
  await saveManualProducts(products);
  return product;
}

export async function deleteManualProduct(id: string) {
  const products = await getManualProducts();
  const deletedProduct = products.find((product) => product.id === id);
  const next = products.filter((product) => product.id !== id);
  await saveManualProducts(next);
  if (deletedProduct) { const trash = await getTrashedManualProducts(); trash.unshift(deletedProduct); await fs.writeFile(trashPath, `${JSON.stringify(trash, null, 2)}\n`, "utf8"); }
  return Boolean(deletedProduct);
}

export async function getTrashedManualProducts(): Promise<Product[]> { try { const parsed = JSON.parse(await fs.readFile(trashPath, "utf8")); return Array.isArray(parsed) ? parsed : []; } catch { return []; } }
export async function restoreManualProduct(id: string) { const trash = await getTrashedManualProducts(); const product = trash.find(item => item.id === id); if (!product) return null; const products = await getManualProducts(); if (products.some(item => item.id === id)) return null; await saveManualProducts([product, ...products]); await fs.writeFile(trashPath, `${JSON.stringify(trash.filter(item => item.id !== id), null, 2)}\n`, "utf8"); return product; }

export async function updateManualProduct(id: string, product: Product) {
  const products = await getManualProducts();
  const index = products.findIndex(item => item.id === id);
  if (index < 0) return null;
  products[index] = product;
  await saveManualProducts(products);
  return product;
}
