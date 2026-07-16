"use client";

import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";

import { getShortcutModules } from "@/config/modules";
import { cn } from "@/lib/utils";

export function QuickActions() {
  const modules = getShortcutModules();

  return (
    <section className="logos-glass rounded-xl">
      <div className="border-logos-border border-b px-5 py-4">
        <h2 className="text-logos-text text-sm font-semibold tracking-tight">
          Atalhos rápidos
        </h2>
        <p className="text-logos-text-muted mt-0.5 text-xs">
          Módulos ativos e próximos da plataforma
        </p>
      </div>

      <div className="grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modules.map((mod) => {
          const Icon = mod.icon;
          const isPlanned = mod.status === "planned";

          if (isPlanned) {
            return (
              <div
                key={mod.id}
                className="border-logos-border/60 bg-logos-surface/20 flex items-start gap-3 rounded-lg border border-dashed px-3 py-3 opacity-70"
                title="Em breve"
              >
                <div className="bg-logos-surface text-logos-text-muted flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <Icon className="size-4" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-logos-text truncate text-sm font-medium">
                      {mod.label}
                    </p>
                    <Lock
                      className="text-logos-text-muted size-3 shrink-0"
                      aria-hidden
                    />
                  </div>
                  <p className="text-logos-text-muted mt-0.5 line-clamp-1 text-xs">
                    Em breve
                  </p>
                </div>
              </div>
            );
          }

          return (
            <Link
              key={mod.id}
              href={mod.href}
              className={cn(
                "group border-logos-border/0 hover:border-brand-primary/20 hover:bg-logos-surface/50",
                "flex items-start gap-3 rounded-lg border px-3 py-3 transition-all",
              )}
            >
              <div className="bg-brand-primary/10 text-brand-primary flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors group-hover:bg-brand-primary/15">
                <Icon className="size-4" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1">
                  <p className="text-logos-text truncate text-sm font-medium">
                    {mod.label}
                  </p>
                  <ArrowUpRight
                    className="text-logos-text-muted size-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                    aria-hidden
                  />
                </div>
                <p className="text-logos-text-muted mt-0.5 line-clamp-1 text-xs">
                  {mod.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
