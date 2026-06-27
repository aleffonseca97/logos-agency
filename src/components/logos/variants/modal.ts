import { cva } from "class-variance-authority";

import { glassSurfaceClasses } from "./glass";

export const modalContentVariants = cva("", {
  variants: {
    size: {
      sm: "sm:max-w-sm",
      md: "sm:max-w-md",
      lg: "sm:max-w-lg",
      xl: "sm:max-w-xl",
      "2xl": "sm:max-w-2xl",
      full: "sm:max-w-[calc(100%-2rem)] lg:max-w-4xl",
    },
    variant: {
      default: "",
      glass: glassSurfaceClasses,
    },
  },
  defaultVariants: {
    size: "md",
    variant: "default",
  },
});
