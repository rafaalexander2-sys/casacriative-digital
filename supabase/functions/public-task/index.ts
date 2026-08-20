// Edge Function: public-task  (PÚBLICA)
// Devolve o briefing de uma atividade a partir do token de partilha, para a
// página /t — que a pessoa abre pelo WhatsApp, sem login no CRM.
//
// Só devolve dados se a atividade tiver share_enabled = true.
// Nunca devolve nada de outros cartões, nem dados do espaço além do nome.
//
// IMPORTANTE no deploy: desligar "Verify JWT" desta função (é pública).
// Supabase injeta SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY automaticamente.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
      auth: { persistSession: false },
    })

    const { token } = await req.json().catch(() => ({}))
    if (!token) return json({ error: 'Link inválido.' }, 400)

    // 1) Atividade — só se a partilha estiver ligada
    const { data: act } = await admin
      .from('activities')
      .select('id, workspace_id, title, description, status, priority, start_date, due_date, tags, estimate_hours, assigned_to, share_enabled')
      .eq('share_token', token)
      .maybeSingle()

    if (!act || !act.share_enabled) {
      return json({ error: 'Esta tarefa não está disponível. Peça um link novo a quem partilhou.' }, 404)
    }

    // 2) Contexto mínimo: nome do espaço e rótulo da coluna atual
    const [{ data: ws }, { data: stage }] = await Promise.all([
      admin.from('workspaces').select('name').eq('id', act.workspace_id).maybeSingle(),
      admin.from('activity_stages').select('label, color').eq('workspace_id', act.workspace_id).eq('key', act.status).maybeSingle(),
    ])

    // 3) Checklist
    const { data: items } = await admin
      .from('activity_items')
      .select('id, title, done, position')
      .eq('activity_id', act.id)
      .order('position')

    // 4) Anexos — URLs assinadas (o bucket é privado), válidas por 7 dias
    const { data: files } = await admin
      .from('activity_attachments')
      .select('id, name, path, mime_type, size_bytes')
      .eq('activity_id', act.id)
      .order('created_at')

    const attachments = []
    for (const f of files ?? []) {
      const { data: signed } = await admin.storage.from('activity-files').createSignedUrl(f.path, 60 * 60 * 24 * 7)
      attachments.push({ id: f.id, name: f.name, mime_type: f.mime_type, size_bytes: f.size_bytes, url: signed?.signedUrl ?? null })
    }

    return json({
      workspace: ws?.name ?? null,
      stage: stage ? { label: stage.label, color: stage.color } : null,
      task: {
        title: act.title,
        description: act.description,
        priority: act.priority,
        start_date: act.start_date,
        due_date: act.due_date,
        tags: act.tags ?? [],
        estimate_hours: act.estimate_hours,
        assigned_to: act.assigned_to,
      },
      checklist: items ?? [],
      attachments,
    })
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500)
  }
})
