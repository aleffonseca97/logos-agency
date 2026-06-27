-- Tabela de leads para captura de contatos do site
-- Execute no SQL Editor do Supabase ou via CLI

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  company text not null,
  email text not null,
  phone text not null,
  project_type text not null,
  budget text not null,
  message text not null,
  status text not null default 'Novo',
  source text not null default 'website',
  ip text,
  user_agent text
);

create index if not exists leads_email_created_at_idx
  on public.leads (email, created_at desc);

create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

create index if not exists leads_status_idx
  on public.leads (status);

alter table public.leads enable row level security;

-- Apenas service role (server-side) acessa via SUPABASE_SERVICE_ROLE_KEY.
-- Nenhuma policy pública — anon/authenticated não têm acesso direto.

comment on table public.leads is 'Leads capturados pelo formulário de contato do site';
comment on column public.leads.status is 'Status do lead: Novo, Em contato, Qualificado, Fechado, Perdido';
comment on column public.leads.source is 'Origem do lead (ex: website)';
