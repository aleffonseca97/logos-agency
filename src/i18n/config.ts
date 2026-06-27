export const locales = ["en", "pt", "it"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<
  Locale,
  { label: string; flag: string; htmlLang: string; ogLocale: string; hreflang: string }
> = {
  en: {
    label: "English",
    flag: "🇺🇸",
    htmlLang: "en",
    ogLocale: "en_US",
    hreflang: "en",
  },
  pt: {
    label: "Português",
    flag: "🇧🇷",
    htmlLang: "pt-BR",
    ogLocale: "pt_BR",
    hreflang: "pt",
  },
  it: {
    label: "Italiano",
    flag: "🇮🇹",
    htmlLang: "it",
    ogLocale: "it_IT",
    hreflang: "it",
  },
};

export const LOCALE_COOKIE = "NEXT_LOCALE";

export function isValidLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
