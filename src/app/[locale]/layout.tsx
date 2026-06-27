import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { buildMetadata, getHomeJsonLd } from "@/config/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { isValidLocale, locales } from "@/i18n/config";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    return {};
  }

  return buildMetadata(locale);
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const jsonLd = await getHomeJsonLd(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <JsonLd data={jsonLd} />
      {children}
    </NextIntlClientProvider>
  );
}
