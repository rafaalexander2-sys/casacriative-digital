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
  // gbraid/wbraid contam: sao o que o Google manda quando o iOS impede o gclid.
  // Ficarem de fora fazia passar por organico trafego pago de telemovel.
  !!(l.gclid || l.gbraid || l.wbraid || l.fbclid ||
     l.source === 'meta_ads' || l.source === 'google_ads' ||
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
    'gclid', 'gbraid', 'wbraid', 'fbclid', 'Veio de anúncio pago',
    'Código de referência', 'Página de entrada',
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
      l.gclid, l.gbraid, l.wbraid, l.fbclid, yn(paid(l)),
      l.ref_code, l.landing_page,
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
  setTimeout(() => downloadFile(fileName('campanhas', wsName, r), buildCampaignsCsv(data)), 1200)
}

// ============================================================
// Campanhas e criativos
//
// A pergunta e "que anuncio traz lead que fecha", nao "que anuncio traz
// clique" - essa o Google e o Meta ja respondem sozinhos, e e a pergunta
// errada: o criativo que traz mais clique costuma ser o que traz mais curioso.
// Aqui cruza-se o criativo com o que aconteceu ao lead DEPOIS, que so o CRM
// sabe.
// ============================================================

/** Por que campo agrupar. utm_content e onde costuma ir o criativo. */
export type AttribKey = 'utm_campaign' | 'utm_content' | 'utm_term' | 'utm_source'

export const ATTRIB_LABELS: Record<AttribKey, string> = {
  utm_campaign: 'Campanha',
  utm_content: 'Criativo',
  utm_term: 'Palavra / conjunto',
  utm_source: 'Origem',
}

export interface AttribRow {
  /** Valor do agrupador. Vazio = o lead chegou sem essa etiqueta. */
  key: string
  leads: number
  /** Saiu da etapa de entrada pelo menos uma vez. */
  avancaram: number
  fechados: number
  perdidos: number
  receita: number
}

/**
 * Para cada lead, a primeira passagem por uma etapa mais a frente do que a de
 * entrada. Partilhado com a exportacao de conversoes para o Google: se as duas
 * contas divergissem, o relatorio no ecra e o ficheiro enviado discordariam.
 */
export function firstAdvanceByLead(
  { stages, spans }: Pick<ExportData, 'stages' | 'spans'>,
): Map<string, LeadStageSpan> {
  const abertas = stages.filter(s => s.kind === 'open').sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
  const primeira = abertas[0]
  const posOf = new Map(stages.map((s, i) => [s.key, s.position ?? i]))
  const out = new Map<string, LeadStageSpan>()
  if (!primeira) return out

  const byLead = new Map<string, LeadStageSpan[]>()
  for (const sp of spans) {
    // 'seed' e o ponto de partida inventado na importacao: a data nao e
    // confiavel e contaria como avanco que nunca existiu.
    if (sp.origin === 'seed') continue
    const arr = byLead.get(sp.lead_id) ?? []
    arr.push(sp)
    byLead.set(sp.lead_id, arr)
  }
  for (const [id, arr] of byLead) {
    const a = arr
      .sort((x, y) => x.entered_at.localeCompare(y.entered_at))
      .find(x => x.status !== primeira.key && (posOf.get(x.status) ?? 0) > (posOf.get(primeira.key) ?? 0))
    if (a) out.set(id, a)
  }
  return out
}

export function groupByAttrib(data: ExportData, by: AttribKey): AttribRow[] {
  const avancou = firstAdvanceByLead(data)
  const kindOf = new Map(data.stages.map(s => [s.key, s.kind]))
  const m = new Map<string, AttribRow>()

  for (const l of data.leads) {
    const k = (l[by] ?? '').trim()
    const r = m.get(k) ?? { key: k, leads: 0, avancaram: 0, fechados: 0, perdidos: 0, receita: 0 }
    r.leads++
    if (avancou.has(l.id)) r.avancaram++
    if (l.won_at) { r.fechados++; r.receita += l.value ?? 0 }
    else if (l.lost_at || kindOf.get(l.status) === 'lost') r.perdidos++
    m.set(k, r)
  }

  // Sem etiqueta vai sempre no fim: e um balde, nao um criativo, e no topo da
  // tabela dava a impressao de ser a campanha que mais traz lead.
  return [...m.values()].sort((a, b) =>
    (a.key === '' ? 1 : 0) - (b.key === '' ? 1 : 0) || b.leads - a.leads)
}

export function buildCampaignsCsv(data: ExportData): string {
  const header = ['Agrupado por', 'Valor', 'Leads', 'Avançaram', '% que avança',
                  'Fechados', '% que fecha', 'Perdidos', 'Receita', 'Receita por lead']
  const rows: (string | number | null)[][] = []
  for (const by of Object.keys(ATTRIB_LABELS) as AttribKey[]) {
    for (const r of groupByAttrib(data, by)) {
      rows.push([
        ATTRIB_LABELS[by], r.key || '(sem etiqueta)',
        r.leads, r.avancaram, num(100 * r.avancaram / Math.max(1, r.leads), 1),
        r.fechados, num(100 * r.fechados / Math.max(1, r.leads), 1),
        r.perdidos, num(r.receita), num(r.receita / Math.max(1, r.leads)),
      ])
    }
  }
  return toCsv(header, rows)
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

/** As três formas de identificar o clique. NUNCA no mesmo ficheiro. */
export type ClickKind = 'gclid' | 'gbraid' | 'wbraid'

/** O cabeçalho da coluna muda conforme o identificador. */
const CLICK_HEADER: Record<ClickKind, string> = {
  gclid: 'Google Click ID', gbraid: 'GBRAID', wbraid: 'WBRAID',
}

export const CLICK_KINDS: ClickKind[] = ['gclid', 'gbraid', 'wbraid']

export interface ConversionNames {
  /** Tem de bater EXACTAMENTE com o nome da acção de conversão no Google Ads */
  qualified: string
  converted: string
  currency: string
  /** Indicativo do país para normalizar o telefone (55 = Brasil, 1 = EUA). */
  ddi?: string
}

/**
 * Valor a atribuir a um lead que chegou a uma etapa mas ainda não fechou.
 *
 * Sem isto só o contrato fechado leva valor, e o Google fica a aprender com
 * dez linhas por trimestre — pouco para qualquer optimização. Com o mapa, cada
 * avanço no funil sobe com o valor ESPERADO daquela etapa (valor médio do
 * contrato × probabilidade de fechar a partir dali) e o algoritmo passa a ter
 * sinal semanal. Chave = `key` da etapa.
 */
export type StageValues = Record<string, number>

export interface ConversionRow {
  leadId: string
  click: string | null
  clickKind: ClickKind | null
  email: string | null
  phone: string | null
  /** Nome da acção de conversão, como está no Google Ads. */
  action: string
  at: string
  value: number | null
}

export interface ConversionPlan {
  /** Linhas dentro da janela, com identificador de clique. */
  rows: ConversionRow[]
  /** Linhas de leads sem identificador de clique — vão por correspondência. */
  semClique: ConversionRow[]
  /** Quantas ficaram de fora por serem mais antigas do que a janela. */
  foraDaJanela: number
  /** Quantas linhas de conversão foram sem valor nenhum. */
  semValor: number
}

export interface ConversionOptions {
  stageValues?: StageValues
  /**
   * O Google recusa conversão com mais de 90 dias. Enviar na mesma não dá erro
   * visível: o ficheiro é aceite e as linhas velhas são ignoradas em silêncio,
   * o que é pior do que falhar.
   */
  janelaDias?: number
  agora?: Date
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

/**
 * Decide o que vai subir para o Google, sem formatar nada ainda.
 *
 * Separado da escrita do CSV porque a mesma decisão alimenta três ficheiros
 * diferentes (gclid, gbraid, wbraid) mais o de correspondência melhorada — e
 * porque assim o painel consegue dizer quantas linhas sairiam sem gerar
 * ficheiro nenhum.
 */
export function planConversions(
  { leads, stages, spans }: ExportData,
  names: ConversionNames,
  opts: ConversionOptions = {},
): ConversionPlan {
  const { stageValues = {}, janelaDias = 90, agora = new Date() } = opts
  const limite = agora.getTime() - janelaDias * 86400000

  const avancoDe = firstAdvanceByLead({ stages, spans })

  const rows: ConversionRow[] = []
  const semClique: ConversionRow[] = []
  let foraDaJanela = 0
  let semValor = 0

  const empurrar = (r: ConversionRow) => {
    if (new Date(r.at).getTime() < limite) { foraDaJanela++; return }
    if (r.value == null) semValor++
    if (r.clickKind) rows.push(r); else semClique.push(r)
  }

  for (const l of leads) {
    // gclid primeiro: é o identificador com maior taxa de correspondência.
    // gbraid/wbraid só aparecem quando o iOS impediu o gclid.
    const clickKind: ClickKind | null =
      l.gclid ? 'gclid' : l.gbraid ? 'gbraid' : l.wbraid ? 'wbraid' : null
    const click = clickKind ? String(l[clickKind]) : null

    // Sem identificador de clique E sem e-mail/telefone não há como o Google
    // ligar a conversão a nada: a linha só sujaria o relatório de erros.
    if (!clickKind && !l.email && !l.phone) continue

    const base = {
      leadId: l.id, click, clickKind,
      email: l.email ?? null, phone: l.phone ?? null,
    }

    // QUALIFICADO: a primeira vez que saiu da etapa de entrada para uma etapa
    // mais à frente. Linhas 'seed' ficam de fora: a data delas não é confiável.
    const avancou = avancoDe.get(l.id)

    if (avancou) {
      empurrar({
        ...base, action: names.qualified, at: avancou.entered_at,
        value: stageValues[avancou.status] ?? null,
      })
    }

    // CONVERTIDO: fechou. Vai com o valor real, que é o que permite ao Google
    // optimizar por receita em vez de por quantidade. Se ninguém preencheu o
    // valor, cai no mapa de etapas em vez de subir vazio.
    if (l.won_at) {
      const real = l.value != null && !Number.isNaN(l.value) ? l.value : null
      empurrar({
        ...base, action: names.converted, at: l.won_at,
        value: real ?? stageValues[l.status] ?? null,
      })
    }
  }

  return { rows, semClique, foraDaJanela, semValor }
}

const BOM = String.fromCharCode(0xfeff)
// O Google exige vírgula, ao contrário dos nossos outros CSVs.
const escG = (v: string) => (/[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v)

function csvGoogle(header: string[], rows: string[][]): string {
  return BOM + [
    `Parameters:TimeZone=${TZ}`,
    header.join(','),
    ...rows.map(r => r.map(escG).join(',')),
  ].join('\r\n')
}

/**
 * Ponto decimal, NÃO vírgula: este ficheiro é separado por vírgulas, e o nosso
 * num() usa vírgula decimal (correcto nos outros CSVs, fatal neste).
 */
const valorG = (v: number | null) => (v == null ? '' : v.toFixed(2))

/** Um ficheiro por tipo de identificador — o Google não aceita misturados. */
export function buildGoogleAdsConversionsCsv(
  plan: ConversionPlan, names: ConversionNames, kind: ClickKind = 'gclid',
): string {
  const rows = plan.rows
    .filter(r => r.clickKind === kind)
    .map(r => [r.click!, r.action, gAdsTime(r.at), r.leadId, valorG(r.value), names.currency])

  return csvGoogle(
    [CLICK_HEADER[kind], 'Conversion Name', 'Conversion Time', 'Order ID', 'Conversion Value', 'Conversion Currency'],
    rows,
  )
}

// ---------- Correspondência melhorada (sem identificador de clique) ----------
//
// A maior parte dos leads dela é cadastrada à mão, depois de uma conversa no
// WhatsApp: não há gclid nenhum. A correspondência melhorada resolve esses —
// o Google cruza o e-mail/telefone com a conta de quem clicou.
//
// O dado pessoal NUNCA sai em claro: sobe o SHA-256 do valor normalizado. Sem
// normalizar antes, o mesmo telefone escrito de duas maneiras dá dois hashes
// diferentes e nenhum corresponde.

async function sha256Hex(s: string): Promise<string> {
  const c = globalThis.crypto?.subtle
  if (!c) throw new Error('Este navegador não expõe crypto.subtle — sem ele não dá para gerar o hash, e enviar telefone em claro está fora de questão.')
  const buf = await c.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}

/** E.164: "+" e só dígitos. O Google descarta o resto. */
export function toE164(raw: string | null | undefined, ddi = '55'): string | null {
  const d = String(raw ?? '').replace(/\D/g, '')
  if (!d) return null
  if (d.startsWith(ddi)) {
    const nacional = d.slice(ddi.length)
    // Brasil: 10 (fixo antigo) ou 11 (móvel com o 9). EUA: 10.
    if (nacional.length >= 8 && nacional.length <= 11) return '+' + d
  }
  if (d.length >= 8 && d.length <= 11) return '+' + ddi + d
  // Número que não bate com nenhum formato: não adivinhar. Hash de lixo não
  // corresponde a ninguém e ainda conta como tentativa falhada no Google.
  return null
}

const normEmail = (e: string | null | undefined): string | null => {
  const s = String(e ?? '').trim().toLowerCase()
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s) ? s : null
}

export async function buildEnhancedConversionsCsv(
  plan: ConversionPlan, names: ConversionNames,
): Promise<string> {
  const rows: string[][] = []
  for (const r of plan.semClique) {
    const email = normEmail(r.email)
    const phone = toE164(r.phone, names.ddi ?? '55')
    if (!email && !phone) continue
    rows.push([
      email ? await sha256Hex(email) : '',
      phone ? await sha256Hex(phone) : '',
      r.action, gAdsTime(r.at), r.leadId, valorG(r.value), names.currency,
    ])
  }
  return csvGoogle(
    ['Email', 'Phone Number', 'Conversion Name', 'Conversion Time', 'Order ID', 'Conversion Value', 'Conversion Currency'],
    rows,
  )
}

/** Quantas linhas sairiam de cada ficheiro — para avisar antes de baixar um vazio. */
export function countConversions(plan: ConversionPlan): Record<ClickKind | 'enhanced', number> {
  const out = { gclid: 0, gbraid: 0, wbraid: 0, enhanced: 0 }
  for (const r of plan.rows) if (r.clickKind) out[r.clickKind]++
  for (const r of plan.semClique) if (normEmail(r.email) || toE164(r.phone)) out.enhanced++
  return out
}
