// Consentimento de cookies + Google Consent Mode v2.
//
// O padrão negado é definido por um script inline no <head> (app/layout.tsx),
// ANTES do gtag.js carregar. Sem isso o GA dispara antes da escolha do
// visitante e o Consent Mode não serve para nada.

export const CONSENT_KEY = 'cc_consent'
export const CONSENT_VERSION = 1
export const CONSENT_MAX_AGE = 365 * 24 * 60 * 60 * 1000 // 12 meses
export const CONSENT_EVENT = 'cc:consent-open'

export interface ConsentChoice {
  v: number
  analytics: boolean
  marketing: boolean
  ts: number
}

type GtagFn = (...args: unknown[]) => void

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: GtagFn
  }
}

export function readConsent(): ConsentChoice | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsentChoice
    if (parsed?.v !== CONSENT_VERSION) return null
    if (Date.now() - parsed.ts > CONSENT_MAX_AGE) return null
    return parsed
  } catch {
    return null
  }
}

/** Traduz a escolha nos sinais do Consent Mode v2. */
export function consentSignals(choice: Pick<ConsentChoice, 'analytics' | 'marketing'>) {
  const ads = choice.marketing ? 'granted' : 'denied'
  return {
    ad_storage: ads,
    ad_user_data: ads,
    ad_personalization: ads,
    personalization_storage: ads,
    analytics_storage: choice.analytics ? 'granted' : 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted',
  }
}

export function saveConsent(analytics: boolean, marketing: boolean): ConsentChoice {
  const choice: ConsentChoice = { v: CONSENT_VERSION, analytics, marketing, ts: Date.now() }
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(choice))
  } catch {}
  applyConsent(choice)
  return choice
}

export function applyConsent(choice: Pick<ConsentChoice, 'analytics' | 'marketing'>) {
  if (typeof window === 'undefined') return
  window.dataLayer = window.dataLayer || []
  const gtag: GtagFn =
    window.gtag ||
    function (...args: unknown[]) {
      window.dataLayer!.push(args)
    }
  gtag('consent', 'update', consentSignals(choice))
}

/** Reabre o painel de preferências a partir de qualquer lugar (ex.: rodapé). */
export function openConsentPreferences() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT))
}

/**
 * Script inline do <head>. Define o padrão negado e, se o visitante já
 * escolheu antes, reaplica a escolha ainda antes do gtag.js carregar.
 */
export const CONSENT_BOOTSTRAP = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{
  ad_storage:'denied',
  ad_user_data:'denied',
  ad_personalization:'denied',
  analytics_storage:'denied',
  personalization_storage:'denied',
  functionality_storage:'granted',
  security_storage:'granted',
  wait_for_update:500
});
try{
  var s=JSON.parse(localStorage.getItem('${CONSENT_KEY}')||'null');
  if(s&&s.v===${CONSENT_VERSION}&&(Date.now()-s.ts)<${CONSENT_MAX_AGE}){
    var a=s.marketing?'granted':'denied';
    gtag('consent','update',{
      ad_storage:a,ad_user_data:a,ad_personalization:a,personalization_storage:a,
      analytics_storage:s.analytics?'granted':'denied',
      functionality_storage:'granted',security_storage:'granted'
    });
  }
}catch(e){}
`.trim()
