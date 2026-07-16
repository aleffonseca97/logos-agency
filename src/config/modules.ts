import {
  BarChart3,
  Briefcase,
  Calendar,
  FileText,
  FolderKanban,
  LayoutDashboard,
  MessageSquareQuote,
  Newspaper,
  Settings,
  Users,
  UserCircle,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

/**
 * Registro central dos módulos da plataforma LOGOS Agency.
 * status: "active" → rota/UI existentes | "planned" → reservado para expansão
 */
export type ModuleStatus = "active" | "planned";

export type PlatformModule = {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  status: ModuleStatus;
  /** Incluir na sidebar principal */
  nav: boolean;
  /** Incluir nos atalhos rápidos da Home */
  shortcut: boolean;
};

export const platformModules: PlatformModule[] = [
  {
    id: "overview",
    label: "Dashboard",
    description: "Visão geral da operação",
    href: "/dashboard",
    icon: LayoutDashboard,
    status: "active",
    nav: true,
    shortcut: false,
  },
  {
    id: "leads",
    label: "Leads",
    description: "Pipeline e contatos comerciais",
    href: "/dashboard/leads",
    icon: Users,
    status: "active",
    nav: true,
    shortcut: true,
  },
  {
    id: "agenda",
    label: "Agenda",
    description: "Reuniões e compromissos",
    href: "/dashboard/agenda",
    icon: Calendar,
    status: "active",
    nav: true,
    shortcut: true,
  },
  {
    id: "projects",
    label: "Projetos",
    description: "Entregas e status de projetos",
    href: "/dashboard/projetos",
    icon: FolderKanban,
    status: "active",
    nav: true,
    shortcut: true,
  },
  {
    id: "clients",
    label: "Clientes",
    description: "Base de clientes ativos",
    href: "/dashboard/clientes",
    icon: UserCircle,
    status: "active",
    nav: true,
    shortcut: true,
  },
  {
    id: "proposals",
    label: "Propostas",
    description: "Orçamentos e propostas comerciais",
    href: "/dashboard/propostas",
    icon: FileText,
    status: "active",
    nav: true,
    shortcut: true,
  },
  {
    id: "portfolio",
    label: "Portfólio",
    description: "Cases e trabalhos publicados",
    href: "/dashboard/portfolio",
    icon: Briefcase,
    status: "planned",
    nav: false,
    shortcut: true,
  },
  {
    id: "testimonials",
    label: "Depoimentos",
    description: "Reviews e prova social",
    href: "/dashboard/depoimentos",
    icon: MessageSquareQuote,
    status: "planned",
    nav: false,
    shortcut: true,
  },
  {
    id: "team",
    label: "Equipe",
    description: "Membros e permissões",
    href: "/dashboard/equipe",
    icon: UsersRound,
    status: "planned",
    nav: false,
    shortcut: true,
  },
  {
    id: "blog",
    label: "Blog",
    description: "Conteúdo e publicações",
    href: "/dashboard/blog",
    icon: Newspaper,
    status: "planned",
    nav: false,
    shortcut: true,
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Métricas e performance",
    href: "/dashboard/analytics",
    icon: BarChart3,
    status: "planned",
    nav: false,
    shortcut: true,
  },
  {
    id: "settings",
    label: "Configurações",
    description: "Preferências da organização",
    href: "/dashboard/configuracoes",
    icon: Settings,
    status: "active",
    nav: true,
    shortcut: true,
  },
];

export function getActiveNavModules() {
  return platformModules.filter((m) => m.nav && m.status === "active");
}

export function getShortcutModules() {
  return platformModules.filter((m) => m.shortcut);
}

export function getModuleById(id: string) {
  return platformModules.find((m) => m.id === id);
}
