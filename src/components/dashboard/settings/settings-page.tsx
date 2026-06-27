"use client";

import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/logos/button";
import { Input } from "@/components/logos/input";
import { useToast } from "@/components/logos/toast";

export function SettingsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ["org-settings"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/settings");
      if (!res.ok) return null;
      return res.json();
    },
  });

  const [form, setForm] = useState({
    company_name: "",
    logo_url: "",
    whatsapp: "",
    contact_email: "",
    primary_color: "#2563eb",
    calendly_url: "",
    linkedin: "",
    instagram: "",
  });

  useEffect(() => {
    if (settings) {
      setForm({
        company_name: settings.company_name ?? "",
        logo_url: settings.logo_url ?? "",
        whatsapp: settings.whatsapp ?? "",
        contact_email: settings.contact_email ?? "",
        primary_color: settings.primary_color ?? "#2563eb",
        calendly_url: settings.calendly_url ?? "",
        linkedin: settings.social_links?.linkedin ?? "",
        instagram: settings.social_links?.instagram ?? "",
      });
    }
  }, [settings]);

  const save = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/dashboard/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: form.company_name,
          logo_url: form.logo_url || null,
          whatsapp: form.whatsapp || null,
          contact_email: form.contact_email || null,
          primary_color: form.primary_color,
          calendly_url: form.calendly_url || null,
          social_links: { linkedin: form.linkedin, instagram: form.instagram },
        }),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["org-settings"] });
      toast({ variant: "success", title: "Configurações salvas" });
    },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configurações"
        description="Personalize a identidade e integrações da plataforma."
      />

      <div className="logos-glass max-w-2xl space-y-4 rounded-xl p-6">
        <Field label="Nome da empresa" value={form.company_name} onChange={(v) => setForm({ ...form, company_name: v })} />
        <Field label="URL do logo" value={form.logo_url} onChange={(v) => setForm({ ...form, logo_url: v })} />
        <Field label="WhatsApp" value={form.whatsapp} onChange={(v) => setForm({ ...form, whatsapp: v })} />
        <Field label="E-mail de contato" value={form.contact_email} onChange={(v) => setForm({ ...form, contact_email: v })} />
        <Field label="Cor principal" value={form.primary_color} onChange={(v) => setForm({ ...form, primary_color: v })} type="color" />
        <Field label="Calendly URL" value={form.calendly_url} onChange={(v) => setForm({ ...form, calendly_url: v })} />
        <Field label="LinkedIn" value={form.linkedin} onChange={(v) => setForm({ ...form, linkedin: v })} />
        <Field label="Instagram" value={form.instagram} onChange={(v) => setForm({ ...form, instagram: v })} />

        <div className="border-logos-border border-t pt-4">
          <p className="text-logos-text-muted mb-2 text-xs">
            Resend e Supabase são configurados via variáveis de ambiente (.env.local).
          </p>
        </div>

        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          Salvar alterações
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="text-logos-text mb-1.5 block text-sm font-medium">{label}</label>
      {type === "color" ? (
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-full cursor-pointer rounded-lg border border-logos-border bg-transparent"
        />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}
