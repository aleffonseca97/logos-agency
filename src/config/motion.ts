import type { Transition, Variants } from "framer-motion";

export const motionTransitions = {
  default: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } satisfies Transition,
  spring: { type: "spring", stiffness: 300, damping: 30 } satisfies Transition,
  slow: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } satisfies Transition,
} as const;

export const motionVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  } satisfies Variants,
  fadeInUp: {
    hidden: { opacity: 0, y: 16 },
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
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const sectionFadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: motionTransitions.slow,
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
