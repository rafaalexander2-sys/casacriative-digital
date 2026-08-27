# Casa Criative — Instruções para Claude

## Fluxo de trabalho OBRIGATÓRIO (Issues + Pull Requests)

Qualquer agente, de qualquer modelo, DEVE seguir este padrão **antes de implementar** mudanças:

1. **Toda tarefa vira uma Issue no GitHub**, categorizada com uma etiqueta:
   - `Correção` — corrige comportamento quebrado
   - `Melhoria` — aprimora algo existente
   - `Nova função` — funcionalidade nova
2. **Entregas são feitas via Pull Request** (nunca commitar direto na `main` para features/correções). Crie uma branch por tarefa (ex.: `fix/...`, `feat/...`, `docs/...`).
3. **Todo Pull Request DEVE conter, na descrição:**
   - **Issue relacionada** (ex.: `Closes #12`);
   - **O que mudou** — resumo objetivo das alterações;
   - **Como foi validado** — build, testes, verificações manuais;
   - **Riscos, limitações e próximos passos**.
4. Só fazer merge após o build da Cloudflare (preview/produção) passar.

> O deploy de produção é disparado pelo merge na `main` (ver seção de Deploy).

## Deploy das Edge Functions: automático pelo GitHub

`.github/workflows/deploy-edge-functions.yml` publica as funções do Supabase a
cada push na `main` que toque em `supabase/functions/**` (ou à mão em Actions →
"Deploy Edge Functions" → "Run workflow" — funciona pelo telemóvel).

Antes era preciso copiar o código à mão no painel do Supabase; o repositório e a
produção divergiam sem ninguém dar por isso.

- Segredo necessário: `SUPABASE_ACCESS_TOKEN` (GitHub → Settings → Secrets and
  variables → Actions). Gera-se em supabase.com/dashboard/account/tokens.
- `ingest-lead` e `public-task` vão com `--no-verify-jwt` — são públicas. **Sem
  esse sinalizador cada deploy volta a ligar a verificação de JWT e os leads do
  site deixam de entrar.**
- O último passo do workflow confirma que `ingest-lead` responde 400 (função
  correu) e não 401 (gateway barrou), e falha o deploy se tiver ficado fechada.

## Deploy: Cloudflare Pages (NÃO é Hostinger)

O site é servido pelo **Cloudflare Pages** (projeto `casacriative-digital2`,
domínio `casacriative.com.br`), conectado ao repo GitHub `rafaalexander2-sys/casacriative-digital`.

**O Cloudflare roda o próprio `npx next build` a cada push na `main`** (build
command = `npx next build`, saída = `out`). Ou seja: **o `out/` commitado é
ignorado** — quem gera o deploy é o build da Cloudflare.

### A cada mudança de código:

```bash
git add ...
git commit -m "..."
git push origin main   # dispara build + deploy automático na Cloudflare
```

⚠️ **Se o build da Cloudflare falhar, a produção fica presa na versão anterior.**
Causa comum: variável de ambiente faltando (ex.: `NEXT_PUBLIC_SUPABASE_*`).
As env vars ficam em: Cloudflare → Workers e Pages → casacriative-digital2 →
Configurações → Variáveis e segredos.

Para ver logs de build com erro: aba **Implantações** → deploy → **Detalhes** → Log de build.

---

## Stack

- **Next.js** com `output: 'export'` (site estático, sem servidor)
- **Cloudflare Pages** — build automático (`next build`) a cada push na `main`
- **Supabase** — backend do CRM (Postgres + Auth + RLS) em `/crm` (ver [[crm-casa-criative]] na memória)
- **localStorage** — persistência das ferramentas antigas (prospecção); CRM usa Supabase
- **Cloudflare Worker** — formulário de contacto (`worker/index.js`)

## Branches

- `main` → produção (Cloudflare Pages)
- `claude/linkedin-smb-outreach-SjgyT` → branch de desenvolvimento

## Ficheiros principais

| Ficheiro | O que faz |
|---|---|
| `app/prospeccao/page.tsx` | Dashboard CC Prospecter (fila, kanban, leads) |
| `lib/prospecting-types.ts` | Tipos, status, labels e cores dos prospects |
| `lib/message-templates.ts` | Templates de mensagem PT/ES por setor |
| `lib/ai-messages.ts` | Geração de mensagem via Perplexity API |
| `public/seeds-prospects.json` | 18 leads reais PT+ES pré-carregados |

## CC Prospecter — fluxo de outreach

1. **Seguir** no Instagram (status: `following`)
2. **Interagir** — curtir + comentar após 2-3 dias (status: `engaging`)
3. **Enviar DM** — gerar mensagem com IA + copiar + enviar (status: `sent`)

## Chaves API (guardadas em localStorage, nunca no código)

- `cc_perplexity_key` — Perplexity API (geração de mensagens com IA)
- `cc_apify_key` — Apify (scraping Instagram por hashtag)

## CRM — Histórico de movimentação e relatórios

- **Base:** `lead_stage_history` (`supabase/schema-lead-history.sql`) — uma linha por
  movimento de card, escrita por **gatilho no banco** (`log_lead_stage_change`), não
  pelo app. Assim importação, webhook e UPDATE manual também deixam rastro.
  `origin` diz no que confiar: `live` (gatilho), `backfill` (recuperado de
  `lead_events`), `seed` (ponto de partida das fichas importadas — data NÃO confiável).
- **Vista `lead_stage_spans`** (`security_invoker = on`): transforma movimentos em
  períodos — `entered_at`, `left_at`, `is_current`, `days_in_stage`. Quem ainda não
  saiu conta até `now()`, por isso o número cresce sozinho.
- **`leads.entry_date`** = marco zero do ciclo (quando a PESSOA chegou), separado de
  `created_at` (quando a FICHA foi criada). Editável à mão no cartão.
  `entry_date_estimated = true` marca data deduzida por nós — esses leads ficam de
  fora do cálculo de ciclo. Corrigir a data à mão limpa a flag.
- **Relatórios** (`ReportsView` em `app/crm/page.tsx`): filtro de período no topo
  (7/30/90 dias, mês, tudo, ou datas à mão) que manda em tudo, inclusive na
  exportação. Traz ciclo de vendas (mediana/média/min/máx), tempo mediano por etapa
  com taxa de avanço, e a tabela de parados por faixa (0–3/4–7/8–14/15+ dias) —
  clicar num número lista quem são.
- **Exportação** (`lib/crm-export.ts`): três CSVs que se cruzam pelo ID do lead —
  `leads` (larga, com UTMs, datas e os dias em CADA etapa), `movimentos` (base bruta)
  e `resumo-etapas` (agregado). Separador `;`, BOM UTF-8, decimal com vírgula e datas
  em dd/mm/aaaa no fuso de São Paulo (o banco guarda UTC). Fica em **Relatórios**;
  Configurações só tem o backup JSON.
- `ingest-lead` passa a aceitar `service`, `value`, `utm_term` e `utm_content`, e grava
  `entry_date` com a data real da chegada.

- **Etapa inicial do lead do webhook:** `ingest-lead` usa a PRIMEIRA coluna aberta do
  funil daquele espaço (`pipeline_stages`, menor `position`, `kind = 'open'`), não a
  chave `novo` fixa. O quadro só mostra um lead se `leads.status` bater exatamente com
  a `key` de uma coluna — com `novo` fixo, cliente que editou o funil recebia os leads
  no banco e não os via em coluna nenhuma.
- **Coluna "Sem etapa"** no Pipeline: aparece só quando há leads cujo `status` não
  corresponde a nenhuma coluna. Antes eram omitidos em silêncio. Arrastar para uma
  coluna real resolve.

**Setup necessário (uma vez):** rodar `supabase/schema-lead-history.sql` no SQL Editor
e fazer redeploy da Edge Function `ingest-lead`. Sem o SQL, a tela de Relatórios avisa
e o resto do CRM continua a funcionar.

## CRM — Atividades (Trello) + Google Agenda

- `app/crm/page.tsx` → `ActivitiesView` / `ActivityModal`: quadro de tarefas por espaço,
  com colunas customizáveis (`ActivityFunnelEditor`), prioridade, data de início,
  data de entrega, etiquetas, estimativa de horas, checklist/subtarefas,
  lead vinculado e responsável.
- Só aparece nos clientes com `workspaces.activities_enabled = true` (liga em Clientes).
- Tabelas: `activities` (`supabase/schema-activities.sql`), `activity_stages`
  (`schema-activity-stages.sql`), `activity_items` = checklist (`schema-activity-fields.sql`),
  `activity_attachments` = anexos (`schema-activity-share.sql`). RLS igual aos `leads` em todas.
- **Agenda** (`AgendaView`): grade semanal a partir de início/entrega/estimativa;
  marca em vermelho tarefas sobrepostas (não dá pra fazer duas ao mesmo tempo).
  A integração com o Google é **nos dois sentidos**: tarefa com data vira evento
  (`action: 'sync'`) e os compromissos do Google aparecem na grade
  (`action: 'list'`), entrando na conta do choque de horário. Evento marcado
  como "Disponível" no Google (`transparency: transparent`) não bloqueia horário.
  Prazo maior que 10h não vira bloco gigante: reserva só a estimativa terminando
  na hora da entrega (ver `activityWindow`).
- **Recorrência**: ao arrastar pra coluna `kind = 'done'`, `spawnNextOccurrence()`
  cria a próxima ocorrência com datas avançadas e checklist zerado.
- **Anexos**: bucket privado `activity-files` no Storage, caminho
  `<workspace_id>/<activity_id>/<ficheiro>`; dá pra colar imagem (Ctrl+V) no modal.
- **Responsável + notificações** (`schema-activity-notify.sql`): `activities.assigned_user_id`
  aponta pra um utilizador real; ao marcar alguém, cai uma linha em
  `activity_notifications` que a pessoa vê no sininho da sidebar ao entrar.
  Esse SQL também libera `list_members` pros membros do próprio espaço
  (antes só a agência conseguia listar, o que impedia escolher responsável).
- **Renomear cliente**: campo no topo de Clientes → (selecionar) — vale também
  pro espaço da própria agência, que aparece na mesma lista.
- **Link público** (`/t?t=<share_token>`): página estática que lê o token e chama a
  Edge Function pública `public-task` (deploy com "Verify JWT" DESLIGADO, igual
  `ingest-lead`). Só responde se o cartão estiver com `share_enabled = true`;
  os anexos vão como URLs assinadas de 7 dias.
- Google Agenda: tokens ficam em `google_calendar_connections`
  (`supabase/schema-google-calendar.sql`) — RLS sem policies, só a Edge Function
  `google-calendar` (service role) acede. O front só sabe conectado sim/não via
  `google_calendar_status()`.
- Fluxo OAuth: `lib/google-calendar.ts` monta a URL de autorização; o Google
  redireciona de volta pra `/crm?code=...&state=<workspace_id>`; `App` (em
  `app/crm/page.tsx`) captura isso e chama a Edge Function pra trocar o code por tokens.

**Setup necessário (uma vez, feito manualmente — o build da Cloudflare não faz isso):**
1. Google Cloud Console → criar projeto → "APIs e serviços" → ativar **Google Calendar API**.
2. Criar credencial **OAuth client ID** (tipo "Web application"). Origem autorizada:
   `https://crm.casacriative.com.br`. URI de redirecionamento autorizado:
   `https://crm.casacriative.com.br/crm`.
3. Cloudflare Pages → variável `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = Client ID.
4. Supabase → Edge Functions → deploy `google-calendar` → Secrets:
   `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` (o Client Secret nunca vai pro front).
5. Rodar `schema-activities.sql` e `schema-google-calendar.sql` no SQL Editor.

Sem esse setup, o botão "Conectar Google Agenda" mostra erro pedindo pra configurar
— o resto do CRM (quadro de atividades, pipeline, etc.) funciona normalmente sem ele.
