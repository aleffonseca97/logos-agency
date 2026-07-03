"use client";

import { useTranslations } from "next-intl";

import { CONTACT_SECTION_ID } from "@/config/contact";
import {
  AnimatedGradient,
  AuroraBackground,
  GlowBorder,
  NoiseLayer,
  Particles,
  Spotlight,
} from "@/components/logos/effects";
import {
  Reveal,
  RevealGroup,
  RevealItem,
} from "@/components/logos/sections/lib/reveal";
import { SectionShell } from "@/components/logos/sections/lib/section-shell";

import { ContactForm } from "./contact-form";

export function ContactSection({ whatsappNumber }: { whatsappNumber: string }) {
  const t = useTranslations("contact");

  return (
    <SectionShell
      id={CONTACT_SECTION_ID}
      spacing="lg"
      effects={
        <>
          <AnimatedGradient intensity="subtle" />
          <AuroraBackground intensity="subtle" />
          <Spotlight intensity="subtle" x={50} y={50} />
          <Particles intensity="subtle" />
          <NoiseLayer intensity="subtle" />
        </>
      }
    >
      <Reveal>
        <GlowBorder intensity="medium" borderRadius="1rem">
          <div className="logos-glass rounded-2xl px-6 py-12 sm:px-12 sm:py-16 lg:px-20 lg:py-20">
            <RevealGroup className="mx-auto flex max-w-3xl flex-col gap-10">
              <RevealItem>
                <div className="mx-auto max-w-3xl space-y-4 text-center">
                  <h2 className="logos-text-display-sm text-logos-text sm:logos-text-display-md text-balance">
                    {t("title")}{" "}
                    <span className="logos-text-gradient">
                      {t("titleHighlight")}
                    </span>
                  </h2>
                  <p className="text-logos-text-muted mx-auto max-w-2xl text-base leading-relaxed text-pretty sm:text-lg">
                    {t("description")}
                  </p>
                </div>
              </RevealItem>
              <RevealItem>
                <ContactForm whatsappNumber={whatsappNumber} />
              </RevealItem>
            </RevealGroup>
          </div>
        </GlowBorder>
      </Reveal>
    </SectionShell>
  );
}
