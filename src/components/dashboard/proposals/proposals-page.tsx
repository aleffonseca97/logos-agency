"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Copy, FileText, Plus } from "lucide-react";

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { TableSkeleton } from "@/components/dashboard/shared/skeletons";
import { Button } from "@/components/logos/button";
import { Input } from "@/components/logos/input";
import { Textarea } from "@/components/logos/textarea";
import { Badge } from "@/components/logos/badge";
import { useToast } from "@/components/logos/toast";
import { branding } from "@/config/branding";
import { siteConfig } from "@/config/site";
import { formatCurrency, formatDate } from "@/utils/export";

export function ProposalsPage() {
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: proposals = [], isLoading } = useQuery({
    queryKey: ["proposals"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/proposals");
      if (!res.ok) return [];
      return res.json();
    },
  });

  const createProposal = useMutation({
    mutationFn: async (body: Record<string, unknown>) => {
      const res = await fetch("/api/dashboard/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Erro");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      setShowForm(false);
      toast({ variant: "success", title: "Proposta criada" });
    },
  });

  const duplicate = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch("/api/dashboard/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ duplicateId: id }),
      });
      if (!res.ok) throw new Error("Erro");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["proposals"] });
      toast({ variant: "success", title: "Proposta duplicada" });
    },
  });

  const handlePdf = (proposal: { title: string; value: number; description: string | null; deadline: string | null }) => {
    const html = `<!DOCTYPE html><html><head><title>${proposal.title}</title>
      <style>body{font-family:sans-serif;padding:40px;background:#0b0f19;color:#f8fafc}
      h1{color:#2563eb}table{width:100%;margin-top:20px}td{padding:8px 0;border-bottom:1px solid #333}</style></head>
      <body><h1>${proposal.title}</h1>
      <table><tr><td>Valor</td><td>${formatCurrency(proposal.value)}</td></tr>
      <tr><td>Prazo</td><td>${proposal.deadline ?? "—"}</td></tr></table>
      <p style="margin-top:24px">${proposal.description ?? ""}</p>
      <img src="${siteConfig.url}${branding.logo.markSrc}" alt="${siteConfig.name}" style="height:30px;width:30px;margin-top:40px;" />
      </body></html>`;
    const w = window.open("", "_blank");
    w?.document.write(html);
    w?.print();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Propostas"
        description="Crie, envie e acompanhe propostas comerciais."
        actions={
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="size-4" aria-hidden />
            Nova proposta
          </Button>
        }
      />

      {showForm && (
        <ProposalForm
          onSubmit={(data) => createProposal.mutate(data)}
          onCancel={() => setShowForm(false)}
          loading={createProposal.isPending}
        />
      )}

      {isLoading ? (
        <TableSkeleton />
      ) : proposals.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhuma proposta"
          description="Crie propostas para enviar aos seus leads e clientes."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {proposals.map((p: {
            id: string;
            title: string;
            value: number;
            description: string | null;
            deadline: string | null;
            status: string;
            created_at: string;
          }) => (
            <div key={p.id} className="logos-glass group rounded-xl p-5 transition-all hover:shadow-logos-glow">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-logos-text font-semibold">{p.title}</h3>
                <Badge variant="primary">{p.status}</Badge>
              </div>
              <p className="text-brand-primary mt-2 text-xl font-bold">{formatCurrency(p.value)}</p>
              <p className="text-logos-text-muted mt-2 text-xs">{formatDate(p.created_at)}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => handlePdf(p)}>
                  Gerar PDF
                </Button>
                <Button size="sm" variant="outline" onClick={() => duplicate.mutate(p.id)}>
                  <Copy className="size-4" aria-hidden />
                  Duplicar
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProposalForm({
  onSubmit,
  onCancel,
  loading,
}: {
  onSubmit: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  loading: boolean;
}) {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");

  return (
    <div className="logos-glass space-y-4 rounded-xl p-6">
      <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
      <Input placeholder="Valor (R$)" type="number" value={value} onChange={(e) => setValue(e.target.value)} />
      <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
      <Textarea placeholder="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
      <div className="flex gap-2">
        <Button
          disabled={!title || !value || loading}
          onClick={() =>
            onSubmit({
              title,
              value: Number(value),
              description,
              deadline: deadline || null,
              status: "Rascunho",
            })
          }
        >
          Salvar
        </Button>
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </div>
  );
}
