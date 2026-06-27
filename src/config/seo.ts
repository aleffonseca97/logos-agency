import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { siteConfig } from "@/config/site";
import { FAQ_KEYS } from "@/data/home-content";
import { defaultLocale, localeLabels, type Locale } from "@/i18n/config";
import { getAlternateLanguages, getLocalizedPath } from "@/i18n/paths";

export async function buildMetadata(
  locale: Locale,
  overrides?: Partial<Metadata>,
): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const tBrand = await getTranslations({ locale, namespace: "branding" });
  const description = t("description");
  const keywords = t("keywords").split(",");
  const title = t("title");
  const ogImage = {
    url: getLocalizedPath(locale, "/opengraph-image"),
    width: 1200,
    height: 630,
    alt: tBrand("logoAlt"),
  };
  const canonicalPath = getLocalizedPath(locale, "/");
  const languages = getAlternateLanguages("/");
  languages["x-default"] = `${siteConfig.url.replace(/\/$/, "")}/`;

  return {
    title: {
      default: title,
      template: `%s | ${siteConfig.name}`,
    },
    description,
    metadataBase: new URL(siteConfig.url),
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      ],
      shortcut: "/favicon.ico",
      apple: [
        {
          url: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      other: [
        {
          rel: "icon",
          url: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          rel: "icon",
          url: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    },
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name, url: siteConfig.url }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    keywords,
    category: "technology",
    alternates: {
      canonical: canonicalPath,
      languages,
    },
    openGraph: {
      type: "website",
      locale: localeLabels[locale].ogLocale,
      url: `${siteConfig.url.replace(/\/$/, "")}${canonicalPath}`,
      siteName: siteConfig.name,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
      creator: siteConfig.links.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    ...overrides,
  };
}

export async function getOrganizationJsonLd(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "metadata" });
  const tBrand = await getTranslations({ locale, namespace: "branding" });

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: tBrand("name"),
    url: siteConfig.url,
    description: t("description"),
    logo: `${siteConfig.url}/branding/logo-icon.png`,
    sameAs: Object.values(siteConfig.links).filter(Boolean),
  };
}

export async function getWebSiteJsonLd(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: t("description"),
    inLanguage: localeLabels[locale].htmlLang,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export async function getWebPageJsonLd(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("title"),
    url: `${siteConfig.url.replace(/\/$/, "")}${getLocalizedPath(locale, "/")}`,
    description: t("description"),
    inLanguage: localeLabels[locale].htmlLang,
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}

export async function getFaqJsonLd(locale: Locale) {
  const t = await getTranslations({ locale, namespace: "faq" });

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_KEYS.map((key) => ({
      "@type": "Question",
      name: t(`items.${key}.question`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`items.${key}.answer`),
      },
    })),
  };
}

export async function getHomeJsonLd(locale: Locale) {
  return [
    await getOrganizationJsonLd(locale),
    await getWebSiteJsonLd(locale),
    await getWebPageJsonLd(locale),
    await getFaqJsonLd(locale),
  ];
}

export function getDefaultLocaleMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: siteConfig.name,
  };
}

export { defaultLocale };
