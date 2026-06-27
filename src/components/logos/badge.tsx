import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { type VariantProps } from "class-variance-authority";

import { cnVariants } from "./lib/cn-variants";
import { logosBadgeVariants } from "./variants/badge";

export type BadgeProps = useRender.ComponentProps<"span"> &
  VariantProps<typeof logosBadgeVariants>;

function Badge({
  className,
  variant = "primary",
  size = "md",
  render,
  ...props
}: BadgeProps) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cnVariants(logosBadgeVariants, { variant, size }, className),
      },
      props,
    ),
    render,
    state: {
      slot: "logos-badge",
      variant,
    },
  });
}

export { Badge, logosBadgeVariants };
