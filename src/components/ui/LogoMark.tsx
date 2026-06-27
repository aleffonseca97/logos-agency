"use client";

import { useId } from "react";

import { cn } from "@/lib/utils";

export type LogoMarkProps = {
  size?: number;
  className?: string;
};

export function LogoMark({ size = 40, className }: LogoMarkProps) {
  const uid = useId().replace(/:/g, "");
  const gradientA = `logos-mark-a-${uid}`;
  const gradientB = `logos-mark-b-${uid}`;
  const gradientC = `logos-mark-c-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient
          id={gradientA}
          x1="6"
          y1="2"
          x2="20"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#00D2FF" />
          <stop offset="0.35" stopColor="#3B82F6" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient
          id={gradientB}
          x1="4"
          y1="28"
          x2="36"
          y2="38"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2563EB" />
          <stop offset="0.55" stopColor="#6366F1" />
          <stop offset="1" stopColor="#9D50BB" />
        </linearGradient>
        <linearGradient
          id={gradientC}
          x1="16"
          y1="4"
          x2="30"
          y2="28"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#67E8F9" stopOpacity="0.95" />
          <stop offset="0.5" stopColor="#818CF8" stopOpacity="0.7" />
          <stop offset="1" stopColor="#7C3AED" stopOpacity="0.5" />
        </linearGradient>
        <filter
          id={`logos-mark-glow-${uid}`}
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#logos-mark-glow-${uid})`}>
        {/* Face vertical */}
        <path d="M6 4h11v32H6V4z" fill={`url(#${gradientA})`} />
        {/* Face horizontal */}
        <path d="M6 27h28v9H6v-9z" fill={`url(#${gradientB})`} />
        {/* Plano de profundidade — efeito 3D */}
        <path d="M17 4h5.5L31 27H17V4z" fill={`url(#${gradientC})`} />
        {/* Borda superior — nitidez premium */}
        <path
          d="M6 4h11v1.25H6V4z"
          fill="#A5F3FC"
          fillOpacity="0.6"
        />
        <path
          d="M6 27h28v1H6v-1z"
          fill="#93C5FD"
          fillOpacity="0.4"
        />
      </g>
    </svg>
  );
}
