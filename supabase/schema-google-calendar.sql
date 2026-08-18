-- ============================================================
-- Casa Criative CRM — Integração com Google Agenda
-- Cole no Supabase → SQL Editor → Run (depois do schema.sql).
-- Idempotente: pode rodar de novo sem quebrar.
--
-- IMPORTANTE: esta tabela guarda tokens OAuth do Google. Ela fica
-- com RLS ligado e SEM policies — ninguém acede via PostgREST direto
-- (nem a agência). Só a Edge Function "google-calendar" toca aqui,
-- usando a service role key. O front só sabe "conectado sim/não"
-- através da função google_calendar_status() abaixo.
-- ============================================================

create table if not exists google_calendar_connections (
  workspace_id     uuid primary key references workspaces(id) on delete cascade,
  access_token     text not null,
  refresh_token    text not null,
  expiry_date      timestamptz not null,
  calendar_id      text not null default 'primary',
  connected_by     uuid references auth.users(id) on delete set null,
  connected_email  text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

drop trigger if exists gcal_updated_at on google_calendar_connections;
create trigger gcal_updated_at before update on google_calendar_connections
  for each row execute function set_updated_at();

alter table google_calendar_connections enable row level security;
-- Nenhuma policy: SELECT/INSERT/UPDATE/DELETE via PostgREST ficam bloqueados
-- para todo mundo (inclusive agência). Só a service role (Edge Function) acede.

-- ------------------------------------------------------------
-- Status de conexão (sem expor tokens) — usado pelo front
-- ------------------------------------------------------------
create or replace function google_calendar_status(ws uuid)
returns table (connected boolean, email text) as $$
declare
  r record;
begin
  select connected_email into r from google_calendar_connections where workspace_id = ws;
  if found then
    return query select true, r.connected_email;
  else
    return query select false, null::text;
  end if;
end;
$$ language plpgsql stable security definer;

grant execute on function google_calendar_status(uuid) to authenticated;
