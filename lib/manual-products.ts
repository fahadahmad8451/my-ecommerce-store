import fs from "node:fs/promises";
import path from "node:path";
import type { Product } from "@/lib/products";

const filePath = path.join(process.cwd(), "data", "manual-products.json");

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
  const next = products.filter((product) => product.id !== id);
  await saveManualProducts(next);
  return products.length !== next.length;
}

export async function updateManualProduct(id: string, product: Product) {
  const products = await getManualProducts();
  const index = products.findIndex(item => item.id === id);
  if (index < 0) return null;
  products[index] = product;
  await saveManualProducts(products);
  return product;
}
