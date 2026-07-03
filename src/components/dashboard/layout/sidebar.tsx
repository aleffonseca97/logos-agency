"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { m } from "framer-motion";
import { ChevronLeft, LogOut, Sparkles } from "lucide-react";

import { dashboardNav } from "@/config/dashboard";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/hooks/use-dashboard-query";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export function DashboardSidebar({
  collapsed,
  onToggle,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount } = useNotifications();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
  };

  const content = (
    <aside
      className={cn(
        "border-logos-border bg-logos-bg/80 flex h-full flex-col border-r backdrop-blur-xl",
        collapsed ? "w-[72px]" : "w-64",
      )}
    >
      <div className="border-logos-border flex h-16 items-center gap-2 border-b px-4">
        <div className="bg-brand-primary/15 flex size-9 shrink-0 items-center justify-center rounded-lg">
          <Sparkles className="text-brand-primary size-4" aria-hidden />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-logos-text truncate text-sm font-semibold">
              LOGOS CRM
            </p>
            <p className="text-logos-text-muted truncate text-xs">Framework</p>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="CRM">
        {dashboardNav.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;
          const showBadge = item.label === "Leads" && unreadCount > 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-brand-primary/15 text-brand-primary shadow-logos-glow"
                  : "text-logos-text-muted hover:bg-logos-surface hover:text-logos-text",
              )}
            >
              <Icon className="size-4 shrink-0" aria-hidden />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {showBadge && (
                <span className="bg-brand-primary text-brand-white ml-auto flex size-5 items-center justify-center rounded-full text-[10px] font-bold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="border-logos-border border-t p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="text-logos-text-muted hover:bg-logos-surface hover:text-logos-text flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
        >
          <LogOut className="size-4 shrink-0" aria-hidden />
          {!collapsed && "Sair"}
        </button>
      </div>
    </aside>
  );

  return (
    <>
      {mobileOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onMobileClose}
          aria-hidden
        />
      )}

      <m.div
        className={cn(
          "fixed inset-y-0 left-0 z-50 lg:static lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {content}
        <button
          type="button"
          onClick={onToggle}
          className="text-logos-text-muted hover:text-logos-text absolute top-4 -right-3 hidden size-6 items-center justify-center rounded-full border border-logos-border bg-logos-surface lg:flex"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          <ChevronLeft
            className={cn("size-3 transition-transform", collapsed && "rotate-180")}
            aria-hidden
          />
        </button>
      </m.div>
    </>
  );
}
