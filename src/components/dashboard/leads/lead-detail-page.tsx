"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Calendar,
  Mail,
  MessageCircle,
  Pencil,
  Send,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { CardGridSkeleton } from "@/components/dashboard/shared/skeletons";
import { Button } from "@/components/logos/button";
import { Badge } from "@/components/logos/badge";
import { Textarea } from "@/components/logos/textarea";
import { useLead } from "@/hooks/use-dashboard-query";
import { useToast } from "@/components/logos/toast";
import { getWhatsAppUrl } from "@/config/contact";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/utils/export";
import type { LeadActivity } from "@/types/lead";

export function LeadDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading } = useLead(id);
  const [note, setNote] = useState("");

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["lead", id] });

  const addNote = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/dashboard/leads/${id}/activities`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, type: "note" }),
      });
      if (!res.ok) throw new Error("Erro ao salvar nota");
      return res.json();
    },
    onSuccess: () => {
      setNote("");
      invalidate();
      toast({ variant: "success", title: "Nota adicionada" });
    },
  });

  const deleteLead = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/dashboard/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir");
    },
    onSuccess: () => {
      toast({ variant: "success", title: "Lead excluído" });
      router.push("/dashboard/leads");
    },
  });

  const convertClient = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/dashboard/leads/${id}/convert`, { method: "POST" });
      if (!res.ok) throw new Error("Erro ao converter");
      return res.json();
    },
    onSuccess: () => {
      toast({ variant: "success", title: "Cliente criado com sucesso" });
      invalidate();
    },
  });

  if (isLoading) return <CardGridSkeleton count={2} />;
  if (!data?.lead) {
    return <p className="text-logos-text-muted">Lead não encontrado.</p>;
  }

  const { lead, activities } = data as {
    lead: {
      id: string;
      name: string;
      company: string;
      email: string;
      phone: string;
      project_type: string;
      budget: string;
      message: string;
      status: string;
      source: string;
      created_at: string;
      ip: string | null;
      user_agent: string | null;
      notes: string | null;
    };
    activities: LeadActivity[];
  };

  const whatsappUrl = getWhatsAppUrl(
    `Olá ${lead.name}! Sou da ${siteConfig.name}. Vi seu projeto de ${lead.project_type} e gostaria de conversar.`,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={lead.name}
        description={lead.company}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" render={<Link href={`/dashboard/propostas?lead=${id}`} />}>
              <Send className="size-4" aria-hidden />
              Enviar proposta
            </Button>
            <Button variant="outline" size="sm" render={<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" />}>
              <MessageCircle className="size-4" aria-hidden />
              WhatsApp
            </Button>
            <Button variant="outline" size="sm" render={<a href={`mailto:${lead.email}`} />}>
              <Mail className="size-4" aria-hidden />
              Email
            </Button>
            <Button variant="outline" size="sm" render={<Link href={`/dashboard/agenda?lead=${id}`} />}>
              <Calendar className="size-4" aria-hidden />
              Reunião
            </Button>
            {lead.status === "Fechado" && (
              <Button size="sm" onClick={() => convertClient.mutate()} disabled={convertClient.isPending}>
                <UserPlus className="size-4" aria-hidden />
                Converter em cliente
              </Button>
            )}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (confirm("Excluir este lead permanentemente?")) deleteLead.mutate();
              }}
            >
              <Trash2 className="size-4" aria-hidden />
              Excluir
            </Button>
          </div>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="logos-glass space-y-4 rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-logos-text font-semibold">Informações</h2>
            <Badge variant="primary">{lead.status}</Badge>
          </div>
          <InfoGrid
            items={[
              ["E-mail", lead.email],
              ["Telefone", lead.phone],
              ["Projeto", lead.project_type],
              ["Orçamento", lead.budget],
              ["Origem", lead.source],
              ["Data", formatDate(lead.created_at)],
              ["IP", lead.ip ?? "—"],
              ["User Agent", lead.user_agent ? lead.user_agent.slice(0, 80) + "…" : "—"],
            ]}
          />
          <div>
            <p className="text-logos-text-muted mb-1 text-xs font-medium uppercase">Mensagem</p>
            <p className="text-logos-text text-sm leading-relaxed">{lead.message}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="logos-glass rounded-xl p-6">
            <h2 className="text-logos-text mb-4 font-semibold">Timeline</h2>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <p className="text-logos-text-muted text-sm">Sem atividades ainda.</p>
              ) : (
                activities.map((a) => (
                  <div key={a.id} className="border-logos-border relative border-l-2 pl-4">
                    <p className="text-logos-text text-sm">{a.content}</p>
                    <p className="text-logos-text-muted mt-1 text-xs">{formatDate(a.created_at)}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="logos-glass rounded-xl p-6">
            <h2 className="text-logos-text mb-3 font-semibold">Observações</h2>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Adicionar observação..."
              textareaSize="sm"
            />
            <Button
              className="mt-3"
              size="sm"
              disabled={!note.trim() || addNote.isPending}
              onClick={() => addNote.mutate(note)}
            >
              <Pencil className="size-4" aria-hidden />
              Salvar nota
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoGrid({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt className="text-logos-text-muted text-xs font-medium uppercase">{label}</dt>
          <dd className="text-logos-text mt-0.5 text-sm break-all">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
