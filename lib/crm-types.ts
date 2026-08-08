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
  fbclid?: string | null
  gclid?: string | null
  synced_to_ads: boolean
  synced_at?: string | null
  assigned_to?: string | null
  created_at: string
  updated_at: string
  won_at?: string | null
  lost_at?: string | null
}

export interface Workspace {
  id: string
  name: string
  is_agency: boolean
  ingest_token?: string | null
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
