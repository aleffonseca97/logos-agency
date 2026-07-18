"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { PageHeader } from "@/components/dashboard/shared/page-header";
import { Button } from "@/components/logos/button";
import { Input } from "@/components/logos/input";
import { useToast } from "@/components/logos/toast";

export function ProfilePage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [fullName, setFullName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/dashboard/profile");
      if (!res.ok) return null;
      return res.json();
    },
  });

  useEffect(() => {
    if (profile?.full_name) setFullName(profile.full_name);
  }, [profile]);

  const saveProfile = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/dashboard/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName }),
      });
      if (!res.ok) throw new Error("Erro");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({ variant: "success", title: "Perfil atualizado" });
    },
  });

  const changePassword = async () => {
    if (!currentPassword) {
      toast({ variant: "error", title: "Informe a senha atual" });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast({ variant: "error", title: "Senha deve ter pelo menos 6 caracteres" });
      return;
    }
    const res = await fetch("/api/dashboard/profile/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, password: newPassword }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast({ variant: "error", title: data.error ?? "Erro ao alterar senha" });
    } else {
      setCurrentPassword("");
      setNewPassword("");
      toast({ variant: "success", title: "Senha alterada com sucesso" });
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Perfil" description="Gerencie suas informações pessoais." />

      <div className="logos-glass max-w-lg space-y-6 rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="bg-brand-primary/20 text-brand-primary flex size-16 items-center justify-center rounded-full text-2xl font-bold">
            {(fullName || profile?.email || "?")[0]?.toUpperCase()}
          </div>
          <div>
            <p className="text-logos-text font-semibold">{fullName || "Usuário"}</p>
            <p className="text-logos-text-muted text-sm">{profile?.email}</p>
          </div>
        </div>

        <div>
          <label className="text-logos-text mb-1.5 block text-sm font-medium">Nome completo</label>
          <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>

        <Button onClick={() => saveProfile.mutate()} disabled={saveProfile.isPending}>
          Salvar perfil
        </Button>

        <div className="border-logos-border border-t pt-6">
          <h3 className="text-logos-text mb-3 font-semibold">Alterar senha</h3>
          <div className="space-y-3">
            <Input
              type="password"
              placeholder="Senha atual"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Nova senha"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button className="mt-3" variant="outline" onClick={changePassword}>
            Atualizar senha
          </Button>
        </div>
      </div>
    </div>
  );
}
