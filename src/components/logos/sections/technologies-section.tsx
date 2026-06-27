"use client";

import { useTranslations } from "next-intl";

import { Badge } from "../badge";
import { Card, CardContent } from "../card";
import { Spotlight } from "../effects";
import { homeTechnologies, SECTION_IDS } from "@/data/home-content";
import { Reveal, RevealGroup, RevealItem } from "./lib/reveal";
import { SectionHeader } from "./lib/section-header";
import { SectionShell } from "./lib/section-shell";

export function TechnologiesSection() {
  const t = useTranslations("technologies");

  return (
    <SectionShell
      id={SECTION_IDS.technologies}
      spacing="lg"
      effects={<Spotlight intensity="subtle" x={70} y={30} />}
    >
      <SectionHeader
        badge={t("badge")}
        title={t("title")}
        description={t("description")}
        align="center"
      />

      <Reveal>
        <Card variant="glass" padding="lg" className="mx-auto max-w-4xl">
          <CardContent>
            <RevealGroup className="flex flex-wrap justify-center gap-2 sm:gap-3">
              {homeTechnologies.map((tech) => (
                <RevealItem key={tech}>
                  <Badge variant="outline" size="lg" className="px-4 py-1.5">
                    {tech}
                  </Badge>
                </RevealItem>
              ))}
            </RevealGroup>
          </CardContent>
        </Card>
      </Reveal>
    </SectionShell>
  );
}
