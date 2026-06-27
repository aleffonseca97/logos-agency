"use client";

import { forwardRef } from "react";

import { CONTACT_SECTION_ID } from "@/config/contact";
import { CtaButton, type CtaButtonProps } from "@/components/logos/cta-button";
import { scrollToSection } from "@/lib/scroll-to-section";

export type ContactScrollButtonProps = Omit<CtaButtonProps, "render">;

export const ContactScrollButton = forwardRef<
  HTMLButtonElement,
  ContactScrollButtonProps
>(function ContactScrollButton({ onClick, ...props }, ref) {
  const handleClick: ContactScrollButtonProps["onClick"] = (event) => {
    event.preventDefault();
    scrollToSection(CONTACT_SECTION_ID);
    onClick?.(event);
  };

  return (
    <CtaButton
      ref={ref}
      type="button"
      onClick={handleClick}
      {...props}
    />
  );
});
