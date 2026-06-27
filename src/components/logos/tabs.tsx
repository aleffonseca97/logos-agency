"use client";

import { type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { cnVariants } from "./lib/cn-variants";
import {
  Tabs as TabsPrimitive,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { logosTabsListVariants, tabsRootVariants } from "./variants/tabs";

function Tabs({
  className,
  layout,
  ...props
}: React.ComponentProps<typeof TabsPrimitive> &
  VariantProps<typeof tabsRootVariants>) {
  return (
    <TabsPrimitive
      data-slot="logos-tabs"
      className={cnVariants(tabsRootVariants, { layout }, className)}
      {...props}
    />
  );
}

function LogosTabsList({
  className,
  appearance = "default",
  ...props
}: Omit<React.ComponentProps<typeof TabsList>, "variant"> &
  VariantProps<typeof logosTabsListVariants>) {
  const listVariant = appearance === "underline" ? "line" : "default";

  return (
    <TabsList
      data-slot="logos-tabs-list"
      variant={listVariant}
      className={cnVariants(logosTabsListVariants, { appearance }, className)}
      {...props}
    />
  );
}

function LogosTabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsTrigger>) {
  return (
    <TabsTrigger
      data-slot="logos-tabs-trigger"
      className={cn("logos-font-body", className)}
      {...props}
    />
  );
}

function LogosTabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsContent>) {
  return (
    <TabsContent
      data-slot="logos-tabs-content"
      className={cn("pt-4", className)}
      {...props}
    />
  );
}

export {
  Tabs,
  LogosTabsContent as TabsContent,
  LogosTabsList as TabsList,
  LogosTabsTrigger as TabsTrigger,
  logosTabsListVariants,
  tabsRootVariants,
};
