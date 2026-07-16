"use client";

import Link from "next/link";
import { ArrowUpRight, Inbox } from "lucide-react";

import { Badge } from "@/components/logos/badge";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { formatDate } from "@/utils/export";

export type RecentLead = {
  id: string;
  name: string;
  company: string;
  status: string;
  created_at: string;
};

type RecentActivityProps = {
  leads: RecentLead[];
  isLoading?: boolean;
};

export function RecentActivity({ leads, isLoading }: RecentActivityProps) {
  return (
    <section className="logos-glass flex h-full flex-col rounded-xl">
      <div className="border-logos-border flex items-center justify-between border-b px-5 py-4">
        <div>
          <h2 className="text-logos-text text-sm font-semibold tracking-tight">
            Atividade recente
          </h2>
          <p className="text-logos-text-muted mt-0.5 text-xs">
            Últimos leads capturados pelo site
          </p>
        </div>
        <Link
          href="/dashboard/leads"
          className="text-brand-primary hover:text-brand-primary/80 inline-flex items-center gap-1 text-xs font-medium transition-colors"
        >
          Ver todos
          <ArrowUpRight className="size-3.5" aria-hidden />
        </Link>
      </div>

      <div className="flex-1 p-2">
        {isLoading ? (
          <div className="space-y-2 p-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="bg-logos-surface/40 h-14 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title="Nenhuma atividade"
            description="Quando novos leads chegarem pelo formulário, eles aparecem aqui."
            className="border-0 bg-transparent py-10 shadow-none"
          />
        ) : (
          <ul className="space-y-0.5">
            {leads.map((lead) => (
              <li key={lead.id}>
                <Link
                  href={`/dashboard/leads/${lead.id}`}
                  className="hover:bg-logos-surface/50 group flex items-center justify-between gap-3 rounded-lg px-3 py-3 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-logos-text truncate text-sm font-medium">
                      {lead.name}
                    </p>
                    <p className="text-logos-text-muted truncate text-xs">
                      {lead.company}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Badge variant="primary">{lead.status}</Badge>
                    <span className="text-logos-text-muted hidden text-xs tabular-nums sm:inline">
                      {formatDate(lead.created_at)}
                    </span>
                    <ArrowUpRight
                      className="text-logos-text-muted size-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden
                    />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
