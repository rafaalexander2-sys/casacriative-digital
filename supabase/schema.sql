-- ============================================================
-- Casa Criative CRM — Schema (milestone 1: CRM core)
-- Cole isto no Supabase → SQL Editor → Run
-- ============================================================

-- Extensões
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- WORKSPACES  (cada cliente + a própria agência)
-- ------------------------------------------------------------
create table if not exists workspaces (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  is_agency   boolean not null default false,  -- true = workspace comercial da Casa Criative
  created_at  timestamptz not null default now()
);

-- ------------------------------------------------------------
-- MEMBERSHIPS  (que utilizador acede a que workspace)
-- role: owner | admin | member
-- ------------------------------------------------------------
create table if not exists memberships (
  id            uuid primary key default gen_random_uuid(),
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  user_id       uuid not null references auth.users(id) on delete cascade,
  role          text not null default 'member' check (role in ('owner','admin','member')),
  created_at    timestamptz not null default now(),
  unique (workspace_id, user_id)
);

-- ------------------------------------------------------------
-- LEADS
-- source: form | whatsapp | meta_ads | google_ads | manual | import
-- status pipeline: novo → qualificado → proposta → ganho | perdido
-- ------------------------------------------------------------
create table if not exists leads (
  id             uuid primary key default gen_random_uuid(),
  workspace_id   uuid not null references workspaces(id) on delete cascade,
  name           text not null,
  email          text,
  phone          text,
  company        text,
  source         text not null default 'manual'
                   check (source in ('form','whatsapp','meta_ads','google_ads','manual','import')),
  status         text not null default 'novo'
                   check (status in ('novo','qualificado','proposta','ganho','perdido')),
  value          numeric(12,2),                 -- valor estimado / fechado do negócio
  notes          text,

  -- rastreio de origem de tráfego (para retroalimentar Meta/Google na etapa 4)
  utm_source     text,
  utm_medium     text,
  utm_campaign   text,
  fbclid         text,   -- click id do Meta (Conversions API)
  gclid          text,   -- click id do Google (Offline Conversions)

  -- sinalização de envio para as plataformas de anúncios
  synced_to_ads  boolean not null default false,
  synced_at      timestamptz,

  assigned_to    uuid references auth.users(id) on delete set null,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  won_at         timestamptz,
  lost_at        timestamptz
);

create index if not exists leads_workspace_idx on leads(workspace_id);
create index if not exists leads_status_idx    on leads(workspace_id, status);

-- ------------------------------------------------------------
-- LEAD EVENTS  (histórico: mudança de status, notas, contactos)
-- é a base do que alimenta o Ads depois
-- ------------------------------------------------------------
create table if not exists lead_events (
  id           uuid primary key default gen_random_uuid(),
  lead_id      uuid not null references leads(id) on delete cascade,
  workspace_id uuid not null references workspaces(id) on delete cascade,
  type         text not null,      -- status_change | note | contact | created
  from_status  text,
  to_status    text,
  message      text,
  created_by   uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);

create index if not exists lead_events_lead_idx on lead_events(lead_id);

-- ------------------------------------------------------------
-- updated_at automático
-- ------------------------------------------------------------
create or replace function set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists leads_updated_at on leads;
create trigger leads_updated_at before update on leads
  for each row execute function set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY — cliente A nunca vê lead do cliente B
-- ============================================================
alter table workspaces  enable row level security;
alter table memberships enable row level security;
alter table leads       enable row level security;
alter table lead_events enable row level security;

-- helper: workspaces a que o utilizador atual pertence
create or replace function my_workspaces() returns setof uuid as $$
  select workspace_id from memberships where user_id = auth.uid();
$$ language sql stable security definer;

-- WORKSPACES: vê os que é membro
drop policy if exists ws_select on workspaces;
create policy ws_select on workspaces for select
  using (id in (select my_workspaces()));

-- MEMBERSHIPS: vê as próprias
drop policy if exists mb_select on memberships;
create policy mb_select on memberships for select
  using (user_id = auth.uid() or workspace_id in (select my_workspaces()));

-- LEADS: full acesso apenas dentro dos seus workspaces
drop policy if exists leads_all on leads;
create policy leads_all on leads for all
  using (workspace_id in (select my_workspaces()))
  with check (workspace_id in (select my_workspaces()));

-- LEAD EVENTS: idem
drop policy if exists events_all on lead_events;
create policy events_all on lead_events for all
  using (workspace_id in (select my_workspaces()))
  with check (workspace_id in (select my_workspaces()));

-- ============================================================
-- SEED opcional: cria o workspace da agência (corre depois de te registares)
-- Substitui o email pelo teu.
-- ============================================================
-- insert into workspaces (name, is_agency) values ('Casa Criative (Comercial)', true);
-- insert into memberships (workspace_id, user_id, role)
--   select w.id, u.id, 'owner'
--   from workspaces w, auth.users u
--   where w.is_agency = true and u.email = 'rafaalexander2@gmail.com';
