/**
 * LOGOS Design System — Motion
 *
 * Tokens de movimento para Framer Motion e CSS transitions.
 * Identidade: reveals suaves, stagger curto, efeitos premium com ease próprio.
 */

import type { Transition, Variants } from "framer-motion";

/** Curvas de easing canônicas. */
export const easings = {
  /** UI padrão (botões, dialogs, hovers). */
  standard: [0.25, 0.1, 0.25, 1] as const,
  /** Efeitos premium em loop (aurora, particles, glow). */
  effect: [0.45, 0, 0.55, 1] as const,
  linear: "linear" as const,
} as const;

/** Durações em segundos. */
export const durations = {
  instant: 0.1,
  fast: 0.15,
  normal: 0.3,
  slow: 0.6,
  slower: 0.9,
} as const;

export const motionTransitions = {
  default: {
    duration: durations.normal,
    ease: easings.standard,
  } satisfies Transition,
  fast: {
    duration: durations.fast,
    ease: easings.standard,
  } satisfies Transition,
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  } satisfies Transition,
  slow: {
    duration: durations.slow,
    ease: easings.standard,
  } satisfies Transition,
} as const;

export const motionVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  } satisfies Variants,
  fadeInUp: {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
  } satisfies Variants,
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 },
  } satisfies Variants,
} as const;

/** Variantes para seções com reveal on scroll. */
export const sectionStagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

export const sectionFadeUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: easings.standard,
    },
  },
};

export const sectionFadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: motionTransitions.default,
  },
};

export const sectionViewport = { once: true, margin: "-80px" as const };

/** Intensidade de efeitos visuais premium. */
export const effectIntensity = {
  subtle: { opacity: 0.35, speed: 0.7, count: 0.6, blur: 0.8 },
  medium: { opacity: 0.55, speed: 1, count: 1, blur: 1 },
  strong: { opacity: 0.75, speed: 1.2, count: 1.4, blur: 1.2 },
} as const;

export type EffectIntensity = keyof typeof effectIntensity;
