# Análise completa — E-commerce Vitaree · 12/06/2026

> Histórico de análises CC. Conta: CA - VITARE SUPLEMENTOS (2079717816155914) · Pixel: 2302067036928796

## Veredito
Conta pequena com mídia razoável, estrutura que fatiava sinal (corrigida em 11/06 com a CBO consolidada), ~72% da verba de 30d queimada em apostas sem venda (já pausadas), funil que morre no pagamento (~8% checkout→compra vs 30–50% benchmark) e pixel sem e-mail/telefone nas chaves de correspondência.

## 1. Verba — 30 dias (~R$1.800)
| Destino | Valor | Resultado |
|---|---|---|
| REEL Camile (FAST) | ~R$640 | única compra real ✅ |
| Campanha HAIR | ~R$381 | 0 compras em 9 dias |
| Seguidores Novos (legado) | R$411 | ROAS 0,49 ❌ pausada |
| Verisol catálogo (legado) | R$302 | CPM R$141, 0 vendas ❌ |
| "pote frases" hair | R$237 | CPC R$5,06, 0 vendas ❌ pausado |
| LAL1-Carrinho | ~R$98 | CPC R$4,10 ❌ pausado |
| RmK + Colágeno ATC (legado) | ~R$287 | 0 compras ❌ pausadas |

≈ R$1.300 (72%) sem nenhuma venda gerada.

## 2. Funil (7d, excl. testes Camile/Rafael)
22.645 impressões → 287 visitas (CTR 2,4% ✅) → 18 carrinhos (6,3% ✅) → 15 checkouts → 1 compra (~8% ❌).
Gargalo: pagamento. Marcos tentou 2× no domingo e desistiu 2×. Shopify: 5 abandonadores reais na semana, ~R$1.600 (Márcia R$719, Marcos R$429, Rosi, Isis, Geni), automação de recuperação aparentemente desligada (tudo "não recuperado"). Camile Pazello (dona) e Rafael = testes, excluídos.

## 3. Audiência (breakdown idade, 14d)
35–44: R$259 CTR 3,35% · 45–54: R$272 CTR 3,82% · 55–64: R$196 CTR 3,88% · 65+: R$212 CTR 4,95% (suspeita de clique acidental) · 18–24: R$62 CTR 2,05% (desperdício).
Núcleo real: 35–54. Ajustar sugestão de idade da CBO para 30–60 quando houver dados.

## 4. Tracking (EMQ)
EMQ 6,1 (ATC/IC/VC), 5,8 (PageView). Chaves presentes: IP, user_agent, external_id, fbc (100%).

**CORREÇÃO (12/06, após verificação fonte a fonte):** o compartilhamento Shopify↔Meta JÁ estava no nível Máximo e a API de Conversões está ativa e saudável — eventos de servidor fluindo em volume igual/superior ao navegador, deduplicação correta (compra de 09/06 visível nas duas fontes, contada 1×). A ausência de e-mail/telefone nas chaves dos eventos ATC/IC/PageView/VC é NORMAL (visitante anônimo ainda não digitou dados); o evento Purchase, que carrega e-mail, não pontua EMQ por volume baixo (2–3/semana). **Nenhuma ação necessária no data sharing.**

Pendência real do tracking: aviso de Diagnóstico no Events Manager — confirmar domínio `vitaree.com.br` (lista de permissões via botão "Analisar domínios" + verificação completa no BM em Segurança da marca → Domínios, meta-tag no theme.liquid da Shopify ou TXT no DNS).

Achado lateral: servidor registrou ~3 compras na loja em 7d, só 1 atribuída a anúncio — a loja vende também por orgânico/direto (relevante p/ MER).
Evento Purchase sem EMQ reportado (volume baixo). Opportunity Score Meta: sem recomendações pendentes.

## 5. Campanhas (estado 12/06)
- **CBO NOVA [Nowa] VIT | CBO | COMPRA | COLAGENO+HAIR (120242752450390609)**, R$100/dia, ativa desde 11/06: CTR 3,6–4,6%, CPC R$0,55–0,73, CPM R$22 (−40% vs antigas). Conjuntos: COLAGENO Mulheres 25+ (3 ads) e HAIR Mulheres 30-55 (5 ads). Reel Especialista: CPC R$0,35, CTR 5,5% — aposta.
- **FAST | COMPRA**: rodando em transição. 7d: R$421, 1 compra, ROAS 0,61. Camile = 79% da verba.
- **AQ | COMPRA-HAIR**: rodando em transição. 0 vendas na vida.
- Regra de transição: CBO registrar compra (ou dia 5) → pausar as duas antigas.

## 6. Economia unitária
Ticket observado ~R$257. Margem assumida 60% → CPA máx ~R$150, break-even ROAS ~1,7. Atual: CPA R$367+, ROAS 0,61. NÃO escalar p/ R$6k até CPA < R$150 comprovado. Falta: margem real e ticket médio da loja.

## 7. Plano por impacto
1. WhatsApp aos 5 abandonos reais (Márcia/Marcos primeiro) + perguntar ao Marcos o que travou — zero custo
2. Ligar automação de carrinho abandonado na Shopify — zero
3. Correspondência avançada Shopify→Meta (e-mail/telefone no pixel) — zero, 10 min
4. Dia 3–4 da CBO: pausar FAST/HAIR antigas se houver compra
5. 2–3 criativos UGC/semana padrão Camile; verba ao Especialista
6. Oferta de kit/assinatura no anúncio (ticket ↑)
7. Margem real → CPA-alvo → decisão dos R$6k

## Relatório 7d de referência (5–11 jun)
Total: R$799,47 · 22.645 impr · 1 compra · ROAS 0,61
| Campanha | Gasto | CTR | CPC | CPM | Compras |
|---|---|---|---|---|---|
| FAST | R$421,42 | 2,37% | R$1,62 | R$38,43 | 1 (ROAS 0,61) |
| HAIR | R$348,88 | 2,29% | R$1,47 | R$33,65 | 0 |
| CBO nova (1º dia) | R$29,17 | 3,58% | R$0,62 | R$22,23 | — |
