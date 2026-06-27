"use client";

import { type VariantProps } from "class-variance-authority";

import { cnVariants } from "./lib/cn-variants";
import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { tooltipContentVariants } from "./variants/tooltip";

function Tooltip({ ...props }: React.ComponentProps<typeof TooltipPrimitive>) {
  return <TooltipPrimitive data-slot="logos-tooltip" {...props} />;
}

function LogosTooltipContent({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof TooltipContent> &
  VariantProps<typeof tooltipContentVariants>) {
  return (
    <TooltipContent
      data-slot="logos-tooltip-content"
      className={cnVariants(tooltipContentVariants, { variant }, className)}
      {...props}
    />
  );
}

export {
  Tooltip,
  LogosTooltipContent as TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  tooltipContentVariants,
};
