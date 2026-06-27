"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { branding } from "@/config/branding";
import { cn } from "@/lib/utils";

import { LogoMark } from "./LogoMark";

export type LogoVariant = "wordmark" | "mark" | "image" | "navbar";

export type LogoProps = {
  variant?: LogoVariant;
  height?: number;
  className?: string;
  priority?: boolean;
  showTagline?: boolean;
  taglineClassName?: string;
};

export function Logo({
  variant = "wordmark",
  height = 40,
  className,
  priority = false,
  showTagline = true,
  taglineClassName,
}: LogoProps) {
  const t = useTranslations("branding");
  const logoAlt = t("logoAlt");

  if (variant === "mark") {
    return <LogoMark size={height} className={className} />;
  }

  if (variant === "image") {
    return (
      <Image
        src={branding.logo.src}
        alt={logoAlt}
        width={branding.logo.width}
        height={branding.logo.height}
        priority={priority}
        className={cn("w-auto max-w-none", className)}
        style={{ height }}
      />
    );
  }

  if (variant === "navbar") {
    return (
      <span
        className={cn(
          "relative inline-flex h-10 w-[140px] shrink-0 items-center lg:h-12 lg:w-[180px]",
          className,
        )}
      >
        <Image
          src={branding.logo.src}
          alt={logoAlt}
          fill
          priority={priority}
          sizes="(max-width: 1023px) 140px, 180px"
          className="object-contain object-left"
        />
      </span>
    );
  }

  const titleSize = Math.round(height * 0.4);
  const taglineSize = Math.max(Math.round(height * 0.2), 7);
  const gap = Math.round(height * 0.22);

  return (
    <span
      className={cn("inline-flex items-center", className)}
      style={{ gap }}
      role="img"
      aria-label={logoAlt}
    >
      <LogoMark size={height} />
      <span className="flex min-w-0 flex-col justify-center leading-none">
        <span
          className="logos-font-heading text-logos-text font-semibold tracking-[0.14em]"
          style={{ fontSize: titleSize }}
        >
          {branding.wordmark.title}
        </span>
        {showTagline ? (
          <span
            className={cn(
              "logos-text-gradient mt-[0.2em] font-medium uppercase",
              taglineClassName,
            )}
            style={{
              fontSize: taglineSize,
              letterSpacing: "0.18em",
            }}
          >
            {t("tagline")}
          </span>
        ) : null}
      </span>
    </span>
  );
}
