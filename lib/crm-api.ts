import { supabase } from './supabase'
import type { Lead, Workspace, Member, Invitation, MemberRole, PipelineStage, StageKind, LeadEvent, Activity, ActivityStage, ActivityStageKind, ActivityItem, ActivityAttachment, ActivityNotification } from './crm-types'

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

// ---- Renomear um cliente/espaço ----
export async function renameWorkspace(workspaceId: string, name: string): Promise<Workspace> {
  const { data, error } = await supabase
    .from('workspaces')
    .update({ name: name.trim() })
    .eq('id', workspaceId)
    .select()
    .single()
  if (error) throw error
  return data
}

// ---- Ativar/desativar o quadro de Atividades de um cliente ----
export async function updateWorkspaceActivitiesEnabled(workspaceId: string, enabled: boolean): Promise<void> {
  const { error } = await supabase.from('workspaces').update({ activities_enabled: enabled }).eq('id', workspaceId)
  if (error) throw error
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

// ---- Checklist / subtarefas de uma atividade ----
export async function getActivityItems(activityId: string): Promise<ActivityItem[]> {
  const { data, error } = await supabase
    .from('activity_items')
    .select('*')
    .eq('activity_id', activityId)
    .order('position')
  if (error) throw error
  return data ?? []
}

// Checklist de várias atividades de uma vez (pra mostrar o progresso nos cartões)
export async function getActivityItemsForWorkspace(workspaceId: string): Promise<ActivityItem[]> {
  const { data, error } = await supabase
    .from('activity_items')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('position')
  if (error) throw error
  return data ?? []
}

export async function createActivityItem(
  workspaceId: string,
  activityId: string,
  input: { title: string; position: number; done?: boolean },
): Promise<ActivityItem> {
  const { data, error } = await supabase
    .from('activity_items')
    .insert({ workspace_id: workspaceId, activity_id: activityId, title: input.title, position: input.position, done: input.done ?? false })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateActivityItem(id: string, patch: Partial<Pick<ActivityItem, 'title' | 'done' | 'position'>>): Promise<void> {
  const { error } = await supabase.from('activity_items').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteActivityItem(id: string): Promise<void> {
  const { error } = await supabase.from('activity_items').delete().eq('id', id)
  if (error) throw error
}

// ---- Notificações (o sininho) ----
export async function getMyNotifications(limit = 30): Promise<ActivityNotification[]> {
  const { data, error } = await supabase
    .from('activity_notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data ?? []
}

export async function markNotificationRead(id: string): Promise<void> {
  const { error } = await supabase
    .from('activity_notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function markAllNotificationsRead(): Promise<void> {
  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return
  const { error } = await supabase
    .from('activity_notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('user_id', userData.user.id)
    .is('read_at', null)
  if (error) throw error
}

// Avisa quem foi marcado numa atividade (não avisa a própria pessoa)
export async function notifyAssignment(activity: Activity, userId: string, actorEmail?: string | null): Promise<void> {
  const { data: userData } = await supabase.auth.getUser()
  const actorId = userData.user?.id ?? null
  if (userId === actorId) return

  const quando = activity.due_date
    ? ` · entrega ${new Date(activity.due_date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}`
    : ''
  const { error } = await supabase.from('activity_notifications').insert({
    workspace_id: activity.workspace_id,
    activity_id: activity.id,
    user_id: userId,
    actor_id: actorId,
    type: 'assigned',
    title: activity.title,
    message: `${actorEmail ? actorEmail + ' marcou' : 'Marcaram'} você nesta tarefa${quando}`,
  })
  if (error) throw error
}

// ---- Anexos do briefing (ficheiro vai pro Storage, registo vai pra tabela) ----
const BUCKET = 'activity-files'

export async function getAttachments(activityId: string): Promise<ActivityAttachment[]> {
  const { data, error } = await supabase
    .from('activity_attachments')
    .select('*')
    .eq('activity_id', activityId)
    .order('created_at')
  if (error) throw error
  return data ?? []
}

export async function uploadAttachment(workspaceId: string, activityId: string, file: File): Promise<ActivityAttachment> {
  // nome seguro + sufixo aleatório evita colisão entre ficheiros com o mesmo nome
  const safe = file.name.replace(/[^\w.\-]+/g, '_').slice(-80) || 'arquivo'
  const path = `${workspaceId}/${activityId}/${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${safe}`

  const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type || 'application/octet-stream',
    upsert: false,
  })
  if (upErr) throw upErr

  const { data: userData } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('activity_attachments')
    .insert({
      activity_id: activityId,
      workspace_id: workspaceId,
      name: file.name || safe,
      path,
      mime_type: file.type || null,
      size_bytes: file.size ?? null,
      created_by: userData.user?.id ?? null,
    })
    .select()
    .single()
  if (error) {
    // não deixa ficheiro órfão no Storage se o registo falhar
    await supabase.storage.from(BUCKET).remove([path]).catch(() => {})
    throw error
  }
  return data
}

// URL temporária pra mostrar o anexo dentro do CRM (o bucket é privado)
export async function getAttachmentUrl(path: string, seconds = 3600): Promise<string | null> {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, seconds)
  if (error) return null
  return data?.signedUrl ?? null
}

export async function deleteAttachment(att: ActivityAttachment): Promise<void> {
  await supabase.storage.from(BUCKET).remove([att.path]).catch(() => {})
  const { error } = await supabase.from('activity_attachments').delete().eq('id', att.id)
  if (error) throw error
}

// ---- Link público do briefing (pra mandar no WhatsApp) ----
export async function setActivityShare(id: string, enabled: boolean): Promise<Activity> {
  const { data, error } = await supabase
    .from('activities')
    .update({ share_enabled: enabled })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// ---- Recorrência: cria a próxima ocorrência ao concluir ----
function advance(iso: string | null | undefined, recurrence: Activity['recurrence']): string | null {
  if (!iso) return null
  const d = new Date(iso)
  if (isNaN(d.getTime())) return null
  if (recurrence === 'daily') d.setDate(d.getDate() + 1)
  else if (recurrence === 'weekly') d.setDate(d.getDate() + 7)
  else if (recurrence === 'biweekly') d.setDate(d.getDate() + 14)
  else if (recurrence === 'monthly') d.setMonth(d.getMonth() + 1)
  else return null
  return d.toISOString()
}

// Duplica a tarefa recorrente com as datas avançadas e o checklist desmarcado.
// Devolve null quando não há o que repetir (sem recorrência ou sem datas).
export async function spawnNextOccurrence(activity: Activity, firstStage?: string): Promise<Activity | null> {
  if (!activity.recurrence || activity.recurrence === 'none') return null
  const start_date = advance(activity.start_date, activity.recurrence)
  const due_date = advance(activity.due_date, activity.recurrence)
  if (!start_date && !due_date) return null

  const { data: next, error } = await supabase
    .from('activities')
    .insert({
      workspace_id: activity.workspace_id,
      lead_id: activity.lead_id ?? null,
      title: activity.title,
      description: activity.description ?? null,
      status: firstStage ?? activity.status,
      priority: activity.priority,
      start_date,
      due_date,
      tags: activity.tags ?? [],
      estimate_hours: activity.estimate_hours ?? null,
      assigned_to: activity.assigned_to ?? null,
      recurrence: activity.recurrence,
      recurrence_parent: activity.recurrence_parent ?? activity.id,
    })
    .select()
    .single()
  if (error) throw error

  // Checklist volta a aparecer, todo desmarcado
  const items = await getActivityItems(activity.id).catch(() => [])
  for (const [i, it] of items.entries()) {
    await createActivityItem(activity.workspace_id, next.id, { title: it.title, position: i + 1, done: false }).catch(() => {})
  }
  return next
}

// ---- Colunas do quadro de Atividades (customizáveis por espaço) ----
export async function getActivityStages(workspaceId: string): Promise<ActivityStage[]> {
  const { data, error } = await supabase
    .from('activity_stages')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('position')
  if (error) throw error
  return data ?? []
}

export async function createActivityStage(
  workspaceId: string,
  input: { label: string; color?: string; kind?: ActivityStageKind; position: number },
): Promise<ActivityStage> {
  const { data, error } = await supabase
    .from('activity_stages')
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

export async function updateActivityStage(id: string, patch: Partial<Pick<ActivityStage, 'label' | 'color' | 'kind' | 'position'>>): Promise<void> {
  const { error } = await supabase.from('activity_stages').update(patch).eq('id', id)
  if (error) throw error
}

export async function deleteActivityStage(id: string): Promise<void> {
  const { error } = await supabase.from('activity_stages').delete().eq('id', id)
  if (error) throw error
}

export async function reorderActivityStages(stages: ActivityStage[]): Promise<void> {
  await Promise.all(stages.map((s, i) => supabase.from('activity_stages').update({ position: i + 1 }).eq('id', s.id)))
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
