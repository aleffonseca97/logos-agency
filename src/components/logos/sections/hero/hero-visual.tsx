"use client";

import { m, useReducedMotion } from "framer-motion";
import { useTranslations } from "next-intl";

import {
  AnimatedBackground,
  AnimatedGradient,
  AnimatedGrid,
  AuroraBackground,
  BackgroundBlur,
  FloatingShapes,
  GlowBorder,
  GradientBorder,
  LightRays,
  MouseGlow,
  NoiseLayer,
  Particles,
  Spotlight,
} from "../../effects";
import { HeroOrbitLines } from "./hero-orbit-lines";
import { HeroTechPanel } from "./hero-tech-panel";

export function HeroVisual() {
  const t = useTranslations("hero.visual");
  const reduceMotion = useReducedMotion();

  return (
    <m.div
      className="relative w-full"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.96, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.85, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }
      }
    >
      <MouseGlow intensity="subtle" className="rounded-2xl">
        <GlowBorder intensity="subtle" borderRadius="1rem">
          <div className="bg-brand-background relative aspect-[4/5] min-h-[280px] w-full overflow-hidden rounded-2xl sm:aspect-square sm:min-h-[340px] lg:min-h-[520px]">
            <AnimatedGradient intensity="subtle" />
            <AuroraBackground intensity="subtle" />
            <AnimatedBackground intensity="subtle" />
            <LightRays intensity="subtle" />
            <AnimatedGrid intensity="subtle" />
            <Particles intensity="subtle" />
            <FloatingShapes intensity="subtle" />
            <Spotlight intensity="subtle" x={50} y={20} />
            <BackgroundBlur intensity="subtle" fade="edges" />
            <NoiseLayer intensity="subtle" />
            <HeroOrbitLines />

            <div className="absolute inset-0 flex items-center justify-center p-5 sm:p-8">
              <m.div
                className="w-full max-w-[280px] sm:max-w-xs"
                animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <GradientBorder intensity="subtle" borderRadius="0.875rem">
                  <div className="logos-glass-strong rounded-xl p-5 sm:p-6">
                    <HeroTechPanel />
                  </div>
                </GradientBorder>
              </m.div>
            </div>

            <m.div
              className="logos-glass border-logos-border absolute top-[12%] right-[10%] hidden rounded-lg border px-3 py-2 sm:block"
              animate={reduceMotion ? undefined : { y: [0, -4, 0] }}
              transition={{
                duration: 6.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
            >
              <p className="text-logos-text-muted text-[0.65rem]">
                {t("nodes")}
              </p>
              <p className="logos-font-heading text-brand-primary text-sm font-semibold">
                847
              </p>
            </m.div>

            <m.div
              className="logos-glass border-logos-border absolute bottom-[15%] left-[8%] hidden rounded-lg border px-3 py-2 sm:block"
              animate={reduceMotion ? undefined : { y: [0, 4, 0] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <p className="text-logos-text-muted text-[0.65rem]">
                {t("deploy")}
              </p>
              <p className="logos-font-heading text-sm font-semibold text-emerald-400">
                {t("deployActive")}
              </p>
            </m.div>

            <m.div
              className="bg-brand-primary/20 absolute top-1/2 left-1/2 size-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
              animate={
                reduceMotion
                  ? undefined
                  : { scale: [1, 1.1, 1], opacity: [0.28, 0.42, 0.28] }
              }
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              aria-hidden
            />
          </div>
        </GlowBorder>
      </MouseGlow>
    </m.div>
  );
}
