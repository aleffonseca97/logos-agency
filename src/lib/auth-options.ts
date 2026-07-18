import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { eq } from "drizzle-orm";

import {
  ensureNextAuthEnv,
  getAuthSecret,
  isAuthHttps,
} from "@/lib/auth-env";
import { getDb } from "@/lib/db";
import { profiles, users } from "@/lib/db/schema";
import type { UserRole } from "@/types/profile";

ensureNextAuthEnv();

/** Fail-closed: somente "admin" explícito é admin. */
export function normalizeRole(role: string | null | undefined): UserRole {
  return role === "admin" ? "admin" : "member";
}

const useSecureCookies = isAuthHttps();

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) return null;

        const db = getDb();
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email.toLowerCase().trim()))
          .limit(1);

        if (!user) return null;

        const valid = await compare(password, user.passwordHash);
        if (!valid) return null;

        const [profile] = await db
          .select({ role: profiles.role })
          .from(profiles)
          .where(eq(profiles.id, user.id))
          .limit(1);

        return {
          id: user.id,
          email: user.email,
          role: normalizeRole(profile?.role),
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = normalizeRole(token.role);
      }
      return session;
    },
  },
  secret: getAuthSecret(),
  useSecureCookies,
  cookies: {
    sessionToken: {
      name: useSecureCookies
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
};
