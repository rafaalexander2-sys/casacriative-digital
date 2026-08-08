-- ============================================================
-- Casa Criative CRM — Campos de negócio no lead
-- Cole no Supabase → SQL Editor → Run.
-- ============================================================

-- Tipo de cobrança: mrr (recorrente) | one_time (serviço único)
alter table leads add column if not exists deal_type text
  check (deal_type in ('mrr','one_time'));

-- Serviço contratado/de interesse
alter table leads add column if not exists service text;

-- (notes já existe no schema base; lead_events já guarda o histórico)
