"use client";

import { m } from "framer-motion";

export function HeroOrbitLines() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 size-full"
      viewBox="0 0 400 400"
      aria-hidden
    >
      <m.ellipse
        cx="200"
        cy="200"
        rx="160"
        ry="60"
        fill="none"
        stroke="url(#orbit-gradient)"
        strokeWidth="1"
        style={{ transformOrigin: "200px 200px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <m.ellipse
        cx="200"
        cy="200"
        rx="130"
        ry="130"
        fill="none"
        stroke="color-mix(in srgb, var(--logos-brand-accent) 20%, transparent)"
        strokeWidth="0.5"
        strokeDasharray="4 8"
        style={{ transformOrigin: "200px 200px" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />
      <m.circle
        cx="200"
        cy="40"
        r="4"
        fill="var(--logos-brand-primary)"
        style={{ transformOrigin: "200px 200px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      />
      <defs>
        <linearGradient id="orbit-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="50%" stopColor="var(--logos-brand-primary)" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}
