import { cva } from "class-variance-authority";

export const tabsRootVariants = cva("", {
  variants: {
    layout: {
      default: "",
      full: "w-full",
    },
  },
  defaultVariants: {
    layout: "default",
  },
});

export const logosTabsListVariants = cva("", {
  variants: {
    appearance: {
      default: "",
      pills: "bg-brand-surface",
      underline: "w-full justify-start",
    },
  },
  defaultVariants: {
    appearance: "default",
  },
});
