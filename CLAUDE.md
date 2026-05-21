# Casa Criative — Instruções para Claude

## REGRA OBRIGATÓRIA: Deploy no Hostinger

O Hostinger serve ficheiros estáticos diretamente da pasta `out/`.
**Não tem build step — só serve o que estiver no repositório.**

### A cada mudança de código, SEMPRE:

```bash
npm run build        # gera a pasta out/ atualizada
git add out/ ...     # inclui a pasta out/ no commit
git commit -m "..."
git push origin main
```

Se o `out/` não for commitado, **o site online não muda**.

---

## Stack

- **Next.js** com `output: 'export'` (site estático, sem servidor)
- **Hostinger** — serve a pasta `out/` diretamente do repositório GitHub
- **localStorage** — toda a persistência de dados é client-side (sem base de dados)
- **Cloudflare Worker** — apenas para o formulário de contacto (`worker/index.js`)

## Branches

- `main` → produção (Hostinger)
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
