import fs from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
const MAX_MODEL_BYTES = 20 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File) || !file.name.toLowerCase().endsWith(".glb")) return NextResponse.json({ error: "Please upload a .glb model file." }, { status: 400 });
    if (file.size > MAX_MODEL_BYTES) return NextResponse.json({ error: "GLB files must be 20 MB or smaller." }, { status: 400 });
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const targetDirectory = path.join(process.cwd(), "public", "uploads", "models");
    await fs.mkdir(targetDirectory, { recursive: true });
    await fs.writeFile(path.join(targetDirectory, safeName), Buffer.from(await file.arrayBuffer()));
    return NextResponse.json({ path: `/uploads/models/${safeName}` });
  } catch { return NextResponse.json({ error: "Model upload failed." }, { status: 500 }); }
}
