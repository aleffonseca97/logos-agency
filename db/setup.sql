-- =============================================================================
-- Setup do banco — execute conectado ao PostgreSQL (não ao banco logos_crm)
-- Exemplo: psql -U postgres -f db/setup.sql
-- =============================================================================

create database logos_crm
  encoding 'UTF8'
  template template0;

comment on database logos_crm is 'CRM LOGOS Framework — leads, clientes, projetos e dashboard';
