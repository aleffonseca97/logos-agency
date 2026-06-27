import {
  Calendar,
  FileText,
  FolderKanban,
  LayoutDashboard,
  Settings,
  UserCircle,
  Users,
  type LucideIcon,
} from "lucide-react";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: boolean;
};

export const dashboardNav: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Leads", href: "/dashboard/leads", icon: Users },
  { label: "Agenda", href: "/dashboard/agenda", icon: Calendar },
  { label: "Projetos", href: "/dashboard/projetos", icon: FolderKanban },
  { label: "Clientes", href: "/dashboard/clientes", icon: UserCircle },
  { label: "Propostas", href: "/dashboard/propostas", icon: FileText },
  { label: "Configurações", href: "/dashboard/configuracoes", icon: Settings },
  { label: "Perfil", href: "/dashboard/perfil", icon: UserCircle },
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
