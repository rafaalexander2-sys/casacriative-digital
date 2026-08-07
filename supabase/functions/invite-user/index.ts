// Edge Function: invite-user
// Cria (ou reaproveita) a conta da pessoa, liga ao cliente e devolve um
// LINK DE ACESSO copiável — sem depender de entrega de e-mail.
// Só membros da AGÊNCIA podem chamar.
//
// Deploy: Supabase → Edge Functions → deploy "invite-user".
// As chaves SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são injetadas
// automaticamente pelo Supabase — você NÃO precisa configurar nada.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const REDIRECT_TO = 'https://casacriative.com.br/crm'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const url = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } })

    // 1) Quem está a chamar? (valida o JWT do utilizador logado)
    const jwt = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!jwt) return json({ error: 'Sem autenticação.' }, 401)
    const { data: caller } = await admin.auth.getUser(jwt)
    if (!caller?.user) return json({ error: 'Sessão inválida.' }, 401)

    // 2) O chamador é membro da agência?
    const { data: agencyRows } = await admin
      .from('memberships')
      .select('workspace_id, workspaces!inner(is_agency)')
      .eq('user_id', caller.user.id)
      .eq('workspaces.is_agency', true)
      .limit(1)
    if (!agencyRows || agencyRows.length === 0)
      return json({ error: 'Apenas a agência pode adicionar pessoas.' }, 403)

    // 3) Input
    const { workspace_id, email, role } = await req.json()
    const cleanEmail = String(email ?? '').trim().toLowerCase()
    const cleanRole = ['owner', 'admin', 'member'].includes(role) ? role : 'member'
    if (!workspace_id || !cleanEmail) return json({ error: 'workspace_id e email são obrigatórios.' }, 400)

    // 4) Cria a conta (ou reaproveita se já existir)
    let userId: string | undefined
    const { data: createdData, error: createErr } = await admin.auth.admin.createUser({
      email: cleanEmail,
      email_confirm: true,
    })
    if (createErr) {
      // provavelmente já existe → procura
      const { data: list } = await admin.auth.admin.listUsers()
      userId = list.users.find((u) => u.email?.toLowerCase() === cleanEmail)?.id
    } else {
      userId = createdData.user?.id
    }
    if (!userId) return json({ error: 'Não consegui criar/encontrar o utilizador.' }, 500)

    // 5) Liga ao cliente (workspace)
    await admin
      .from('memberships')
      .upsert({ workspace_id, user_id: userId, role: cleanRole }, { onConflict: 'workspace_id,user_id' })

    // 6) Gera o link de acesso (magic link) para copiar/enviar
    const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
      type: 'magiclink',
      email: cleanEmail,
      options: { redirectTo: REDIRECT_TO },
    })
    if (linkErr) return json({ error: 'Utilizador ligado, mas falhou gerar o link: ' + linkErr.message }, 500)

    return json({ link: linkData.properties?.action_link, email: cleanEmail, role: cleanRole })
  } catch (e) {
    return json({ error: String(e?.message ?? e) }, 500)
  }
})
