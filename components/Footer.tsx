'use client'

import Link from 'next/link'
import Image from 'next/image'

const links = [
  { label: 'Quem Somos',            href: '/quem-somos' },
  { label: 'Tráfego Pago',          href: '/gestao-de-anuncios-pagos' },
  { label: 'Sites & Landing Pages', href: '/sites-e-landing-pages' },
  { label: 'SEO',                   href: '/seo-e-otimizacao-local' },
  { label: 'Social Media',          href: '/gestao-de-midias-e-conteudo' },
  { label: 'Design Gráfico',        href: '/design-grafico' },
  { label: 'Blog',                  href: '/blog' },
  { label: 'Contato',               href: '/contato' },
]

const socials = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/casacriativedigital/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/casacriativedigital',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/company/casa-criative-digital/',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: 'Behance',
    href: 'https://www.behance.net/casacriative',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7.5 11.25c.69 0 1.25-.56 1.25-1.25S8.19 8.75 7.5 8.75H5v2.5h2.5zm.5 1.5H5V16h3c.83 0 1.5-.67 1.5-1.5S8.83 12.75 8 12.75zM22 9h-5V7.5h5V9zM2 7h7c1.65 0 3 1.12 3 2.75 0 1-.48 1.84-1.22 2.36C12.02 12.67 12.75 13.7 12.75 15c0 2.07-1.68 3.5-4 3.5H2V7zm13.5 2c-2.21 0-4 1.79-4 4s1.79 4 4 4c1.56 0 2.91-.89 3.58-2.19l-1.74-.87c-.32.63-.97 1.06-1.84 1.06-.96 0-1.78-.6-2.07-1.44H21c.04-.24.06-.49.06-.74C21.06 10.82 19.44 9 15.5 9zm-2.03 3.25c.25-.78.98-1.35 1.91-1.35.89 0 1.6.55 1.87 1.35h-3.78z"/>
      </svg>
    ),
  },
]

export default function Footer() {
  return (
    <footer className="footer-inner" style={{ background: '#000', borderTop: '0.5px solid #1d1d1f', padding: '64px 40px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="r3" style={{ gap: 40, marginBottom: 48 }}>
          <div>
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', marginBottom: 14 }}>
              <Image src="/logo.webp" alt="Casa Criative Digital" width={110} height={30} style={{ objectFit: 'contain' }} />
            </Link>
            <p style={{ fontSize: 13, fontWeight: 300, color: '#555', lineHeight: 1.6 }}>Tráfego Pago, Criação de Sites e Marketing Digital em Curitiba, PR.</p>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#555', marginBottom: 20 }}>Acesso rápido</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
              {links.map(l => (
                <Link key={l.label} href={l.href} style={{ fontSize: 13, color: '#86868b', textDecoration: 'none' }}>{l.label}</Link>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#555', marginBottom: 20 }}>Contato</p>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8, marginBottom: 24 }}>
              <a href="https://wa.me/5541998170428" style={{ fontSize: 13, color: '#c47a4a', textDecoration: 'none' }}>+55 (41) 99817-0428</a>
              <a href="mailto:contato@casacriative.com.br" style={{ fontSize: 13, color: '#86868b', textDecoration: 'none' }}>contato@casacriative.com.br</a>
            </div>
            <div style={{ display: 'flex', gap: 14 }}>
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  style={{ color: '#555', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#c47a4a')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#555')}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#c47a4a,#f0d5b0,#c47a4a,transparent)', marginBottom: 24 }} />
        <p style={{ fontSize: 11, color: '#3a3a3c', textAlign: 'center' }}>© 2025 Casa Criative Digital. Todos os direitos reservados. Curitiba, PR.</p>
      </div>
    </footer>
  )
}
