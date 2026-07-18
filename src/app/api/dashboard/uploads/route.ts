import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { z } from "zod";

import { requireRole } from "@/lib/auth";
import { handleRouteError, jsonError, jsonOk } from "@/lib/api/http";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
] as const;

const MAX_BYTES = 2 * 1024 * 1024;

const EXT_BY_TYPE: Record<(typeof ALLOWED_TYPES)[number], string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
};

const uploadMetaSchema = z.object({
  type: z.enum(ALLOWED_TYPES),
  size: z.number().int().positive().max(MAX_BYTES),
});

export async function POST(request: Request) {
  const { error } = await requireRole("admin");
  if (error) return error;

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return jsonError("Arquivo não enviado.", 400);
    }

    const meta = uploadMetaSchema.safeParse({
      type: file.type,
      size: file.size,
    });

    if (!meta.success) {
      if (file.size > MAX_BYTES) {
        return jsonError("Arquivo muito grande. Máximo 2MB.", 400);
      }
      return jsonError(
        "Formato inválido. Use JPG, PNG, WEBP, SVG ou GIF.",
        400,
      );
    }

    const ext = EXT_BY_TYPE[meta.data.type];
    const filename = `${randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "clients");
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    return jsonOk({ url: `/uploads/clients/${filename}` });
  } catch (e) {
    return handleRouteError("[api/dashboard/uploads]", e, "Erro ao enviar arquivo.");
  }
}
