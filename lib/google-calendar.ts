// Helpers do fluxo OAuth do Google Agenda (frontend).
// A troca do "code" por tokens acontece na Edge Function "google-calendar"
// (precisa do client secret, que nunca vai para o front).

export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

const SCOPE = 'https://www.googleapis.com/auth/calendar.events'

// O CRM é um app estático (SPA) — o próprio /crm recebe a volta do Google.
export function googleRedirectUri(): string {
  return `${window.location.origin}/crm`
}

// state = workspace_id: identifica pra qual espaço a conexão é, sem
// depender do espaço selecionado no momento da volta do Google.
export function googleAuthUrl(workspaceId: string): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: googleRedirectUri(),
    response_type: 'code',
    scope: SCOPE,
    access_type: 'offline',
    prompt: 'consent', // força o Google a sempre devolver refresh_token
    state: workspaceId,
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}
