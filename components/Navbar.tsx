'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

const servicos = [
  { label: 'Tráfego Pago', href: '/gestao-de-anuncios-pagos' },
  { label: 'Sites e Landing Pages', href: '/sites-e-landing-pages' },
  { label: 'SEO e Google Meu Negócio', href: '/seo-e-otimizacao-local' },
  { label: 'Gestão de Mídias Sociais', href: '/gestao-de-midias-e-conteudo' },
  { label: 'Design Gráfico', href: '/design-grafico' },
]

const links = [
  { label: 'Quem Somos', href: '/quem-somos' },
  { label: 'Blog', href: '/blog' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const [mobileServOpen, setMobileServOpen] = useState(false)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className="nav-header" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 52, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 32px',
        background: scrolled ? 'rgba(0,0,0,0.88)' : 'rgba(0,0,0,0)',
        backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none',
        borderBottom: scrolled ? '0.5px solid rgba(255,255,255,0.08)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <Image src="/logo.webp" alt="Casa Criative" width={120} height={32} style={{ objectFit: 'contain' }} />
        </Link>

        <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="hide-mobile">
          {/* Serviços dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => { if (closeTimer.current) clearTimeout(closeTimer.current); setDropOpen(true) }}
            onMouseLeave={() => { closeTimer.current = setTimeout(() => setDropOpen(false), 180) }}
          >
            <button style={{
              fontSize: 13, color: dropOpen ? '#f5f5f7' : '#a1a1a6',
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5, padding: 0,
              fontFamily: 'inherit', transition: 'color 0.2s',
            }}>
              Serviços
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: dropOpen ? 'rotate(180deg)' : 'none', transformOrigin: '5px 5px', transition: 'transform 0.2s' }} />
              </svg>
            </button>

            {dropOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                marginTop: 10, minWidth: 220,
                background: 'rgba(15,15,15,0.96)', backdropFilter: 'blur(24px) saturate(160%)',
                border: '0.5px solid rgba(255,210,160,0.15)', borderRadius: 12,
                padding: '8px 0', boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              }}>
                <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 12, height: 6, overflow: 'hidden' }}>
                  <div style={{ width: 10, height: 10, background: 'rgba(15,15,15,0.96)', border: '0.5px solid rgba(255,210,160,0.15)', transform: 'rotate(45deg)', margin: '3px auto 0' }} />
                </div>
                {servicos.map(s => (
                  <Link key={s.href} href={s.href}
                    style={{ display: 'block', padding: '10px 20px', fontSize: 13, color: '#a1a1a6', textDecoration: 'none', transition: 'color 0.15s, background 0.15s' }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.color = '#f5f5f7'; (e.target as HTMLElement).style.background = 'rgba(255,210,160,0.06)' }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.color = '#a1a1a6'; (e.target as HTMLElement).style.background = 'transparent' }}
                  >
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {links.map(l => (
            <Link key={l.label} href={l.href} style={{ fontSize: 13, color: '#a1a1a6', textDecoration: 'none' }}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <a href="/contato" style={{ color: '#a1a1a6', display: 'flex' }} className="hide-mobile">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </a>
          <a href="https://wa.me/5541998170428" style={{ color: '#a1a1a6', display: 'flex' }} className="hide-mobile">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.17h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.77a16 16 0 0 0 5.86 5.86l1.28-.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
          </a>
          <button onClick={() => setOpen(!open)} className="show-mobile"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <span style={{ display: 'block', width: 22, height: 1.5, background: '#fff', transition: 'all 0.3s', transform: open ? 'rotate(45deg) translate(4px, 5px)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: '#fff', transition: 'all 0.3s', opacity: open ? 0 : 1 }} />
            <span style={{ display: 'block', width: 22, height: 1.5, background: '#fff', transition: 'all 0.3s', transform: open ? 'rotate(-45deg) translate(4px, -5px)' : 'none' }} />
          </button>
        </div>
      </header>

      {open && (
        <div style={{
          position: 'fixed', top: 52, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.97)', zIndex: 49,
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 0, overflowY: 'auto', padding: '32px 0',
        }}>
          {/* Mobile: Serviços accordion */}
          <div style={{ width: '100%', textAlign: 'center', marginBottom: 8 }}>
            <button
              onClick={() => setMobileServOpen(!mobileServOpen)}
              style={{ fontSize: 26, fontWeight: 700, color: '#fff', textDecoration: 'none', letterSpacing: '-0.5px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 10, margin: '0 auto', paddingBottom: 20 }}>
              Serviços
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: mobileServOpen ? 'rotate(180deg)' : 'none', transformOrigin: '8px 8px', transition: 'transform 0.2s' }} />
              </svg>
            </button>
            {mobileServOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 20 }}>
                {servicos.map(s => (
                  <Link key={s.href} href={s.href} onClick={() => setOpen(false)}
                    style={{ fontSize: 17, fontWeight: 400, color: '#86868b', textDecoration: 'none' }}>
                    {s.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {links.map(l => (
            <Link key={l.label} href={l.href} onClick={() => setOpen(false)}
              style={{ fontSize: 26, fontWeight: 700, color: '#fff', textDecoration: 'none', letterSpacing: '-0.5px', paddingBottom: 20 }}>
              {l.label}
            </Link>
          ))}
          <a href="https://wa.me/5541998170428"
            style={{ marginTop: 8, background: BG, color: '#fff', borderRadius: 10, padding: '13px 36px', fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
            Fale Conosco
          </a>
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .hide-mobile { display: flex !important; }
          .show-mobile { display: none !important; }
        }
        @media (max-width: 767px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </>
  )
}
