-- ============================================================
-- Casa Criative CRM — Atividades: colunas customizáveis + ativar por cliente
-- Cole no Supabase → SQL Editor → Run (depois de schema-activities.sql).
-- Idempotente: pode rodar de novo sem quebrar.
--
-- Contexto: o quadro de Atividades não é pra todo cliente — só os que
-- fazem sentido pra gestão de tarefas (ex.: Aline). A agência liga isso
-- por cliente em Clientes → (selecionar) → "Ativar quadro de Atividades".
-- Quando liga, as 3 colunas padrão (A Fazer/Em andamento/Concluído) são
-- criadas automaticamente — e dá pra editar como no funil de leads.
-- ============================================================

-- ------------------------------------------------------------
-- Liga/desliga o quadro de Atividades por espaço (default: desligado)
-- ------------------------------------------------------------
alter table workspaces add column if not exists activities_enabled boolean not null default false;

-- ------------------------------------------------------------
-- Colunas do quadro de Atividades, por espaço — mesmo padrão do
-- funil de leads (pipeline_stages), só que kind é open/done.
-- ------------------------------------------------------------
create table if not exists activity_stages (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  key          text not null,
  label        text not null,
  position     int  not null default 0,
  color        text not null default '#64748b',
  kind         text not null default 'open' check (kind in ('open','done')),
  created_at   timestamptz not null default now(),
  unique (workspace_id, key)
);
create index if not exists activity_stages_ws_idx on activity_stages(workspace_id, position);

-- activities.status deixa de ser um enum fixo (todo/doing/done) — agora é
-- a "key" de uma linha de activity_stages, igual leads.status/pipeline_stages.
alter table activities drop constraint if exists activities_status_check;

-- ------------------------------------------------------------
-- Semear as 3 etapas padrão num espaço
-- ------------------------------------------------------------
create or replace function seed_default_activity_stages(ws uuid) returns void as $$
  insert into activity_stages (workspace_id, key, label, position, color, kind) values
    (ws, 'todo',  'A Fazer',      1, '#64748b', 'open'),
    (ws, 'doing', 'Em andamento', 2, '#3b82f6', 'open'),
    (ws, 'done',  'Concluído',    3, '#22c55e', 'done')
  on conflict (workspace_id, key) do nothing;
$$ language sql;

-- Semear em todo espaço que já tem o quadro ativado mas ainda não tem colunas
do $$
declare w record;
begin
  for w in select id from workspaces where activities_enabled = true loop
    if not exists (select 1 from activity_stages where workspace_id = w.id) then
      perform seed_default_activity_stages(w.id);
    end if;
  end loop;
end $$;

-- Semear automaticamente quando a agência ativa o quadro pra um cliente
create or replace function seed_activity_stages_trigger() returns trigger as $$
begin
  if new.activities_enabled = true and (old.activities_enabled is distinct from true) then
    perform seed_default_activity_stages(new.id);
  end if;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists seed_activity_stages_on_enable on workspaces;
create trigger seed_activity_stages_on_enable after update on workspaces
  for each row execute function seed_activity_stages_trigger();

-- ============================================================
-- RLS — mesma regra do funil de leads
-- ============================================================
alter table activity_stages enable row level security;

drop policy if exists activity_stages_select on activity_stages;
create policy activity_stages_select on activity_stages for select
  using (workspace_id in (select my_workspaces()) or is_agency_member());

drop policy if exists activity_stages_manage on activity_stages;
create policy activity_stages_manage on activity_stages for all
  using (is_ws_admin(workspace_id))
  with check (is_ws_admin(workspace_id));
