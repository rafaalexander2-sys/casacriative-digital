# Checklist de Rastreamento — Advant Tecnologia
**Site:** https://www.advant.com.br/

---

## Como verificar (você faz no navegador)

1. Abra o site no Chrome
2. Clique com o botão direito → **Inspecionar** → aba **Network**
3. Recarregue a página e filtre por `gtm` ou `google`
4. Ou instale a extensão **Tag Assistant** do Google Chrome para ver tudo de uma vez

---

## O que precisa estar instalado

### Google Tag Manager
- [ ] GTM instalado no `<head>` e no `<body>`
- [ ] ID do container: `GTM-_______` ← preencher
- [ ] Verificar no Tag Assistant se está **disparando** (status verde)

### Google Analytics 4
- [ ] Tag GA4 configurada dentro do GTM
- [ ] ID da propriedade: `G-_______` ← preencher
- [ ] Evento `page_view` disparando em todas as páginas

### Google Ads — Tag de Conversão
- [ ] Tag de conversão do Google Ads instalada via GTM
- [ ] ID da conta: `AW-_______` ← preencher
- [ ] **Conversões configuradas:**
  - [ ] Clique no botão WhatsApp → evento de conversão
  - [ ] Envio de formulário de contato (se houver) → evento de conversão
  - [ ] Ligação telefônica (se houver número clicável) → evento de conversão

---

## Eventos de conversão — o que configurar no GTM

### Prioridade 1 — WhatsApp (principal CTA da Advant)
- **Gatilho:** clique em links com `wa.me` ou `api.whatsapp.com`
- **Tag:** Google Ads Conversion — nome sugerido: `Lead_WhatsApp`
- **Valor:** deixar em branco por enquanto (calibrar após 30 dias)

### Prioridade 2 — Formulário de contato (se existir)
- **Gatilho:** envio de formulário (`Form Submission`)
- **Tag:** Google Ads Conversion — nome sugerido: `Lead_Formulario`

### Prioridade 3 — Clique em telefone (se existir)
- **Gatilho:** clique em `tel:`
- **Tag:** Google Ads Conversion — nome sugerido: `Lead_Telefone`

---

## Teste antes de subir as campanhas

1. Abrir o site com o **Preview Mode** ativo no GTM
2. Clicar no botão de WhatsApp
3. Confirmar que a tag `Lead_WhatsApp` disparou
4. Confirmar que a conversão aparece no Google Ads (pode levar até 24h)

---

## Status atual (preencher após verificação)

| Tag | Instalada? | ID | Conversões configuradas? |
|---|---|---|---|
| Google Tag Manager | ✅ | GTM-P4SC6LFQ | — |
| Google Analytics 4 | — | G- | — |
| Google Ads | — | AW- | — |
| WhatsApp event | — | — | — |
| Formulário event | — | — | — |

---

## Observação

O briefing indica que GTM e GA4 estão instalados. Confirmar se a tag de conversão
do Google Ads também está ativa — sem ela, as campanhas rodam sem dados de otimização.
