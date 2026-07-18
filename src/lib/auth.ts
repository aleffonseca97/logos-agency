import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions, normalizeRole } from "@/lib/auth-options";
import { getDb } from "@/lib/db";
import { profiles } from "@/lib/db/schema";
import type { UserRole } from "@/types/profile";

export type AuthUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  image?: string | null;
  role: UserRole;
};

async function resolveRole(userId: string, sessionRole?: string | null): Promise<UserRole> {
  if (sessionRole === "admin" || sessionRole === "member") {
    return sessionRole;
  }

  // JWT antigo sem role: consulta o banco (fail-closed se perfil ausente).
  const db = getDb();
  const [profile] = await db
    .select({ role: profiles.role })
    .from(profiles)
    .where(eq(profiles.id, userId))
    .limit(1);

  return normalizeRole(profile?.role);
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      user: null,
      error: NextResponse.json({ error: "Não autorizado." }, { status: 401 }),
    };
  }

  const role = await resolveRole(session.user.id, session.user.role);

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      role,
    } satisfies AuthUser,
    error: null,
  };
}

/** Exige autenticação e que o role do usuário esteja na lista permitida. */
export async function requireRole(...allowedRoles: UserRole[]) {
  const { user, error } = await requireAuth();
  if (error) return { user: null, error };

  if (!allowedRoles.includes(user.role)) {
    return {
      user: null,
      error: NextResponse.json({ error: "Acesso negado." }, { status: 403 }),
    };
  }

  return { user, error: null };
}
