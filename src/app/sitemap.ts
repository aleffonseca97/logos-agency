import type { MetadataRoute } from "next";

import { getAppUrl } from "@/lib/env";
import { locales } from "@/i18n/config";
import { getLocalizedPath } from "@/i18n/paths";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getAppUrl().replace(/\/$/, "");

  return locales.map((locale) => ({
    url: `${base}${getLocalizedPath(locale, "/")}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1,
    alternates: {
      languages: Object.fromEntries(
        locales.map((item) => [
          item === "en" ? "en" : item === "pt" ? "pt" : "it",
          `${base}${getLocalizedPath(item, "/")}`,
        ]),
      ),
    },
  }));
}
