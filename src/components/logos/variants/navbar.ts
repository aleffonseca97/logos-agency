import { cva } from "class-variance-authority";

export const navbarVariants = cva("w-full", {
  variants: {
    variant: {
      default: "border-b border-logos-border bg-brand-background",
      transparent: "bg-transparent",
      glass: "logos-glass sticky top-0 z-50 border-b border-logos-border",
      sticky:
        "sticky top-0 z-50 border-b border-logos-border bg-brand-background/95 backdrop-blur-md",
      floating: [
        "sticky top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 lg:px-6 lg:pt-5",
        "[&_[data-slot=logos-navbar-inner]]:logos-navbar-pill",
        "[&_[data-slot=logos-navbar-inner]]:h-[3.25rem]",
        "[&_[data-slot=logos-navbar-inner]]:sm:h-[4.25rem]",
        "[&_[data-slot=logos-navbar-inner]]:px-3",
        "[&_[data-slot=logos-navbar-inner]]:sm:px-5",
        "[&_[data-slot=logos-navbar-inner]]:lg:px-8",
      ].join(" "),
    },
    size: {
      sm: "[&_[data-slot=logos-navbar-inner]]:h-14",
      md: "[&_[data-slot=logos-navbar-inner]]:h-16",
      lg: "[&_[data-slot=logos-navbar-inner]]:h-20",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});
