"use client";

import Link from "next/link";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { MetricCard } from "@/components/dashboard/shared/metric-card";
import { CardGridSkeleton } from "@/components/dashboard/shared/skeletons";
import { useDashboardMetrics } from "@/hooks/use-dashboard-query";
import { formatCurrency, formatDate } from "@/utils/export";
import { Badge } from "@/components/logos/badge";

const CHART_COLORS = [
  "#2563eb",
  "#4f46e5",
  "#1d4ed8",
  "#6366f1",
  "#3b82f6",
  "#818cf8",
  "#93c5fd",
];

export function DashboardHome() {
  const { data, isLoading } = useDashboardMetrics();

  if (isLoading) return <CardGridSkeleton count={5} />;

  const metrics = data ?? {
    totalLeads: 0,
    newLeads: 0,
    closedProjects: 0,
    conversionRate: 0,
    estimatedRevenue: 0,
    recentLeads: [],
    leadsByMonth: [],
    conversionsByStatus: [],
    leadsBySource: [],
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard label="Total de Leads" value={metrics.totalLeads} />
        <MetricCard label="Novos Leads" value={metrics.newLeads} change="Últimos 30 dias" />
        <MetricCard label="Projetos Fechados" value={metrics.closedProjects} />
        <MetricCard label="Taxa de Conversão" value={`${metrics.conversionRate}%`} />
        <MetricCard
          label="Receita Estimada"
          value={formatCurrency(metrics.estimatedRevenue)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Leads por mês">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={metrics.leadsByMonth}>
              <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "1px solid rgba(248,250,252,0.1)",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Conversões por status">
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={metrics.conversionsByStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
              >
                {metrics.conversionsByStatus.map((entry: { status: string; count: number }, i: number) => (
                  <Cell key={entry.status} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "1px solid rgba(248,250,252,0.1)",
                  borderRadius: 8,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Origem dos leads" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={metrics.leadsBySource} layout="vertical">
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="source" width={80} tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  border: "1px solid rgba(248,250,252,0.1)",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="count" fill="#4f46e5" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="logos-glass rounded-xl p-6">
        <h2 className="text-logos-text mb-4 text-lg font-semibold">Últimos contatos</h2>
        {metrics.recentLeads.length === 0 ? (
          <p className="text-logos-text-muted text-sm">Nenhum lead ainda.</p>
        ) : (
          <div className="space-y-3">
            {metrics.recentLeads.map((lead: { id: string; name: string; company: string; status: string; created_at: string }) => (
              <Link
                key={lead.id}
                href={`/dashboard/leads/${lead.id}`}
                className="hover:bg-logos-surface/50 flex items-center justify-between rounded-lg px-3 py-3 transition-colors"
              >
                <div>
                  <p className="text-logos-text text-sm font-medium">{lead.name}</p>
                  <p className="text-logos-text-muted text-xs">{lead.company}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="primary">{lead.status}</Badge>
                  <span className="text-logos-text-muted text-xs">{formatDate(lead.created_at)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ChartCard({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`logos-glass rounded-xl p-6 ${className ?? ""}`}>
      <h2 className="text-logos-text mb-4 text-sm font-semibold">{title}</h2>
      {children}
    </div>
  );
}
