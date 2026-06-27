import type { Transition } from "framer-motion";

/** Transições lentas e elegantes — base para todos os efeitos premium. */
export const effectEase = [0.45, 0, 0.55, 1] as const;

export function effectTransition(duration: number, delay = 0): Transition {
  return {
    duration,
    delay,
    ease: effectEase,
    repeat: Infinity,
    repeatType: "mirror",
  };
}

export function effectLoop(duration: number, delay = 0): Transition {
  return {
    duration,
    delay,
    ease: "linear",
    repeat: Infinity,
  };
}
