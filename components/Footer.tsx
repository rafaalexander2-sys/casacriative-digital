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
  { label: 'Instagram', href: 'https://instagram.com' },
  { label: 'LinkedIn',  href: 'https://linkedin.com' },
  { label: 'Behance',   href: 'https://behance.net' },
  { label: 'Facebook',  href: 'https://facebook.com' },
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
            <div style={{ display: 'flex', gap: 16 }}>
              {socials.map(s => (
                <a key={s.label} href={s.href} style={{ fontSize: 11, color: '#555', textDecoration: 'none' }}>{s.label}</a>
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
