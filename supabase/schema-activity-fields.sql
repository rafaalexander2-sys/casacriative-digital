-- ============================================================
-- Casa Criative CRM — Atividades: campos de gestão de tarefas
-- Cole no Supabase → SQL Editor → Run (depois de schema-activity-stages.sql).
-- Idempotente: pode rodar de novo sem quebrar.
--
-- Inspirado no que ClickUp/Trello/Notion usam num cartão de tarefa:
-- prioridade, data de início + data de entrega, etiquetas, estimativa
-- de horas e checklist (subtarefas).
-- ============================================================

-- ------------------------------------------------------------
-- Campos novos no cartão
-- ------------------------------------------------------------
-- Prioridade (bandeirinha colorida, estilo ClickUp)
alter table activities add column if not exists priority text not null default 'normal'
  check (priority in ('urgent','high','normal','low'));

-- Data de início (a due_date que já existia passa a ser a DATA DE ENTREGA)
alter table activities add column if not exists start_date timestamptz;

-- Etiquetas livres (estilo Trello labels)
alter table activities add column if not exists tags text[] not null default '{}';

-- Estimativa de esforço, em horas
alter table activities add column if not exists estimate_hours numeric(6,2);

create index if not exists activities_due_idx      on activities(workspace_id, due_date);
create index if not exists activities_priority_idx on activities(workspace_id, priority);

-- ------------------------------------------------------------
-- CHECKLIST / SUBTAREFAS  (itens dentro de um cartão)
-- ------------------------------------------------------------
create table if not exists activity_items (
  id            uuid primary key default gen_random_uuid(),
  activity_id   uuid not null references activities(id) on delete cascade,
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  title         text not null,
  done          boolean not null default false,
  position      int not null default 0,
  created_at    timestamptz not null default now()
);
create index if not exists activity_items_activity_idx on activity_items(activity_id, position);

-- ============================================================
-- RLS — mesma regra das atividades: membro do espaço, ou agência
-- ============================================================
alter table activity_items enable row level security;

drop policy if exists activity_items_all on activity_items;
create policy activity_items_all on activity_items for all
  using (workspace_id in (select my_workspaces()) or is_agency_member())
  with check (workspace_id in (select my_workspaces()) or is_agency_member());
