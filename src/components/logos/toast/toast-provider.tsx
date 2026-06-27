"use client";

import { m, AnimatePresence, useReducedMotion } from "framer-motion";
import { AlertCircle, CheckCircle2, X } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
};

type ToastInput = Omit<ToastItem, "id">;

type ToastContextValue = {
  toast: (input: ToastInput) => void;
  dismiss: (id: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 5000;

function ToastIcon({ variant }: { variant: ToastVariant }) {
  if (variant === "success") {
    return <CheckCircle2 className="text-brand-primary size-5 shrink-0" aria-hidden />;
  }

  return <AlertCircle className="text-destructive size-5 shrink-0" aria-hidden />;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const reduceMotion = useReducedMotion();

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = crypto.randomUUID();
      setToasts((current) => [...current, { ...input, id }]);

      window.setTimeout(() => dismiss(id), AUTO_DISMISS_MS);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-relevant="additions"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((item) => (
            <m.div
              key={item.id}
              role="status"
              layout
              initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "logos-glass pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl p-4 shadow-logos-glow",
                item.variant === "error" && "ring-destructive/30 ring-1",
              )}
            >
              <ToastIcon variant={item.variant} />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="text-logos-text text-sm font-semibold">
                  {item.title}
                </p>
                {item.description && (
                  <p className="text-logos-text-muted text-sm leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                className="text-logos-text-muted hover:text-logos-text shrink-0 rounded-md p-1 transition-colors"
                aria-label="Fechar notificação"
              >
                <X className="size-4" aria-hidden />
              </button>
            </m.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast deve ser usado dentro de ToastProvider.");
  }

  return context;
}
