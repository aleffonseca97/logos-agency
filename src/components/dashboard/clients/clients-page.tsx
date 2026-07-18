"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, Upload, UserCircle } from "lucide-react";

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { EmptyState } from "@/components/dashboard/shared/empty-state";
import { TableSkeleton } from "@/components/dashboard/shared/skeletons";
import { Badge } from "@/components/logos/badge";
import { Button } from "@/components/logos/button";
import { Input } from "@/components/logos/input";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "@/components/logos/modal";
import { Textarea } from "@/components/logos/textarea";
import { useToast } from "@/components/logos/toast";
import type { Client, ClientInsert, ClientStatus } from "@/types/client";
import { CLIENT_STATUS } from "@/types/client";

type ClientFormState = {
  company: string;
  logo_url: string;
  website: string;
  segment: string;
  city: string;
  country: string;
  status: ClientStatus;
  client_since: string;
  featured_home: boolean;
  display_order: string;
  notes: string;
};

const emptyForm = (): ClientFormState => ({
  company: "",
  logo_url: "",
  website: "",
  segment: "",
  city: "",
  country: "",
  status: CLIENT_STATUS.ATIVO,
  client_since: new Date().toISOString().slice(0, 10),
  featured_home: false,
  display_order: "0",
  notes: "",
});

function toForm(client: Client): ClientFormState {
  return {
    company: client.company,
    logo_url: client.logo_url ?? "",
    website: client.website ?? "",
    segment: client.segment ?? "",
    city: client.city ?? "",
    country: client.country ?? "",
    status: client.status,
    client_since: client.client_since ?? "",
    featured_home: client.featured_home,
    display_order: String(client.display_order ?? 0),
    notes: client.notes ?? "",
  };
}

function toPayload(form: ClientFormState): Omit<ClientInsert, "created_by" | "lead_id" | "name" | "email" | "phone"> {
  return {
    company: form.company.trim(),
    logo_url: form.logo_url || null,
    website: form.website.trim() || null,
    segment: form.segment.trim() || null,
    city: form.city.trim() || null,
    country: form.country.trim() || null,
    status: form.status,
    client_since: form.client_since || null,
    featured_home: form.featured_home,
    display_order: Number(form.display_order) || 0,
    notes: form.notes.trim() || null,
  };
}

export function ClientsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [form, setForm] = useState<ClientFormState>(emptyForm);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: clients = [], isLoading } = useQuery<Client[]>({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/clients");
      if (!res.ok) throw new Error("Erro ao carregar clientes");
      return res.json();
    },
  });

  useEffect(() => {
    if (!open) {
      setEditing(null);
      setForm(emptyForm());
    }
  }, [open]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = toPayload(form);
      if (!payload.company) throw new Error("Nome da empresa é obrigatório");

      const res = await fetch(
        editing ? `/api/dashboard/clients/${editing.id}` : "/api/dashboard/clients",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "Erro ao salvar cliente");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      setOpen(false);
      toast({
        variant: "success",
        title: editing ? "Cliente atualizado" : "Cliente criado",
      });
    },
    onError: (err: Error) => {
      toast({ variant: "error", title: err.message });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/dashboard/clients/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir cliente");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({ variant: "success", title: "Cliente excluído" });
    },
    onError: () => {
      toast({ variant: "error", title: "Erro ao excluir cliente" });
    },
  });

  function openCreate() {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  }

  function openEdit(client: Client) {
    setEditing(client);
    setForm(toForm(client));
    setOpen(true);
  }

  async function handleLogoUpload(file: File | null) {
    if (!file) return;
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/dashboard/uploads", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Falha no upload");
      setForm((prev) => ({ ...prev, logo_url: data.url }));
      toast({ variant: "success", title: "Logo enviado" });
    } catch (err) {
      toast({
        variant: "error",
        title: err instanceof Error ? err.message : "Erro no upload",
      });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Clientes"
        description="Base de clientes da agência — vitrine, status e ordenação na home."
        actions={
          <Button size="sm" onClick={openCreate}>
            <Plus className="size-4" aria-hidden />
            Novo Cliente
          </Button>
        }
      />

      {isLoading ? (
        <TableSkeleton />
      ) : clients.length === 0 ? (
        <EmptyState
          icon={UserCircle}
          title="Nenhum cliente ainda"
          description="Cadastre o primeiro cliente ou converta um lead fechado."
          action={
            <Button size="sm" onClick={openCreate}>
              <Plus className="size-4" aria-hidden />
              Novo Cliente
            </Button>
          }
        />
      ) : (
        <div className="logos-glass overflow-x-auto rounded-xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-logos-border text-logos-text-muted border-b">
                {[
                  "Empresa",
                  "Segmento",
                  "Local",
                  "Status",
                  "Desde",
                  "Home",
                  "Ordem",
                  "",
                ].map((h) => (
                  <th key={h || "actions"} className="px-4 py-3 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr
                  key={c.id}
                  className="border-logos-border hover:bg-logos-surface/40 border-b last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {c.logo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={c.logo_url}
                          alt=""
                          className="border-logos-border bg-logos-surface size-8 rounded-md border object-contain p-0.5"
                        />
                      ) : (
                        <div className="border-logos-border bg-logos-surface text-logos-text-muted flex size-8 items-center justify-center rounded-md border text-xs">
                          {c.company.slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-logos-text font-medium">{c.company}</p>
                        {c.website && (
                          <a
                            href={c.website.startsWith("http") ? c.website : `https://${c.website}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-brand-primary text-xs hover:underline"
                          >
                            {c.website.replace(/^https?:\/\//, "")}
                          </a>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-logos-text-muted px-4 py-3">{c.segment ?? "—"}</td>
                  <td className="text-logos-text-muted px-4 py-3">
                    {[c.city, c.country].filter(Boolean).join(", ") || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={c.status === CLIENT_STATUS.ATIVO ? "success" : "muted"}>
                      {c.status === CLIENT_STATUS.ATIVO ? "Ativo" : "Inativo"}
                    </Badge>
                  </td>
                  <td className="text-logos-text-muted px-4 py-3">
                    {c.client_since ? formatClientSince(c.client_since) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    {c.featured_home ? (
                      <Badge variant="primary">Sim</Badge>
                    ) : (
                      <span className="text-logos-text-muted">Não</span>
                    )}
                  </td>
                  <td className="text-logos-text-muted px-4 py-3">{c.display_order}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Editar cliente"
                        onClick={() => openEdit(c)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label="Excluir cliente"
                        onClick={() => {
                          if (confirm(`Excluir ${c.company}?`)) {
                            deleteMutation.mutate(c.id);
                          }
                        }}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={open} onOpenChange={setOpen}>
        <ModalContent size="2xl" variant="glass" className="max-h-[90vh] overflow-y-auto">
          <ModalHeader>
            <ModalTitle>{editing ? "Editar cliente" : "Novo Cliente"}</ModalTitle>
            <ModalDescription>
              Preencha os dados da empresa para a base de clientes.
            </ModalDescription>
          </ModalHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nome da empresa *" className="sm:col-span-2">
              <Input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                placeholder="Ex.: Acme Corp"
              />
            </Field>

            <Field label="Logo" className="sm:col-span-2">
              <div className="flex flex-wrap items-center gap-3">
                {form.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.logo_url}
                    alt="Logo"
                    className="border-logos-border bg-logos-surface size-12 rounded-md border object-contain p-1"
                  />
                ) : null}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/svg+xml,image/gif"
                  className="hidden"
                  onChange={(e) => handleLogoUpload(e.target.files?.[0] ?? null)}
                />
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={uploading}
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="size-4" aria-hidden />
                  {uploading ? "Enviando..." : "Upload do logo"}
                </Button>
                {form.logo_url && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setForm({ ...form, logo_url: "" })}
                  >
                    Remover
                  </Button>
                )}
              </div>
            </Field>

            <Field label="Website">
              <Input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://"
              />
            </Field>

            <Field label="Segmento">
              <Input
                value={form.segment}
                onChange={(e) => setForm({ ...form, segment: e.target.value })}
                placeholder="Ex.: SaaS, Retail..."
              />
            </Field>

            <Field label="Cidade">
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
            </Field>

            <Field label="País">
              <Input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
            </Field>

            <Field label="Status">
              <select
                value={form.status}
                onChange={(e) =>
                  setForm({
                    ...form,
                    status: e.target.value === "inativo" ? "inativo" : "ativo",
                  })
                }
                className="border-logos-border bg-logos-surface text-logos-text focus:border-brand-primary focus:ring-brand-primary/20 h-10 w-full rounded-lg border px-3 text-sm outline-none focus:ring-2"
              >
                <option value={CLIENT_STATUS.ATIVO}>Ativo</option>
                <option value={CLIENT_STATUS.INATIVO}>Inativo</option>
              </select>
            </Field>

            <Field label="Cliente desde">
              <Input
                type="date"
                value={form.client_since}
                onChange={(e) => setForm({ ...form, client_since: e.target.value })}
              />
            </Field>

            <Field label="Ordem de exibição">
              <Input
                type="number"
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: e.target.value })}
              />
            </Field>

            <Field label="Destaque na Home">
              <label className="border-logos-border bg-logos-surface text-logos-text flex h-10 cursor-pointer items-center gap-2 rounded-lg border px-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured_home}
                  onChange={(e) =>
                    setForm({ ...form, featured_home: e.target.checked })
                  }
                  className="accent-brand-primary size-4"
                />
                Exibir na home do site
              </label>
            </Field>

            <Field label="Observações" className="sm:col-span-2">
              <Textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Notas internas sobre o cliente..."
                rows={3}
              />
            </Field>
          </div>

          <ModalFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button
              disabled={!form.company.trim() || saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="text-logos-text mb-1.5 block text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

function formatClientSince(value: string) {
  const [year, month, day] = value.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(
    new Date(year, month - 1, day),
  );
}
