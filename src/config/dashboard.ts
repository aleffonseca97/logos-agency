import { getActiveNavModules } from "@/config/modules";
import type { LucideIcon } from "lucide-react";
import { UserCircle } from "lucide-react";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: boolean;
};

/** Nav da sidebar — derivada do registry (apenas módulos ativos com nav: true). */
export const dashboardNav: DashboardNavItem[] = [
  ...getActiveNavModules().map((m) => ({
    label: m.label,
    href: m.href,
    icon: m.icon,
    badge: m.id === "leads",
  })),
  {
    label: "Perfil",
    href: "/dashboard/perfil",
    icon: UserCircle,
  },
];

export const LEAD_EXPORT_COLUMNS = [
  { key: "name" as const, label: "Nome" },
  { key: "company" as const, label: "Empresa" },
  { key: "email" as const, label: "Email" },
  { key: "phone" as const, label: "Telefone" },
  { key: "project_type" as const, label: "Projeto" },
  { key: "budget" as const, label: "Orçamento" },
  { key: "status" as const, label: "Status" },
  { key: "created_at" as const, label: "Data" },
];
