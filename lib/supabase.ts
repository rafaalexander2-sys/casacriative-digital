import { createClient } from '@supabase/supabase-js'

// Fallbacks evitam que um env faltando no build derrube o site inteiro.
// Os valores reais entram via variáveis de ambiente (local: .env.local / prod: Cloudflare Pages).
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

// Cliente único do CRM (auth + dados). Chaves públicas, seguras no front.
export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})
