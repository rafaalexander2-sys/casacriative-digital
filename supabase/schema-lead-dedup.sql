-- ============================================================
-- Casa Criative CRM — Identificador externo do lead (anti-duplicado)
-- Cole no Supabase → SQL Editor → Run. Idempotente.
--
-- PARA QUÊ
-- Quem nos envia leads costuma reenviar quando recebe erro. O Google Ads faz
-- isso explicitamente: uma resposta 5xx significa "tenta outra vez". Sem uma
-- marca de identidade, cada nova tentativa criava outro cartão no quadro.
--
-- Guardando o id que a origem já dá (lead_id do Google, ou o lead_id que o
-- formulário do site gera), a segunda entrega do mesmo lead não faz nada.
-- ============================================================

alter table leads add column if not exists external_id text;

-- Único POR ESPAÇO: dois clientes diferentes podem, em teoria, receber ids
-- iguais de origens diferentes sem se atrapalharem.
create unique index if not exists leads_external_id_uniq
  on leads(workspace_id, external_id)
  where external_id is not null;
