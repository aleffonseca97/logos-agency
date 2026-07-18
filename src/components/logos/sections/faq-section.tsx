"use client";

import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../accordion";
import { FAQ_KEYS, SECTION_IDS } from "@/data/home-content";
import { Reveal } from "./lib/reveal";
import { SectionHeader } from "./lib/section-header";
import { SectionShell } from "./lib/section-shell";

export function FaqSection() {
  const t = useTranslations("faq");

  return (
    <SectionShell id={SECTION_IDS.faq} spacing="md">
      <SectionHeader
        badge={t("badge")}
        title={t("title")}
        description={t("description")}
        align="center"
      />

      <Reveal className="mx-auto max-w-3xl">
        <Accordion variant="bordered">
          {FAQ_KEYS.map((key, index) => (
            <AccordionItem key={key} value={`faq-${index}`}>
              <AccordionTrigger>{t(`items.${key}.question`)}</AccordionTrigger>
              <AccordionContent>{t(`items.${key}.answer`)}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </SectionShell>
  );
}
