# /relatorio-midia

Gera qualquer documento no design system da Nowa — relatórios, propostas, briefings, apresentações — e entrega em PDF.

## Como usar

O utilizador descreve o tipo de documento e envia os dados (CSVs, texto, tabelas, ou descreve o conteúdo). Depois digita `/relatorio-midia`.

Se o contexto não for claro, perguntar:
1. **Que tipo de documento?** (relatório de mídia, proposta comercial, briefing, análise, outro)
2. **Para quem é?** (cliente, interno, apresentação)
3. **Quais dados ou conteúdo incluir?**

---

## Tipos de documento suportados

### Relatório de mídia paga (Meta Ads / Google Ads / LinkedIn Ads)
Ler CSVs enviados na conversa. Identificar nível de campanha, conjuntos e anúncios.
- Calcular: investimento total, impressões, alcance, CPM, custo por resultado
- Agrupar campanhas por prefixo no nome
- Detectar campanhas sem resultado ou pausadas com gasto relevante
- Alertas: CPA > 3× a média ⚠, ThruPlay < R$0,05 ✓, visita LP < R$0,60 ✓

### Proposta comercial
Estrutura: Capa → Contexto/Problema → Solução → Escopo → Investimento → Próximos Passos

### Briefing de campanha
Estrutura: Capa → Objetivo → Público → Mensagem → Canais → Cronograma → Budget

### Análise / relatório genérico
Adaptar estrutura ao conteúdo fornecido. Sempre: Capa → Contexto → Dados/Análise → Conclusões → Próximos Passos

---

## Gerar HTML

Criar ficheiro em `public/relatorios/<cliente>-<tipo>-<periodo>.html`.

Nomenclatura:
- Cliente: nome limpo sem espaços (ex: `advant`, `nowa-company`)
- Tipo: `google`, `meta`, `proposta`, `briefing`, `analise`
- Período ou data: `mai-2026`, `jun-2026`, `12-29mai2026`

**Estrutura base de páginas:**
1. **Capa** — título do documento, cliente, período, Nowa branding
2. **Conteúdo principal** — adaptar ao tipo de documento
3. **Insights & Recomendações** (se aplicável)
4. **Próximos Passos** (se aplicável)

Cada página: `height: 297mm`, `page-break-after: always`.
Se o conteúdo exceder ~1100px, dividir em duas páginas.

**Obrigatório no `<head>`:**
```html
<link rel="stylesheet" href="../fonts/nowa-fonts.css">
```

---

## Design system

- Fontes: `Playfair Display` (títulos, números grandes, itálico na capa), `Inter` (corpo)
- Cores: `--indigo: #4D4C9A`, `--lavender: #E8D8F8`, `--mono-bg: #0E0E12`
- Capa: fundo escuro `--mono-bg`, título em Playfair Display italic lavender
- KPI escuro: fundo `--mono-bg`, valor em `--lavender`
- KPI claro: fundo `--lav-pale: #F5EFFF`, borda `--lav-mute: #C4B0E8`
- Destaque positivo: borda esquerda verde `#16A34A`
- Alerta: borda esquerda âmbar `#D97706`
- Erro/pausa: borda esquerda vermelho `#DC2626`
- Tema alternativo por plataforma: Google → `#4285F4`, LinkedIn → `#0A66C2`

---

## Gerar PDF

```bash
node scripts/gerar-pdf.js public/relatorios/<arquivo>.html
```

Verificar cada `.page` com screenshot antes de entregar. Nenhuma página pode ter conteúdo cortado.

---

## Entregar

Enviar o PDF com `SendUserFile` + resumo compacto do documento (3-4 linhas).

---

## Commit e push

```bash
git add public/relatorios/<arquivo>.html public/relatorios/<arquivo>.pdf
git commit -m "relatorio: <cliente> <tipo> <periodo>"
git push -u origin <branch-atual>
```
