"use client";

import { useTranslations } from "next-intl";

import { Card, CardDescription, CardHeader, CardTitle } from "../card";
import { AnimatedGrid, NoiseLayer } from "../effects";
import {
  SECTION_IDS,
  SERVICE_KEYS,
  serviceIcons,
} from "@/data/home-content";
import { RevealGroup, RevealItem } from "./lib/reveal";
import { SectionHeader } from "./lib/section-header";
import { SectionShell } from "./lib/section-shell";

export function ServicesSection() {
  const t = useTranslations("services");

  return (
    <SectionShell
      id={SECTION_IDS.services}
      spacing="lg"
      variant="surface"
      effects={
        <>
          <NoiseLayer intensity="subtle" />
          <AnimatedGrid intensity="subtle" />
        </>
      }
    >
      <SectionHeader
        badge={t("badge")}
        title={t("title")}
        description={t("description")}
      />

      <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {SERVICE_KEYS.map((key) => {
          const Icon = serviceIcons[key];
          return (
            <RevealItem key={key}>
              <Card
                variant="glass"
                padding="md"
                className="hover:border-brand-primary/30 h-full transition-colors"
              >
                <CardHeader>
                  <div className="bg-brand-primary/10 text-brand-primary mb-2 flex size-10 items-center justify-center rounded-lg">
                    <Icon className="size-5" aria-hidden />
                  </div>
                  <CardTitle>{t(`items.${key}.title`)}</CardTitle>
                  <CardDescription>
                    {t(`items.${key}.description`)}
                  </CardDescription>
                </CardHeader>
              </Card>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </SectionShell>
  );
}
