import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { LEAD_STATUS } from "@/types/lead";

export type DashboardMetrics = {
  totalLeads: number;
  newLeads: number;
  closedProjects: number;
  conversionRate: number;
  estimatedRevenue: number;
  recentLeads: Array<{
    id: string;
    name: string;
    company: string;
    created_at: string;
    status: string;
  }>;
  leadsByMonth: Array<{ month: string; count: number }>;
  conversionsByStatus: Array<{ status: string; count: number }>;
  leadsBySource: Array<{ source: string; count: number }>;
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const db = getDb();
  const rows = await db
    .select({
      id: leads.id,
      name: leads.name,
      company: leads.company,
      status: leads.status,
      source: leads.source,
      createdAt: leads.createdAt,
      estimatedValue: leads.estimatedValue,
      budget: leads.budget,
    })
    .from(leads);

  const all = rows.map((r) => ({
    id: r.id,
    name: r.name,
    company: r.company,
    status: r.status,
    source: r.source,
    created_at: r.createdAt.toISOString(),
    estimated_value: r.estimatedValue ? Number(r.estimatedValue) : null,
    budget: r.budget,
  }));

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const newLeads = all.filter(
    (l) => new Date(l.created_at) >= thirtyDaysAgo && l.status === LEAD_STATUS.NOVO,
  ).length;

  const closed = all.filter((l) => l.status === LEAD_STATUS.FECHADO).length;
  const total = all.length;
  const conversionRate = total > 0 ? Math.round((closed / total) * 100) : 0;

  const estimatedRevenue = all
    .filter(
      (l) =>
        l.status === LEAD_STATUS.FECHADO || l.status === LEAD_STATUS.NEGOCIACAO,
    )
    .reduce((sum, l) => sum + (l.estimated_value ?? parseBudget(l.budget)), 0);

  const monthMap = new Map<string, number>();
  all.forEach((l) => {
    const key = l.created_at.slice(0, 7);
    monthMap.set(key, (monthMap.get(key) ?? 0) + 1);
  });

  const leadsByMonth = [...monthMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, count]) => ({
      month: formatMonth(month),
      count,
    }));

  const statusMap = new Map<string, number>();
  all.forEach((l) => {
    statusMap.set(l.status, (statusMap.get(l.status) ?? 0) + 1);
  });

  const conversionsByStatus = [...statusMap.entries()].map(([status, count]) => ({
    status,
    count,
  }));

  const sourceMap = new Map<string, number>();
  all.forEach((l) => {
    sourceMap.set(l.source, (sourceMap.get(l.source) ?? 0) + 1);
  });

  const leadsBySource = [...sourceMap.entries()].map(([source, count]) => ({
    source,
    count,
  }));

  const recentLeads = [...all]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 5)
    .map((l) => ({
      id: l.id,
      name: l.name,
      company: l.company,
      created_at: l.created_at,
      status: l.status,
    }));

  return {
    totalLeads: total,
    newLeads,
    closedProjects: closed,
    conversionRate,
    estimatedRevenue,
    recentLeads,
    leadsByMonth,
    conversionsByStatus,
    leadsBySource,
  };
}

function formatMonth(ym: string): string {
  const [year, month] = ym.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
}

function parseBudget(budget: string): number {
  if (budget.includes("Acima") || budget.includes("20.000")) return 25000;
  if (budget.includes("10.000")) return 15000;
  if (budget.includes("5.000–10.000") || budget.includes("5.000-10.000")) return 7500;
  if (budget.includes("Até")) return 5000;
  return 0;
}
