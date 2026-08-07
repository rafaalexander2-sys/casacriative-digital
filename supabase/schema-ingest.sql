-- ============================================================
-- Casa Criative CRM — Ingestão de leads (form / webhook)
-- Cole no Supabase → SQL Editor → Run.
-- ============================================================

-- Token de captação por espaço: encaminha o lead ao cliente certo.
-- É write-only (só cria lead) — pode ir em formulários/LPs.
alter table workspaces add column if not exists ingest_token uuid not null default gen_random_uuid();
create unique index if not exists workspaces_ingest_token_idx on workspaces(ingest_token);

-- A agência pode LER o token (para mostrar o webhook na tela de Clientes).
-- (as policies de workspaces já permitem select à agência; o token vem junto)

-- Nada mais é preciso aqui: a Edge Function "ingest-lead" usa a service key
-- para validar o token e inserir o lead, contornando o RLS com segurança.
