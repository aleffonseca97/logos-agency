import { cva } from "class-variance-authority";

import { glassSurfaceClasses } from "./glass";

export const drawerContentVariants = cva("", {
  variants: {
    variant: {
      default: "bg-popover",
      glass: glassSurfaceClasses,
    },
  },
  defaultVariants: {
    variant: "default",
  },
});
