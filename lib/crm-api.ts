import { supabase } from './supabase'
import type { Lead, LeadStatus, Workspace } from './crm-types'

// ---- Workspaces do utilizador logado ----
export async function getMyWorkspaces(): Promise<Workspace[]> {
  const { data, error } = await supabase
    .from('workspaces')
    .select('*')
    .order('is_agency', { ascending: false })
    .order('name')
  if (error) throw error
  return data ?? []
}

// ---- Leads de um workspace ----
export async function getLeads(workspaceId: string): Promise<Lead[]> {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

// ---- Criar lead ----
export async function createLead(
  workspaceId: string,
  input: Partial<Lead> & { name: string },
): Promise<Lead> {
  const { data, error } = await supabase
    .from('leads')
    .insert({ ...input, workspace_id: workspaceId })
    .select()
    .single()
  if (error) throw error
  await logEvent(workspaceId, data.id, { type: 'created', to_status: data.status })
  return data
}

// ---- Mudar status (arrastar no Kanban) ----
export async function updateLeadStatus(lead: Lead, to: LeadStatus): Promise<Lead> {
  const patch: Partial<Lead> = { status: to }
  if (to === 'ganho') patch.won_at = new Date().toISOString()
  if (to === 'perdido') patch.lost_at = new Date().toISOString()

  const { data, error } = await supabase
    .from('leads')
    .update(patch)
    .eq('id', lead.id)
    .select()
    .single()
  if (error) throw error

  await logEvent(lead.workspace_id, lead.id, {
    type: 'status_change',
    from_status: lead.status,
    to_status: to,
  })
  return data
}

// ---- Editar campos gerais do lead ----
export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead> {
  const { data, error } = await supabase.from('leads').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

// ---- Apagar lead ----
export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) throw error
}

// ---- Histórico de eventos ----
async function logEvent(
  workspaceId: string,
  leadId: string,
  ev: { type: string; from_status?: string; to_status?: string; message?: string },
) {
  const { data: userData } = await supabase.auth.getUser()
  await supabase.from('lead_events').insert({
    workspace_id: workspaceId,
    lead_id: leadId,
    created_by: userData.user?.id ?? null,
    ...ev,
  })
}
