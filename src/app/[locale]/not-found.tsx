import { getTranslations } from "next-intl/server";

import { siteCta } from "@/config/navigation";
import { Button } from "@/components/logos/button";
import { Container } from "@/components/logos/container";
import { Link } from "@/i18n/routing";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  const tNav = await getTranslations("nav");
  const tBrand = await getTranslations("branding");

  return (
    <main
      id="main-content"
      className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center"
    >
      <Container className="flex max-w-lg flex-col items-center gap-6">
        <p className="text-brand-primary logos-font-heading text-6xl font-bold">
          404
        </p>
        <h1 className="logos-text-display-sm text-logos-text">{t("title")}</h1>
        <p className="text-logos-text-muted text-base leading-relaxed">
          {t("description", { brand: tBrand("name") })}
        </p>
        <Button render={<Link href="/" />} variant="cta" size="lg">
          {t("backHome")}
        </Button>
        <Button
          render={<Link href={siteCta.primary.href} />}
          variant="outline"
          size="lg"
        >
          {tNav(siteCta.primary.labelKey)}
        </Button>
      </Container>
    </main>
  );
}
