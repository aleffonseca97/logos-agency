"use client";

import { m } from "framer-motion";
import { useTranslations } from "next-intl";

import {
  HERO_VISUAL_STAT_KEYS,
  HERO_VISUAL_STAT_VALUES,
} from "@/data/home-content";
import { useSafeReducedMotion } from "@/hooks/use-safe-reduced-motion";
import { cn } from "@/lib/utils";

const bars = [
  { height: 42, delay: 0 },
  { height: 68, delay: 0.1 },
  { height: 55, delay: 0.2 },
  { height: 82, delay: 0.15 },
  { height: 48, delay: 0.25 },
  { height: 72, delay: 0.05 },
  { height: 60, delay: 0.3 },
] as const;

export function HeroTechPanel({ className }: { className?: string }) {
  const t = useTranslations("hero.visual");
  const reduceMotion = useSafeReducedMotion();

  return (
    <div className={cn("w-full space-y-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="logos-text-overline text-brand-primary">
            {t("systemLive")}
          </p>
          <p className="logos-font-heading text-logos-text text-lg font-semibold">
            {t("performanceRealtime")}
          </p>
        </div>
        <m.div
          className="flex size-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]"
          animate={reduceMotion ? undefined : { opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="flex h-20 items-end justify-between gap-1.5">
        {bars.map((bar, index) => (
          <m.div
            key={index}
            className="from-brand-primary/20 to-brand-primary w-full rounded-sm bg-gradient-to-t"
            initial={reduceMotion ? false : { height: "20%" }}
            style={reduceMotion ? { height: `${bar.height}%` } : undefined}
            animate={
              reduceMotion
                ? undefined
                : {
                    height: [
                      `${bar.height * 0.55}%`,
                      `${bar.height}%`,
                      `${bar.height * 0.72}%`,
                    ],
                  }
            }
            transition={{
              duration: 3.6 + bar.delay,
              repeat: Infinity,
              ease: "easeInOut",
              delay: bar.delay,
            }}
          />
        ))}
      </div>

      <svg
        viewBox="0 0 280 80"
        className="text-brand-primary/40 w-full"
        aria-hidden
      >
        <m.path
          d="M0 60 Q40 20, 80 45 T160 35 T280 15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          initial={false}
          animate={
            reduceMotion
              ? { pathLength: 1, opacity: 0.55 }
              : { pathLength: 1, opacity: [0.35, 0.7, 0.35] }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
          }
        />
        <m.path
          d="M0 70 Q60 50, 120 55 T240 40"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeOpacity="0.5"
          initial={false}
          animate={
            reduceMotion
              ? { pathLength: 1, opacity: 0.35 }
              : { pathLength: 1, opacity: [0.2, 0.45, 0.2] }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  duration: 5.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }
          }
        />
        {[
          [80, 45],
          [160, 35],
          [240, 40],
        ].map(([cx, cy], i) => (
          <m.circle
            key={i}
            cx={cx}
            cy={cy}
            r="3"
            fill="var(--logos-brand-primary)"
            animate={
              reduceMotion
                ? { opacity: 0.7, scale: 1 }
                : { opacity: [0.45, 1, 0.45], scale: [1, 1.2, 1] }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 2.8, repeat: Infinity, delay: i * 0.4 }
            }
          />
        ))}
      </svg>

      <div className="border-logos-border grid grid-cols-3 gap-3 border-t pt-4">
        {HERO_VISUAL_STAT_KEYS.map((key) => (
          <div key={key} className="space-y-0.5">
            <p className="text-logos-text-muted text-[0.65rem]">{t(key)}</p>
            <p className="logos-font-heading text-logos-text text-sm font-semibold">
              {HERO_VISUAL_STAT_VALUES[key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
