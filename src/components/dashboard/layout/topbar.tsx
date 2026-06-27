"use client";

import { useTheme } from "next-themes";
import { Bell, Menu, Moon, Sun } from "lucide-react";

import { GlobalSearch } from "@/components/dashboard/search/global-search";
import { Button } from "@/components/logos/button";
import { useNotifications } from "@/hooks/use-dashboard-query";
import { cn } from "@/lib/utils";

type TopbarProps = {
  onMenuClick: () => void;
};

export function DashboardTopbar({ onMenuClick }: TopbarProps) {
  const { theme, setTheme } = useTheme();
  const { unreadCount, notifications, markRead, markAllRead } =
    useNotifications();

  return (
    <header className="border-logos-border bg-logos-bg/60 sticky top-0 z-30 flex h-16 items-center gap-4 border-b px-4 backdrop-blur-xl sm:px-6">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Abrir menu"
      >
        <Menu className="size-5" aria-hidden />
      </Button>

      <div className="flex flex-1 items-center gap-4">
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Alternar tema"
        >
          {theme === "dark" ? (
            <Sun className="size-4" aria-hidden />
          ) : (
            <Moon className="size-4" aria-hidden />
          )}
        </Button>

        <div className="group relative">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Notificações${unreadCount ? `, ${unreadCount} não lidas` : ""}`}
          >
            <Bell className="size-4" aria-hidden />
            {unreadCount > 0 && (
              <span className="bg-brand-primary absolute top-1 right-1 size-2 rounded-full" />
            )}
          </Button>

          <div className="logos-glass pointer-events-none absolute top-full right-0 mt-2 w-80 origin-top-right scale-95 rounded-xl opacity-0 shadow-lg transition-all group-focus-within:pointer-events-auto group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100">
            <div className="border-logos-border flex items-center justify-between border-b px-4 py-3">
              <p className="text-logos-text text-sm font-semibold">Notificações</p>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllRead()}
                  className="text-brand-primary text-xs hover:underline"
                >
                  Marcar todas
                </button>
              )}
            </div>
            <div className="max-h-72 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-logos-text-muted p-4 text-center text-sm">
                  Nenhuma notificação
                </p>
              ) : (
                notifications.slice(0, 8).map((n: { id: string; title: string; message: string; read: boolean }) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => markRead(n.id)}
                    className={cn(
                      "border-logos-border hover:bg-logos-surface/50 w-full border-b px-4 py-3 text-left transition-colors last:border-0",
                      !n.read && "bg-brand-primary/5",
                    )}
                  >
                    <p className="text-logos-text text-sm font-medium">{n.title}</p>
                    <p className="text-logos-text-muted mt-0.5 text-xs line-clamp-2">
                      {n.message}
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
