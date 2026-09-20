'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { CONSENT_EVENT, readConsent, saveConsent } from '@/lib/consent'

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

const groups = [
  {
    key: 'necessary' as const,
    label: 'Necessários',
    desc: 'Fazem o site funcionar e guardam esta escolha. Não podem ser desligados.',
    locked: true,
  },
  {
    key: 'analytics' as const,
    label: 'Medição',
    desc: 'Google Analytics. Mostram quais páginas funcionam e quantas pessoas visitam.',
    locked: false,
  },
  {
    key: 'marketing' as const,
    label: 'Marketing',
    desc: 'Google Ads e Meta. Medem conversões de campanha e permitem anúncios relevantes.',
    locked: false,
  },
]

export default function CookieConsent() {
  const [open, setOpen] = useState(false)
  const [details, setDetails] = useState(false)
  const [analytics, setAnalytics] = useState(true)
  const [marketing, setMarketing] = useState(true)

  useEffect(() => {
    const stored = readConsent()
    if (!stored) {
      setOpen(true)
      return
    }
    setAnalytics(stored.analytics)
    setMarketing(stored.marketing)
  }, [])

  useEffect(() => {
    const reopen = () => {
      const stored = readConsent()
      setAnalytics(stored?.analytics ?? true)
      setMarketing(stored?.marketing ?? true)
      setDetails(true)
      setOpen(true)
    }
    window.addEventListener(CONSENT_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_EVENT, reopen)
  }, [])

  const decide = useCallback((a: boolean, m: boolean) => {
    saveConsent(a, m)
    setAnalytics(a)
    setMarketing(m)
    setOpen(false)
    setDetails(false)
  }, [])

  if (!open) return null

  return (
    <>
      <style>{`
        .cc-ck {
          position: fixed; left: 20px; right: 20px; bottom: 20px; z-index: 9000;
          max-width: 520px; margin-left: auto;
          background: rgba(14,14,14,0.96);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          border: 0.5px solid rgba(255,210,160,0.22);
          border-radius: 16px; padding: 22px 22px 18px;
          box-shadow: 0 18px 50px rgba(0,0,0,0.55);
        }
        .cc-ck-btns { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 18px; }
        .cc-ck-btn {
          flex: 1 1 140px; border: none; border-radius: 10px; padding: 12px 18px;
          font-family: inherit; font-size: 13px; font-weight: 500; cursor: pointer;
          transition: opacity 0.2s;
        }
        .cc-ck-btn:hover { opacity: 0.85; }
        .cc-ck-btn.primary { background: ${BG}; color: #fff; }
        .cc-ck-btn.ghost {
          background: rgba(255,255,255,0.06); color: #d8d8dc;
          border: 0.5px solid rgba(255,255,255,0.14);
        }
        .cc-ck-link {
          background: none; border: none; padding: 0; cursor: pointer;
          font-family: inherit; font-size: 12px; color: #86868b; text-decoration: underline;
          text-underline-offset: 3px;
        }
        .cc-ck-link:hover { color: #c47a4a; }
        .cc-ck-row {
          display: flex; align-items: flex-start; gap: 12px; padding: 12px 0;
          border-top: 0.5px solid rgba(255,255,255,0.08);
        }
        .cc-ck-sw {
          flex: 0 0 auto; width: 38px; height: 22px; border-radius: 11px; border: none;
          cursor: pointer; position: relative; transition: background 0.2s; margin-top: 2px;
        }
        .cc-ck-sw span {
          position: absolute; top: 3px; width: 16px; height: 16px; border-radius: 50%;
          background: #fff; transition: left 0.2s;
        }
        @media (max-width: 560px) {
          .cc-ck { left: 12px; right: 12px; bottom: 12px; padding: 18px 18px 16px; }
          .cc-ck-btn { flex: 1 1 100%; }
        }
      `}</style>

      <div className="cc-ck" role="dialog" aria-modal="false" aria-label="Preferências de cookies">
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#555',
            marginBottom: 10,
          }}
        >
          Cookies
        </p>
        <p style={{ fontSize: 13, fontWeight: 300, color: '#86868b', lineHeight: 1.7 }}>
          Usamos cookies para medir o desempenho do site e para entender quais campanhas trazem visitantes. Nada é
          ativado antes de você decidir. Leia a{' '}
          <Link href="/politica-de-privacidade" style={{ color: '#c47a4a', textDecoration: 'none' }}>
            Política de Privacidade
          </Link>
          .
        </p>

        {details && (
          <div style={{ marginTop: 16 }}>
            {groups.map(g => {
              const on = g.locked ? true : g.key === 'analytics' ? analytics : marketing
              const toggle = () => {
                if (g.locked) return
                if (g.key === 'analytics') setAnalytics(v => !v)
                else setMarketing(v => !v)
              }
              return (
                <div key={g.key} className="cc-ck-row">
                  <button
                    type="button"
                    className="cc-ck-sw"
                    onClick={toggle}
                    disabled={g.locked}
                    role="switch"
                    aria-checked={on}
                    aria-label={g.label}
                    style={{
                      background: on ? '#c47a4a' : 'rgba(255,255,255,0.16)',
                      cursor: g.locked ? 'not-allowed' : 'pointer',
                      opacity: g.locked ? 0.55 : 1,
                    }}
                  >
                    <span style={{ left: on ? 19 : 3 }} />
                  </button>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 500, color: '#f5f5f7', marginBottom: 3 }}>{g.label}</p>
                    <p style={{ fontSize: 12, fontWeight: 300, color: '#86868b', lineHeight: 1.6 }}>{g.desc}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="cc-ck-btns">
          <button type="button" className="cc-ck-btn ghost" onClick={() => decide(false, false)}>
            Só o necessário
          </button>
          {details ? (
            <button type="button" className="cc-ck-btn primary" onClick={() => decide(analytics, marketing)}>
              Salvar escolha
            </button>
          ) : (
            <button type="button" className="cc-ck-btn primary" onClick={() => decide(true, true)}>
              Aceitar tudo
            </button>
          )}
        </div>

        {!details && (
          <button type="button" className="cc-ck-link" style={{ marginTop: 14 }} onClick={() => setDetails(true)}>
            Personalizar
          </button>
        )}
      </div>
    </>
  )
}
