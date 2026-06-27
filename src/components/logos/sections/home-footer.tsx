"use client";

import { useTranslations } from "next-intl";

import { footerLinkGroups } from "@/config/navigation";
import { Logo } from "@/components/ui/Logo";

import {
  Footer,
  FooterBottom,
  FooterBrand,
  FooterColumn,
  FooterColumnTitle,
  FooterCopyright,
  FooterInner,
  FooterLink,
  FooterNav,
  FooterTop,
} from "../footer";

export function HomeFooter() {
  const t = useTranslations("footer");
  const tMeta = useTranslations("metadata");
  const tBrand = useTranslations("branding");
  const year = new Date().getFullYear();

  return (
    <Footer variant="surface" spacing="lg">
      <FooterInner>
        <FooterTop>
          <FooterBrand>
            <Logo variant="wordmark" height={32} taglineClassName="max-sm:hidden" />
            <p className="text-logos-text-muted text-sm leading-relaxed">
              {tMeta("description")}
            </p>
          </FooterBrand>

          <FooterNav>
            <FooterColumn>
              <FooterColumnTitle>{t("columns.services")}</FooterColumnTitle>
              {footerLinkGroups.services.map((link) => (
                <FooterLink key={`${link.labelKey}-${link.href}`} href={link.href}>
                  {t(`links.${link.labelKey}`)}
                </FooterLink>
              ))}
            </FooterColumn>
            <FooterColumn>
              <FooterColumnTitle>{t("columns.company")}</FooterColumnTitle>
              {footerLinkGroups.company.map((link) => (
                <FooterLink key={`${link.labelKey}-${link.href}`} href={link.href}>
                  {t(`links.${link.labelKey}`)}
                </FooterLink>
              ))}
            </FooterColumn>
            <FooterColumn>
              <FooterColumnTitle>{t("columns.legal")}</FooterColumnTitle>
              {footerLinkGroups.legal.map((link) => (
                <FooterLink key={`${link.labelKey}-${link.href}`} href={link.href}>
                  {t(`links.${link.labelKey}`)}
                </FooterLink>
              ))}
            </FooterColumn>
          </FooterNav>
        </FooterTop>

        <FooterBottom>
          <FooterCopyright>
            {t("copyright", { year, brand: tBrand("name") })}
          </FooterCopyright>
        </FooterBottom>
      </FooterInner>
    </Footer>
  );
}
