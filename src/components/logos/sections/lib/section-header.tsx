"use client";

import { cn } from "@/lib/utils";

import { Badge } from "../../badge";
import { RevealGroup, RevealItem } from "./reveal";

type SectionHeaderProps = {
  badge?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeader({
  badge,
  title,
  description,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <RevealGroup
      className={cn(
        "max-w-3xl space-y-4",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {badge && (
        <RevealItem>
          <Badge variant="primary">{badge}</Badge>
        </RevealItem>
      )}
      <RevealItem>
        <h2 className="logos-text-h1 text-logos-text sm:logos-text-display-sm text-balance text-pretty">
          {title}
        </h2>
      </RevealItem>
      {description && (
        <RevealItem>
          <p className="text-logos-text-muted text-base leading-relaxed text-pretty sm:text-lg">
            {description}
          </p>
        </RevealItem>
      )}
    </RevealGroup>
  );
}
