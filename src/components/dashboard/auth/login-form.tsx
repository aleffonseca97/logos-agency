"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Sparkles } from "lucide-react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/logos/button";
import { Input } from "@/components/logos/input";
import { useToast } from "@/components/logos/toast";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({ variant: "error", title: "Falha no login", description: error.message });
      setLoading(false);
      return;
    }

    const redirect = searchParams.get("redirect") ?? "/dashboard";
    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="bg-logos-bg flex min-h-screen items-center justify-center p-4">
      <div className="logos-glass w-full max-w-md rounded-2xl p-8 shadow-logos-glow">
        <div className="mb-8 text-center">
          <div className="bg-brand-primary/15 mx-auto mb-4 flex size-12 items-center justify-center rounded-xl">
            <Sparkles className="text-brand-primary size-6" aria-hidden />
          </div>
          <h1 className="text-logos-text text-2xl font-semibold">LOGOS CRM</h1>
          <p className="text-logos-text-muted mt-2 text-sm">
            Acesse o painel administrativo
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-logos-text mb-1.5 block text-sm font-medium">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              inputSize="lg"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-logos-text mb-1.5 block text-sm font-medium">
              Senha
            </label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              inputSize="lg"
            />
          </div>
          <Button type="submit" fullWidth size="lg" disabled={loading} className="mt-2">
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Entrando…
              </>
            ) : (
              "Entrar"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
