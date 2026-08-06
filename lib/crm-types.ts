// Tipos do CRM — espelham o schema em supabase/schema.sql

export type LeadStatus = 'novo' | 'qualificado' | 'proposta' | 'ganho' | 'perdido'

export type LeadSource = 'form' | 'whatsapp' | 'meta_ads' | 'google_ads' | 'manual' | 'import'

export interface Lead {
  id: string
  workspace_id: string
  name: string
  email?: string | null
  phone?: string | null
  company?: string | null
  source: LeadSource
  status: LeadStatus
  value?: number | null
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
  created_at: string
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
