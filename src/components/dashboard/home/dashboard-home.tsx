"use client";

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

import { QuickActions } from "@/components/dashboard/home/quick-actions";
import { RecentActivity } from "@/components/dashboard/home/recent-activity";
import { StatsCards } from "@/components/dashboard/home/stats-cards";
import { useDashboardMetrics } from "@/hooks/use-dashboard-query";
import { cn } from "@/lib/utils";

const CHART_COLORS = [
  "#2563eb",
  "#4f46e5",
  "#1d4ed8",
  "#6366f1",
  "#3b82f6",
  "#818cf8",
  "#93c5fd",
];

const tooltipStyle = {
  background: "#111827",
  border: "1px solid rgba(248,250,252,0.1)",
  borderRadius: 8,
};

export function DashboardHome() {
  const { data, isLoading } = useDashboardMetrics();

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
      <StatsCards
        metrics={
          isLoading
            ? undefined
            : {
                totalLeads: metrics.totalLeads,
                newLeads: metrics.newLeads,
                closedProjects: metrics.closedProjects,
                conversionRate: metrics.conversionRate,
                estimatedRevenue: metrics.estimatedRevenue,
              }
        }
        isLoading={isLoading}
      />

      <div className="grid gap-6 xl:grid-cols-5">
        <div className="xl:col-span-3">
          <RecentActivity leads={metrics.recentLeads} isLoading={isLoading} />
        </div>
        <div className="xl:col-span-2">
          <ChartCard title="Conversões por status" className="h-full">
            {isLoading ? (
              <div className="bg-logos-surface/40 h-[240px] animate-pulse rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={metrics.conversionsByStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={88}
                    paddingAngle={2}
                  >
                    {metrics.conversionsByStatus.map(
                      (entry: { status: string; count: number }, i: number) => (
                        <Cell
                          key={entry.status}
                          fill={CHART_COLORS[i % CHART_COLORS.length]}
                        />
                      ),
                    )}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      </div>

      <QuickActions />

      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard title="Leads por mês">
          {isLoading ? (
            <div className="bg-logos-surface/40 h-[240px] animate-pulse rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={metrics.leadsByMonth}>
                <XAxis
                  dataKey="month"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Origem dos leads">
          {isLoading ? (
            <div className="bg-logos-surface/40 h-[240px] animate-pulse rounded-lg" />
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={metrics.leadsBySource} layout="vertical">
                <XAxis
                  type="number"
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="source"
                  width={80}
                  tick={{ fill: "#94a3b8", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" fill="#4f46e5" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
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
    <div className={cn("logos-glass rounded-xl p-5 sm:p-6", className)}>
      <h2 className="text-logos-text mb-4 text-sm font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </div>
  );
}
