import { cva } from "class-variance-authority";

export const accordionVariants = cva("w-full", {
  variants: {
    variant: {
      default: "",
      bordered:
        "divide-y divide-logos-border rounded-xl border border-logos-border",
      ghost: "gap-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
