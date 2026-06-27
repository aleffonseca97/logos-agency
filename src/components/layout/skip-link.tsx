"use client";

import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations();

  return (
    <a
      href="#main-content"
      className="bg-brand-primary text-logos-text focus:ring-brand-accent sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:font-medium focus:shadow-lg focus:ring-2 focus:outline-none"
    >
      {t("skipLink")}
    </a>
  );
}
