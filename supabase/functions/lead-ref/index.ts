// Edge Function: lead-ref  (PÚBLICA)
// Regista a associação código de referência → atribuição do clique.
//
// Chamada pelo servidor do site do cliente quando alguém clica num link de
// WhatsApp. O código vai no fim da mensagem pré-preenchida; quem atende
// cola-o no cadastro e o gatilho no banco (schema-lead-refs.sql) preenche
// gclid/utms sozinho.
//
// Deploy: automático pelo GitHub Actions, com --no-verify-jwt.
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

    // O código é lido de um ecrã e digitado por uma pessoa: normalizar para
    // maiúsculas evita metade dos casos de "não encontrei a referência".
    const ref = String(body.ref ?? '').trim().toUpperCase()
    if (!/^[A-Z0-9]{4,12}$/.test(ref)) return json({ error: 'ref inválida.' }, 400)

    if (!body.token) return json({ error: 'token é obrigatório.' }, 400)
    const { data: ws } = await admin
      .from('workspaces').select('id').eq('ingest_token', body.token).limit(1)
    const workspaceId = ws?.[0]?.id
    if (!workspaceId) return json({ error: 'Token inválido.' }, 401)

    const txt = (v: unknown) => {
      const s = v == null ? null : String(v).trim()
      return s ? s.slice(0, 500) : null
    }

    // upsert: o mesmo código pode ser reenviado (clique repetido, retentativa
    // do keepalive). Reescrever é inofensivo e melhor do que falhar.
    const { error } = await admin.from('lead_refs').upsert({
      ref,
      workspace_id: workspaceId,
      gclid: txt(body.gclid),
      gbraid: txt(body.gbraid),
      wbraid: txt(body.wbraid),
      fbclid: txt(body.fbclid),
      utm_source: txt(body.utm_source),
      utm_medium: txt(body.utm_medium),
      utm_campaign: txt(body.utm_campaign),
      utm_term: txt(body.utm_term),
      utm_content: txt(body.utm_content),
      landing_page: txt(body.landing_page),
      referrer: txt(body.referrer),
      page: txt(body.page),
      cta: txt(body.cta),
      user_agent: txt(body.ua),
      ip: txt(body.ip),
    }, { onConflict: 'ref' })

    if (error) return json({ error: error.message }, 500)
    return json({ ok: true })
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500)
  }
})
