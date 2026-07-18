"use client";

import dynamic from "next/dynamic";
import { m, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import { ContactScrollButton } from "@/components/contact";
import { Logo } from "@/components/ui/Logo";
import { sectionFadeUp, sectionStagger } from "@/config/motion";
import { HERO_STAT_KEYS } from "@/data/home-content";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

import { Badge } from "../../badge";
import { Button } from "../../button";
import { Container } from "../../container";
import {
  AnimatedGradient,
  AuroraBackground,
  CursorSpotlight,
  NoiseLayer,
  Spotlight,
} from "../../effects";

const HeroVisual = dynamic(
  () => import("./hero-visual").then((mod) => mod.HeroVisual),
  {
    loading: () => (
      <div
        aria-hidden
        className="bg-logos-surface/60 aspect-square w-full animate-pulse rounded-2xl"
      />
    ),
  },
);

export type HeroSectionProps = {
  className?: string;
};

export function HeroSection({ className }: HeroSectionProps) {
  const t = useTranslations("hero");
  const reduceMotion = useReducedMotion();
  const MotionDiv = reduceMotion ? "div" : m.div;

  return (
    <section
      className={cn(
        "relative flex min-h-[100dvh] items-center overflow-hidden",
        className,
      )}
    >
      <AnimatedGradient intensity="subtle" className="z-0" />
      <AuroraBackground intensity="subtle" className="z-0" />
      <Spotlight intensity="subtle" x={30} y={0} className="z-0" />
      <NoiseLayer intensity="subtle" className="z-0" />

      <CursorSpotlight intensity="subtle" className="z-10 w-full">
        <Container className="relative py-20 sm:py-24 lg:py-28">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-12 lg:gap-16 xl:gap-24">
            <MotionDiv
              className="flex flex-col items-start gap-6 sm:gap-7"
              {...(!reduceMotion && {
                variants: sectionStagger,
                initial: "hidden",
                animate: "visible",
              })}
            >
              <MotionDiv {...(!reduceMotion && { variants: sectionFadeUp })}>
                <Badge
                  variant="accent"
                  className="gap-2 px-3 py-1.5 opacity-90"
                >
                  <Logo variant="mark" height={16} />
                  <span className="logos-font-heading text-xs font-semibold tracking-[0.12em]">
                    {t("badge")}
                  </span>
                </Badge>
              </MotionDiv>

              <MotionDiv
                className="space-y-5"
                {...(!reduceMotion && { variants: sectionFadeUp })}
              >
                <h1 className="logos-text-display-lg text-logos-text sm:logos-text-display-xl lg:logos-text-display-2xl max-w-2xl text-balance text-pretty lg:max-w-3xl">
                  {t("title")}{" "}
                  <span className="logos-text-gradient">
                    {t("titleHighlight")}
                  </span>
                  .
                </h1>
                <p className="text-logos-text-muted max-w-xl text-base leading-relaxed text-pretty sm:text-lg lg:max-w-2xl">
                  {t("description")}
                </p>
              </MotionDiv>

              <MotionDiv
                className="flex w-full flex-col gap-3 pt-1 sm:w-auto sm:flex-row sm:items-center"
                {...(!reduceMotion && { variants: sectionFadeUp })}
              >
                <ContactScrollButton size="lg" className="w-full sm:w-auto">
                  {t("ctaPrimary")}
                </ContactScrollButton>
                <Button
                  render={<Link href="#services" />}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {t("ctaSecondary")}
                </Button>
              </MotionDiv>

              <MotionDiv
                className="border-logos-border/80 flex flex-wrap items-center gap-x-5 gap-y-2 border-t pt-7 opacity-90 sm:gap-x-7 sm:pt-8"
                {...(!reduceMotion && { variants: sectionFadeUp })}
              >
                {HERO_STAT_KEYS.map((key) => (
                  <div key={key} className="space-y-0.5">
                    <p className="logos-font-heading text-logos-text text-lg font-semibold tracking-tight">
                      {t(`stats.${key}.value`)}
                    </p>
                    <p className="text-logos-text-muted text-xs">
                      {t(`stats.${key}.label`)}
                    </p>
                  </div>
                ))}
              </MotionDiv>
            </MotionDiv>

            <div className="relative md:pl-2 lg:pl-4">
              <HeroVisual />
            </div>
          </div>
        </Container>
      </CursorSpotlight>
    </section>
  );
}
