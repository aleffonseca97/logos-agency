import { readFile } from "node:fs/promises";
import { join } from "node:path";

import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";

import { branding } from "@/config/branding";
import { isValidLocale } from "@/i18n/config";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type OpenGraphImageProps = {
  params: Promise<{ locale: string }>;
};

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
  const { locale } = await params;
  const resolvedLocale = isValidLocale(locale) ? locale : "en";
  const t = await getTranslations({
    locale: resolvedLocale,
    namespace: "metadata",
  });

  const logoBuffer = await readFile(
    join(process.cwd(), "public/branding/logo-icon.png"),
  );
  const logoSrc = `data:image/png;base64,${logoBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background:
            "linear-gradient(135deg, #0B0F19 0%, #111827 50%, #1D4ED8 100%)",
          color: "#F8FAFC",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
            marginBottom: 32,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoSrc}
            alt=""
            width={96}
            height={96}
            style={{ borderRadius: 20 }}
          />
          <span style={{ fontSize: 28, fontWeight: 600, opacity: 0.9 }}>
            {branding.wordmark.title}
          </span>
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: 900,
            letterSpacing: "-0.02em",
          }}
        >
          {t("title")}
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            lineHeight: 1.4,
            maxWidth: 800,
            color: "#94A3B8",
          }}
        >
          {t("description")}
        </div>
      </div>
    ),
    { ...size },
  );
}
