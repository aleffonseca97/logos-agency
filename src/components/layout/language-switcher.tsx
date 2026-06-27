"use client";

import { ChevronDown } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState, useTransition } from "react";

import {
  locales,
  localeLabels,
  type Locale,
} from "@/i18n/config";
import { usePathname, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("languageSwitcher");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleSelect = (nextLocale: Locale) => {
    if (nextLocale === locale) {
      setOpen(false);
      return;
    }

    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("current", { language: localeLabels[locale].label })}
        disabled={isPending}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "logos-font-body text-logos-text-muted hover:text-logos-text hover:bg-logos-surface/60",
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-medium transition-colors",
          "focus-visible:ring-brand-primary/40 focus-visible:ring-2 focus-visible:outline-none",
          isPending && "cursor-wait opacity-60",
        )}
      >
        <span aria-hidden className="text-base leading-none">
          {localeLabels[locale].flag}
        </span>
        <span className="hidden sm:inline">{localeLabels[locale].label}</span>
        <ChevronDown
          className={cn(
            "size-3.5 shrink-0 transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={t("selectLanguage")}
          className="logos-glass border-logos-border absolute top-full right-0 z-50 mt-2 min-w-[11rem] overflow-hidden rounded-xl border py-1 shadow-lg"
        >
          {locales.map((item) => {
            const isActive = item === locale;

            return (
              <li key={item} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleSelect(item)}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm transition-colors",
                    isActive
                      ? "bg-brand-primary/10 text-logos-text font-medium"
                      : "text-logos-text-muted hover:bg-logos-surface/60 hover:text-logos-text",
                  )}
                >
                  <span aria-hidden className="text-base leading-none">
                    {localeLabels[item].flag}
                  </span>
                  <span>{localeLabels[item].label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
