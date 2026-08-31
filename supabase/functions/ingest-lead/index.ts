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

    const raw = await req.json().catch(() => ({}))

    // ------------------------------------------------------------------
    // Formulários de lead do Google Ads
    // O Google manda um formato próprio e NÃO deixa configurar cabeçalhos —
    // por isso esta função tem de aceitar um POST simples. A "Chave" que se
    // preenche no painel do Google viaja em `google_key`: usamo-la como o
    // token do espaço, o que valida e roteia de uma vez só.
    // Docs: developers.google.com/google-ads/webhook/docs/implementation
    // ------------------------------------------------------------------
    const isGoogleForm = Array.isArray(raw?.user_column_data)
    let body = raw

    if (isGoogleForm) {
      const cols: Record<string, string> = {}
      for (const c of raw.user_column_data ?? []) {
        if (c?.column_id) cols[String(c.column_id)] = String(c.string_value ?? '').trim()
      }

      // Campos que não têm coluna própria no CRM vão para as anotações, com
      // o rótulo que o próprio Google deu — não se perde nada do formulário.
      const conhecidos = new Set(['FULL_NAME', 'FIRST_NAME', 'LAST_NAME', 'EMAIL', 'WORK_EMAIL', 'PHONE_NUMBER', 'COMPANY_NAME'])
      const extras = (raw.user_column_data ?? [])
        .filter((c: any) => c?.column_id && !conhecidos.has(String(c.column_id)) && String(c.string_value ?? '').trim())
        .map((c: any) => `${c.column_name ?? c.column_id}: ${c.string_value}`)

      const nome = cols.FULL_NAME
        || [cols.FIRST_NAME, cols.LAST_NAME].filter(Boolean).join(' ').trim()
        || cols.EMAIL || cols.PHONE_NUMBER

      body = {
        token: raw.google_key,
        name: nome,
        email: cols.EMAIL || cols.WORK_EMAIL || null,
        phone: cols.PHONE_NUMBER || null,
        company: cols.COMPANY_NAME || null,
        source: 'google_ads',
        gclid: raw.gcl_id ?? null,
        utm_source: 'google',
        utm_medium: 'cpc',
        utm_campaign: raw.campaign_id != null ? String(raw.campaign_id) : null,
        notes: extras.length ? extras.join('\n') : null,
        external_id: raw.lead_id ? String(raw.lead_id) : null,
        _google: true,
        _is_test: raw.is_test === true,
      }
    }

    // Respostas no formato que cada lado espera: o Google quer {} em 200 e
    // {"message": ...} em erro; o resto do sistema já usa {ok:true}/{error}.
    const ok = () => (isGoogleForm ? json({}) : json({ ok: true }))
    const fail = (msg: string, code: number) =>
      isGoogleForm ? json({ message: msg }, code) : json({ error: msg }, code)

    // honeypot anti-bot: se veio preenchido, finge sucesso e ignora
    if (body._gotcha) return json({ ok: true })

    // Teste do botão "Enviar dados do teste": confirma a ligação sem sujar o CRM
    if (body._is_test) return ok()

    const name = String(body.name ?? '').trim()
    if (!name) return fail('name é obrigatório.', 400)

    // 1) Descobrir o espaço de destino
    let workspaceId: string | undefined
    if (body.token) {
      const { data } = await admin.from('workspaces').select('id').eq('ingest_token', body.token).limit(1)
      workspaceId = data?.[0]?.id
      if (!workspaceId) return fail('Token inválido.', 401)
    } else {
      const { data } = await admin.from('workspaces').select('id').eq('is_agency', true).limit(1)
      workspaceId = data?.[0]?.id
      if (!workspaceId) return fail('Nenhum espaço da agência configurado.', 500)
    }

    // 2) Etapa inicial: a PRIMEIRA coluna do funil DESTE espaço.
    // Antes era 'novo' fixo. Se o cliente editou o funil e a primeira coluna
    // ficou com outra chave, o lead entrava no banco mas não aparecia em
    // coluna nenhuma no quadro — existia e era invisível.
    let status = 'novo'
    {
      const { data: st } = await admin
        .from('pipeline_stages')
        .select('key')
        .eq('workspace_id', workspaceId)
        .eq('kind', 'open')
        .order('position')
        .limit(1)
      if (st?.[0]?.key) status = st[0].key
    }

    // 3) Inserir o lead (captura origem de anúncio)
    const lead = {
      workspace_id: workspaceId,
      name,
      email: body.email ?? null,
      phone: body.phone ?? null,
      company: body.company ?? null,
      source: body.source && ['form', 'whatsapp', 'meta_ads', 'google_ads', 'manual', 'import'].includes(body.source)
        ? body.source
        : 'form',
      status,
      notes: body.notes ?? body.message ?? null,
      service: body.service ?? null,
      value: body.value != null && !Number.isNaN(Number(body.value)) ? Number(body.value) : null,
      utm_source: body.utm_source ?? null,
      utm_medium: body.utm_medium ?? null,
      utm_campaign: body.utm_campaign ?? null,
      utm_term: body.utm_term ?? null,
      utm_content: body.utm_content ?? null,
      fbclid: body.fbclid ?? null,
      gclid: body.gclid ?? null,
      // Lead que chega pelo webhook chega AGORA: a data é real, não deduzida.
      // Em fuso de São Paulo — senão um lead das 21h cai no dia seguinte.
      entry_date: new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }),
      entry_date_estimated: false,
    }
    // Dedup: o Google reenvia o mesmo lead quando recebe 5xx. Sem isto, uma
    // falha temporária transformava-se em cartões repetidos no quadro.
    const externalId = body.external_id ? String(body.external_id) : null
    if (externalId) {
      const { data: jaExiste } = await admin
        .from('leads').select('id')
        .eq('workspace_id', workspaceId).eq('external_id', externalId).limit(1)
      if (jaExiste?.[0]) return ok()
    }

    let { error } = await admin.from('leads').insert({ ...lead, external_id: externalId })

    // Se a coluna external_id ainda não existir no banco, grava sem ela em vez
    // de perder o lead — o dedup passa a valer quando o SQL for aplicado.
    if (error && /external_id/i.test(error.message)) {
      ;({ error } = await admin.from('leads').insert(lead))
    }
    // 5xx faz o Google tentar de novo; 4xx não. Um erro de escrita é nosso.
    if (error) return fail(error.message, 500)

    return ok()
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500)
  }
})
