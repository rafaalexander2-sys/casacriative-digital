# Contexto — Vitaree (Vitare Suplementos) · Meta Ads
> Cole este texto numa nova conversa para dar o contexto completo.

## O que foi feito em 10/06/2026
- Via **Meta Ads MCP**, foi extraído um snapshot completo das campanhas da conta **CA - VITARE SUPLEMENTOS** (ID `2079717816155914`, BM "vitareeoficial" `1570410800799990`, moeda BRL).
- Os dados foram guardados na pasta **`dados-campanhas-vitaree/`** do repositório **`rafaalexander2-sys/casacriative-digital`**, branch **`claude/inspiring-shannon-84nep5`** (commit `a4165ee`):
  - `campanhas.json` — 41 campanhas (2 ativas, 39 pausadas)
  - `conjuntos-anuncios.json` — 13 conjuntos
  - `anuncios.json` — 22 anúncios com gasto no período
  - `README.md` — resumo
- Link: https://github.com/rafaalexander2-sys/casacriative-digital/tree/claude/inspiring-shannon-84nep5/dados-campanhas-vitaree

## Dados do mês (últimos 30 dias: 11 mai – 9 jun 2026)
**Gasto total nas campanhas com atividade: ~R$1.800**

### Campanhas ATIVAS (vendas)
| Campanha | ID | Gasto | Impr. | Cliques | CTR | CPC | CPM |
|---|---|---|---|---|---|---|---|
| [Nowa] VIT \| FAST \| COMPRA \| JUN26 | 120242163576000609 | R$418,84 | 5.850 | 203 | 3,47% | R$2,06 | R$71,60 |
| [Nowa} VIT \| AQ \| COMPRA-HAIR \| JUN26 | 120242176613440609 | R$381,08 | 5.392 | 138 | 2,56% | R$2,76 | R$70,68 |

### Campanhas PAUSADAS com gasto no período
| Campanha | Gasto | CTR | CPC | Nota |
|---|---|---|---|---|
| Seguidores Novos (engajamento) | R$411,40 | 4,21% | R$0,28 | anúncios ainda registaram gasto |
| Colageno Verisol | R$302,31 | 4,03% | R$3,52 | CPM alto (R$141,66) |
| Venda RmK | R$188,20 | 3,40% | R$2,48 | |
| Colágeno | R$98,95 | **6,53%** | **R$0,47** | melhor CTR/CPC da conta |

### Estrutura ativa (conjuntos)
- **VIT | FAST | INTERESSES-INTENCAO | GERAL** (R$68/dia, conversões) — R$365,49 gastos, CTR 3,45%
- **Mulheres 30–55 · BR · sinal de cabelo/queda · exclui compradores 40d** (CBO, conversões) — R$381,08 gastos, CTR 2,56%
- VIT | FAST | LAL1-CARRINHO ficou pausado (CPC R$4,10, fraco)

### Top anúncios por gasto
1. "Teste - Novo anúncio de Engajamento" — R$377,10 · CTR 4,20% · CPC R$0,28 (campanha Seguidores Novos)
2. "VIT | STATIC | pote frases 1 | V1" — R$351,67 · CTR 2,38% · CPC R$3,06 (pausado)
3. "VIT | REEL | COLAGENO - Camile falando V1" — R$303,61 · CTR 4,10% · CPC R$2,01
4. "All Products - Vendas — Cópia" — R$302,31 · CTR 4,03% (catálogo)

### Observações
- As 39 campanhas pausadas sem métricas não tiveram entrega nos últimos 30 dias.
- Todos os IDs completos estão nos JSONs da pasta `dados-campanhas-vitaree/`.

## ATUALIZAÇÃO 10/06 — Conversões extraídas (ver `conversoes-30d.json`)
- **~R$1.800 gastos em 30 dias geraram ~2 compras atribuídas.** ROAS: 0,61 (FAST) e 0,49 (Seguidores). Muito abaixo de qualquer break-even.
- **Funil quebra no checkout:** ~20 checkouts iniciados → ~2 compras (~10%; típico é 30–50%). Suspeitos: frete/pagamento na Shopify OU evento Purchase mal configurado (CAPI/pixel).
- A campanha "Colágeno" (melhor CTR da conta) otimizava para **ADD_TO_CART**, não compra — métricas enganosas.
- **Conclusão: NÃO escalar para R$6k ainda.** Primeiro: (1) validar evento Purchase/CAPI no Events Manager, (2) investigar o checkout da loja, (3) consolidar estrutura com a verba atual e comprovar CPA < break-even. Só então escalar.
