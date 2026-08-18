-- ============================================================
-- Casa Criative CRM — Atividades (quadro estilo Trello)
-- Cole no Supabase → SQL Editor → Run (depois do schema.sql).
-- Idempotente: pode rodar de novo sem quebrar.
-- ============================================================

-- ------------------------------------------------------------
-- ATIVIDADES  (cartões do quadro, por espaço)
-- status: colunas fixas do quadro (todo → doing → done)
-- lead_id: opcional, liga a atividade a um lead do pipeline
-- assigned_to: texto livre (nome da pessoa responsável)
-- google_event_id: id do evento no Google Agenda, quando sincronizado
-- ------------------------------------------------------------
create table if not exists activities (
  id               uuid primary key default gen_random_uuid(),
  workspace_id     uuid not null references workspaces(id) on delete cascade,
  lead_id          uuid references leads(id) on delete set null,
  title            text not null,
  description      text,
  status           text not null default 'todo' check (status in ('todo','doing','done')),
  due_date         timestamptz,
  assigned_to      text,
  position         int not null default 0,
  google_event_id  text,
  created_by       uuid references auth.users(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists activities_workspace_idx on activities(workspace_id);
create index if not exists activities_status_idx    on activities(workspace_id, status);

drop trigger if exists activities_updated_at on activities;
create trigger activities_updated_at before update on activities
  for each row execute function set_updated_at();

-- ============================================================
-- RLS — mesma regra dos leads: membro do espaço, ou agência
-- ============================================================
alter table activities enable row level security;

drop policy if exists activities_all on activities;
create policy activities_all on activities for all
  using (workspace_id in (select my_workspaces()) or is_agency_member())
  with check (workspace_id in (select my_workspaces()) or is_agency_member());
