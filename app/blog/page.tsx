import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { posts as allPosts } from '@/lib/posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Casa Criative Digital',
  description: 'Dicas sobre Criação de Sites Profissionais, Tráfego Pago, Marketing Digital, Design Gráfico e muito mais.',
}

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

const posts = allPosts.map(p => ({
  categoria: p.categoria,
  titulo: p.titulo,
  desc: p.desc,
  href: `/blog/${p.slug}`,
  data: p.data,
  cover: p.cover ?? null,
}))

const categorias = ['Todos', 'Design Gráfico', 'Notícias', 'Social Media', 'Tráfego Pago']

export default function Blog() {
  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section className="hero-section">
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c47a4a', marginBottom: 16 }}>
          Casa Criative
        </p>
        <h1 className="h1-xl" style={{ fontWeight: 700, color: '#f5f5f7', maxWidth: 600, margin: '0 auto 20px' }}>
          Blog
        </h1>
        <p style={{ fontSize: 17, fontWeight: 300, color: '#86868b', lineHeight: 1.65, maxWidth: 520, margin: '0 auto' }}>
          Dicas sobre Criação de Sites, Tráfego Pago, Marketing Digital, Design Gráfico e muito mais.
        </p>
      </section>

      {/* Categorias */}
      <section style={{ padding: '0 24px 56px' }}>
        <div className="cats-wrap" style={{ maxWidth: 960, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {categorias.map((c, i) => (
            <span key={c} style={{ fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? '#f5f5f7' : '#86868b', background: i === 0 ? 'rgba(255,210,160,0.1)' : 'rgba(255,255,255,0.04)', border: `0.5px solid ${i === 0 ? 'rgba(255,210,160,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '7px 18px', cursor: 'pointer' }}>
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Cards de posts */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '60px 24px 80px' }}>
        <div className="r3" style={{ maxWidth: 960, margin: '0 auto', gap: 16 }}>
          {posts.map((p, i) => (
            <Link
              key={i}
              href={p.href}
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg,rgba(255,255,255,0.05),rgba(120,70,40,0.06),rgba(0,0,0,0.5))', border: '0.5px solid rgba(255,210,160,0.1)', borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s, transform 0.2s' }}
            >
              {/* Imagem / placeholder */}
              <div style={{ width: '100%', aspectRatio: '16/9', background: 'linear-gradient(135deg,#111,#1a0f05)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                {p.cover
                  ? <img src={p.cover} alt={p.titulo} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <>
                      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#333' }}>{p.categoria}</span>
                      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 40%, rgba(196,122,74,0.08) 0%, transparent 60%)' }} />
                    </>
                }
              </div>

              {/* Conteúdo */}
              <div style={{ padding: '20px 20px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c47a4a', background: 'rgba(196,122,74,0.1)', border: '0.5px solid rgba(196,122,74,0.2)', borderRadius: 10, padding: '3px 10px', display: 'inline-block', marginBottom: 12, alignSelf: 'flex-start' }}>
                  {p.categoria}
                </span>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f5f5f7', letterSpacing: '-0.2px', lineHeight: 1.45, marginBottom: 10, flex: 1 }}>
                  {p.titulo}
                </h2>
                <p style={{ fontSize: 13, fontWeight: 300, color: '#6e6e73', lineHeight: 1.65, marginBottom: 16 }}>
                  {p.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: '#444' }}>{p.data}</span>
                  <span style={{ fontSize: 12, color: '#c47a4a', fontWeight: 500 }}>Leia mais →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA newsletter */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.8px', marginBottom: 12 }}>Receba novos artigos por e-mail.</h2>
        <p style={{ fontSize: 15, fontWeight: 300, color: '#86868b', marginBottom: 28 }}>Sem spam. Conteúdo prático sobre marketing digital, uma vez por semana.</p>
        <div className="newsletter-row" style={{ display: 'flex', gap: 8, justifyContent: 'center', maxWidth: 420, margin: '0 auto' }}>
          <input type="email" placeholder="seu@email.com" style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,210,160,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'inherit' }} />
          <button style={{ background: BG, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
            Assinar
          </button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
