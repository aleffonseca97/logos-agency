"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { SECTION_IDS } from "@/data/home-content";
import { cn } from "@/lib/utils";
import type { HomeClient } from "@/types/home-client";

import { Reveal } from "./lib/reveal";
import { SectionHeader } from "./lib/section-header";
import { SectionShell } from "./lib/section-shell";

const MARQUEE_COPIES = 2;

function ClientLogoItem({ client }: { client: HomeClient }) {
  return (
    <li
      className={cn(
        "group/logo flex shrink-0 flex-col items-center justify-center px-3 py-2",
        "w-[calc(100cqw/2)] md:w-[calc(100cqw/4)] lg:w-[calc(100cqw/6)]",
      )}
    >
      <div className="flex h-16 w-full max-w-[9rem] items-center justify-center sm:h-20">
        {client.logo_url ? (
          <Image
            src={client.logo_url}
            alt={client.company}
            width={144}
            height={64}
            className={cn(
              "max-h-12 w-auto max-w-full object-contain transition-all duration-300 sm:max-h-14",
              "grayscale opacity-70",
              "group-hover/logo:scale-110 group-hover/logo:opacity-100 group-hover/logo:grayscale-0",
            )}
            unoptimized
          />
        ) : (
          <span
            className={cn(
              "logos-font-heading text-logos-text-muted text-sm font-semibold tracking-wide uppercase transition-all duration-300",
              "group-hover/logo:text-logos-text group-hover/logo:scale-110",
            )}
          >
            {client.company}
          </span>
        )}
      </div>
      <p
        className={cn(
          "text-logos-text-muted mt-2 max-w-[9rem] text-center text-xs leading-snug transition-all duration-300",
          "max-h-0 overflow-hidden opacity-0",
          "group-hover/logo:max-h-10 group-hover/logo:opacity-100",
        )}
      >
        {client.company}
      </p>
    </li>
  );
}

export function ClientsSection() {
  const t = useTranslations("clients");
  const [clients, setClients] = useState<HomeClient[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "empty">(
    "loading",
  );

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const response = await fetch("/api/public/home/clients");
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = (await response.json()) as { clients?: HomeClient[] };
        const list = Array.isArray(data.clients) ? data.clients : [];
        if (cancelled) return;
        setClients(list);
        setStatus(list.length > 0 ? "ready" : "empty");
      } catch (error) {
        console.error("[ClientsSection]", error);
        if (!cancelled) {
          setClients([]);
          setStatus("empty");
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  /** Garante faixa contínua mesmo com poucos clientes. */
  const trackClients = useMemo(() => {
    if (clients.length === 0) return [];
    const minPerCopy = 6;
    if (clients.length >= minPerCopy) return clients;
    const filled: HomeClient[] = [];
    while (filled.length < minPerCopy) {
      filled.push(...clients);
    }
    return filled.slice(0, minPerCopy);
  }, [clients]);

  const marqueeItems = useMemo(
    () =>
      Array.from({ length: MARQUEE_COPIES }, (_, copyIndex) =>
        trackClients.map((client, index) => ({
          client,
          key: `${copyIndex}-${client.id}-${index}`,
        })),
      ).flat(),
    [trackClients],
  );

  if (status !== "ready") {
    return null;
  }

  return (
    <SectionShell id={SECTION_IDS.clients} spacing="lg">
      <SectionHeader
        badge={t("badge")}
        title={t("title")}
        description={t("description")}
        align="center"
      />

      <Reveal>
        <div
          className="group/carousel @container relative overflow-hidden"
          aria-label={t("carouselAria")}
        >
          <div
            className="from-brand-background pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r to-transparent sm:w-16"
            aria-hidden
          />
          <div
            className="from-brand-background pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l to-transparent sm:w-16"
            aria-hidden
          />

          <ul
            className={cn(
              "m-0 flex w-max list-none p-0",
              "animate-logos-clients-marquee motion-reduce:animate-none",
              "group-hover/carousel:[animation-play-state:paused]",
            )}
          >
            {marqueeItems.map(({ client, key }) => (
              <ClientLogoItem key={key} client={client} />
            ))}
          </ul>
        </div>
      </Reveal>
    </SectionShell>
  );
}
