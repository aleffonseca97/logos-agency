"use client";

import { type VariantProps } from "class-variance-authority";

import { cnVariants } from "./lib/cn-variants";
import {
  Drawer as DrawerPrimitive,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { drawerContentVariants } from "./variants/drawer";

function Drawer({ ...props }: React.ComponentProps<typeof DrawerPrimitive>) {
  return <DrawerPrimitive data-slot="logos-drawer" {...props} />;
}

function LogosDrawerContent({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof DrawerContent> &
  VariantProps<typeof drawerContentVariants>) {
  return (
    <DrawerContent
      data-slot="logos-drawer-content"
      className={cnVariants(drawerContentVariants, { variant }, className)}
      {...props}
    />
  );
}

export {
  Drawer,
  DrawerClose,
  LogosDrawerContent as DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerPortal,
  DrawerTitle,
  DrawerTrigger,
  drawerContentVariants,
};
