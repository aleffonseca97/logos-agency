"use client";

import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "../badge";
import { Button } from "../button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../card";
import { AuroraBackground, NoiseLayer } from "../effects";
import {
  CASE_KEYS,
  SECTION_IDS,
  caseMetrics,
} from "@/data/home-content";
import { RevealGroup, RevealItem } from "./lib/reveal";
import { SectionHeader } from "./lib/section-header";
import { SectionShell } from "./lib/section-shell";

export function CasesSection() {
  const t = useTranslations("cases");

  return (
    <SectionShell
      id={SECTION_IDS.cases}
      spacing="xl"
      variant="background"
      effects={
        <>
          <AuroraBackground intensity="subtle" />
          <NoiseLayer intensity="subtle" />
        </>
      }
    >
      <SectionHeader
        badge={t("badge")}
        title={t("title")}
        description={t("description")}
      />

      <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3">
        {CASE_KEYS.map((key) => {
          const title = t(`items.${key}.title`);

          return (
            <RevealItem key={key}>
              <Card
                variant="elevated"
                padding="md"
                className="group flex h-full flex-col"
              >
                <CardHeader>
                  <Badge variant="accent" size="sm">
                    {t(`items.${key}.industry`)}
                  </Badge>
                  <CardTitle className="mt-3">{title}</CardTitle>
                  <CardDescription>
                    {t(`items.${key}.description`)}
                  </CardDescription>
                </CardHeader>
                <CardFooter className="border-logos-border mt-auto border-t pt-4">
                  <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="logos-font-heading text-brand-primary text-2xl font-semibold">
                        {caseMetrics[key]}
                      </p>
                      <p className="text-logos-text-muted text-xs">
                        {t(`items.${key}.metricLabel`)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={t("viewCaseAria", { title })}
                    >
                      <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </RevealItem>
          );
        })}
      </RevealGroup>
    </SectionShell>
  );
}
