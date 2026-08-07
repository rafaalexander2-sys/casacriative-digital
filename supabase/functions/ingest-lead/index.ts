// Edge Function: ingest-lead  (PÚBLICA)
// Recebe submissões de formulário/webhook e cria um lead no CRM.
// Roteia pelo token do espaço; sem token → espaço da agência.
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

    const body = await req.json().catch(() => ({}))
    // honeypot anti-bot: se veio preenchido, finge sucesso e ignora
    if (body._gotcha) return json({ ok: true })

    const name = String(body.name ?? '').trim()
    if (!name) return json({ error: 'name é obrigatório.' }, 400)

    // 1) Descobrir o espaço de destino
    let workspaceId: string | undefined
    if (body.token) {
      const { data } = await admin.from('workspaces').select('id').eq('ingest_token', body.token).limit(1)
      workspaceId = data?.[0]?.id
      if (!workspaceId) return json({ error: 'Token inválido.' }, 401)
    } else {
      const { data } = await admin.from('workspaces').select('id').eq('is_agency', true).limit(1)
      workspaceId = data?.[0]?.id
      if (!workspaceId) return json({ error: 'Nenhum espaço da agência configurado.' }, 500)
    }

    // 2) Inserir o lead (captura origem de anúncio)
    const lead = {
      workspace_id: workspaceId,
      name,
      email: body.email ?? null,
      phone: body.phone ?? null,
      company: body.company ?? null,
      source: body.source && ['form', 'whatsapp', 'meta_ads', 'google_ads', 'manual', 'import'].includes(body.source)
        ? body.source
        : 'form',
      status: 'novo',
      notes: body.notes ?? body.message ?? null,
      utm_source: body.utm_source ?? null,
      utm_medium: body.utm_medium ?? null,
      utm_campaign: body.utm_campaign ?? null,
      fbclid: body.fbclid ?? null,
      gclid: body.gclid ?? null,
    }
    const { error } = await admin.from('leads').insert(lead)
    if (error) return json({ error: error.message }, 500)

    return json({ ok: true })
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500)
  }
})
