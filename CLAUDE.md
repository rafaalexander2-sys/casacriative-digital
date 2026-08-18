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

## CRM — Atividades (Trello) + Google Agenda

- `app/crm/page.tsx` → `ActivitiesView` / `ActivityModal`: quadro de tarefas por espaço
  (colunas fixas A Fazer/Em andamento/Concluído), com data, lead vinculado e responsável.
- Tabela `activities` (`supabase/schema-activities.sql`), RLS igual aos `leads`.
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
