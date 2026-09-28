import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BlogGrid from '@/components/BlogGrid'
import { posts as localPosts } from '@/lib/posts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog de Marketing Digital em Curitiba',
  description: 'Artigos sobre Tráfego Pago, SEO, Criação de Sites, Design Gráfico e Social Media. Conteúdo prático para empreendedores que querem crescer no digital.',
  keywords: ['blog marketing digital curitiba', 'tráfego pago dicas', 'seo para pequenas empresas', 'social media estratégia', 'design gráfico tendências'],
  alternates: { canonical: 'https://casacriative.com.br/blog' },
  openGraph: {
    title: 'Blog | Casa Criative Digital — Marketing Digital em Curitiba',
    description: 'Artigos práticos sobre Tráfego Pago, SEO, Sites e Social Media para empreendedores.',
    url: 'https://casacriative.com.br/blog',
    type: 'website',
  },
}

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

export default function Blog() {
  const posts = localPosts.map(p => ({
    categoria: p.categoria,
    titulo: p.titulo,
    desc: p.desc,
    href: `/blog/${p.slug}`,
    data: p.data,
    cover: p.cover ?? null,
  }))

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

      <BlogGrid posts={posts} />

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
