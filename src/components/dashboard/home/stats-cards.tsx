"use client";

import {
  FolderKanban,
  Percent,
  TrendingUp,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react";

import { MetricCard } from "@/components/dashboard/shared/metric-card";
import { CardGridSkeleton } from "@/components/dashboard/shared/skeletons";
import { formatCurrency } from "@/utils/export";

export type StatsMetrics = {
  totalLeads: number;
  newLeads: number;
  closedProjects: number;
  conversionRate: number;
  estimatedRevenue: number;
};

type StatsCardsProps = {
  metrics: StatsMetrics | undefined;
  isLoading?: boolean;
};

const STATS: Array<{
  key: keyof StatsMetrics;
  label: string;
  icon: LucideIcon;
  format?: (v: number) => string | number;
  change?: string;
}> = [
  {
    key: "totalLeads",
    label: "Total de Leads",
    icon: Users,
  },
  {
    key: "newLeads",
    label: "Novos Leads",
    icon: UserPlus,
    change: "Últimos 30 dias",
  },
  {
    key: "closedProjects",
    label: "Projetos Fechados",
    icon: FolderKanban,
  },
  {
    key: "conversionRate",
    label: "Taxa de Conversão",
    icon: Percent,
    format: (v) => `${v}%`,
  },
  {
    key: "estimatedRevenue",
    label: "Receita Estimada",
    icon: TrendingUp,
    format: (v) => formatCurrency(v),
  },
];

export function StatsCards({ metrics, isLoading }: StatsCardsProps) {
  if (isLoading || !metrics) {
    return <CardGridSkeleton count={5} />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {STATS.map((stat) => {
        const raw = metrics[stat.key];
        const value = stat.format ? stat.format(raw) : raw;
        return (
          <MetricCard
            key={stat.key}
            label={stat.label}
            value={value}
            change={stat.change}
            icon={stat.icon}
          />
        );
      })}
    </div>
  );
}
