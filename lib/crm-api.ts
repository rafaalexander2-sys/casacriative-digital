import { supabase } from './supabase'
import type { Lead, LeadStatus, Workspace, Member, Invitation, MemberRole } from './crm-types'

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
): Promise<{ link: string; email: string; role: MemberRole }> {
  const { data, error } = await supabase.functions.invoke('invite-user', {
    body: { workspace_id: workspaceId, email, role },
  })
  if (error) {
    let msg = error.message
    try {
      const j = await (error as any).context?.json?.()
      if (j?.error) msg = j.error
    } catch {}
    throw new Error(msg)
  }
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
