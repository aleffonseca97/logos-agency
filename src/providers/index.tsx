"use client";

import type { ReactNode } from "react";

import { ToastProvider } from "@/components/logos/toast";

import { QueryProvider } from "./query-provider";
import { MotionProvider } from "./motion-provider";
import { ThemeProvider } from "./theme-provider";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <MotionProvider>
          <ToastProvider>{children}</ToastProvider>
        </MotionProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

export { MotionProvider } from "./motion-provider";
export { QueryProvider } from "./query-provider";
export { ThemeProvider } from "./theme-provider";
