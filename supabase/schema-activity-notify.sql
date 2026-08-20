-- ============================================================
-- Casa Criative CRM — Responsável de verdade + notificações
-- Cole no Supabase → SQL Editor → Run (depois de schema-activity-share.sql).
-- Idempotente: pode rodar de novo sem quebrar.
--
-- Antes: "responsável" era só um nome digitado. Agora dá pra marcar uma
-- pessoa que tem login, e ela recebe um aviso ao entrar no CRM.
-- ============================================================

-- ------------------------------------------------------------
-- Responsável ligado a um utilizador real
-- (o campo de texto assigned_to continua, pra quem não tem login)
-- ------------------------------------------------------------
alter table activities add column if not exists assigned_user_id uuid references auth.users(id) on delete set null;
create index if not exists activities_assigned_user_idx on activities(assigned_user_id) where assigned_user_id is not null;

-- ------------------------------------------------------------
-- NOTIFICAÇÕES  (o sininho do CRM)
-- Uma linha por pessoa avisada. Cada um só vê as suas.
-- ------------------------------------------------------------
create table if not exists activity_notifications (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  activity_id   uuid references activities(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,   -- quem recebe
  actor_id      uuid references auth.users(id) on delete set null,           -- quem gerou
  type          text not null default 'assigned',
  title         text not null,
  message       text,
  read_at       timestamptz,
  created_at    timestamptz not null default now()
);
create index if not exists activity_notifications_user_idx
  on activity_notifications(user_id, read_at, created_at desc);

alter table activity_notifications enable row level security;

-- Ler / marcar como lida: só as próprias
drop policy if exists notif_select_own on activity_notifications;
create policy notif_select_own on activity_notifications for select
  using (user_id = auth.uid());

drop policy if exists notif_update_own on activity_notifications;
create policy notif_update_own on activity_notifications for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists notif_delete_own on activity_notifications;
create policy notif_delete_own on activity_notifications for delete
  using (user_id = auth.uid());

-- Criar aviso para outra pessoa: só dentro de um espaço a que se pertence
drop policy if exists notif_insert_ws on activity_notifications;
create policy notif_insert_ws on activity_notifications for insert
  with check (workspace_id in (select my_workspaces()) or is_agency_member());

-- ============================================================
-- list_members: passa a servir também aos membros do próprio espaço
-- (antes só a agência conseguia listar — sem isso não dá pra escolher
--  o responsável dentro de um cliente)
-- ============================================================
create or replace function list_members(ws uuid)
returns table (user_id uuid, email text, role text) as $$
  select m.user_id, u.email::text, m.role
  from memberships m
  join auth.users u on u.id = m.user_id
  where m.workspace_id = ws
    and (is_agency_member() or ws in (select my_workspaces()));
$$ language sql stable security definer;

grant execute on function list_members(uuid) to authenticated;
