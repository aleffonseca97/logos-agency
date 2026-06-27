"use client";

import { useQuery } from "@tanstack/react-query";
import { UserCircle } from "lucide-react";

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { TableSkeleton } from "@/components/dashboard/shared/skeletons";
import { formatDate } from "@/utils/export";

export function ClientsPage() {
  const { data: clients = [], isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/clients");
      if (!res.ok) return [];
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Leads convertidos e histórico de relacionamento."
      />

      {isLoading ? (
        <TableSkeleton />
      ) : clients.length === 0 ? (
        <EmptyState
          icon={UserCircle}
          title="Nenhum cliente ainda"
          description="Converta leads fechados em clientes para acompanhar projetos e histórico."
        />
      ) : (
        <div className="logos-glass overflow-x-auto rounded-xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-logos-border text-logos-text-muted border-b">
                {["Nome", "Empresa", "Email", "Telefone", "Desde"].map((h) => (
                  <th key={h} className="px-4 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((c: { id: string; name: string; company: string; email: string; phone: string | null; created_at: string }) => (
                <tr key={c.id} className="border-logos-border hover:bg-logos-surface/40 border-b last:border-0">
                  <td className="text-logos-text px-4 py-3 font-medium">{c.name}</td>
                  <td className="text-logos-text-muted px-4 py-3">{c.company}</td>
                  <td className="text-logos-text-muted px-4 py-3">{c.email}</td>
                  <td className="text-logos-text-muted px-4 py-3">{c.phone ?? "—"}</td>
                  <td className="text-logos-text-muted px-4 py-3">{formatDate(c.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
