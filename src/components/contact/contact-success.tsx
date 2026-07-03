"use client";

import { m, useReducedMotion } from "framer-motion";
import { CheckCircle2, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { Button } from "@/components/logos/button";
import { CtaButton } from "@/components/logos/cta-button";
import { scrollToSection } from "@/lib/scroll-to-section";

type ContactSuccessProps = {
  whatsappNumber: string;
  onReset: () => void;
};

export function ContactSuccess({ whatsappNumber, onReset }: ContactSuccessProps) {
  const t = useTranslations("contact");
  const tBrand = useTranslations("branding");
  const reduceMotion = useReducedMotion();
  const MotionDiv = reduceMotion ? "div" : m.div;

  const handleBackToTop = () => {
    onReset();
    scrollToSection("main-content", { block: "start" });
  };

  const whatsappMessage = t("whatsappMessage", { brand: tBrand("name") });

  return (
    <MotionDiv
      className="mx-auto flex max-w-lg flex-col items-center gap-6 text-center"
      {...(!reduceMotion && {
        initial: { opacity: 0, y: 20, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      })}
    >
      <m.div
        className="logos-glass flex size-20 items-center justify-center rounded-full shadow-logos-glow"
        {...(!reduceMotion && {
          initial: { scale: 0.6, opacity: 0 },
          animate: { scale: 1, opacity: 1 },
          transition: { delay: 0.1, type: "spring", stiffness: 260, damping: 18 },
        })}
      >
        <CheckCircle2 className="text-brand-primary size-10" aria-hidden />
      </m.div>

      <div className="space-y-3">
        <h3 className="logos-text-display-sm text-logos-text text-balance">
          {t("success.title")}
        </h3>
        <p className="text-logos-text-muted text-base leading-relaxed">
          {t("success.description", { brand: tBrand("shortName") })}
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
          onClick={handleBackToTop}
        >
          {t("success.backToTop")}
        </Button>
        <CtaButton
          render={
            <a
              href={buildWhatsAppUrl(whatsappNumber, whatsappMessage)}
              target="_blank"
              rel="noopener noreferrer"
            />
          }
          size="lg"
          showArrow={false}
          className="w-full sm:w-auto"
        >
          <MessageCircle className="size-4" aria-hidden />
          {t("success.whatsapp")}
        </CtaButton>
      </div>
    </MotionDiv>
  );
}
