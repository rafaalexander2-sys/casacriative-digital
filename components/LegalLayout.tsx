import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ServiceHero from '@/components/ServiceHero'
import Link from 'next/link'

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

export type Block =
  | { p: string }
  | { ul: string[] }
  | { dl: { term: string; desc: string }[] }

export interface Section {
  id: string
  title: string
  blocks: Block[]
}

interface Props {
  tag: string
  title: string
  highlight: string
  desc: string
  updatedAt: string
  sections: Section[]
}

function renderBlock(b: Block, i: number) {
  if ('p' in b) {
    return (
      <p key={i} style={{ fontSize: 14, fontWeight: 300, color: '#86868b', lineHeight: 1.8, marginBottom: 14 }}>
        {b.p}
      </p>
    )
  }
  if ('ul' in b) {
    return (
      <ul key={i} style={{ listStyle: 'none', padding: 0, margin: '0 0 18px' }}>
        {b.ul.map((item, j) => (
          <li
            key={j}
            style={{
              fontSize: 14,
              fontWeight: 300,
              color: '#86868b',
              lineHeight: 1.8,
              paddingLeft: 18,
              marginBottom: 8,
              position: 'relative',
            }}
          >
            <span style={{ position: 'absolute', left: 0, top: 0, color: '#c47a4a' }}>{'›'}</span>
            {item}
          </li>
        ))}
      </ul>
    )
  }
  return (
    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 18 }}>
      {b.dl.map((row, j) => (
        <div
          key={j}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '0.5px solid rgba(255,255,255,0.08)',
            borderRadius: 10,
            padding: '14px 16px',
          }}
        >
          <p style={{ fontSize: 13, fontWeight: 600, color: '#f5f5f7', marginBottom: 6 }}>{row.term}</p>
          <p style={{ fontSize: 13, fontWeight: 300, color: '#86868b', lineHeight: 1.7 }}>{row.desc}</p>
        </div>
      ))}
    </div>
  )
}

export default function LegalLayout({ tag, title, highlight, desc, updatedAt, sections }: Props) {
  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <Navbar />

      <ServiceHero
        tag={tag}
        title={title}
        highlight={highlight}
        desc={desc}
        ctaLabel="Falar com a gente"
        ctaHref="https://wa.me/5541998170428"
        compact
      />

      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '64px 24px 80px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 12, fontWeight: 300, color: '#555', marginBottom: 40 }}>
            Última atualização em {updatedAt}.
          </p>

          {/* Índice */}
          <nav
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '0.5px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '20px 22px',
              marginBottom: 48,
            }}
          >
            <p
              style={{
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#555',
                marginBottom: 14,
              }}
            >
              Nesta página
            </p>
            <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} style={{ fontSize: 13, color: '#86868b', textDecoration: 'none' }}>
                    <span style={{ color: '#c47a4a', marginRight: 8 }}>{String(i + 1).padStart(2, '0')}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          {sections.map((s, i) => (
            <section key={s.id} id={s.id} style={{ scrollMarginTop: 90, marginBottom: 44 }}>
              <p
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  color: '#555',
                  marginBottom: 8,
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </p>
              <h2
                style={{
                  fontSize: 19,
                  fontWeight: 700,
                  letterSpacing: '-0.4px',
                  lineHeight: 1.3,
                  marginBottom: 14,
                  background: BG,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.title}
              </h2>
              {s.blocks.map(renderBlock)}
            </section>
          ))}

          <div
            style={{
              height: 1,
              background: 'linear-gradient(90deg,transparent,#c47a4a,#f0d5b0,#c47a4a,transparent)',
              margin: '48px 0 28px',
            }}
          />

          <p style={{ fontSize: 13, fontWeight: 300, color: '#86868b', lineHeight: 1.8 }}>
            Dúvidas sobre este documento? Escreva para{' '}
            <a href="mailto:contato@casacriative.com.br" style={{ color: '#c47a4a', textDecoration: 'none' }}>
              contato@casacriative.com.br
            </a>{' '}
            ou fale pelo{' '}
            <a
              href="https://wa.me/5541998170428"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#c47a4a', textDecoration: 'none' }}
            >
              WhatsApp
            </a>
            . Veja também a{' '}
            <Link href="/politica-de-privacidade" style={{ color: '#c47a4a', textDecoration: 'none' }}>
              Política de Privacidade
            </Link>{' '}
            e os{' '}
            <Link href="/termos-de-uso" style={{ color: '#c47a4a', textDecoration: 'none' }}>
              Termos de Uso
            </Link>
            .
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
