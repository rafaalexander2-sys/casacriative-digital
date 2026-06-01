# Checklist — Tracking Shopify + Meta CAPI (padrão Nowa)

Setup de rastreamento para e-commerce Shopify com tráfego pago.
Aplicável a clientes com orçamento até ~R$30k/mês (acima disso, avaliar sGTM dedicado).

---

## Resultado esperado

- Eventos de compra chegando ao Meta via Pixel **e** CAPI, com deduplicação correta
- Qualidade do evento `Purchase` (EMQ) ≥ 7 no Events Manager
- `value` e `currency` corretos em todas as compras (essencial para o algoritmo otimizar ROAS)
- Enhanced Conversions ativo no Google Ads

---

## Parte 1 — Meta (Pixel + CAPI nativo do Shopify)

### 1.1 Conectar o canal Facebook & Instagram
- [ ] No Shopify Admin → **Settings → Apps and sales channels** → instalar **Facebook & Instagram** (canal oficial Shopify, gratuito)
- [ ] Conectar à conta de **Business Manager** correta do cliente
- [ ] Selecionar o **Pixel** correto (criar um novo se o cliente não tiver)
- [ ] Ativar **Maximum / Enhanced data sharing** (ativa o CAPI server-side automático)

### 1.2 Validar deduplicação
- [ ] No **Events Manager → Overview**, confirmar que `Purchase` aparece com origem **Browser + Server**
- [ ] Verificar que a coluna **"Eventos deduplicados"** está sendo aplicada (mesmo `event_id` nas duas origens)
- [ ] Sem dedupe = compras contadas em dobro → ROAS falso. Não avançar sem isso.

### 1.3 Domain verification + Aggregated Events
- [ ] Verificar o **domínio do cliente** no Business Manager (DNS TXT ou meta-tag)
- [ ] Configurar **Aggregated Event Measurement**: `Purchase` como evento de prioridade 1
- [ ] Garantir os 8 eventos web priorizados na ordem: Purchase → InitiateCheckout → AddToCart → ViewContent → ...

### 1.4 Qualidade do evento (EMQ)
- [ ] Events Manager → `Purchase` → **Event Match Quality** deve estar ≥ 7
- [ ] Para subir o EMQ: garantir envio de email, telefone, nome, cidade, CEP (já vai automático pelo CAPI do Shopify no checkout)

---

## Parte 2 — Eventos mínimos de e-commerce

Confirmar que estão disparando (Meta Pixel Helper + Events Manager → Test Events):

- [ ] `PageView`
- [ ] `ViewContent` (página de produto)
- [ ] `AddToCart`
- [ ] `InitiateCheckout`
- [ ] `AddPaymentInfo`
- [ ] **`Purchase`** — com `value` (valor da compra) e `currency: BRL`

---

## Parte 3 — Google Ads + GA4

### 3.1 GA4
- [ ] GA4 conectado ao Shopify (via Google & YouTube channel ou GTM)
- [ ] **Enhanced measurement** ativo
- [ ] Eventos de e-commerce: `view_item`, `add_to_cart`, `begin_checkout`, `purchase`

### 3.2 Google Ads
- [ ] Conversão de **Purchase** importada do GA4 ou via tag direta
- [ ] **Enhanced Conversions** ativado (Google Ads → Conversions → Settings)
- [ ] Conversão marcada como **Primária**; demais como secundárias

---

## Parte 4 — Validação final (antes de escalar verba)

- [ ] Fazer **1 compra teste real** (cartão de verdade, valor baixo) e confirmar:
  - [ ] Aparece no Meta Events Manager (Browser + Server, deduplicado)
  - [ ] Aparece no GA4 com `value` correto
  - [ ] Aparece no Google Ads como conversão
- [ ] Conferir que o `value` registrado bate com o valor real da venda
- [ ] EMQ ≥ 7 e sem alertas vermelhos no Events Manager

---

## Quando subir para tracking avançado (sGTM)

Considerar GTM server-side em subdomínio próprio quando:
- Orçamento > ~R$30-50k/mês
- Múltiplas plataformas (Meta + Google + TikTok + Pinterest)
- Necessidade de enriquecer dados ou first-party data avançado
- Perda de eventos perceptível mesmo com CAPI nativo

Abaixo disso, o CAPI nativo do Shopify + Enhanced Conversions é suficiente e custo-zero.
