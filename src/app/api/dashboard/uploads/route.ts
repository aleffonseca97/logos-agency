import { mkdir, writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import path from "path";
import { randomUUID } from "crypto";

import { requireAuth } from "@/lib/auth";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
]);

const MAX_BYTES = 2 * 1024 * 1024;

const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
};

export async function POST(request: Request) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo não enviado." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Formato inválido. Use JPG, PNG, WEBP, SVG ou GIF." },
        { status: 400 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Máximo 2MB." },
        { status: 400 },
      );
    }

    const ext = EXT_BY_TYPE[file.type] ?? "bin";
    const filename = `${randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "clients");
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    const url = `/uploads/clients/${filename}`;
    return NextResponse.json({ url });
  } catch (e) {
    console.error("[api/dashboard/uploads]", e);
    return NextResponse.json({ error: "Erro ao enviar arquivo." }, { status: 500 });
  }
}
