-- ============================================================
-- Casa Criative CRM — Funil personalizável (etapas por cliente)
-- Cole no Supabase → SQL Editor → Run.
-- ============================================================

-- ------------------------------------------------------------
-- Etapas do pipeline, por espaço (workspace)
-- kind: open (aberto) | won (ganho) | lost (perdido)
-- key: identificador estável usado em leads.status (não muda ao renomear)
-- ------------------------------------------------------------
create table if not exists pipeline_stages (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  key          text not null,
  label        text not null,
  position     int  not null default 0,
  color        text not null default '#64748b',
  kind         text not null default 'open' check (kind in ('open','won','lost')),
  created_at   timestamptz not null default now(),
  unique (workspace_id, key)
);
create index if not exists pipeline_stages_ws_idx on pipeline_stages(workspace_id, position);

-- leads.status deixa de ser enum fixo (agora é a "key" de uma etapa)
alter table leads drop constraint if exists leads_status_check;

-- ------------------------------------------------------------
-- Quem pode gerir o funil: agência OU dono/admin do próprio espaço
-- ------------------------------------------------------------
create or replace function is_ws_admin(ws uuid) returns boolean as $$
  select is_agency_member() or exists (
    select 1 from memberships m
    where m.workspace_id = ws and m.user_id = auth.uid() and m.role in ('owner','admin')
  );
$$ language sql stable security definer;

-- ------------------------------------------------------------
-- Semear as 5 etapas padrão num espaço
-- ------------------------------------------------------------
create or replace function seed_default_stages(ws uuid) returns void as $$
  insert into pipeline_stages (workspace_id, key, label, position, color, kind) values
    (ws, 'novo',        'Novo',        1, '#64748b', 'open'),
    (ws, 'qualificado', 'Qualificado', 2, '#3b82f6', 'open'),
    (ws, 'proposta',    'Proposta',    3, '#c47a4a', 'open'),
    (ws, 'ganho',       'Ganho',       4, '#22c55e', 'won'),
    (ws, 'perdido',     'Perdido',     5, '#ef4444', 'lost')
  on conflict (workspace_id, key) do nothing;
$$ language sql;

-- Semear em todos os espaços que ainda não têm etapas
do $$
declare w record;
begin
  for w in select id from workspaces loop
    if not exists (select 1 from pipeline_stages where workspace_id = w.id) then
      perform seed_default_stages(w.id);
    end if;
  end loop;
end $$;

-- Semear automaticamente ao criar um novo espaço
create or replace function seed_stages_trigger() returns trigger as $$
begin
  perform seed_default_stages(new.id);
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists seed_stages_on_ws on workspaces;
create trigger seed_stages_on_ws after insert on workspaces
  for each row execute function seed_stages_trigger();

-- ============================================================
-- RLS
-- ============================================================
alter table pipeline_stages enable row level security;

drop policy if exists stages_select on pipeline_stages;
create policy stages_select on pipeline_stages for select
  using (workspace_id in (select my_workspaces()) or is_agency_member());

drop policy if exists stages_manage on pipeline_stages;
create policy stages_manage on pipeline_stages for all
  using (is_ws_admin(workspace_id))
  with check (is_ws_admin(workspace_id));

grant execute on function is_ws_admin(uuid) to authenticated;
grant execute on function seed_default_stages(uuid) to authenticated;
