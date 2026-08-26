-- ============================================================
-- Casa Criative CRM — Histórico de movimentação dos cards
-- Cole no Supabase → SQL Editor → Run (depois de schema-stages.sql).
-- Idempotente: pode rodar de novo sem duplicar nada.
--
-- O QUE ISTO RESOLVE
-- Antes: o CRM só sabia em que etapa o lead ESTÁ. Não dava para saber
-- quando ele entrou nela, quanto tempo ficou em cada uma, nem quantos
-- estão parados há mais de X dias. Sem isso não existe ciclo de vendas.
--
-- A LIÇÃO DO created_at: o registo é feito por GATILHO no banco, não pelo
-- código do site. Assim nenhuma mudança de etapa escapa — nem importação,
-- nem webhook, nem UPDATE manual no SQL Editor.
-- ============================================================

-- ============================================================
-- 1) CAMPOS QUE FALTAVAM NO LEAD
-- ============================================================

-- Data de entrada = marco zero do ciclo de vendas.
-- Separada de created_at de propósito: created_at é quando a FICHA foi
-- criada no sistema; entry_date é quando a PESSOA chegou. Numa importação
-- em massa as duas divergem em meses.
alter table leads add column if not exists entry_date date;

-- true = a data foi deduzida por nós, não informada por quem atende.
-- Os relatórios podem excluir estas linhas para não mentir.
alter table leads add column if not exists entry_date_estimated boolean not null default false;

-- Motivo da perda (aparece na lista de fechados)
alter table leads add column if not exists lost_reason text;

-- Quantos contratos esta pessoa fechou (uma pessoa pode fechar mais de um)
alter table leads add column if not exists contracts_count int not null default 0;

-- Atribuição completa: faltavam estes dois
alter table leads add column if not exists utm_term text;
alter table leads add column if not exists utm_content text;

-- Backfill da data de entrada: usa a data de criação convertida para o
-- fuso de São Paulo (created_at é UTC — um lead das 21h ficava no dia
-- seguinte). Marca como ESTIMADA, porque para as fichas importadas
-- created_at é a data do import, não a da chegada real.
update leads
   set entry_date = (created_at at time zone 'America/Sao_Paulo')::date,
       entry_date_estimated = true
 where entry_date is null;

-- Daqui para a frente, lead novo sem data explícita já nasce com a de hoje
alter table leads alter column entry_date set default (now() at time zone 'America/Sao_Paulo')::date;

create index if not exists leads_entry_date_idx on leads(workspace_id, entry_date);

-- ============================================================
-- 2) A LINHA DO TEMPO DE CADA CARD
-- ============================================================
create table if not exists lead_stage_history (
  id            uuid primary key default gen_random_uuid(),
  lead_id       uuid not null references leads(id) on delete cascade,
  workspace_id  uuid not null references workspaces(id) on delete cascade,

  from_status   text,          -- key da etapa de onde saiu (null = entrada no funil)
  to_status     text not null, -- key da etapa para onde foi
  to_label      text,          -- rótulo da etapa NA ÉPOCA (reserva, caso a etapa seja apagada)

  changed_at    timestamptz not null default now(),
  changed_by    uuid references auth.users(id) on delete set null,

  -- de onde veio este registo, para o relatório saber no que confiar:
  --   live     = gravado pelo gatilho, em tempo real          (confiável)
  --   backfill = recuperado de lead_events (arrastos antigos) (confiável)
  --   seed     = ponto de partida das fichas importadas       (data NÃO confiável)
  origin        text not null default 'live'
                  check (origin in ('live','backfill','seed'))
);

create index if not exists lsh_lead_idx on lead_stage_history(lead_id, changed_at);
create index if not exists lsh_ws_idx   on lead_stage_history(workspace_id, changed_at);
-- impede duplicar o mesmo movimento ao rodar a migração de novo
create unique index if not exists lsh_dedup_idx
  on lead_stage_history(lead_id, to_status, changed_at);

-- ------------------------------------------------------------
-- RLS: igual aos leads — cliente A nunca vê movimento do cliente B
-- ------------------------------------------------------------
alter table lead_stage_history enable row level security;

drop policy if exists lsh_select on lead_stage_history;
create policy lsh_select on lead_stage_history for select
  using (workspace_id in (select my_workspaces()) or is_agency_member());

drop policy if exists lsh_insert on lead_stage_history;
create policy lsh_insert on lead_stage_history for insert
  with check (workspace_id in (select my_workspaces()) or is_agency_member());

-- Sem policy de update/delete de propósito: histórico não se edita.

-- ============================================================
-- 3) O GATILHO — é ele que garante que nada escapa
-- ============================================================
create or replace function log_lead_stage_change() returns trigger as $$
declare
  lbl text;
begin
  -- entrada no funil, ou mudança real de etapa
  if TG_OP = 'INSERT' or NEW.status is distinct from OLD.status then

    select label into lbl
      from pipeline_stages
     where workspace_id = NEW.workspace_id and key = NEW.status;

    insert into lead_stage_history
      (lead_id, workspace_id, from_status, to_status, to_label, changed_by, origin)
    values (
      NEW.id,
      NEW.workspace_id,
      case when TG_OP = 'INSERT' then null else OLD.status end,
      NEW.status,
      lbl,
      auth.uid(),
      'live'
    )
    on conflict do nothing;   -- dois updates no mesmo instante não quebram nada
  end if;
  return NEW;
end;
$$ language plpgsql security definer;

drop trigger if exists leads_stage_history on leads;
create trigger leads_stage_history after insert or update of status on leads
  for each row execute function log_lead_stage_change();

-- ============================================================
-- 4) RECUPERAR O PASSADO
-- ============================================================

-- 4a) Arrastos antigos: já estavam em lead_events. Estes têm data real.
insert into lead_stage_history
  (lead_id, workspace_id, from_status, to_status, to_label, changed_at, changed_by, origin)
select e.lead_id, e.workspace_id, e.from_status, e.to_status,
       (select label from pipeline_stages p
         where p.workspace_id = e.workspace_id and p.key = e.to_status),
       e.created_at, e.created_by, 'backfill'
  from lead_events e
 where e.type = 'status_change'
   and e.to_status is not null
on conflict do nothing;

-- 4b) Fichas que nunca se moveram (as importadas): ganham um ponto de
-- partida marcado como 'seed'. A data é a de criação — que para elas NÃO
-- é confiável. Por isso o relatório de ciclo ignora as linhas 'seed'.
insert into lead_stage_history
  (lead_id, workspace_id, from_status, to_status, to_label, changed_at, changed_by, origin)
select l.id, l.workspace_id, null, l.status,
       (select label from pipeline_stages p
         where p.workspace_id = l.workspace_id and p.key = l.status),
       l.created_at, null, 'seed'
  from leads l
 where not exists (select 1 from lead_stage_history h where h.lead_id = l.id)
on conflict do nothing;

-- ============================================================
-- 5) A VISTA QUE OS RELATÓRIOS LEEM
-- Transforma "movimentos" em "períodos": cada linha é uma passagem por
-- uma etapa, com quando entrou, quando saiu e quantos dias ficou.
-- Quem ainda não saiu conta até agora — por isso o número cresce sozinho.
--
-- security_invoker = on: a vista respeita a RLS de quem consulta.
-- ============================================================
drop view if exists lead_stage_spans;
create view lead_stage_spans with (security_invoker = on) as
select
  h.id,
  h.lead_id,
  h.workspace_id,
  h.to_status  as status,
  h.to_label   as label,
  h.from_status,
  h.origin,
  h.changed_by,
  h.changed_at as entered_at,
  lead(h.changed_at) over w as left_at,
  (lead(h.changed_at) over w) is null as is_current,
  round(
    extract(epoch from (coalesce(lead(h.changed_at) over w, now()) - h.changed_at)) / 86400.0
  , 2) as days_in_stage
from lead_stage_history h
window w as (partition by h.lead_id order by h.changed_at, h.id);

grant select on lead_stage_spans to authenticated;
