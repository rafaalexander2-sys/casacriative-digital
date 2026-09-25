# Casa Criative — site + CRM

Site institucional (Next.js, `output: 'export'`, servido pelo Cloudflare Pages) e
CRM em `/crm`, com Supabase por trás. As instruções de trabalho estão em
[`CLAUDE.md`](CLAUDE.md); este ficheiro documenta a **atribuição** — de onde vêm
os leads e como isso volta para o Google Ads — e como validar cada peça em
produção.

---

## O problema que isto resolve

O anúncio traz a pessoa, a conversa acontece no WhatsApp e quem atende cadastra
o lead à mão. Nesse trajeto perdia-se tudo o que o navegador sabia sobre o
clique. No espaço da Dra. Cintia, **212 dos 215 leads entram assim** e a
cobertura de `gclid` estava em **1,4%**.

Sem essa ligação, o lance automático do Google optimiza por volume de formulário:
paga o mesmo por quem fecha contrato e por quem nunca responde.

A ponte tem quatro peças:

| Peça | Onde vive | O que faz |
|---|---|---|
| Captura no site | repo do cliente (`lib/attrib.js`) | guarda `gclid`/`gbraid`/`wbraid`/`fbclid` + utms em cookie de 90 dias |
| Código no link | repo do cliente (`lib/waref.js`) | cola `[ref: A7X29K]` na mensagem pré-preenchida do WhatsApp |
| Registo do código | `supabase/functions/lead-ref` | guarda a associação código → atribuição |
| Resolução | `supabase/schema-lead-refs.sql` | **gatilho no banco** que lê o código no cadastro e preenche o lead |

A resolução é feita por gatilho, não pelo app, porque um lead pode nascer pela
tela, por importação ou por webhook. O gatilho apanha os três. Já tivemos o
problema oposto com o `created_at` e custou semanas de dados.

---

## Como validar em produção

### 1. A Edge Function está no ar?

```bash
curl -s -X POST 'https://mnmcxuumgbjyylsxsadv.supabase.co/functions/v1/lead-ref' \
  -H 'Content-Type: application/json' -d '{}'
```

Esperado: `{"error":"ref inválida."}`.
`401` significa que o deploy ligou a verificação de JWT — a função é pública e
tem de ir com `--no-verify-jwt` (ver `.github/workflows/deploy-edge-functions.yml`).

### 2. O gatilho resolve mesmo?

Registar uma referência e criar um lead que a menciona. `<TOKEN>` é o token de
ingestão do espaço, que aparece em **Clientes** no CRM:

```bash
curl -s -X POST '.../functions/v1/lead-ref' -H 'Content-Type: application/json' \
  -d '{"ref":"R3FT9K","token":"<TOKEN>","gclid":"TESTE","utm_campaign":"teste"}'

curl -s -X POST '.../functions/v1/ingest-lead' -H 'Content-Type: application/json' \
  -d '{"token":"<TOKEN>","name":"ZZ TESTE - APAGAR","notes":"[ref: R3FT9K]"}'
```

Depois: **Actions → "Diagnostico de leads" → Run workflow**. A consulta **F**
mostra o que o gatilho fez com cada cartão de teste. O comportamento esperado,
já verificado em produção a 16/09/2026:

| Caso | Resultado |
|---|---|
| `[ref: R3FT9K]` nas anotações | `ref_code`, `gclid`, campanha e `landing_page` preenchidos; Origem `google_ads` |
| Só o código solto, sem rótulo | idem, a partir do `fbclid`; Origem `meta_ads` |
| Lead que já traz `gclid` próprio | fica com o **dele** — a referência não sobrescreve |
| Código inexistente | `ref_code` vazio, nenhuma atribuição inventada |

> `is_test: true` no webhook do Google devolve 200 **sem gravar nada**. Não serve
> de validação. Testar a sério cria cartões no quadro do cliente — limpar depois
> com **Actions → "Limpar cartoes de teste"**, que apaga só nomes `ZZ TESTE…`.

### 3. A cobertura está a subir?

CRM → **Relatórios** → *Saúde do rastreamento*: leads por semana, quantos
trouxeram código e qual a percentagem com clique identificado. Se cair para
zero, partiu-se alguma coisa no site. A mesma conta existe no banco, na vista
`lead_attrib_health`, e sai na consulta **H** do diagnóstico.

Esta medição é o ponto principal: a cobertura esteve em 1,4% durante três meses
sem ninguém dar por isso, porque não havia onde ver.

---

## Que campanha e que criativo trazem lead que fecha

Duas peças, alimentadas pelos mesmos utms:

- **No cartão do lead**, o bloco *De onde veio*: campanha, criativo, palavra,
  origem/meio, página de entrada, código de referência e o identificador do
  clique. Só aparece o que existe; quando não existe nada, diz porquê em vez de
  ficar em branco.
- **Em Relatórios**, o painel *Campanhas e criativos*, com um botão por forma de
  agrupar (campanha, criativo, palavra, origem): leads, quantos avançaram no
  funil, quantos fecharam, a taxa de fecho e a receita. Sai também em CSV
  (`campanhas`, o quarto ficheiro da exportação), com as quatro agregações.

Duas coisas que confundem à primeira vista:

- **O Google manda o número da campanha em `utm_campaign`, não o nome** (por
  exemplo `24047901353`). O cartão etiqueta-o como *Campanha (ID no Google Ads)*
  para não parecer defeito — é o número que se procura no painel do Google.
- **`utm_content` é onde costuma ir o criativo**, mas só se as ligações do
  anúncio forem etiquetadas assim. Anúncio sem etiqueta cai na linha
  *sem etiqueta*, que fica sempre no fim da tabela: é um balde, não um criativo,
  e no topo daria a impressão de ser a campanha que mais traz lead.

A coluna que interessa é **% que fecha**, não *Leads*. O criativo que traz mais
clique costuma ser o que traz mais curioso — essa conta o Google e o Meta já
fazem sozinhos. O que só o CRM sabe é o que aconteceu ao lead depois.

---

## Conversões offline para o Google Ads

CRM → **Relatórios** → *Conversões para o Google Ads*. O período escolhido no
topo manda em tudo, inclusive aqui.

- **Qualificado** = a primeira vez que o lead saiu da etapa de entrada para uma
  mais à frente. **Convertido** = `won_at`, com o valor.
- **Valor esperado por etapa**: se só o contrato fechado levasse valor, o Google
  aprenderia com meia dúzia de linhas por trimestre. O mapa dá a cada avanço o
  valor esperado daquela etapa (valor médio × hipótese de fechar a partir dali).
  Fica em `localStorage`, por espaço.
- **Três ficheiros separados** — `gclid`, `gbraid`, `wbraid`. O Google não aceita
  os três identificadores no mesmo upload, e o cabeçalho da primeira coluna muda
  em cada um. `gbraid`/`wbraid` aparecem quando o iOS impede o `gclid`.
- **Correspondência melhorada**: para os leads sem clique identificado — a
  maioria, quando o atendimento é por WhatsApp. O Google cruza pelo e-mail e
  telefone, que sobem **cifrados com SHA-256**, nunca em claro. O telefone é
  normalizado para E.164 antes do hash; sem isso o mesmo número escrito de duas
  maneiras dá dois hashes e nenhum corresponde.
- **Janela de 90 dias**: o Google ignora conversões mais antigas, em silêncio. O
  painel diz quantas ficaram de fora em vez de as deixar passar.

Armadilhas do formato, todas já custaram um upload recusado:

- a **primeira linha** é `Parameters:TimeZone=…`; os cabeçalhos só vêm na segunda;
- o separador é **vírgula** e o decimal é **ponto** — ao contrário dos outros CSVs
  do CRM, que usam `;` e vírgula decimal para o Excel pt-BR;
- os **nomes das acções de conversão** têm de bater exactamente com os do Google
  Ads, senão o ficheiro é aceite e as linhas ignoradas sem erro nenhum.

---

## Leads dos formulários do Google Ads

`ingest-lead` também aceita o formato próprio do Google (detectado por
`user_column_data`), para os "formulários de lead" das campanhas — o lead entra
no CRM sem tocar no site do cliente.

Configuração: campanha → Recursos → formulário de lead → "Exportar leads" →
**Integração com o webhook**. URL = `…/functions/v1/ingest-lead`, Chave = o token
do espaço.

> **A "Chave" é o token do espaço, e é ela que decide em que quadro o lead cai.**
> Já aconteceu um teste ir parar ao quadro da agência por causa do token errado,
> sem erro nenhum a denunciar. Confirmar sempre em **Clientes**, onde o token
> aparece com o nome do espaço ao lado.

---

## Coisas que partem em silêncio

Lista curta do que já falhou aqui sem dar erro, para não voltar a acontecer:

1. **`--no-verify-jwt` em falta** num deploy → o gateway devolve 401 e os leads do
   site deixam de entrar. O último passo do workflow de deploy testa isto.
2. **Token de ingestão trocado** → o lead entra, mas no quadro errado.
3. **Vírgula decimal** no CSV do Google → as colunas partem-se.
4. **Nome da acção de conversão diferente** → ficheiro aceite, linhas ignoradas.
5. **Projecto da Vercel sem ligação ao GitHub** → o `git push` não publica nada e
   a produção fica presa numa versão antiga. Foi o que fez a DBP perder leads.
