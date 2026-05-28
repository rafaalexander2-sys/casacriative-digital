# Relatórios Nowa — Sistema de Geração

## Padrão visual

- **Fonte de display:** Playfair Display (700, 900, itálicas)
- **Fonte de corpo:** Inter (400, 600, 700, 800)
- **Cores:** tokens Nowa em `:root` (indigo `#4D4C9A`, lavender `#E8D8F8`, etc.)
- **Formato:** A4 (210×297mm), uma página por bloco lógico

Todas as fontes estão em `public/fonts/` e referenciadas via `public/fonts/nowa-fonts.css`.

## Como criar um novo relatório

1. **Copiar o template base:**
   ```bash
   cp public/relatorios/_template-base.html public/relatorios/<cliente>-<periodo>.html
   ```

2. **Editar** o HTML — substituir placeholders `{{...}}` com os dados reais.

3. **Gerar o PDF:**
   ```bash
   node scripts/gerar-pdf.js public/relatorios/<cliente>-<periodo>.html
   ```
   O PDF é gerado no mesmo diretório.

## Regras de layout

- Cada bloco lógico (KPIs + tabela + highlight) deve caber numa página A4.
- Use `<div class="page">` para separar páginas.
- Se um bloco exceder ~1100px de altura, divide em duas páginas.

## Arquivos

| Arquivo | Função |
|---|---|
| `_template-base.html` | Template a copiar para novos relatórios |
| `nowa-company-meta-mai2026.html` | Exemplo real — campanha própria |
| `../fonts/nowa-fonts.css` | @font-face das fontes oficiais |
| `../../scripts/gerar-pdf.js` | Script Playwright para gerar PDF a partir de HTML |
