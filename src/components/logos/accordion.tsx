"use client";

import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { cnVariants } from "./lib/cn-variants";
import {
  Accordion as AccordionPrimitive,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { accordionVariants } from "./variants/accordion";

function Accordion({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive> &
  VariantProps<typeof accordionVariants>) {
  return (
    <AccordionPrimitive
      data-slot="logos-accordion"
      className={cnVariants(accordionVariants, { variant }, className)}
      {...props}
    />
  );
}

function LogosAccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionItem>) {
  return (
    <AccordionItem
      data-slot="logos-accordion-item"
      className={cn("px-4", className)}
      {...props}
    />
  );
}

function LogosAccordionTrigger({
  className,
  ...props
}: React.ComponentProps<typeof AccordionTrigger>) {
  return (
    <AccordionTrigger
      data-slot="logos-accordion-trigger"
      className={cn("logos-font-heading py-4 text-base", className)}
      {...props}
    />
  );
}

function LogosAccordionContent({
  className,
  ...props
}: React.ComponentProps<typeof AccordionContent>) {
  return (
    <AccordionContent
      data-slot="logos-accordion-content"
      className={cn("text-logos-text-muted", className)}
      {...props}
    />
  );
}

export {
  Accordion,
  LogosAccordionContent as AccordionContent,
  LogosAccordionItem as AccordionItem,
  LogosAccordionTrigger as AccordionTrigger,
  accordionVariants,
};
