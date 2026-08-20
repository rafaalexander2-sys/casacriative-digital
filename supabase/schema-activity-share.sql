-- ============================================================
-- Casa Criative CRM — Atividades: anexos + link público de briefing
-- Cole no Supabase → SQL Editor → Run (depois de schema-activity-fields.sql).
-- Idempotente: pode rodar de novo sem quebrar.
-- ============================================================

-- ------------------------------------------------------------
-- LINK PÚBLICO DA TAREFA
-- Cada atividade tem um token; o link só funciona com share_enabled = true.
-- Serve pra mandar a tarefa no WhatsApp pra quem não tem login no CRM.
-- ------------------------------------------------------------
alter table activities add column if not exists share_token uuid default gen_random_uuid();
alter table activities add column if not exists share_enabled boolean not null default false;

-- Atividades antigas ficam com token também
update activities set share_token = gen_random_uuid() where share_token is null;

create unique index if not exists activities_share_token_idx
  on activities(share_token) where share_token is not null;

-- ------------------------------------------------------------
-- RECORRÊNCIA
-- Ex.: "toda segunda gerar relatórios". Ao arrastar o cartão pra uma
-- coluna do tipo "Concluído", o CRM cria sozinho a próxima ocorrência
-- com as datas avançadas e o checklist desmarcado.
-- ------------------------------------------------------------
alter table activities add column if not exists recurrence text not null default 'none'
  check (recurrence in ('none','daily','weekly','biweekly','monthly'));
alter table activities add column if not exists recurrence_parent uuid references activities(id) on delete set null;

-- ------------------------------------------------------------
-- ANEXOS (briefing: imagens, PDFs, etc.)
-- O ficheiro em si vai pro Storage; aqui fica só o registo.
-- ------------------------------------------------------------
create table if not exists activity_attachments (
  id            uuid primary key default gen_random_uuid(),
  activity_id   uuid not null references activities(id) on delete cascade,
  workspace_id  uuid not null references workspaces(id) on delete cascade,
  name          text not null,
  path          text not null,          -- caminho dentro do bucket activity-files
  mime_type     text,
  size_bytes    bigint,
  created_by    uuid references auth.users(id) on delete set null,
  created_at    timestamptz not null default now()
);
create index if not exists activity_attachments_activity_idx on activity_attachments(activity_id, created_at);

alter table activity_attachments enable row level security;

drop policy if exists activity_attachments_all on activity_attachments;
create policy activity_attachments_all on activity_attachments for all
  using (workspace_id in (select my_workspaces()) or is_agency_member())
  with check (workspace_id in (select my_workspaces()) or is_agency_member());

-- ============================================================
-- STORAGE — bucket privado dos anexos
-- Caminho dos ficheiros: <workspace_id>/<activity_id>/<ficheiro>
-- O bucket é PRIVADO: a página pública recebe URLs assinadas geradas
-- pela Edge Function "public-task" (service role), com validade curta.
-- ============================================================
insert into storage.buckets (id, name, public)
values ('activity-files', 'activity-files', false)
on conflict (id) do nothing;

-- Quem pode ler/gravar: membro do espaço dono da pasta, ou a agência.
-- (compara como texto pra não rebentar se aparecer um caminho estranho)
drop policy if exists activity_files_select on storage.objects;
create policy activity_files_select on storage.objects for select
  using (
    bucket_id = 'activity-files' and (
      is_agency_member()
      or (storage.foldername(name))[1] in (select w::text from my_workspaces() w)
    )
  );

drop policy if exists activity_files_insert on storage.objects;
create policy activity_files_insert on storage.objects for insert
  with check (
    bucket_id = 'activity-files' and (
      is_agency_member()
      or (storage.foldername(name))[1] in (select w::text from my_workspaces() w)
    )
  );

drop policy if exists activity_files_delete on storage.objects;
create policy activity_files_delete on storage.objects for delete
  using (
    bucket_id = 'activity-files' and (
      is_agency_member()
      or (storage.foldername(name))[1] in (select w::text from my_workspaces() w)
    )
  );
