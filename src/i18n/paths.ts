import { defaultLocale, localeLabels, type Locale } from "./config";
import { getAppUrl } from "@/lib/env";

export function getLocalizedPath(locale: Locale, pathname = "/"): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;

  if (locale === defaultLocale) {
    return normalized === "/" ? "/" : normalized;
  }

  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

export function getAlternateLanguages(pathname = "/"): Record<string, string> {
  const base = getAppUrl().replace(/\/$/, "");

  return Object.fromEntries(
    (Object.keys(localeLabels) as Locale[]).map((locale) => [
      localeLabels[locale].hreflang,
      `${base}${getLocalizedPath(locale, pathname)}`,
    ]),
  );
}
