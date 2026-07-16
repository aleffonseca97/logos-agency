-- ── Módulo Clientes (campos de portfólio / vitrine) ─────────────

alter table clients
  alter column name drop not null;

alter table clients
  alter column email drop not null;

alter table clients
  add column if not exists logo_url text;

alter table clients
  add column if not exists website text;

alter table clients
  add column if not exists segment text;

alter table clients
  add column if not exists city text;

alter table clients
  add column if not exists country text;

alter table clients
  add column if not exists status text not null default 'ativo';

alter table clients
  add column if not exists client_since date;

alter table clients
  add column if not exists featured_home boolean not null default false;

alter table clients
  add column if not exists display_order integer not null default 0;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'clients_status_check'
  ) then
    alter table clients
      add constraint clients_status_check
      check (status in ('ativo', 'inativo'));
  end if;
end $$;

create index if not exists clients_status_idx on clients (status);
create index if not exists clients_display_order_idx on clients (display_order);
create index if not exists clients_featured_home_idx on clients (featured_home);
