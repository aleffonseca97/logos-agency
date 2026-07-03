import { NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";

import { requireAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function POST(request: Request) {
  const { user, error } = await requireAuth();
  if (error) return error;

  let body: { password?: string; currentPassword?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { password, currentPassword } = body;

  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: "Senha deve ter pelo menos 6 caracteres." },
      { status: 400 },
    );
  }

  const db = getDb();
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.id, user!.id))
    .limit(1);

  if (!row) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  if (currentPassword) {
    const valid = await compare(currentPassword, row.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Senha atual incorreta." }, { status: 400 });
    }
  }

  const passwordHash = await hash(password, 12);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, user!.id));

  return NextResponse.json({ success: true });
}
