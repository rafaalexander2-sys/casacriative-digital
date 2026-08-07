# Casa Criative — Instruções para Claude

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
