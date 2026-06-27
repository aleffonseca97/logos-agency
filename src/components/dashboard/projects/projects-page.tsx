"use client";

import { useQuery } from "@tanstack/react-query";
import { FolderKanban } from "lucide-react";

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { Badge } from "@/components/logos/badge";
import { formatCurrency } from "@/utils/export";

export function ProjectsPage() {
  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/projects");
      if (!res.ok) return [];
      return res.json();
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Projetos" description="Acompanhe todos os projetos em andamento." />

      {projects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="Nenhum projeto"
          description="Projetos serão exibidos aqui quando vinculados a clientes."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p: { id: string; name: string; status: string; budget: number | null }) => (
            <div key={p.id} className="logos-glass rounded-xl p-5">
              <div className="flex items-center justify-between">
                <h3 className="text-logos-text font-semibold">{p.name}</h3>
                <Badge variant="primary">{p.status}</Badge>
              </div>
              {p.budget && (
                <p className="text-logos-text-muted mt-2 text-sm">
                  {formatCurrency(p.budget)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
