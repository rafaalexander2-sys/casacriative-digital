// Captura parâmetros de origem de anúncio (gclid/fbclid/UTM) na primeira
// visita e guarda no localStorage, para anexar depois ao lead do formulário.

const KEYS = ['gclid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const
const STORE = 'cc_ad_params'

export function captureAdParams() {
  if (typeof window === 'undefined') return
  const params = new URLSearchParams(window.location.search)
  const found: Record<string, string> = {}
  for (const k of KEYS) {
    const v = params.get(k)
    if (v) found[k] = v
  }
  if (Object.keys(found).length === 0) return
  try {
    const prev = JSON.parse(localStorage.getItem(STORE) || '{}')
    localStorage.setItem(STORE, JSON.stringify({ ...prev, ...found }))
  } catch {}
}

export function getAdParams(): Record<string, string> {
  if (typeof window === 'undefined') return {}
  try {
    return JSON.parse(localStorage.getItem(STORE) || '{}')
  } catch {
    return {}
  }
}

// Endpoint público de ingestão de leads
export const INGEST_URL = 'https://mnmcxuumgbjyylsxsadv.supabase.co/functions/v1/ingest-lead'
export const SUPABASE_ANON = 'sb_publishable_UOo29BJEZW7Ds_PgEjGUbw_pzKmRIy6'

// Envia um lead ao CRM. `token` opcional → sem token cai no espaço da agência.
export async function sendLead(payload: Record<string, unknown>, token?: string) {
  const res = await fetch(INGEST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON },
    body: JSON.stringify({ ...getAdParams(), ...payload, ...(token ? { token } : {}) }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok || data.error) throw new Error(data.error || 'Falha ao enviar.')
  return data
}
