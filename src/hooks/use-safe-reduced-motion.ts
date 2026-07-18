"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * SSR-safe prefers-reduced-motion.
 * framer-motion's useReducedMotion() returns null on the server and the real
 * matchMedia value on the client's first paint — that tree mismatch breaks hydration.
 * Until mount, we assume motion is allowed so server HTML and hydration agree.
 */
export function useSafeReducedMotion(): boolean {
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return false;
  return Boolean(reducedMotion);
}
