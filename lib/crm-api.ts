import { supabase } from './supabase'
import type { Lead, Workspace, Member, Invitation, MemberRole, PipelineStage, StageKind, LeadEvent, Activity } from './crm-types'

// Extrai uma mensagem legível do erro de uma Edge Function (supabase.functions.invoke)
async function fnErrorMessage(error: any): Promise<string> {
  let msg = error?.message ?? 'Falha na requisição.'
  try {
    const j = await error?.context?.json?.()
    if (j?.error) msg = j.error
  } catch {}
  return msg
}

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

// ---- Convites: reclamar os meus ao logar (liga user aos clientes) ----
export async function acceptMyInvitations(): Promise<void> {
  const { error } = await supabase.rpc('accept_my_invitations')
  if (error) throw error
}

// ---- Sou membro da agência? ----
export async function isAgencyMember(): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_agency_member')
  if (error) throw error
  return !!data
}

// ---- Criar cliente (novo workspace) ----
export async function createClient(name: string): Promise<Workspace> {
  const { data, error } = await supabase
    .from('workspaces')
    .insert({ name, is_agency: false })
    .select()
    .single()
  if (error) throw error
  return data
}

// ---- Membros de um cliente (com email, via RPC) ----
export async function listMembers(workspaceId: string): Promise<Member[]> {
  const { data, error } = await supabase.rpc('list_members', { ws: workspaceId })
  if (error) throw error
  return data ?? []
}

// ---- Convites pendentes de um cliente ----
export async function listInvitations(workspaceId: string): Promise<Invitation[]> {
  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('workspace_id', workspaceId)
    .is('accepted_at', null)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

// ---- Convidar pessoa para um cliente ----
export async function inviteMember(workspaceId: string, email: string, role: MemberRole): Promise<Invitation> {
  const { data: userData } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('invitations')
    .upsert(
      { workspace_id: workspaceId, email: email.trim().toLowerCase(), role, created_by: userData.user?.id ?? null, accepted_at: null },
      { onConflict: 'workspace_id,email' },
    )
    .select()
    .single()
  if (error) throw error
  return data
}

// ---- Adicionar pessoa via Edge Function: cria conta + liga + devolve link ----
export async function addPerson(
  workspaceId: string,
  email: string,
  role: MemberRole,
): Promise<{ email: string; password: string; role: MemberRole; existed: boolean }> {
  const { data, error } = await supabase.functions.invoke('invite-user', {
    body: { workspace_id: workspaceId, email, role },
  })
  if (error) throw new Error(await fnErrorMessage(error))
  if (data?.error) throw new Error(data.error)
  return data
}

// ---- Cancelar convite ----
export async function cancelInvitation(id: string): Promise<void> {
  const { error } = await supabase.from('invitations').delete().eq('id', id)
  if (error) throw error
}

// ---- Remover membro de um cliente ----
export async function removeMember(workspaceId: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('memberships')
    .delete()
    .eq('workspace_id', workspaceId)
    .eq('user_id', userId)
  if (error) throw error
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

// ---- Mudar etapa (arrastar no Kanban) ----
export async function updateLeadStatus(lead: Lead, stage: PipelineStage): Promise<Lead> {
  const now = new Date().toISOString()
  const patch: Partial<Lead> = {
    status: stage.key,
    won_at: stage.kind === 'won' ? now : null,
    lost_at: stage.kind === 'lost' ? now : null,
  }
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
    to_status: stage.key,
  })
  return data
}

// ---- Etapas do funil (por espaço) ----
export async function getStages(workspaceId: string): Promise<PipelineStage[]> {
  const { data, error } = await supabase
    .from('pipeline_stages')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('position')
  if (error) throw error
  return data ?? []
}

export async function canManageFunnel(workspaceId: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('is_ws_admin', { ws: workspaceId })
  if (error) return false
  return !!data
}

function slugKey(label: string): string {
  const base = label.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')
  return (base || 'etapa') + '_' + Math.random().toString(36).slice(2, 6)
}

export async function createStage(
  workspaceId: string,
  input: { label: string; color?: string; kind?: StageKind; position: number },
): Promise<PipelineStage> {
  const { data, error } = await supabase
    .from('pipeline_stages')
    .insert({
      workspace_id: workspaceId,
      key: slugKey(input.label),
      label: input.label,
      color: input.color ?? '#64748b',
      kind: input.kind ?? 'open',
      position: input.position,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateStage(id: string, patch: Partial<Pick<PipelineStage, 'label' | 'color' | 'kind' | 'position'>>): Promise<void> {
  const { error } = await supabase.from('pipeline_stages').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteStage(id: string): Promise<void> {
  const { error } = await supabase.from('pipeline_stages').delete().eq('id', id)
  if (error) throw error
}

// Persistir a ordem de todas as etapas
export async function reorderStages(stages: PipelineStage[]): Promise<void> {
  await Promise.all(stages.map((s, i) => supabase.from('pipeline_stages').update({ position: i + 1 }).eq('id', s.id)))
}

// ---- Editar campos gerais do lead ----
export async function updateLead(id: string, patch: Partial<Lead>): Promise<Lead> {
  const { data, error } = await supabase.from('leads').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

// ---- Histórico do lead ----
export async function getLeadEvents(leadId: string): Promise<LeadEvent[]> {
  const { data, error } = await supabase
    .from('lead_events')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

// ---- Adicionar nota ao histórico ----
export async function addNote(lead: Lead, message: string): Promise<void> {
  await logEvent(lead.workspace_id, lead.id, { type: 'note', message })
}

// ---- Apagar lead ----
export async function deleteLead(id: string): Promise<void> {
  const { error } = await supabase.from('leads').delete().eq('id', id)
  if (error) throw error
}

// ---- Atividades (quadro estilo Trello) ----
export async function getActivities(workspaceId: string): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('position')
  if (error) throw error
  return data ?? []
}

export async function createActivity(
  workspaceId: string,
  input: Partial<Activity> & { title: string },
): Promise<Activity> {
  const { data, error } = await supabase
    .from('activities')
    .insert({ ...input, workspace_id: workspaceId })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateActivity(id: string, patch: Partial<Activity>): Promise<Activity> {
  const { data, error } = await supabase.from('activities').update(patch).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteActivity(id: string): Promise<void> {
  const { error } = await supabase.from('activities').delete().eq('id', id)
  if (error) throw error
}

// ---- Google Agenda ----
export async function hasGoogleCalendar(workspaceId: string): Promise<{ connected: boolean; email?: string | null }> {
  const { data, error } = await supabase.rpc('google_calendar_status', { ws: workspaceId })
  if (error) throw error
  const row = data?.[0]
  return { connected: !!row?.connected, email: row?.email ?? null }
}

export async function connectGoogleCalendar(workspaceId: string, code: string, redirectUri: string): Promise<{ ok: true; email: string | null }> {
  const { data, error } = await supabase.functions.invoke('google-calendar', {
    body: { action: 'connect', workspace_id: workspaceId, code, redirect_uri: redirectUri },
  })
  if (error) throw new Error(await fnErrorMessage(error))
  if (data?.error) throw new Error(data.error)
  return data
}

export async function disconnectGoogleCalendar(workspaceId: string): Promise<void> {
  const { data, error } = await supabase.functions.invoke('google-calendar', {
    body: { action: 'disconnect', workspace_id: workspaceId },
  })
  if (error) throw new Error(await fnErrorMessage(error))
  if (data?.error) throw new Error(data.error)
}

export async function syncActivityToGoogle(workspaceId: string, activity: Activity): Promise<{ ok: true; google_event_id: string | null }> {
  const { data, error } = await supabase.functions.invoke('google-calendar', {
    body: {
      action: 'sync',
      workspace_id: workspaceId,
      activity: {
        id: activity.id, title: activity.title, description: activity.description,
        due_date: activity.due_date, google_event_id: activity.google_event_id,
      },
    },
  })
  if (error) throw new Error(await fnErrorMessage(error))
  if (data?.error) throw new Error(data.error)
  return data
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
