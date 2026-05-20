/**
 * Salva os cookies da sua sessão LinkedIn.
 * Execute UMA VEZ para autenticar. Depois o bot usa os cookies salvos.
 *
 * Uso: node setup-session.js
 */

import { chromium } from 'playwright'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))

async function main() {
  console.log('🔐 Abrindo LinkedIn para login...')
  console.log('   Faça login normalmente e aguarde o redirecionamento para o feed.')
  console.log('   A janela vai fechar sozinha e salvar a sessão.\n')

  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext()
  const page = await context.newPage()

  await page.goto('https://www.linkedin.com/login')

  // Aguarda o feed carregar (significa que o login foi feito)
  await page.waitForURL('**/feed/**', { timeout: 120_000 })

  const cookies = await context.cookies()
  writeFileSync(join(__dir, 'session.json'), JSON.stringify(cookies, null, 2))

  console.log('✅ Sessão salva em session.json')
  console.log('   Pode fechar essa janela ou ela fechará automaticamente.')

  await browser.close()
}

main().catch(err => {
  console.error('Erro:', err.message)
  process.exit(1)
})
