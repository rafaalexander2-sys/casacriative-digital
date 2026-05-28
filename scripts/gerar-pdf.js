#!/usr/bin/env node
/**
 * Gerador de PDF para relatórios Nowa
 *
 * Uso:
 *   node scripts/gerar-pdf.js public/relatorios/<arquivo>.html
 *
 * Gera o PDF no mesmo diretório com o mesmo nome (extensão .pdf).
 * Usa Playwright em modo print, respeitando @media print do CSS.
 */

const path = require('path')
const fs = require('fs')

async function main() {
  const inputArg = process.argv[2]
  if (!inputArg) {
    console.error('Uso: node scripts/gerar-pdf.js <arquivo.html>')
    process.exit(1)
  }

  const inputPath = path.resolve(inputArg)
  if (!fs.existsSync(inputPath)) {
    console.error('Arquivo não encontrado:', inputPath)
    process.exit(1)
  }

  const outputPath = inputPath.replace(/\.html?$/i, '.pdf')

  const { chromium } = require('/opt/node22/lib/node_modules/playwright')
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 794, height: 1123 } })
  await page.emulateMedia({ media: 'print' })
  await page.goto('file://' + inputPath, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: true,
  })

  await browser.close()
  console.log('PDF gerado:', outputPath)
}

main().catch(e => { console.error(e.message); process.exit(1) })
