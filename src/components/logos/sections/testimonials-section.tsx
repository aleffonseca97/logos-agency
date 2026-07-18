"use client";

import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";

import { Card, CardContent, CardDescription, CardHeader } from "../card";
import { GlowBorder } from "../effects";
import {
  featuredTestimonial,
  SECTION_IDS,
  TESTIMONIAL_KEYS,
} from "@/data/home-content";
import { RevealGroup, RevealItem } from "./lib/reveal";
import { SectionHeader } from "./lib/section-header";
import { SectionShell } from "./lib/section-shell";

export function TestimonialsSection() {
  const t = useTranslations("testimonials");

  return (
    <SectionShell id={SECTION_IDS.testimonials} spacing="lg" variant="muted">
      <SectionHeader
        badge={t("badge")}
        title={t("title")}
        description={t("description")}
        align="center"
      />

      <RevealGroup className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-3">
        {TESTIMONIAL_KEYS.map((key) => (
          <RevealItem key={key}>
            {key === featuredTestimonial ? (
              <GlowBorder intensity="subtle">
                <TestimonialCard testimonialKey={key} />
              </GlowBorder>
            ) : (
              <TestimonialCard testimonialKey={key} />
            )}
          </RevealItem>
        ))}
      </RevealGroup>
    </SectionShell>
  );
}

function TestimonialCard({
  testimonialKey,
}: {
  testimonialKey: (typeof TESTIMONIAL_KEYS)[number];
}) {
  const t = useTranslations("testimonials");

  return (
    <Card variant="glass" padding="md" className="h-full">
      <CardHeader>
        <Quote className="text-brand-primary/40 size-8" aria-hidden />
      </CardHeader>
      <CardContent className="space-y-6">
        <blockquote className="text-logos-text text-sm leading-relaxed sm:text-base">
          &ldquo;{t(`items.${testimonialKey}.quote`)}&rdquo;
        </blockquote>
        <footer>
          <p className="logos-font-heading text-logos-text font-semibold">
            {t(`items.${testimonialKey}.author`)}
          </p>
          <CardDescription>
            {t(`items.${testimonialKey}.role`)} ·{" "}
            {t(`items.${testimonialKey}.company`)}
          </CardDescription>
        </footer>
      </CardContent>
    </Card>
  );
}
