// Edge Function: invite-user
// Cria (ou reaproveita) a conta da pessoa, liga ao cliente e devolve
// E-MAIL + SENHA TEMPORÁRIA — onboarding robusto para enviar por WhatsApp.
// (Link mágico é uso único e é consumido por robôs de preview; por isso senha.)
// Só membros da AGÊNCIA podem chamar.
//
// Deploy: Supabase → Edge Functions → deploy "invite-user".
// SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são injetadas automaticamente.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, 'Content-Type': 'application/json' } })

// Senha temporária legível (evita caracteres ambíguos)
function tempPassword(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789'
  const bytes = crypto.getRandomValues(new Uint8Array(10))
  return 'cc-' + Array.from(bytes, b => chars[b % chars.length]).join('')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const url = Deno.env.get('SUPABASE_URL')!
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const admin = createClient(url, serviceKey, { auth: { persistSession: false } })

    // 1) Quem está a chamar?
    const jwt = req.headers.get('Authorization')?.replace('Bearer ', '')
    if (!jwt) return json({ error: 'Sem autenticação.' }, 401)
    const { data: caller } = await admin.auth.getUser(jwt)
    if (!caller?.user) return json({ error: 'Sessão inválida.' }, 401)

    // 2) É agência?
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

    const password = tempPassword()

    // 4) Cria a conta OU reseta a senha se já existir
    let userId: string | undefined
    let existed = false
    const { data: createdData, error: createErr } = await admin.auth.admin.createUser({
      email: cleanEmail,
      password,
      email_confirm: true,
    })
    if (createErr) {
      existed = true
      const { data: list } = await admin.auth.admin.listUsers()
      userId = list.users.find(u => u.email?.toLowerCase() === cleanEmail)?.id
      if (userId) await admin.auth.admin.updateUserById(userId, { password })
    } else {
      userId = createdData.user?.id
    }
    if (!userId) return json({ error: 'Não consegui criar/encontrar o utilizador.' }, 500)

    // 5) Liga ao cliente
    await admin
      .from('memberships')
      .upsert({ workspace_id, user_id: userId, role: cleanRole }, { onConflict: 'workspace_id,user_id' })

    return json({ email: cleanEmail, password, role: cleanRole, existed })
  } catch (e) {
    return json({ error: String((e as Error)?.message ?? e) }, 500)
  }
})
