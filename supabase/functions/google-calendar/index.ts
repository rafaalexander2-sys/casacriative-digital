// Edge Function: google-calendar
// Conecta/desconecta o Google Agenda de um espaço (workspace) e sincroniza
// atividades (activities) como eventos. Guarda os tokens OAuth (a tabela
// google_calendar_connections não é acessível via PostgREST — só aqui,
// com a service role).
//
// Deploy: Supabase → Edge Functions → deploy "google-calendar".
// Secrets necessários (Supabase → Edge Functions → Secrets):
//   GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
// (SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são injetadas automaticamente)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } })

const TOKEN_URL = 'https://oauth2.googleapis.com/token'
const CAL_API = 'https://www.googleapis.com/calendar/v3'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const url = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } })

    // 1) Quem está a chamar?
    const jwt = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!jwt) return json({ error: 'Sem autenticação.' }, 401)
    const { data: callerData } = await admin.auth.getUser(jwt)
    const caller = callerData?.user
    if (!caller) return json({ error: 'Sessão inválida.' }, 401)

    const body = await req.json().catch(() => ({}))
    const { action, workspace_id: workspaceId } = body
    if (!workspaceId) return json({ error: 'workspace_id é obrigatório.' }, 400)

    // 2) Tem acesso a este espaço (é membro dele, ou é da agência)?
    const { data: memberships } = await admin
      .from('memberships')
      .select('workspace_id, workspaces!inner(is_agency)')
      .eq('user_id', caller.id)
    const isAgency = (memberships ?? []).some((m: any) => m.workspaces?.is_agency)
    const isMember = (memberships ?? []).some((m: any) => m.workspace_id === workspaceId)
    if (!isAgency && !isMember) return json({ error: 'Sem acesso a este espaço.' }, 403)

    const clientId = Deno.env.get('GOOGLE_CLIENT_ID')
    const clientSecret = Deno.env.get('GOOGLE_CLIENT_SECRET')

    // ---------------------------------------------------------
    if (action === 'connect') {
      if (!clientId || !clientSecret) return json({ error: 'Integração não configurada no servidor (GOOGLE_CLIENT_ID/SECRET).' }, 500)
      const { code, redirect_uri } = body
      if (!code || !redirect_uri) return json({ error: 'code e redirect_uri são obrigatórios.' }, 400)

      const tokenRes = await fetch(TOKEN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code, client_id: clientId, client_secret: clientSecret,
          redirect_uri, grant_type: 'authorization_code',
        }),
      })
      const tok = await tokenRes.json()
      if (!tokenRes.ok || !tok.refresh_token) {
        return json({ error: tok.error_description ?? 'Falha ao conectar com o Google. Tente novamente (é preciso autorizar o acesso).' }, 400)
      }

      let email: string | null = null
      try {
        const meRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${tok.access_token}` },
        })
        if (meRes.ok) email = (await meRes.json()).email ?? null
      } catch { /* não bloqueia a conexão se o userinfo falhar */ }

      const { error: upsertErr } = await admin.from('google_calendar_connections').upsert({
        workspace_id: workspaceId,
        access_token: tok.access_token,
        refresh_token: tok.refresh_token,
        expiry_date: new Date(Date.now() + tok.expires_in * 1000).toISOString(),
        connected_by: caller.id,
        connected_email: email,
      }, { onConflict: 'workspace_id' })
      if (upsertErr) return json({ error: upsertErr.message }, 500)

      return json({ ok: true, email })
    }

    // ---------------------------------------------------------
    if (action === 'disconnect') {
      const { error } = await admin.from('google_calendar_connections').delete().eq('workspace_id', workspaceId)
      if (error) return json({ error: error.message }, 500)
      return json({ ok: true })
    }

    // ---------------------------------------------------------
    if (action === 'sync') {
      if (!clientId || !clientSecret) return json({ error: 'Integração não configurada no servidor (GOOGLE_CLIENT_ID/SECRET).' }, 500)
      const { activity } = body
      if (!activity?.id || !activity?.title) return json({ error: 'activity inválida.' }, 400)

      const { data: conn } = await admin
        .from('google_calendar_connections').select('*').eq('workspace_id', workspaceId).single()
      if (!conn) return json({ error: 'Google Agenda não conectada para este espaço.' }, 400)

      let accessToken = conn.access_token as string
      if (new Date(conn.expiry_date).getTime() < Date.now() + 60_000) {
        const r = await fetch(TOKEN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: clientId, client_secret: clientSecret,
            refresh_token: conn.refresh_token, grant_type: 'refresh_token',
          }),
        })
        const rt = await r.json()
        if (!r.ok) return json({ error: 'Falha ao renovar o acesso ao Google. Reconecte a Agenda em Configurações.' }, 400)
        accessToken = rt.access_token
        await admin.from('google_calendar_connections').update({
          access_token: accessToken,
          expiry_date: new Date(Date.now() + rt.expires_in * 1000).toISOString(),
        }).eq('workspace_id', workspaceId)
      }

      // Sem data → se já tinha evento, apaga; sem mais nada a fazer.
      if (!activity.due_date) {
        if (activity.google_event_id) {
          await fetch(`${CAL_API}/calendars/${encodeURIComponent(conn.calendar_id)}/events/${activity.google_event_id}`, {
            method: 'DELETE', headers: { Authorization: `Bearer ${accessToken}` },
          }).catch(() => {})
        }
        return json({ ok: true, google_event_id: null })
      }

      const start = new Date(activity.due_date)
      const end = new Date(start.getTime() + 30 * 60_000)
      const eventBody = {
        summary: activity.title,
        description: activity.description || undefined,
        start: { dateTime: start.toISOString() },
        end: { dateTime: end.toISOString() },
      }

      const method = activity.google_event_id ? 'PATCH' : 'POST'
      const path = activity.google_event_id
        ? `/calendars/${encodeURIComponent(conn.calendar_id)}/events/${activity.google_event_id}`
        : `/calendars/${encodeURIComponent(conn.calendar_id)}/events`

      const evRes = await fetch(`${CAL_API}${path}`, {
        method,
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(eventBody),
      })
      const ev = await evRes.json()
      if (!evRes.ok) return json({ error: ev.error?.message ?? 'Falha ao sincronizar com o Google Agenda.' }, 400)

      return json({ ok: true, google_event_id: ev.id })
    }

    return json({ error: 'Ação desconhecida.' }, 400)
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500)
  }
})
