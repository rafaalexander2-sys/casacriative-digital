// ============================================================
// Exportação do CRM — os ficheiros que se abrem no Excel/Sheets
//
// A exportação antiga tinha 11 colunas e nenhuma data de movimento: dava
// para ver o estado de hoje, não para analisar nada. Aqui saem três
// ficheiros que se cruzam pelo "ID do lead":
//
//   leads.csv          uma linha por pessoa, larga — inclui os dias que
//                      passou em CADA etapa (dá tabela dinâmica directa)
//   movimentos.csv     uma linha por movimento — a base bruta, para quem
//                      quiser montar uma análise que não previmos
//   resumo-etapas.csv  já agregado: mediana, envelhecimento, passagem
//
// Convenções para o Excel em português:
//   separador ";", BOM UTF-8 (acentos), decimal com vírgula,
//   datas em dd/mm/aaaa no fuso de São Paulo (o banco guarda em UTC —
//   sem converter, um lead das 21h aparece no dia seguinte).
// ============================================================

import type { Lead, PipelineStage, LeadStageSpan, LeadStageHistory, DateRange } from './crm-types'
import { median, agingBucket, AGING_BUCKETS } from './crm-types'

const TZ = 'America/Sao_Paulo'

// ---------- formatação ----------
const cell = (v: unknown): string => {
  const s = v == null ? '' : String(v)
  return /[";\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s
}

/** Número com vírgula decimal — senão o Excel pt-BR lê "1500.5" como texto. */
export const num = (n?: number | null, dec = 2): string =>
  n == null || Number.isNaN(n) ? '' : n.toFixed(dec).replace('.', ',')

export const dt = (iso?: string | null): string => {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('pt-BR', { timeZone: TZ })
}

export const dtTime = (iso?: string | null): string => {
  if (!iso) return ''
  return new Date(iso).toLocaleString('pt-BR', { timeZone: TZ, dateStyle: 'short', timeStyle: 'short' })
}

/** entry_date é `date` puro (aaaa-mm-dd): não pode passar por fuso nenhum. */
const dateOnly = (d?: string | null): string => {
  if (!d) return ''
  const [y, m, day] = d.slice(0, 10).split('-')
  return `${day}/${m}/${y}`
}

const yn = (b?: boolean | null) => (b ? 'Sim' : 'Não')

function toCsv(header: string[], rows: (string | number | null | undefined)[][]): string {
  const BOM = String.fromCharCode(0xfeff)
  return BOM + [header.map(cell).join(';'), ...rows.map(r => r.map(cell).join(';'))].join('\r\n')
}

export function downloadFile(name: string, content: string, type = 'text/csv;charset=utf-8') {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

const slug = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '').toLowerCase()

export const fileName = (base: string, wsName: string, r: DateRange) =>
  `${base}_${slug(wsName || 'crm')}_${r.from}_a_${r.to}.csv`

// ---------- utilitários de análise ----------

const SOURCE_PT: Record<string, string> = {
  form: 'Formulário', whatsapp: 'WhatsApp', meta_ads: 'Meta Ads',
  google_ads: 'Google Ads', manual: 'Manual', import: 'Importação',
}

const ORIGIN_PT: Record<string, string> = {
  live: 'Ao vivo', backfill: 'Recuperado', seed: 'Inicial (data não confiável)',
}

const KIND_PT: Record<string, string> = { open: 'Em aberto', won: 'Ganho', lost: 'Perdido' }

/** Só os dois primeiros dígitos do telefone — a Cintia usou o DDD para
 *  desconfiar da importação, então vale como coluna própria. */
function ddd(phone?: string | null): string {
  const d = (phone ?? '').replace(/\D/g, '')
  const local = d.startsWith('55') ? d.slice(2) : d
  return local.length >= 10 ? local.slice(0, 2) : ''
}

const paid = (l: Lead) =>
  !!(l.gclid || l.fbclid || l.source === 'meta_ads' || l.source === 'google_ads' ||
     ['cpc', 'ppc', 'paid', 'paid_social'].includes((l.utm_medium ?? '').toLowerCase()))

export interface ExportData {
  leads: Lead[]
  stages: PipelineStage[]
  spans: LeadStageSpan[]
  history: LeadStageHistory[]
  range: DateRange
  /** id do utilizador → e-mail, para o responsável sair legível */
  people?: Record<string, string>
}

// ============================================================
// 1) leads.csv — a tabela larga
// ============================================================
export function buildLeadsCsv({ leads, stages, spans, range, people = {} }: ExportData): string {
  const stageOf = new Map(stages.map(s => [s.key, s]))
  const posOf = new Map(stages.map((s, i) => [s.key, s.position ?? i]))

  // spans agrupados por lead
  const byLead = new Map<string, LeadStageSpan[]>()
  for (const sp of spans) {
    const arr = byLead.get(sp.lead_id) ?? []
    arr.push(sp)
    byLead.set(sp.lead_id, arr)
  }

  const header = [
    'ID do lead', 'Nome', 'Empresa', 'E-mail', 'Telefone', 'DDD',
    'Serviço', 'Cobrança', 'Valor', 'Contratos',
    'Etapa atual', 'Situação', 'Responsável',
    'Origem', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
    'gclid', 'fbclid', 'Veio de anúncio pago',
    'Data de entrada', 'Data de entrada estimada', 'Criado no sistema',
    'Ganho em', 'Perdido em', 'Motivo da perda', 'Data de fecho',
    'Dias até fechar', 'Dias no funil', 'Dias parado na etapa atual',
    'Nº de movimentos', 'Voltou de etapa', 'Histórico confiável',
    'Anotações',
    // pivot: uma coluna por etapa do funil deste cliente
    ...stages.map(s => `Dias em ${s.label}`),
    ...stages.map(s => `Entrou em ${s.label} em`),
  ]

  const rows = leads.map(l => {
    const sps = (byLead.get(l.id) ?? []).slice().sort((a, b) => a.entered_at.localeCompare(b.entered_at))
    const st = stageOf.get(l.status)
    const kind = st?.kind ?? 'open'

    const closedAt = l.won_at ?? l.lost_at ?? null
    const zero = l.entry_date ? new Date(`${l.entry_date}T00:00:00`) : new Date(l.created_at)
    const days = (a: Date, b: Date) => (b.getTime() - a.getTime()) / 86400000

    const daysToClose = closedAt ? days(zero, new Date(closedAt)) : null
    const daysInFunnel = closedAt ? null : days(zero, new Date())
    const current = sps.find(s => s.is_current)

    // regressão: foi para uma etapa anterior à que estava
    const wentBack = sps.some(s =>
      s.from_status != null &&
      (posOf.get(s.status) ?? 0) < (posOf.get(s.from_status) ?? 0))

    // "movimentos" não conta a linha de entrada no funil
    const moves = sps.filter(s => s.from_status != null).length
    const trustworthy = sps.length > 0 && !sps.some(s => s.origin === 'seed')

    // dias por etapa: soma, porque um lead pode passar duas vezes pela mesma
    const daysPer = stages.map(s =>
      num(sps.filter(x => x.status === s.key).reduce((acc, x) => acc + (x.days_in_stage ?? 0), 0) || null))
    const firstIn = stages.map(s => {
      const f = sps.find(x => x.status === s.key)
      return f ? dtTime(f.entered_at) : ''
    })

    return [
      l.id, l.name, l.company, l.email, l.phone, ddd(l.phone),
      l.service,
      l.deal_type === 'mrr' ? 'Recorrente (MRR)' : l.deal_type === 'one_time' ? 'Serviço único' : '',
      num(l.value), l.contracts_count ?? 0,
      st?.label ?? l.status, KIND_PT[kind] ?? kind,
      l.assigned_to ? people[l.assigned_to] ?? l.assigned_to : '',
      SOURCE_PT[l.source] ?? l.source,
      l.utm_source, l.utm_medium, l.utm_campaign, l.utm_term, l.utm_content,
      l.gclid, l.fbclid, yn(paid(l)),
      dateOnly(l.entry_date), yn(l.entry_date_estimated), dt(l.created_at),
      dtTime(l.won_at), dtTime(l.lost_at), l.lost_reason, dtTime(closedAt),
      num(daysToClose, 1), num(daysInFunnel, 1), num(current?.days_in_stage ?? null, 1),
      moves, yn(wentBack), yn(trustworthy),
      (l.notes ?? '').replace(/\r?\n/g, ' · '),
      ...daysPer, ...firstIn,
    ]
  })

  return toCsv(header, rows)
}

// ============================================================
// 2) movimentos.csv — a base bruta
// ============================================================
export function buildMovesCsv({ leads, stages, history, people = {} }: ExportData): string {
  const nameOf = new Map(leads.map(l => [l.id, l.name]))
  const labelOf = new Map(stages.map(s => [s.key, s.label]))

  // dias que ficou na etapa anterior = intervalo até o movimento anterior do mesmo lead
  const sorted = [...history].sort((a, b) =>
    a.lead_id.localeCompare(b.lead_id) || a.changed_at.localeCompare(b.changed_at))
  const prev = new Map<string, string>()

  const header = [
    'ID do movimento', 'ID do lead', 'Lead',
    'Saiu de', 'Entrou em', 'Data', 'Data e hora',
    'Dias na etapa anterior', 'Quem moveu', 'Confiança do registo',
  ]

  const rows = sorted.map(h => {
    const before = prev.get(h.lead_id)
    prev.set(h.lead_id, h.changed_at)
    const stayed = before
      ? (new Date(h.changed_at).getTime() - new Date(before).getTime()) / 86400000
      : null
    return [
      h.id, h.lead_id, nameOf.get(h.lead_id) ?? '',
      h.from_status ? labelOf.get(h.from_status) ?? h.from_status : '(entrada no funil)',
      labelOf.get(h.to_status) ?? h.to_label ?? h.to_status,
      dt(h.changed_at), dtTime(h.changed_at),
      num(stayed, 1),
      h.changed_by ? people[h.changed_by] ?? h.changed_by : '',
      ORIGIN_PT[h.origin] ?? h.origin,
    ]
  })

  return toCsv(header, rows)
}

// ============================================================
// 3) resumo-etapas.csv — já agregado
// ============================================================
export function buildStageSummaryCsv({ stages, spans, range }: ExportData): string {
  const posOf = new Map(stages.map((s, i) => [s.key, s.position ?? i]))

  const header = [
    'Etapa', 'Situação',
    'Entraram no período', 'Saíram no período', 'Parados agora',
    'Mediana de dias', 'Média de dias', 'Máximo de dias',
    ...AGING_BUCKETS.map(b => `Parados ${b.label}`),
    'Avançaram', 'Recuaram', 'Taxa de avanço (%)',
  ]

  const inRange = (iso?: string | null) =>
    !!iso && iso.slice(0, 10) >= range.from && iso.slice(0, 10) <= range.to

  const rows = stages.map(s => {
    const mine = spans.filter(x => x.status === s.key)
    const entered = mine.filter(x => inRange(x.entered_at))
    const left = mine.filter(x => inRange(x.left_at))
    const parked = mine.filter(x => x.is_current)

    // duração só de quem JÁ saiu: incluir quem ainda está lá puxaria a
    // mediana para baixo (ainda não terminou de esperar)
    const done = mine.filter(x => !x.is_current).map(x => x.days_in_stage ?? 0)

    const aging: Record<string, number> = {}
    for (const b of AGING_BUCKETS) aging[b.key] = 0
    for (const p of parked) aging[agingBucket(p.days_in_stage ?? 0)]++

    // para onde foram os que saíram desta etapa
    const nexts = spans.filter(x => x.from_status === s.key)
    const fwd = nexts.filter(x => (posOf.get(x.status) ?? 0) > (posOf.get(s.key) ?? 0)).length
    const back = nexts.length - fwd
    const rate = nexts.length ? (fwd / nexts.length) * 100 : null

    return [
      s.label, KIND_PT[s.kind] ?? s.kind,
      entered.length, left.length, parked.length,
      num(done.length ? median(done) : null, 1),
      num(done.length ? done.reduce((a, b) => a + b, 0) / done.length : null, 1),
      num(done.length ? Math.max(...done) : null, 1),
      ...AGING_BUCKETS.map(b => aging[b.key]),
      fwd, back, num(rate, 1),
    ]
  })

  return toCsv(header, rows)
}

// ============================================================
// Baixar tudo — escalonado, senão o browser bloqueia o 2.º e 3.º ficheiro
// ============================================================
export function exportAll(data: ExportData, wsName: string) {
  const r = data.range
  downloadFile(fileName('leads', wsName, r), buildLeadsCsv(data))
  setTimeout(() => downloadFile(fileName('movimentos', wsName, r), buildMovesCsv(data)), 400)
  setTimeout(() => downloadFile(fileName('resumo-etapas', wsName, r), buildStageSummaryCsv(data)), 800)
}

// ============================================================
// Conversões offline para o Google Ads
//
// Fecha o ciclo: o Google sabe que houve um clique e um formulário, mas não
// sabe quais leads viraram negócio. Sem isso, o lance automático optimiza para
// volume de formulário — e paga caro por lead que nunca fecha.
//
// Formato oficial (support.google.com/google-ads/answer/7014069): a PRIMEIRA
// linha declara o fuso e os cabeçalhos só vêm na segunda. Enviar cabeçalho na
// primeira linha é o erro clássico que faz o upload ser recusado.
// ============================================================

export interface ConversionNames {
  /** Tem de bater EXACTAMENTE com o nome da acção de conversão no Google Ads */
  qualified: string
  converted: string
  currency: string
}

/** 'aaaa-mm-dd hh:mm:ss' no fuso declarado no cabeçalho Parameters. */
function gAdsTime(iso: string): string {
  const p = new Intl.DateTimeFormat('sv-SE', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(new Date(iso))
  const g = (t: string) => p.find(x => x.type === t)?.value ?? '00'
  return `${g('year')}-${g('month')}-${g('day')} ${g('hour')}:${g('minute')}:${g('second')}`
}

export function buildGoogleAdsConversionsCsv(
  { leads, stages, spans }: ExportData,
  names: ConversionNames,
): string {
  const abertas = stages.filter(s => s.kind === 'open').sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
  const primeira = abertas[0]
  const posOf = new Map(stages.map((s, i) => [s.key, s.position ?? i]))

  const byLead = new Map<string, LeadStageSpan[]>()
  for (const sp of spans) {
    const arr = byLead.get(sp.lead_id) ?? []
    arr.push(sp)
    byLead.set(sp.lead_id, arr)
  }

  const linhas: string[][] = []

  for (const l of leads) {
    // Sem gclid o Google não consegue ligar a conversão ao clique — a linha
    // seria recusada. Melhor não a enviar do que sujar o relatório de erros.
    if (!l.gclid) continue

    // QUALIFICADO: a primeira vez que saiu da etapa de entrada para uma etapa
    // mais à frente. Linhas 'seed' ficam de fora: a data delas não é confiável.
    const sps = (byLead.get(l.id) ?? [])
      .filter(x => x.origin !== 'seed')
      .sort((a, b) => a.entered_at.localeCompare(b.entered_at))

    const avancou = sps.find(x =>
      primeira && x.status !== primeira.key &&
      (posOf.get(x.status) ?? 0) > (posOf.get(primeira.key) ?? 0))

    if (avancou) {
      linhas.push([l.gclid, names.qualified, gAdsTime(avancou.entered_at), l.id, '', names.currency])
    }

    // CONVERTIDO: fechou. Vai com o valor, que é o que permite ao Google
    // optimizar por receita em vez de por quantidade.
    if (l.won_at) {
      // Ponto decimal, NÃO vírgula: este ficheiro é separado por vírgulas, e o
      // nosso num() usa vírgula (correcto nos outros CSVs, fatal neste).
      const valor = l.value != null && !Number.isNaN(l.value) ? l.value.toFixed(2) : ''
      linhas.push([l.gclid, names.converted, gAdsTime(l.won_at), l.id, valor, names.currency])
    }
  }

  const BOM = String.fromCharCode(0xfeff)
  const sep = ','   // o Google exige vírgula, ao contrário dos nossos CSVs
  const esc = (v: string) => (/[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v)

  return BOM + [
    `Parameters:TimeZone=${TZ}`,
    ['Google Click ID', 'Conversion Name', 'Conversion Time', 'Order ID', 'Conversion Value', 'Conversion Currency'].join(sep),
    ...linhas.map(r => r.map(esc).join(sep)),
  ].join('\r\n')
}

/** Quantas linhas sairiam — para avisar antes de baixar um ficheiro vazio. */
export function countGoogleAdsConversions(data: ExportData): number {
  const csv = buildGoogleAdsConversionsCsv(data, { qualified: 'x', converted: 'x', currency: 'BRL' })
  return Math.max(0, csv.split('\r\n').length - 2)
}
