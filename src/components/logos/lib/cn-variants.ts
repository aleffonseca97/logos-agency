import type { ClassValue } from "clsx";

import { cn } from "@/lib/utils";

type VariantFn = (props?: Record<string, unknown>) => string;

/**
 * Aplica variantes CVA corretamente — className nunca deve ir dentro do objeto de variantes.
 */
export function cnVariants(
  variantsFn: VariantFn,
  props: Record<string, unknown> | undefined,
  className?: ClassValue,
): string {
  return cn(variantsFn(props), className);
}
