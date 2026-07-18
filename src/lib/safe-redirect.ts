const DEFAULT_REDIRECT = "/dashboard";

/**
 * Aceita apenas paths relativos do dashboard (mesmo origem).
 * Bloqueia open redirect via URL absoluta, protocol-relative (//), etc.
 */
export function getSafeRedirect(value: string | null | undefined): string {
  if (!value) return DEFAULT_REDIRECT;

  const redirect = value.trim();

  if (!redirect.startsWith("/")) return DEFAULT_REDIRECT;
  if (redirect.startsWith("//")) return DEFAULT_REDIRECT;
  if (redirect.includes("\\")) return DEFAULT_REDIRECT;
  if (redirect.includes("://")) return DEFAULT_REDIRECT;
  if (/[\s<>"']/.test(redirect)) return DEFAULT_REDIRECT;

  if (redirect === "/dashboard" || redirect.startsWith("/dashboard/")) {
    return redirect;
  }

  return DEFAULT_REDIRECT;
}
