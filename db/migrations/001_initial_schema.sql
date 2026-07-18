-- =============================================================================
-- CRM LOGOS Framework — schema inicial (PostgreSQL standalone)
-- Autenticação própria (users + profiles); sem Supabase / RLS.
--
-- Como aplicar:
--   1. Crie o banco:  createdb logos_crm
--   2. Configure DATABASE_URL no .env
--   3. Execute:       npm run db:seed
--      (ou psql $DATABASE_URL -f db/migrations/001_initial_schema.sql)
-- =============================================================================

create extension if not exists "pgcrypto";

-- ── Usuários (autenticação) ─────────────────────────────────────
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table users is 'Contas de acesso ao dashboard (NextAuth credentials + bcrypt)';

-- ── Leads ───────────────────────────────────────────────────────
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  name text not null,
  company text not null,
  email text not null,
  phone text not null,
  project_type text not null,
  budget text not null,
  message text not null,
  status text not null default 'Novo'
    check (status in (
      'Novo',
      'Contato feito',
      'Reunião marcada',
      'Proposta enviada',
      'Negociação',
      'Fechado',
      'Perdido'
    )),
  source text not null default 'website',
  ip text,
  user_agent text,
  assigned_to uuid references users(id) on delete set null,
  estimated_value numeric(12, 2),
  notes text
);

create index if not exists leads_email_created_at_idx
  on leads (email, created_at desc);

create index if not exists leads_created_at_idx
  on leads (created_at desc);

create index if not exists leads_status_idx
  on leads (status);

create index if not exists leads_assigned_to_idx
  on leads (assigned_to);

comment on table leads is 'Leads capturados pelo formulário de contato do site';

-- ── Perfis ──────────────────────────────────────────────────────
create table if not exists profiles (
  id uuid primary key references users(id) on delete cascade,
  full_name text,
  avatar_url text,
  email text,
  role text not null default 'admin' check (role in ('admin', 'member')),
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table profiles is 'Perfil e preferências de cada usuário do dashboard';

-- ── Atividades / timeline dos leads ─────────────────────────────
create table if not exists lead_activities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references leads(id) on delete cascade,
  type text not null default 'note'
    check (type in ('note', 'call', 'email', 'meeting', 'status_change')),
  content text not null,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists lead_activities_lead_id_idx
  on lead_activities (lead_id, created_at desc);

-- ── Clientes ────────────────────────────────────────────────────
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  company text not null,
  logo_url text,
  website text,
  segment text,
  city text,
  country text,
  status text not null default 'ativo'
    check (status in ('ativo', 'inativo')),
  client_since date,
  featured_home boolean not null default false,
  display_order integer not null default 0,
  notes text,
  name text,
  email text,
  phone text,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists clients_email_idx on clients (email);
create index if not exists clients_lead_id_idx on clients (lead_id);
create index if not exists clients_status_idx on clients (status);
create index if not exists clients_display_order_idx on clients (display_order);
create index if not exists clients_featured_home_idx on clients (featured_home);

-- ── Projetos ────────────────────────────────────────────────────
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references clients(id) on delete set null,
  lead_id uuid references leads(id) on delete set null,
  name text not null,
  description text,
  status text not null default 'Em andamento'
    check (status in ('Em andamento', 'Pausado', 'Concluído', 'Cancelado')),
  budget numeric(12, 2),
  started_at timestamptz,
  completed_at timestamptz,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_client_id_idx on projects (client_id);
create index if not exists projects_status_idx on projects (status);

-- ── Propostas ───────────────────────────────────────────────────
create table if not exists proposals (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id) on delete set null,
  client_id uuid references clients(id) on delete set null,
  title text not null,
  value numeric(12, 2) not null default 0,
  description text,
  deadline date,
  status text not null default 'Rascunho'
    check (status in ('Rascunho', 'Enviada', 'Aceita', 'Recusada', 'Expirada')),
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists proposals_lead_id_idx on proposals (lead_id);
create index if not exists proposals_status_idx on proposals (status);

-- ── Agenda / eventos ────────────────────────────────────────────
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'meeting' check (type in ('meeting', 'call', 'follow-up')),
  description text,
  start_at timestamptz not null,
  end_at timestamptz not null,
  lead_id uuid references leads(id) on delete set null,
  client_id uuid references clients(id) on delete set null,
  google_calendar_id text,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint events_end_after_start check (end_at > start_at)
);

create index if not exists events_start_at_idx on events (start_at);
create index if not exists events_lead_id_idx on events (lead_id);

-- ── Notificações ────────────────────────────────────────────────
create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type text not null,
  title text not null,
  message text not null,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_user_id_idx
  on notifications (user_id, read, created_at desc);

-- ── Configurações da organização (singleton) ────────────────────
create table if not exists org_settings (
  id int primary key default 1 check (id = 1),
  company_name text not null default 'LOGOS Framework',
  logo_url text,
  whatsapp text,
  contact_email text,
  primary_color text default '#2563eb',
  social_links jsonb not null default '{}'::jsonb,
  resend_configured boolean not null default false,
  database_configured boolean not null default false,
  calendly_url text,
  updated_at timestamptz not null default now()
);

insert into org_settings (id) values (1) on conflict (id) do nothing;

-- ── Trigger: updated_at ─────────────────────────────────────────
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_updated_at on users;
create trigger users_updated_at before update on users
  for each row execute function set_updated_at();

drop trigger if exists leads_updated_at on leads;
create trigger leads_updated_at before update on leads
  for each row execute function set_updated_at();

drop trigger if exists clients_updated_at on clients;
create trigger clients_updated_at before update on clients
  for each row execute function set_updated_at();

drop trigger if exists projects_updated_at on projects;
create trigger projects_updated_at before update on projects
  for each row execute function set_updated_at();

drop trigger if exists proposals_updated_at on proposals;
create trigger proposals_updated_at before update on proposals
  for each row execute function set_updated_at();

drop trigger if exists events_updated_at on events;
create trigger events_updated_at before update on events
  for each row execute function set_updated_at();

drop trigger if exists profiles_updated_at on profiles;
create trigger profiles_updated_at before update on profiles
  for each row execute function set_updated_at();

drop trigger if exists org_settings_updated_at on org_settings;
create trigger org_settings_updated_at before update on org_settings
  for each row execute function set_updated_at();
