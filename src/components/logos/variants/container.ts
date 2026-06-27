import { cva } from "class-variance-authority";

export const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      sm: "logos-container-sm",
      md: "logos-container-md",
      lg: "logos-container-lg",
      xl: "logos-container-xl",
      "2xl": "logos-container",
      full: "max-w-full px-4 sm:px-6 lg:px-8",
    },
    padding: {
      none: "px-0",
      default: "",
    },
  },
  defaultVariants: {
    size: "2xl",
    padding: "default",
  },
});
