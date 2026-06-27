"use client";

import Link from "next/link";
import { useState } from "react";
import { Download, Search, Users } from "lucide-react";

import { LeadPipeline } from "@/components/dashboard/leads/lead-pipeline";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { PageHeader } from "@/components/dashboard/shared/page-header";
import { TableSkeleton } from "@/components/dashboard/shared/skeletons";
import { Button } from "@/components/logos/button";
import { Badge } from "@/components/logos/badge";
import { Input } from "@/components/logos/input";
import { useLeads } from "@/hooks/use-dashboard-query";
import { LEAD_PIPELINE } from "@/types/lead";
import { LEAD_EXPORT_COLUMNS } from "@/config/dashboard";
import { exportToCsv, exportToExcel, formatDate } from "@/utils/export";

export function LeadsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [view, setView] = useState<"table" | "pipeline">("table");
  const pageSize = 10;

  const { data, isLoading } = useLeads({
    page: view === "pipeline" ? 1 : page,
    pageSize: view === "pipeline" ? 200 : pageSize,
    search,
    status,
    sortOrder: "desc",
  });

  const leads = data?.data ?? [];

  const handleExport = (type: "csv" | "excel") => {
    const fn = type === "csv" ? exportToCsv : exportToExcel;
    fn(leads, LEAD_EXPORT_COLUMNS, `leads-${new Date().toISOString().slice(0, 10)}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leads"
        description="Gerencie e acompanhe todos os contatos do site."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport("csv")}>
              <Download className="size-4" aria-hidden />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport("excel")}>
              <Download className="size-4" aria-hidden />
              Excel
            </Button>
            <Button
              variant={view === "table" ? "primary" : "outline"}
              size="sm"
              onClick={() => setView("table")}
            >
              Tabela
            </Button>
            <Button
              variant={view === "pipeline" ? "primary" : "outline"}
              size="sm"
              onClick={() => setView("pipeline")}
            >
              Pipeline
            </Button>
          </div>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="text-logos-text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" aria-hidden />
          <Input
            placeholder="Pesquisar leads..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
            inputSize="md"
          />
        </div>
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="border-logos-border bg-logos-surface text-logos-text h-10 rounded-lg border px-3 text-sm"
          aria-label="Filtrar por status"
        >
          <option value="">Todos os status</option>
          {LEAD_PIPELINE.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : leads.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum lead encontrado"
          description="Os leads capturados pelo formulário do site aparecerão aqui."
        />
      ) : view === "pipeline" ? (
        <LeadPipeline leads={leads} />
      ) : (
        <>
          <div className="logos-glass overflow-x-auto rounded-xl">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead>
                <tr className="border-logos-border text-logos-text-muted border-b">
                  {["Nome", "Empresa", "Email", "Telefone", "Projeto", "Orçamento", "Data", "Status", "Responsável"].map((h) => (
                    <th key={h} className="px-4 py-3 font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead: {
                  id: string;
                  name: string;
                  company: string;
                  email: string;
                  phone: string;
                  project_type: string;
                  budget: string;
                  created_at: string;
                  status: string;
                  assignee?: { full_name: string | null } | null;
                }) => (
                  <tr
                    key={lead.id}
                    className="border-logos-border hover:bg-logos-surface/40 border-b transition-colors last:border-0"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/leads/${lead.id}`}
                        className="text-brand-primary font-medium hover:underline"
                      >
                        {lead.name}
                      </Link>
                    </td>
                    <td className="text-logos-text-muted px-4 py-3">{lead.company}</td>
                    <td className="text-logos-text-muted px-4 py-3">{lead.email}</td>
                    <td className="text-logos-text-muted px-4 py-3">{lead.phone}</td>
                    <td className="text-logos-text-muted px-4 py-3">{lead.project_type}</td>
                    <td className="text-logos-text-muted px-4 py-3">{lead.budget}</td>
                    <td className="text-logos-text-muted px-4 py-3">{formatDate(lead.created_at)}</td>
                    <td className="px-4 py-3">
                      <Badge variant="primary">{lead.status}</Badge>
                    </td>
                    <td className="text-logos-text-muted px-4 py-3">
                      {lead.assignee?.full_name ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-logos-text-muted text-sm">
                {data.total} leads · Página {data.page} de {data.totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= data.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
