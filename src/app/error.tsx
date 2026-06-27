"use client";

import Link from "next/link";
import { useEffect } from "react";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/logos/button";
import { Container } from "@/components/logos/container";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center"
    >
      <Container className="flex max-w-lg flex-col items-center gap-6">
        <p className="text-brand-primary logos-font-heading text-6xl font-bold">
          500
        </p>
        <h1 className="logos-text-display-sm text-logos-text">
          Algo deu errado
        </h1>
        <p className="text-logos-text-muted text-base leading-relaxed">
          Ocorreu um erro inesperado ao carregar esta página. Tente novamente ou
          retorne ao {siteConfig.name}.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button variant="cta" size="lg" onClick={reset}>
            Tentar novamente
          </Button>
          <Button render={<Link href="/" />} variant="outline" size="lg">
            Voltar ao início
          </Button>
        </div>
      </Container>
    </main>
  );
}
