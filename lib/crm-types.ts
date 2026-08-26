// Tipos do CRM — espelham o schema em supabase/schema.sql

export type LeadStatus = 'novo' | 'qualificado' | 'proposta' | 'ganho' | 'perdido'

export type LeadSource = 'form' | 'whatsapp' | 'meta_ads' | 'google_ads' | 'manual' | 'import'

export type DealType = 'mrr' | 'one_time'

export const DEAL_TYPE_LABELS: Record<DealType, string> = {
  mrr: 'Recorrente (MRR)',
  one_time: 'Serviço único',
}

export interface LeadEvent {
  id: string
  lead_id: string
  workspace_id: string
  type: string
  from_status?: string | null
  to_status?: string | null
  message?: string | null
  created_at: string
}

export interface Lead {
  id: string
  workspace_id: string
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  source: LeadSource
  status: string
  value?: number | null
  deal_type?: DealType | null
  service?: string | null
  notes?: string | null
  utm_source?: string | null
  utm_medium?: string | null
  utm_campaign?: string | null
  utm_term?: string | null
  utm_content?: string | null
  fbclid?: string | null
  gclid?: string | null
  synced_to_ads: boolean
  synced_at?: string | null
  assigned_to?: string | null
  created_at: string
  updated_at: string
  won_at?: string | null
  lost_at?: string | null

  // Marco zero do ciclo: quando a PESSOA chegou (created_at é quando a
  // ficha foi criada no sistema — numa importação as duas divergem).
  entry_date?: string | null
  entry_date_estimated?: boolean
  lost_reason?: string | null
  contracts_count?: number
}

// ---- Histórico de movimentação (schema-lead-history.sql) ----

/** Um movimento: o card saiu de uma etapa e entrou noutra. */
export interface LeadStageHistory {
  id: string
  lead_id: string
  workspace_id: string
  from_status?: string | null
  to_status: string
  to_label?: string | null
  changed_at: string
  changed_by?: string | null
  origin: 'live' | 'backfill' | 'seed'
}

/** Uma passagem por uma etapa, já com a duração calculada (vista lead_stage_spans). */
export interface LeadStageSpan {
  id: string
  lead_id: string
  workspace_id: string
  status: string
  label?: string | null
  from_status?: string | null
  origin: 'live' | 'backfill' | 'seed'
  entered_at: string
  left_at?: string | null
  is_current: boolean
  days_in_stage: number
}

/** Faixas de envelhecimento do relatório de "parados". */
export const AGING_BUCKETS: { key: string; label: string; min: number; max: number }[] = [
  { key: 'b0', label: '0–3 d', min: 0, max: 3 },
  { key: 'b1', label: '4–7 d', min: 3, max: 7 },
  { key: 'b2', label: '8–14 d', min: 7, max: 14 },
  { key: 'b3', label: '15+ d', min: 14, max: Infinity },
]

export function agingBucket(days: number): string {
  return AGING_BUCKETS.find(b => days > b.min && days <= b.max)?.key
    ?? (days <= 0 ? 'b0' : 'b3')
}

/** Mediana — usada no ciclo. Menos sensível a um caso extremo do que a média. */
export function median(values: number[]): number {
  if (values.length === 0) return 0
  const v = [...values].sort((a, b) => a - b)
  const mid = Math.floor(v.length / 2)
  return v.length % 2 ? v[mid] : (v[mid - 1] + v[mid]) / 2
}

/** Período do filtro de datas dos relatórios. */
export interface DateRange { from: string; to: string }

export const RANGE_PRESETS: { key: string; label: string; days: number | 'all' | 'month' }[] = [
  { key: '7', label: '7 dias', days: 7 },
  { key: '30', label: '30 dias', days: 30 },
  { key: '90', label: '90 dias', days: 90 },
  { key: 'month', label: 'Este mês', days: 'month' },
  { key: 'all', label: 'Tudo', days: 'all' },
]

/** Data local (São Paulo) no formato aaaa-mm-dd, sem escorregar de dia por causa do UTC. */
export function isoDay(d: Date): string {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

export function presetRange(key: string): DateRange {
  const to = isoDay(new Date())
  if (key === 'all') return { from: '2000-01-01', to }
  if (key === 'month') {
    const n = new Date()
    return { from: isoDay(new Date(n.getFullYear(), n.getMonth(), 1)), to }
  }
  const n = new Date()
  n.setDate(n.getDate() - Number(key))
  return { from: isoDay(n), to }
}

export interface Workspace {
  id: string
  name: string
  is_agency: boolean
  ingest_token?: string | null
  activities_enabled: boolean
  created_at: string
}

export type StageKind = 'open' | 'won' | 'lost'

export interface PipelineStage {
  id: string
  workspace_id: string
  key: string
  label: string
  position: number
  color: string
  kind: StageKind
}

export const KIND_LABELS: Record<StageKind, string> = {
  open: 'Em aberto',
  won: 'Ganho',
  lost: 'Perdido',
}

export type MemberRole = 'owner' | 'admin' | 'member'

export interface Member {
  user_id: string
  email: string
  role: MemberRole
}

export interface Invitation {
  id: string
  workspace_id: string
  email: string
  role: MemberRole
  accepted_at?: string | null
  created_at: string
}

export const ROLE_LABELS: Record<MemberRole, string> = {
  owner: 'Dono',
  admin: 'Admin',
  member: 'Membro',
}

// Ordem das colunas do Kanban
export const PIPELINE: LeadStatus[] = ['novo', 'qualificado', 'proposta', 'ganho', 'perdido']

export const STATUS_LABELS: Record<LeadStatus, string> = {
  novo: 'Novo',
  qualificado: 'Qualificado',
  proposta: 'Proposta',
  ganho: 'Ganho',
  perdido: 'Perdido',
}

export const STATUS_COLORS: Record<LeadStatus, string> = {
  novo: '#64748b',       // slate
  qualificado: '#3b82f6', // blue
  proposta: '#c47a4a',    // bronze (marca)
  ganho: '#22c55e',       // green
  perdido: '#ef4444',     // red
}

export const SOURCE_LABELS: Record<LeadSource, string> = {
  form: 'Formulário',
  whatsapp: 'WhatsApp',
  meta_ads: 'Meta Ads',
  google_ads: 'Google Ads',
  manual: 'Manual',
  import: 'Importação',
}

// ---- Atividades (quadro estilo Trello, colunas customizáveis por cliente) ----
export type ActivityStageKind = 'open' | 'done'

export interface ActivityStage {
  id: string
  workspace_id: string
  key: string
  label: string
  position: number
  color: string
  kind: ActivityStageKind
}

export const ACTIVITY_KIND_LABELS: Record<ActivityStageKind, string> = {
  open: 'Em aberto',
  done: 'Concluído',
}

// Prioridade do cartão (bandeirinha colorida, estilo ClickUp)
export type ActivityPriority = 'urgent' | 'high' | 'normal' | 'low'

export const ACTIVITY_PRIORITY_ORDER: ActivityPriority[] = ['urgent', 'high', 'normal', 'low']

export const ACTIVITY_PRIORITY_LABELS: Record<ActivityPriority, string> = {
  urgent: 'Urgente',
  high: 'Alta',
  normal: 'Normal',
  low: 'Baixa',
}

export const ACTIVITY_PRIORITY_COLORS: Record<ActivityPriority, string> = {
  urgent: '#dc2626',
  high: '#f59e0b',
  normal: '#3b82f6',
  low: '#94a3b8',
}

// Compromisso vindo do Google Agenda (só leitura, pra mostrar na Agenda)
export interface GoogleEvent {
  id: string
  title: string
  start: string | null
  end: string | null
  all_day_date: string | null
  html_link: string | null
  busy: boolean
}

// Aviso que aparece no sininho do CRM
export interface ActivityNotification {
  id: string
  workspace_id: string
  activity_id?: string | null
  user_id: string
  actor_id?: string | null
  type: string
  title: string
  message?: string | null
  read_at?: string | null
  created_at: string
}

// Anexo do briefing (imagem, PDF…) — o ficheiro fica no Storage
export interface ActivityAttachment {
  id: string
  activity_id: string
  workspace_id: string
  name: string
  path: string
  mime_type?: string | null
  size_bytes?: number | null
  created_at: string
}

// Item de checklist / subtarefa dentro de um cartão
export interface ActivityItem {
  id: string
  activity_id: string
  workspace_id: string
  title: string
  done: boolean
  position: number
  created_at: string
}

// Recorrência: ao concluir, o CRM já cria a próxima ocorrência
export type ActivityRecurrence = 'none' | 'daily' | 'weekly' | 'biweekly' | 'monthly'

export const ACTIVITY_RECURRENCE_LABELS: Record<ActivityRecurrence, string> = {
  none: 'Não se repete',
  daily: 'Todo dia',
  weekly: 'Toda semana',
  biweekly: 'A cada 15 dias',
  monthly: 'Todo mês',
}

export interface Activity {
  id: string
  workspace_id: string
  lead_id?: string | null
  title: string
  description?: string | null
  status: string
  priority: ActivityPriority
  start_date?: string | null
  due_date?: string | null        // data de entrega (é a que sincroniza com o Google Agenda)
  tags: string[]
  estimate_hours?: number | null
  assigned_to?: string | null           // nome livre (quem não tem login)
  assigned_user_id?: string | null      // pessoa marcada, com login no CRM
  recurrence: ActivityRecurrence
  recurrence_parent?: string | null
  share_token?: string | null
  share_enabled: boolean
  position: number
  google_event_id?: string | null
  created_at: string
  updated_at: string
}

// Ordem de prioridade pra ordenação automática do quadro
export const PRIORITY_RANK: Record<ActivityPriority, number> = { urgent: 0, high: 1, normal: 2, low: 3 }

// Ordena por prioridade e depois pelo prazo mais próximo (sem prazo vai pro fim)
export function sortActivities(list: Activity[]): Activity[] {
  return [...list].sort((a, b) => {
    const p = (PRIORITY_RANK[a.priority] ?? 2) - (PRIORITY_RANK[b.priority] ?? 2)
    if (p !== 0) return p
    const da = a.due_date ? new Date(a.due_date).getTime() : Infinity
    const db = b.due_date ? new Date(b.due_date).getTime() : Infinity
    if (da !== db) return da - db
    return a.title.localeCompare(b.title)
  })
}

// Quanto tempo um bloco pode ocupar antes de ser tratado como "prazo longo"
// em vez de tempo de trabalho contínuo.
const MAX_BLOCO_HORAS = 10

// Janela que a tarefa ocupa na agenda: início→entrega, ou a estimativa a
// partir/antes de uma das pontas. Sem nenhuma data, não entra na agenda.
export function activityWindow(a: Activity): { start: Date; end: Date } | null {
  const HORA = 3600_000
  const dur = Math.max(0.25, a.estimate_hours ?? 1) * HORA
  const s = a.start_date ? new Date(a.start_date) : null
  const e = a.due_date ? new Date(a.due_date) : null

  if (s && e && e.getTime() > s.getTime()) {
    // "Começa hoje, entrega sexta" é prazo, não 3 dias sentado na tarefa:
    // reserva só a estimativa, terminando na hora da entrega.
    if (e.getTime() - s.getTime() > MAX_BLOCO_HORAS * HORA) {
      return { start: new Date(e.getTime() - dur), end: e }
    }
    return { start: s, end: e }
  }
  if (s) return { start: s, end: new Date(s.getTime() + dur) }
  if (e) return { start: new Date(e.getTime() - dur), end: e }
  return null
}
