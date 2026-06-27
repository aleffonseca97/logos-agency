import { headers } from "next/headers";

import { getDefaultLocaleMetadata } from "@/config/seo";
import { logosDefaultTheme } from "@/design-system/themes/logos-default";
import { fontVariables } from "@/config/fonts";
import { defaultLocale, localeLabels } from "@/i18n/config";
import { Providers } from "@/providers";
import "./globals.css";

export const metadata = getDefaultLocaleMetadata();

export const viewport = {
  themeColor: logosDefaultTheme.brand.background,
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const htmlLang =
    headersList.get("x-html-lang") ?? localeLabels[defaultLocale].htmlLang;

  return (
    <html
      lang={htmlLang}
      data-theme={logosDefaultTheme.id}
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
