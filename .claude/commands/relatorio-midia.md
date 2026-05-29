# /relatorio-midia

Gera um relatório de performance de mídia paga em PDF a partir de CSVs do Meta Ads (ou Google/LinkedIn).

## Como usar

O utilizador envia os ficheiros CSV na conversa (podem ser múltiplos: campanhas, conjuntos, anúncios). Depois digita `/relatorio-midia`.

---

## O que fazer passo a passo

### 1. Ler os CSVs

Ler todos os CSVs que o utilizador enviou na conversa. Identificar:

- **Nível de campanhas** (campo "Nome da campanha") — usar como fonte principal dos totais
- **Nível de conjuntos** — detalhe por ad set
- **Nível de anúncios** — detalhe por criativo

Dados a extrair de cada linha:
- Nome, status (active/inactive), valor usado (BRL), impressões, alcance, resultados, indicador de resultados, custo por resultado

### 2. Identificar grupos

Agrupar as campanhas por prefixo/padrão no nome:
- Campanhas com `[Rafa]` ou `[RAFA]` → grupo "Funil de Performance"
- Campanhas com `PEAKX` → grupo "PEAKX"
- Outros padrões → criar grupo com o prefixo identificado

Perguntar ao utilizador se quiser confirmar os grupos, mas só se houver ambiguidade clara.

### 3. Calcular totais

Usar sempre o **nível de campanhas** para somar investimento, impressões e alcance (evitar dupla contagem).

Calcular:
- Total investido (soma de todos os valores usados)
- Total impressões e alcance
- CPM médio = (investimento / impressões) × 1000
- Resultado principal de cada campanha (converter indicador para label legível)
- Detectar campanhas pausadas (status ≠ active)
- Detectar campanhas sem resultado (campo vazio)

### 4. Gerar HTML

Criar um novo ficheiro em `public/relatorios/<cliente>-<plataforma>-<periodo>.html` com base em `public/relatorios/_template-base.html`.

Regras de nomenclatura:
- Cliente: nome limpo sem espaços (ex: `nowa-company`)
- Plataforma: `meta`, `google`, `linkedin`
- Período: `mmm-aaaa` (ex: `mai-2026`) ou `dd-mmm-aaaa` para períodos semanais

Estrutura de páginas do relatório:
1. **Capa** — cliente, plataforma, período, Nowa branding
2. **Visão Geral** — KPIs totais + tabela do grupo principal
3. **Grupos secundários** — uma página por grupo adicional (se existirem)
4. **Insights & Recomendações** — o que funcionou vs. pontos de atenção (2 colunas)
5. **Próximos Passos** — lista numerada com ações concretas

Cada página deve ter altura máxima de 297mm. Se o conteúdo de uma página exceder ~1100px, dividir em duas páginas.

Fontes: obrigatório incluir `<link rel="stylesheet" href="../fonts/nowa-fonts.css">` no `<head>`.

### 5. Gerar PDF

Rodar:
```bash
node scripts/gerar-pdf.js public/relatorios/<arquivo>.html
```

Verificar visualmente com screenshot (`.page` elements) antes de entregar. Confirmar que nenhuma página tem conteúdo cortado.

### 6. Entregar

Enviar o PDF ao utilizador com `SendUserFile`.

Incluir na mensagem um resumo compacto:
- Total investido
- Impressões e alcance
- 1-2 destaques (melhor resultado, maior alerta)

### 7. Commit e push

```bash
git add public/relatorios/<arquivo>.html public/relatorios/<arquivo>.pdf
git commit -m "relatorio: <cliente> <plataforma> <periodo>"
git push -u origin <branch-atual>
```

---

## Alertas automáticos a identificar

| Situação | Tipo |
|---|---|
| CPA / custo por resultado > 3× a média | ⚠ warn |
| Campanha com investimento mas zero resultados | ⚠ warn |
| Campanha pausada com investimento significativo (>15% do total) | ⚠ warn |
| Custo por ThruPlay < R$0,05 | ✓ destaque positivo |
| Custo por visita LP < R$0,60 | ✓ destaque positivo |

---

## Design system

- Fontes: `Playfair Display` (display/números grandes), `Inter` (corpo)
- Cores principais: `--indigo: #4D4C9A`, `--lavender: #E8D8F8`, `--mono-bg: #0E0E12`
- KPI escuro: fundo `--mono-bg`, valor em `--lavender`
- KPI claro: fundo `--lav-pale`, borda `--lav-mute`
- Destaque positivo: borda esquerda verde `#16A34A`
- Alerta: borda esquerda âmbar `#D97706`
- Erro/pausa: borda esquerda vermelho `#DC2626`
