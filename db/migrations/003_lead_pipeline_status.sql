-- =============================================================================
-- Alinha o CHECK de status dos leads com o pipeline da aplicação (LEAD_PIPELINE).
-- =============================================================================

-- Migrar valores legados do CHECK antigo
update leads set status = 'Contato feito' where status = 'Em contato';
update leads set status = 'Negociação' where status = 'Qualificado';

alter table leads drop constraint if exists leads_status_check;

alter table leads
  add constraint leads_status_check
  check (
    status in (
      'Novo',
      'Contato feito',
      'Reunião marcada',
      'Proposta enviada',
      'Negociação',
      'Fechado',
      'Perdido'
    )
  );
