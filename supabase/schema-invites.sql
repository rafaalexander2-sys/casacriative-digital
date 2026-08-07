-- ============================================================
-- Casa Criative CRM — Milestone 2: multi-cliente + convites
-- Cole no Supabase → SQL Editor → Run (depois do schema.sql)
-- Idempotente: pode rodar de novo sem quebrar.
-- ============================================================

-- ------------------------------------------------------------
-- Helper: o utilizador atual é membro da AGÊNCIA?
-- (security definer ignora RLS para não entrar em recursão)
-- ------------------------------------------------------------
create or replace function is_agency_member() returns boolean as $$
  select exists (
    select 1
    from memberships m
    join workspaces w on w.id = m.workspace_id
    where m.user_id = auth.uid() and w.is_agency = true
  );
$$ language sql stable security definer;

-- ------------------------------------------------------------
-- CONVITES
-- ------------------------------------------------------------
create table if not exists invitations (
  id           uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references workspaces(id) on delete cascade,
  email        text not null,
  role         text not null default 'member' check (role in ('owner','admin','member')),
  created_by   uuid references auth.users(id) on delete set null,
  accepted_at  timestamptz,
  created_at   timestamptz not null default now(),
  unique (workspace_id, email)
);
create index if not exists invitations_email_idx on invitations(lower(email));

-- ============================================================
-- POLICIES — a agência gere clientes, membros e convites
-- ============================================================

-- WORKSPACES: agência vê TODOS os clientes (não só onde é membro)
drop policy if exists ws_select on workspaces;
create policy ws_select on workspaces for select
  using (id in (select my_workspaces()) or is_agency_member());

-- WORKSPACES: só a agência cria/edita clientes
drop policy if exists ws_insert on workspaces;
create policy ws_insert on workspaces for insert
  with check (is_agency_member());

drop policy if exists ws_update on workspaces;
create policy ws_update on workspaces for update
  using (is_agency_member());

-- MEMBERSHIPS: agência gere quem entra em cada cliente
drop policy if exists mb_agency_manage on memberships;
create policy mb_agency_manage on memberships for all
  using (is_agency_member())
  with check (is_agency_member());

-- LEADS / EVENTS: agência acede aos leads de TODOS os clientes
drop policy if exists leads_all on leads;
create policy leads_all on leads for all
  using (workspace_id in (select my_workspaces()) or is_agency_member())
  with check (workspace_id in (select my_workspaces()) or is_agency_member());

drop policy if exists events_all on lead_events;
create policy events_all on lead_events for all
  using (workspace_id in (select my_workspaces()) or is_agency_member())
  with check (workspace_id in (select my_workspaces()) or is_agency_member());

-- INVITATIONS: só a agência cria/vê/apaga convites
alter table invitations enable row level security;
drop policy if exists inv_agency on invitations;
create policy inv_agency on invitations for all
  using (is_agency_member())
  with check (is_agency_member());

-- ============================================================
-- Ao logar, a pessoa "reclama" seus convites → vira membro
-- Chamado pelo front logo após autenticar (cobre user novo e existente)
-- ============================================================
create or replace function accept_my_invitations() returns void as $$
  insert into memberships (workspace_id, user_id, role)
  select i.workspace_id, auth.uid(), i.role
  from invitations i
  where lower(i.email) = lower(auth.jwt() ->> 'email')
    and i.accepted_at is null
  on conflict (workspace_id, user_id) do nothing;

  update invitations
  set accepted_at = now()
  where lower(email) = lower(auth.jwt() ->> 'email')
    and accepted_at is null;
$$ language sql security definer;

-- ============================================================
-- Listar membros de um cliente COM email (auth.users é protegido)
-- security definer + guarda de agência
-- ============================================================
create or replace function list_members(ws uuid)
returns table (user_id uuid, email text, role text) as $$
  select m.user_id, u.email::text, m.role
  from memberships m
  join auth.users u on u.id = m.user_id
  where m.workspace_id = ws
    and is_agency_member();
$$ language sql stable security definer;

grant execute on function accept_my_invitations() to authenticated;
grant execute on function list_members(uuid) to authenticated;
grant execute on function is_agency_member() to authenticated;
