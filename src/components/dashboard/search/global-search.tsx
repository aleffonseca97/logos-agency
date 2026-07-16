"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

import { cn } from "@/lib/utils";

type SearchResults = {
  leads: Array<{ id: string; name: string; company: string; status: string }>;
  clients: Array<{ id: string; company: string; city: string | null; segment: string | null; status: string }>;
  projects: Array<{ id: string; name: string; status: string }>;
  proposals: Array<{ id: string; title: string; status: string }>;
};

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await fetch(`/api/dashboard/search?q=${encodeURIComponent(query)}`);
      if (res.ok) setResults(await res.json());
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const hasResults =
    results &&
    (results.leads.length > 0 ||
      results.clients.length > 0 ||
      results.projects.length > 0 ||
      results.proposals.length > 0);

  return (
    <div ref={ref} className="relative w-full max-w-md">
      <div className="relative">
        <Search
          className="text-logos-text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2"
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar leads, clientes, projetos..."
          className="border-logos-border bg-logos-surface/50 text-logos-text placeholder:text-logos-text-muted focus:border-brand-primary focus:ring-brand-primary/20 h-10 w-full rounded-lg border pr-4 pl-10 text-sm outline-none focus:ring-2"
          aria-label="Busca global"
        />
      </div>

      {open && query.length >= 2 && (
        <div className="logos-glass absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl shadow-lg">
          {!hasResults ? (
            <p className="text-logos-text-muted p-4 text-center text-sm">
              Nenhum resultado para &ldquo;{query}&rdquo;
            </p>
          ) : (
            <div className="max-h-80 overflow-y-auto p-2">
              {results!.leads.length > 0 && (
                <SearchGroup title="Leads">
                  {results!.leads.map((l) => (
                    <SearchItem
                      key={l.id}
                      href={`/dashboard/leads/${l.id}`}
                      label={l.name}
                      sub={l.company}
                      onClick={() => setOpen(false)}
                    />
                  ))}
                </SearchGroup>
              )}
              {results!.clients.length > 0 && (
                <SearchGroup title="Clientes">
                  {results!.clients.map((c) => (
                    <SearchItem
                      key={c.id}
                      href="/dashboard/clientes"
                      label={c.company}
                      sub={[c.segment, c.city, c.status].filter(Boolean).join(" · ")}
                      onClick={() => setOpen(false)}
                    />
                  ))}
                </SearchGroup>
              )}
              {results!.projects.length > 0 && (
                <SearchGroup title="Projetos">
                  {results!.projects.map((p) => (
                    <SearchItem
                      key={p.id}
                      href="/dashboard/projetos"
                      label={p.name}
                      sub={p.status}
                      onClick={() => setOpen(false)}
                    />
                  ))}
                </SearchGroup>
              )}
              {results!.proposals.length > 0 && (
                <SearchGroup title="Propostas">
                  {results!.proposals.map((p) => (
                    <SearchItem
                      key={p.id}
                      href="/dashboard/propostas"
                      label={p.title}
                      sub={p.status}
                      onClick={() => setOpen(false)}
                    />
                  ))}
                </SearchGroup>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SearchGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2">
      <p className="text-logos-text-muted px-2 py-1 text-xs font-medium uppercase tracking-wide">
        {title}
      </p>
      {children}
    </div>
  );
}

function SearchItem({
  href,
  label,
  sub,
  onClick,
}: {
  href: string;
  label: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "hover:bg-logos-surface/60 block rounded-lg px-3 py-2 transition-colors",
      )}
    >
      <p className="text-logos-text text-sm font-medium">{label}</p>
      <p className="text-logos-text-muted text-xs">{sub}</p>
    </Link>
  );
}
