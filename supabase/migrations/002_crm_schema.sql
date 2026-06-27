-- CRM LOGOS Framework — migration 002
-- Execute após 001_create_leads_table.sql

-- ── Extensão leads ──────────────────────────────────────────────
alter table public.leads
  add column if not exists assigned_to uuid references auth.users(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists estimated_value numeric(12, 2),
  add column if not exists notes text;

-- ── Perfis (vinculados ao Supabase Auth) ──────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  email text,
  role text not null default 'admin' check (role in ('admin', 'member')),
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Atividades / timeline dos leads ───────────────────────────────
create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  type text not null default 'note',
  content text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists lead_activities_lead_id_idx
  on public.lead_activities (lead_id, created_at desc);

-- ── Clientes ─────────────────────────────────────────────────────
create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  name text not null,
  company text not null,
  email text not null,
  phone text,
  notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_email_idx on public.clients (email);

-- ── Projetos ─────────────────────────────────────────────────────
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.clients(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  name text not null,
  description text,
  status text not null default 'Em andamento',
  budget numeric(12, 2),
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Propostas ────────────────────────────────────────────────────
create table if not exists public.proposals (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  title text not null,
  value numeric(12, 2) not null default 0,
  description text,
  deadline date,
  status text not null default 'Rascunho',
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Agenda / eventos ─────────────────────────────────────────────
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'meeting' check (type in ('meeting', 'call', 'follow-up')),
  description text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  lead_id uuid references public.leads(id) on delete set null,
  client_id uuid references public.clients(id) on delete set null,
  google_calendar_id text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists events_start_at_idx on public.events (start_at);

-- ── Notificações ─────────────────────────────────────────────────
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx
  on public.notifications (user_id, read, created_at desc);

-- ── Configurações da organização (singleton) ─────────────────────
create table if not exists public.org_settings (
  id int primary key default 1 check (id = 1),
  company_name text not null default 'LOGOS Framework',
  logo_url text,
  whatsapp text,
  contact_email text,
  primary_color text default '#2563eb',
  social_links jsonb not null default '{}'::jsonb,
  resend_configured boolean not null default false,
  supabase_configured boolean not null default false,
  calendly_url text,
  updated_at timestamptz not null default now()
);

insert into public.org_settings (id) values (1) on conflict (id) do nothing;

-- ── Trigger: criar profile ao registrar usuário ──────────────────
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Trigger: updated_at ──────────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists leads_updated_at on public.leads;
create trigger leads_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

drop trigger if exists clients_updated_at on public.clients;
create trigger clients_updated_at before update on public.clients
  for each row execute function public.set_updated_at();

drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists proposals_updated_at on public.proposals;
create trigger proposals_updated_at before update on public.proposals
  for each row execute function public.set_updated_at();

drop trigger if exists events_updated_at on public.events;
create trigger events_updated_at before update on public.events
  for each row execute function public.set_updated_at();

-- ── RLS ──────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.lead_activities enable row level security;
alter table public.clients enable row level security;
alter table public.projects enable row level security;
alter table public.proposals enable row level security;
alter table public.events enable row level security;
alter table public.notifications enable row level security;
alter table public.org_settings enable row level security;

-- Políticas: usuários autenticados com perfil admin/member
create policy "Authenticated users can read leads"
  on public.leads for select to authenticated using (true);

create policy "Authenticated users can update leads"
  on public.leads for update to authenticated using (true);

create policy "Authenticated users can delete leads"
  on public.leads for delete to authenticated using (true);

create policy "Profiles are viewable by authenticated users"
  on public.profiles for select to authenticated using (true);

create policy "Users can update own profile"
  on public.profiles for update to authenticated using (auth.uid() = id);

create policy "Lead activities full access for authenticated"
  on public.lead_activities for all to authenticated using (true) with check (true);

create policy "Clients full access for authenticated"
  on public.clients for all to authenticated using (true) with check (true);

create policy "Projects full access for authenticated"
  on public.projects for all to authenticated using (true) with check (true);

create policy "Proposals full access for authenticated"
  on public.proposals for all to authenticated using (true) with check (true);

create policy "Events full access for authenticated"
  on public.events for all to authenticated using (true) with check (true);

create policy "Users can read own notifications"
  on public.notifications for select to authenticated using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update to authenticated using (auth.uid() = user_id);

create policy "System can insert notifications"
  on public.notifications for insert to authenticated with check (true);

create policy "Org settings readable by authenticated"
  on public.org_settings for select to authenticated using (true);

create policy "Org settings updatable by authenticated"
  on public.org_settings for update to authenticated using (true);

-- Service role continua inserindo leads via API pública (sem policy insert para authenticated em leads)
