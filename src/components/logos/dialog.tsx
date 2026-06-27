"use client";

import { type VariantProps } from "class-variance-authority";

import { cnVariants } from "./lib/cn-variants";
import {
  Dialog as DialogPrimitive,
  DialogClose,
  DialogContent as DialogContentPrimitive,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { modalContentVariants } from "./variants/modal";

type DialogContentVariantProps = VariantProps<typeof modalContentVariants>;

function Dialog({ ...props }: React.ComponentProps<typeof DialogPrimitive>) {
  return <DialogPrimitive data-slot="logos-dialog" {...props} />;
}

function DialogContent({
  className,
  size,
  variant,
  ...props
}: React.ComponentProps<typeof DialogContentPrimitive> &
  DialogContentVariantProps) {
  return (
    <DialogContentPrimitive
      data-slot="logos-dialog-content"
      className={cnVariants(modalContentVariants, { size, variant }, className)}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  modalContentVariants,
};
