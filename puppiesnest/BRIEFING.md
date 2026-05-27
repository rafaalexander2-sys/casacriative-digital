# Puppies Nest — Briefing para nova sessão Claude

## Contexto do projeto

Loja de dropshipping de produtos para pets focada nos **Países Baixos (NL) e Reino Unido (UK)**.
Site live: **www.puppiesnest.com**
Plataforma: **Wix** (pago por 1 ano)
GitHub repo Wix Velo: **rafaalexander2-sys/puppiesnest.com**

## O que foi feito nesta sessão

1. Análise da logo Puppies Nest (coral #E8452A, fontes Nunito + Inter)
2. Criado design system completo baseado na logo
3. Criado `global.css` — design system completo para Wix Velo
4. Criado `home-page.js` — JavaScript Velo para homepage
5. Criado `homepage-structure.md` — guia de secções da homepage
6. Wix foi ligado ao GitHub via Velo Dev Mode
7. **Bloqueio:** esta sessão só tem acesso ao repo `casacriative-digital`, não ao `puppiesnest.com`

## O que falta fazer (próxima sessão)

### Prioridade 1 — Homepage
- [ ] Push do `global.css` para o repo `rafaalexander2-sys/puppiesnest.com`
- [ ] Push do `home-page.js` para o repo
- [ ] Verificar estrutura de pastas do repo Wix (src/pages, src/styles, etc.)
- [ ] Ajustar seletores CSS conforme template atual

### Prioridade 2 — Conteúdo
- [ ] Mudar "Call Us 123-456-7890" para algo real ou remover
- [ ] Mudar "A Pet's Favorite Place" para "Premium Pet Accessories · NL & UK"
- [ ] Mudar barra de anúncio de teal para coral #E8452A
- [ ] Adicionar trust bar (entrega rápida, pagamento seguro, devoluções, reviews)

### Prioridade 3 — Produto e conversão
- [ ] Página de produto premium com delivery estimator NL/UK
- [ ] Integração com fornecedor EU (Spocket ou AutoDS)
- [ ] Adicionar 20 produtos pet com boas margens

---

## Design System

### Cores
```
--pn-primary:       #E8452A   (coral da logo)
--pn-primary-hover: #C73318
--pn-primary-light: #FFF1EF
--pn-black:         #1A1A1A
--pn-gray-700:      #3D3633
--pn-gray-500:      #6B6360
--pn-gray-100:      #F5F0EE
--pn-bg-warm:       #FFF8F6
--pn-white:         #FFFFFF
```

### Tipografia
- **Títulos:** Nunito 800/900 — letter-spacing: -0.025em
- **Corpo:** Inter 400/500 — line-height: 1.7

### Componentes
- Botões: border-radius pill (100px), sombra coral
- Cards: border-radius 14px, hover lift + sombra coral
- Inputs: border-radius 12px, focus coral

---

## Estrutura Homepage (8 secções)

1. **Announcement Bar** — fundo #E8452A, texto rotativo via JS
2. **Hero** — full width, foto lifestyle, H1 "Everything your pet deserves."
3. **Trust Bar** — 4 colunas: Fast Delivery / Secure Payment / Free Returns / 2K+ Reviews
4. **Best Sellers** — grid 4 produtos, fundo #FFF8F6
5. **Por que Puppies Nest** — 3 valores: EU suppliers / Vet-approved / Eco packaging
6. **Testimonials** — 3 cards com reviews reais
7. **Newsletter** — fundo escuro #1A1A1A, 10% desconto
8. **Footer** — escuro, 4 colunas

---

## Fornecedores recomendados para NL + UK

| Fornecedor | Entrega | Margem | Integração Wix |
|---|---|---|---|
| **AutoDS** | 2–5 dias UK/EU | 40–65% | ✅ App Market |
| **Spocket** | 2–5 dias EU | 30–50% | ✅ Nativo |
| **Van der Meer** | 1–3 dias NL/BE/DE | variável | Manual API |

## Produtos com melhor margem

- Dog cooling mats — 55–65%
- Cat water fountains — 50–60%
- Lick mats / slow feeders — 60–70%
- Paw cleaners — 55–65%
- No-pull harness — 60–65%

---

## Ficheiros criados (em casacriative-digital/puppiesnest/)

- `global.css` — design system completo Wix Velo
- `home-page.js` — JS Velo homepage (announcement bar, countdown, animações)
- `homepage-structure.md` — guia secção a secção

---

## Instrução para nova sessão

> "Continua o trabalho da Puppies Nest. O repo Wix Velo é rafaalexander2-sys/puppiesnest.com.
> Tens acesso a esta sessão? Lê o BRIEFING.md em casacriative-digital/puppiesnest/BRIEFING.md
> e continua a partir daí — começa por fazer push do global.css e home-page.js para o repo correto."
