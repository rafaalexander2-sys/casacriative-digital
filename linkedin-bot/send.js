/**
 * LinkedIn Outreach Bot
 *
 * Lê a fila exportada do dashboard (queue.json), abre o LinkedIn
 * e envia cada mensagem com delays humanos. Salva o progresso em
 * queue-result.json para reimportar no dashboard.
 *
 * Uso:
 *   node send.js                  (abre Chrome visível)
 *   node send.js --headless       (roda em background)
 *   node send.js --limit 10       (máx 10 mensagens nesta execução)
 */

import { chromium } from 'playwright'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dir = dirname(fileURLToPath(import.meta.url))

// ── Config ────────────────────────────────────────────────────────────────────

const ARGS         = process.argv.slice(2)
const HEADLESS     = ARGS.includes('--headless')
const LIMIT        = parseInt(ARGS.find(a => a.startsWith('--limit='))?.split('=')[1] ?? '20')
const QUEUE_FILE   = join(__dir, 'queue.json')
const RESULT_FILE  = join(__dir, 'queue-result.json')
const SESSION_FILE = join(__dir, 'session.json')  // cookies do LinkedIn

const DELAY_BETWEEN_MESSAGES_MS = [90_000, 180_000] // 1.5 – 3 min
const TYPING_SPEED_MS           = [40, 120]          // ms por caractere

// ── Helpers ───────────────────────────────────────────────────────────────────

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

async function humanType(page, selector, text) {
  await page.click(selector)
  for (const char of text) {
    await page.keyboard.type(char)
    await sleep(randomBetween(...TYPING_SPEED_MS))
  }
}

function log(msg) {
  console.log(`[${new Date().toLocaleTimeString('pt-PT')}] ${msg}`)
}

// ── LinkedIn actions ───────────────────────────────────────────────────────────

async function sendMessage(page, linkedinUrl, message) {
  const profileUrl = linkedinUrl.startsWith('http')
    ? linkedinUrl
    : `https://www.${linkedinUrl}`

  log(`Abrindo perfil: ${profileUrl}`)
  await page.goto(profileUrl, { waitUntil: 'domcontentloaded', timeout: 30_000 })
  await sleep(randomBetween(2000, 4000))

  // Tenta botão "Mensagem" (já conectados)
  const msgBtn = page.locator('button:has-text("Message"), button:has-text("Mensagem")').first()
  if (await msgBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await msgBtn.click()
    await sleep(randomBetween(1500, 2500))

    const textarea = page.locator('.msg-form__contenteditable, div[contenteditable="true"]').first()
    await textarea.waitFor({ timeout: 8000 })
    await humanType(page, '.msg-form__contenteditable, div[contenteditable="true"]', message)
    await sleep(randomBetween(1000, 2000))

    const sendBtn = page.locator('button.msg-form__send-button, button[type="submit"]:has-text("Send"), button:has-text("Enviar")').first()
    await sendBtn.click()
    await sleep(randomBetween(2000, 3000))
    log('✅ Mensagem enviada via chat')
    return 'sent'
  }

  // Tenta botão "Conectar" (não conectados)
  const connectBtn = page.locator('button:has-text("Connect"), button:has-text("Ligar"), button:has-text("Conectar")').first()
  if (await connectBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
    await connectBtn.click()
    await sleep(randomBetween(1000, 2000))

    // Modal "Adicionar nota"
    const addNoteBtn = page.locator('button:has-text("Add a note"), button:has-text("Adicionar nota")').first()
    if (await addNoteBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await addNoteBtn.click()
      await sleep(randomBetween(800, 1500))

      const noteArea = page.locator('#custom-message, textarea[name="message"]').first()
      await noteArea.waitFor({ timeout: 5000 })

      // LinkedIn limita nota de conexão a 300 chars
      const note = message.slice(0, 295)
      await humanType(page, '#custom-message, textarea[name="message"]', note)
      await sleep(randomBetween(800, 1500))
    }

    const doneBtn = page.locator('button:has-text("Send"), button:has-text("Enviar")').first()
    await doneBtn.click()
    await sleep(randomBetween(2000, 3000))
    log('✅ Pedido de conexão com nota enviado')
    return 'sent'
  }

  log('⚠️  Nenhum botão de mensagem/conexão encontrado — perfil pulado')
  return 'skipped'
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  if (!existsSync(QUEUE_FILE)) {
    console.error('❌  queue.json não encontrado.\n   Exporte a fila no dashboard e coloque o arquivo aqui.')
    process.exit(1)
  }

  if (!existsSync(SESSION_FILE)) {
    console.error('❌  session.json não encontrado.\n   Execute primeiro: node setup-session.js')
    process.exit(1)
  }

  const queue   = JSON.parse(readFileSync(QUEUE_FILE, 'utf8'))
  const cookies = JSON.parse(readFileSync(SESSION_FILE, 'utf8'))

  const pending = queue
    .filter(p => p.status === 'message_ready' && p.generatedMessage && p.linkedinUrl)
    .slice(0, LIMIT)

  if (pending.length === 0) {
    log('Nenhum prospect com mensagem pronta na fila.')
    process.exit(0)
  }

  log(`📋 ${pending.length} mensagens para enviar (limite: ${LIMIT}/execução)`)

  const browser = await chromium.launch({ headless: HEADLESS, slowMo: 50 })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  })

  await context.addCookies(cookies)

  const page = await context.newPage()

  // Verifica se está logado
  await page.goto('https://www.linkedin.com/feed/', { waitUntil: 'domcontentloaded' })
  await sleep(2000)

  if (page.url().includes('login') || page.url().includes('authwall')) {
    log('❌ Sessão expirada. Execute: node setup-session.js')
    await browser.close()
    process.exit(1)
  }

  log('✅ LinkedIn autenticado')

  const results = [...queue]
  let sent = 0

  for (const prospect of pending) {
    log(`\n→ ${prospect.name} | ${prospect.company} (${prospect.country})`)

    try {
      const status = await sendMessage(page, prospect.linkedinUrl, prospect.generatedMessage)

      const idx = results.findIndex(p => p.id === prospect.id)
      if (idx !== -1) {
        results[idx] = {
          ...results[idx],
          status: status === 'sent' ? 'sent' : results[idx].status,
          sentAt: status === 'sent' ? new Date().toISOString() : results[idx].sentAt,
        }
      }

      sent++

      if (sent < pending.length) {
        const delay = randomBetween(...DELAY_BETWEEN_MESSAGES_MS)
        log(`⏳ Aguardando ${Math.round(delay / 1000)}s até a próxima mensagem...`)
        await sleep(delay)
      }
    } catch (err) {
      log(`❌ Erro em ${prospect.name}: ${err.message}`)
    }
  }

  writeFileSync(RESULT_FILE, JSON.stringify(results, null, 2))
  log(`\n✅ Concluído: ${sent} mensagens enviadas`)
  log(`📄 Resultado salvo em queue-result.json — reimporte no dashboard`)

  await browser.close()
}

main().catch(err => {
  console.error('Erro fatal:', err)
  process.exit(1)
})
