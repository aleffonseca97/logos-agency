import "server-only";

import { getAuthUrl } from "@/lib/auth-env";

export { getAuthSecret, getAuthUrl, isAuthHttps, ensureNextAuthEnv } from "@/lib/auth-env";

/**
 * Fail-fast: required production env vars must exist before serving traffic.
 * Call from instrumentation at Node server startup (not during build).
 */
export function validateRequiredEnv(): void {
  const missing: string[] = [];

  if (!process.env.DATABASE_URL?.trim()) {
    missing.push("DATABASE_URL");
  }

  if (
    !process.env.NEXTAUTH_SECRET?.trim() &&
    !process.env.AUTH_SECRET?.trim()
  ) {
    missing.push("NEXTAUTH_SECRET (or AUTH_SECRET)");
  }

  if (
    !process.env.NEXTAUTH_URL?.trim() &&
    !process.env.AUTH_URL?.trim() &&
    !process.env.APP_URL?.trim()
  ) {
    missing.push("NEXTAUTH_URL (or AUTH_URL / APP_URL)");
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. ` +
        "Refusing to start.",
    );
  }
}

export function getAppUrl(): string {
  return process.env.APP_URL ?? getAuthUrl();
}

export function getWhatsAppNumber(): string {
  return (process.env.WHATSAPP_NUMBER ?? "5511999999999").replace(/\D/g, "");
}
