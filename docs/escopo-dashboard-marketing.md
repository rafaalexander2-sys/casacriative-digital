# Escopo de Trabalho — Dashboard de Marketing Personalizado

**Cliente:** _(a definir)_
**Fornecedor:** Casa Criative
**Versão:** 1.0 — rascunho para aprovação do cliente
**Data:** 2026-07-16

---

## 1. Objetivo

Construir um **painel (dashboard) de marketing totalmente personalizado** que reúne, num
único lugar, os dados de todas as fontes de marketing do cliente — mídia paga, analytics de
site, redes sociais orgânicas e CRM — apresentados de forma **clara, visual e acionável**:
gráficos, planilhas e listas que permitam ao cliente entender o desempenho e decidir sem
precisar abrir dez plataformas diferentes.

Este documento é um **cardápio de integrações e módulos**. O cliente seleciona o que faz
parte da primeira versão; o restante fica como roadmap.

---

## 2. Fontes de dados, integrações e ferramentas

Cada fonte abaixo é um **módulo independente**. O esforço e o custo variam conforme quantos
módulos entram no projeto.

### 2.1 Mídia paga (Ads)

| Plataforma | API oficial | O que traz para o board | Observações |
|---|---|---|---|
| **Meta Ads** (Facebook + Instagram) | Meta Marketing API / Insights | Investimento, impressões, alcance, cliques, CTR, CPC, CPM, CPA, ROAS, conversões, resultado por campanha/conjunto/anúncio | ✅ Já temos acesso à API Meta neste workspace (via integração Meta Ads). Prioritário. |
| **Google Ads** | Google Ads API | Investimento, cliques, CTR, CPC, conversões, custo/conversão, Search/Display/Performance Max | Requer conta MCC ou token OAuth do cliente |
| **TikTok Ads** | TikTok Marketing API | Investimento, views, cliques, CPA, conversões | _("Kitchen Ads" foi interpretado como TikTok/Google Ads — confirmar com o cliente qual plataforma)_ |
| **LinkedIn Ads** | LinkedIn Marketing API | Investimento, leads (lead gen forms), CPL, engajamento | Opcional — relevante para B2B |

> **Ponto a confirmar:** "Kitchen Ads" mencionado pelo cliente não é uma plataforma conhecida.
> Provavelmente é **Google Ads** ou **TikTok Ads** (ruído de transcrição de voz). Deixamos os
> dois no escopo até o cliente confirmar.

### 2.2 Analytics de site e SEO

| Ferramenta | API | O que traz |
|---|---|---|
| **Google Analytics 4 (GA4)** | GA4 Data API | Sessões, usuários, origem/mídia, taxa de conversão, eventos, funil, receita (e-commerce) |
| **Google Search Console** | Search Console API | Cliques orgânicos, impressões, posição média, palavras-chave, CTR orgânico |
| **Google Tag Manager** | — | Padronização de eventos/conversões que alimentam GA4 e os pixels |

### 2.3 Redes sociais orgânicas

| Plataforma | Fonte de dados | O que traz |
|---|---|---|
| **Instagram** (perfil comercial) | Instagram Graph API | Seguidores, alcance, impressões, engajamento, salvamentos, desempenho por post/reel/story |
| **Facebook Page** | Pages Insights API | Alcance, engajamento, curtidas, desempenho de publicações |
| **LinkedIn** (página) | LinkedIn API | Seguidores, impressões, engajamento |
| **TikTok** (orgânico) | TikTok Business API | Views, seguidores, engajamento por vídeo |
| **YouTube** | YouTube Analytics API | Views, tempo de exibição, inscritos, retenção |

### 2.4 CRM do cliente

Integração com o CRM que o cliente já usa, para fechar o ciclo **investimento → lead → venda**
e calcular o ROI real (não só o do anúncio).

| CRM | Integração | Traz para o board |
|---|---|---|
| **RD Station** | API REST | Leads, oportunidades, funil, origem do lead |
| **HubSpot** | API REST | Contatos, deals, pipeline, receita fechada |
| **Pipedrive** | API REST | Negócios, estágio, valor, taxa de conversão |
| **Outro / planilha** | CSV / Google Sheets / webhook | Fallback quando não há CRM formal |

> **Ponto a confirmar:** qual CRM o cliente usa (ou se usa planilha). Isso define o conector.

### 2.5 Outras fontes (opcionais)

- **WhatsApp Business** — volume de conversas, leads originados
- **E-mail marketing** (RD, Mailchimp, Brevo) — taxa de abertura, cliques, conversões
- **E-commerce** (Shopify, WooCommerce) — pedidos, receita, ticket médio, ROAS real

---

## 3. Arquitetura técnica proposta

> ⚠️ **Importante:** o site atual da Casa Criative é **estático** (Next.js `output: export` no
> Hostinger, persistência em `localStorage`, sem servidor). Um dashboard que puxa dados de
> várias APIs e guarda histórico **não cabe nessa arquitetura** — precisa de um backend e de um
> banco de dados de verdade. A proposta abaixo cobre isso.

```
┌─────────────────────────────────────────────────────────────────┐
│  FONTES (APIs)                                                    │
│  Meta Ads · Google Ads · GA4 · Search Console · Instagram ·      │
│  TikTok · LinkedIn · CRM (RD/HubSpot/Pipedrive)                  │
└───────────────┬─────────────────────────────────────────────────┘
                │  (conectores / ETL agendado)
                ▼
┌─────────────────────────────────────────────────────────────────┐
│  CAMADA DE INGESTÃO                                               │
│  Jobs agendados (cron) que chamam cada API, normalizam os dados  │
│  e gravam no banco. Reautenticação de tokens (OAuth refresh).    │
└───────────────┬─────────────────────────────────────────────────┘
                ▼
┌─────────────────────────────────────────────────────────────────┐
│  BANCO DE DADOS (histórico + métricas)                           │
│  Recomendado: Supabase (Postgres gerido) ou Postgres/MySQL.      │
│  Guarda séries temporais por dia/campanha/canal.                 │
└───────────────┬─────────────────────────────────────────────────┘
                │  (API interna / REST)
                ▼
┌─────────────────────────────────────────────────────────────────┐
│  FRONTEND (o board)                                              │
│  Next.js + React · gráficos, tabelas, filtros, exportação        │
│  Autenticação (login do cliente) · multi-cliente se necessário   │
└─────────────────────────────────────────────────────────────────┘
```

**Escolhas recomendadas:**

- **Banco de dados:** **Supabase** (Postgres gerido + autenticação + API pronta) — reduz muito
  o esforço de backend. Alternativa: Postgres/MySQL num VPS.
- **Backend/ETL:** funções agendadas (Supabase Edge Functions, Vercel Cron ou Cloudflare
  Workers — já usamos Cloudflare no projeto do formulário) que atualizam os dados 1–4× por dia.
- **Frontend:** manter **Next.js + React** (mesma stack do site atual), mas hospedado num
  ambiente com backend (**Vercel** recomendado) — não no export estático do Hostinger.
- **Autenticação:** login por cliente; suporte a multi-cliente/multi-conta se a Casa Criative
  quiser oferecer o mesmo board para vários clientes.

---

## 4. Frontend — visualizações e experiência

Tudo pensado para "deixar os dados claros para o cliente".

### 4.1 Visão geral (home do board)
- **KPIs de topo:** investimento total, leads, CPL, ROAS/ROI, receita — com comparação vs.
  período anterior (▲/▼ %).
- **Seletor de período** (7/30/90 dias, mês, personalizado) e **filtro por canal**.

### 4.2 Gráficos
- Linha temporal de investimento vs. resultados (leads/conversões/receita)
- Barras comparando canais (Meta vs. Google vs. TikTok…)
- Pizza/donut de distribuição de verba por canal
- Funil: impressões → cliques → leads → vendas
- Ranking de melhores campanhas e melhores criativos/posts

### 4.3 Planilhas / tabelas detalhadas
- Tabela por campanha (investimento, CPC, CTR, CPA, ROAS) com ordenação e busca
- Tabela de leads/oportunidades vindas do CRM com origem/canal
- **Exportação para CSV / Excel** e **PDF** do relatório

### 4.4 Listas
- Lista de alertas ("campanha X com CPA acima da meta", "verba quase esgotada")
- Lista de tarefas/recomendações da agência para o cliente
- Lista de melhores posts orgânicos da semana

### 4.5 Extras opcionais
- Relatório automático mensal por e-mail (PDF)
- Análise/insights por IA (resumo em texto do desempenho — já temos SDK de IA no projeto)
- Tema claro/escuro e identidade visual do cliente (white-label)

---

## 5. Fases de entrega

| Fase | Entrega | O que inclui |
|---|---|---|
| **0 — Descoberta** | Alinhamento | Definir KPIs, canais, CRM, acessos e identidade visual |
| **1 — Fundação** | Backend + banco | Arquitetura, banco de dados, autenticação, 1º conector (Meta Ads) |
| **2 — Integrações núcleo** | Dados entrando | GA4 + Google Ads + CRM + ingestão agendada |
| **3 — Frontend v1** | Board utilizável | Visão geral, gráficos principais, tabelas, filtros, exportação |
| **4 — Orgânico + extras** | Cobertura total | Redes sociais orgânicas, alertas, relatório por e-mail, insights de IA |
| **5 — Refino** | Ajustes | Feedback do cliente, white-label, documentação e treinamento |

> Uma **primeira versão útil** (Meta Ads + GA4 + CRM + frontend com gráficos e tabelas) é
> alcançável nas fases 0–3. As demais fontes entram de forma incremental.

---

## 6. O que precisamos do cliente (dependências)

Sem estes acessos as integrações não funcionam:

- Acesso (admin ou parceiro) à **conta de anúncios Meta** (Business Manager)
- Acesso à **conta Google Ads** e ao **GA4 / Search Console**
- Acesso às **contas de redes sociais** (Instagram comercial, páginas)
- **API key / usuário** do CRM (RD Station, HubSpot, Pipedrive…)
- Definição dos **KPIs e metas** que importam para o negócio
- **Identidade visual** (logo, cores) para o board personalizado

---

## 7. Premissas e pontos a confirmar

1. **"Kitchen Ads"** — confirmar se é **Google Ads** ou **TikTok Ads**.
2. **CRM** — qual o cliente usa (ou se é planilha/Google Sheets).
3. **Hospedagem** — o board sai do Hostinger estático para um ambiente com backend
   (recomendado: Vercel + Supabase). Confirmar com o cliente.
4. **Multi-cliente** — o board é só para este cliente ou a Casa Criative quer reutilizá-lo
   para uma carteira de clientes (white-label)?
5. **Frequência de atualização** dos dados (tempo real não é necessário; 1–4×/dia é o padrão
   e reduz custo de API).
6. **Quais módulos entram na v1** — o cliente escolhe do cardápio da seção 2.

---

## 8. Resumo executivo (para apresentar ao cliente)

> Vamos construir um painel só seu, onde num único lugar você vê **quanto investiu, quantos
> leads e vendas gerou e qual o retorno**, juntando Meta, Google, TikTok, seu site (Analytics),
> suas redes sociais e seu CRM. Tudo em gráficos, tabelas e listas fáceis de ler, com
> exportação em Excel/PDF e alertas quando algo precisa de atenção. Começamos pelo essencial
> (Meta Ads + Analytics + CRM) e vamos ampliando canal a canal.

---

_Documento gerado como base para aprovação. Ajustar valores, prazos e módulos conforme
negociação com o cliente._
