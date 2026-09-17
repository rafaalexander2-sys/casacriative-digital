-- ============================================================
-- Casa Criative CRM — Códigos de referência do WhatsApp
-- Cole no Supabase → SQL Editor → Run. Idempotente.
--
-- O PROBLEMA
-- A pessoa clica no anúncio, abre o WhatsApp, e a conversa acontece fora do
-- site. Quem atende cadastra o lead à mão. Nesse trajeto perde-se tudo o que
-- o navegador sabia sobre o clique: gclid, campanha, página de entrada.
--
-- A PONTE
-- No clique, o site gera um código curto, junta-o à mensagem pré-preenchida
-- ("[ref: A7X29K]") e guarda aqui a associação código → atribuição. Quem
-- atende vê o código na primeira mensagem e cola-o no cadastro. O gatilho
-- lá em baixo faz o resto sozinho.
--
-- Porquê gatilho e não código do app: o lead pode ser criado pela tela, por
-- importação ou por webhook. Um gatilho apanha os três. Já tivemos o problema
-- oposto e custou semanas de dados.
-- ============================================================

-- ------------------------------------------------------------
-- 1) A associação código → atribuição
-- ------------------------------------------------------------
create table if not exists lead_refs (
  ref           text primary key,
  workspace_id  uuid not null references workspaces(id) on delete cascade,

  gclid         text,
  gbraid        text,   -- o Google usa estes dois no lugar do gclid quando
  wbraid        text,   -- o iOS restringe cookies
  fbclid        text,

  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_term      text,
  utm_content   text,

  landing_page  text,
  referrer      text,
  page          text,   -- página de onde saiu o clique
  cta           text,   -- texto do botão clicado
  user_agent    text,
  ip            text,

  created_at    timestamptz not null default now(),
  -- preenchido quando um lead reclama este código
  used_by       uuid references leads(id) on delete set null,
  used_at       timestamptz
);

create index if not exists lead_refs_ws_idx on lead_refs(workspace_id, created_at desc);
create index if not exists lead_refs_livres_idx on lead_refs(workspace_id) where used_by is null;

alter table lead_refs enable row level security;

-- Ler: quem vê o espaço. Escrever: só a Edge Function (service role), que
-- ignora RLS — por isso não há policy de insert.
drop policy if exists lead_refs_select on lead_refs;
create policy lead_refs_select on lead_refs for select
  using (workspace_id in (select my_workspaces()) or is_agency_member());

-- ------------------------------------------------------------
-- 2) Campos no lead
-- ------------------------------------------------------------
alter table leads add column if not exists gbraid text;
alter table leads add column if not exists wbraid text;
-- o código que ligou este lead ao clique (nulo = não rastreado)
alter table leads add column if not exists ref_code text;
alter table leads add column if not exists landing_page text;

-- ------------------------------------------------------------
-- 3) O gatilho: extrai o código e preenche a atribuição
--
-- Procura "[ref: XXXXXX]" — ou o código solto — nas anotações e no nome.
-- Quem atende só tem de colar o que veio na mensagem; não precisa saber onde.
-- ------------------------------------------------------------
create or replace function resolver_ref_do_lead() returns trigger as $$
declare
  achado text;
  r      lead_refs%rowtype;
begin
  -- Já resolvido: não mexer.
  if NEW.ref_code is not null then return NEW; end if;

  -- 1º: formato explícito [ref: XXXX] nas anotações ou no nome
  achado := (regexp_match(
    coalesce(NEW.notes, '') || ' ' || coalesce(NEW.name, ''),
    '\[\s*ref\s*:\s*([A-Za-z0-9]{4,12})\s*\]', 'i'))[1];

  -- 2º: código solto numa linha das anotações, para quando colam só o código
  if achado is null then
    achado := (regexp_match(
      coalesce(NEW.notes, ''),
      '(?:^|\s)([A-HJ-NP-Z2-9]{6})(?:\s|$)'))[1];
  end if;

  if achado is null then return NEW; end if;

  select * into r from lead_refs
   where ref = upper(achado) and workspace_id = NEW.workspace_id;

  -- Código de outro espaço ou inexistente: não inventar atribuição.
  if not found then return NEW; end if;

  NEW.ref_code := r.ref;
  -- coalesce: o que já veio preenchido no lead ganha. Se o webhook trouxe um
  -- gclid, não é a referência que o vai sobrescrever.
  NEW.gclid        := coalesce(NEW.gclid,        r.gclid);
  NEW.gbraid       := coalesce(NEW.gbraid,       r.gbraid);
  NEW.wbraid       := coalesce(NEW.wbraid,       r.wbraid);
  NEW.fbclid       := coalesce(NEW.fbclid,       r.fbclid);
  NEW.utm_source   := coalesce(NEW.utm_source,   r.utm_source);
  NEW.utm_medium   := coalesce(NEW.utm_medium,   r.utm_medium);
  NEW.utm_campaign := coalesce(NEW.utm_campaign, r.utm_campaign);
  NEW.utm_term     := coalesce(NEW.utm_term,     r.utm_term);
  NEW.utm_content  := coalesce(NEW.utm_content,  r.utm_content);
  NEW.landing_page := coalesce(NEW.landing_page, r.landing_page);

  -- Origem passa a refletir o que o clique diz, em vez do palpite de quem
  -- cadastrou. Só quando há identificador de clique para sustentar.
  if r.gclid is not null or r.gbraid is not null or r.wbraid is not null then
    NEW.source := 'google_ads';
  elsif r.fbclid is not null then
    NEW.source := 'meta_ads';
  end if;

  return NEW;
end;
$$ language plpgsql;

drop trigger if exists leads_resolver_ref on leads;
create trigger leads_resolver_ref before insert or update of notes, name on leads
  for each row execute function resolver_ref_do_lead();

-- Marca a referência como usada (depois de o lead existir).
create or replace function marcar_ref_usada() returns trigger as $$
begin
  if NEW.ref_code is not null then
    update lead_refs set used_by = NEW.id, used_at = now()
     where ref = NEW.ref_code and used_by is null;
  end if;
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists leads_marcar_ref on leads;
create trigger leads_marcar_ref after insert or update of ref_code on leads
  for each row execute function marcar_ref_usada();

-- ------------------------------------------------------------
-- 4) Saúde do rastreamento, por semana
--
-- Sem isto a regressão volta em silêncio — foi exactamente o que aconteceu
-- até aqui: a cobertura esteve em 1,4% durante três meses sem ninguém ver.
-- ------------------------------------------------------------
drop view if exists lead_attrib_health;
create view lead_attrib_health with (security_invoker = on) as
select
  l.workspace_id,
  date_trunc('week', l.created_at at time zone 'America/Sao_Paulo')::date as semana,
  count(*) as leads,
  count(*) filter (where l.ref_code is not null) as com_ref,
  count(*) filter (where coalesce(l.gclid, l.gbraid, l.wbraid) is not null) as com_clique_google,
  count(*) filter (where l.fbclid is not null) as com_clique_meta,
  round(100.0 * count(*) filter (where coalesce(l.gclid, l.gbraid, l.wbraid) is not null)
        / nullif(count(*), 0), 1) as pct_google,
  count(*) filter (where l.source = 'google_ads') as marcado_google,
  count(*) filter (where l.source = 'meta_ads')   as marcado_meta
from leads l
group by 1, 2;

grant select on lead_attrib_health to authenticated;
