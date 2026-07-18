import { compare, hash } from "bcryptjs";
import { eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import { mapProfile } from "@/lib/db/mappers";
import { profiles, users } from "@/lib/db/schema";
import type { ProfileUpdate } from "@/types/profile";

export async function getProfile(userId: string) {
  const db = getDb();
  const [row] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  return row ? mapProfile(row) : null;
}

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const db = getDb();
  const [row] = await db
    .update(profiles)
    .set({
      ...(updates.full_name !== undefined && { fullName: updates.full_name }),
      ...(updates.avatar_url !== undefined && { avatarUrl: updates.avatar_url }),
      ...(updates.preferences !== undefined && { preferences: updates.preferences }),
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, userId))
    .returning();

  if (!row) throw new Error("Perfil não encontrado");
  return mapProfile(row);
}

export async function changeUserPassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: string; status: number }> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!row) {
    return { ok: false, error: "Usuário não encontrado.", status: 404 };
  }

  const valid = await compare(currentPassword, row.passwordHash);
  if (!valid) {
    return { ok: false, error: "Senha atual incorreta.", status: 400 };
  }

  const passwordHash = await hash(newPassword, 12);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, userId));

  return { ok: true };
}
