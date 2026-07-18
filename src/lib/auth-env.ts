/**
 * Helpers de auth compartilhados entre Node (NextAuth) e Edge/Proxy.
 * Sem "server-only" para poder ser importado no proxy.
 */

export function getAuthSecret(): string | undefined {
  return process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
}

export function getAuthUrl(): string {
  return (
    process.env.NEXTAUTH_URL ??
    process.env.AUTH_URL ??
    process.env.APP_URL ??
    "http://localhost:2000"
  );
}

export function isAuthHttps(): boolean {
  return getAuthUrl().startsWith("https://");
}

/** Espelha aliases AUTH_* → NEXTAUTH_* para o NextAuth v4. */
export function ensureNextAuthEnv(): void {
  if (!process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = getAuthUrl();
  }
  if (!process.env.NEXTAUTH_SECRET && process.env.AUTH_SECRET) {
    process.env.NEXTAUTH_SECRET = process.env.AUTH_SECRET;
  }
}
