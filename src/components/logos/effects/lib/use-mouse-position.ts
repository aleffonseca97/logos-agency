"use client";

import { useMotionValue, useSpring } from "framer-motion";
import { useEffect, type RefObject } from "react";

const springConfig = { stiffness: 120, damping: 28, mass: 0.6 };

export function useMousePosition(containerRef: RefObject<HTMLElement | null>) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const handleMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      x.set(event.clientX - rect.left);
      y.set(event.clientY - rect.top);
    };

    element.addEventListener("mousemove", handleMove, { passive: true });
    return () => element.removeEventListener("mousemove", handleMove);
  }, [containerRef, x, y]);

  return { x: springX, y: springY };
}
