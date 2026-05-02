import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getPost, getRelated, posts } from '@/lib/posts'

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

export async function generateStaticParams() {
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: `${post.titulo} | Blog Casa Criative Digital`,
    description: post.desc,
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const related = getRelated(post.relacionados)
  const wordCount = post.blocks.filter(b => b.type === 'p').reduce((acc, b) => acc + (b as any).text.split(' ').length, 0)
  const readMin = Math.ceil(wordCount / 200)

  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero do artigo */}
      <section style={{ paddingTop: 72, paddingBottom: 0, background: '#000' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 20px' }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <Link href="/blog" style={{ fontSize: 12, color: '#555', textDecoration: 'none' }}>Blog</Link>
            <span style={{ color: '#333', fontSize: 12 }}>›</span>
            <span style={{ fontSize: 12, color: '#555' }}>{post.categoria}</span>
          </div>

          {/* Categoria badge */}
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#c47a4a', background: 'rgba(196,122,74,0.1)', border: '0.5px solid rgba(196,122,74,0.25)', borderRadius: 6, padding: '4px 12px', display: 'inline-block', marginBottom: 20 }}>
            {post.categoria}
          </span>

          {/* Título */}
          <h1 className="h1-lg" style={{ fontWeight: 700, color: '#f5f5f7', marginBottom: 20, maxWidth: 640 }}>
            {post.titulo}
          </h1>

          {/* Descrição / lead */}
          <p style={{ fontSize: 16, fontWeight: 300, color: '#86868b', lineHeight: 1.65, marginBottom: 28 }}>
            {post.desc}
          </p>

          {/* Meta: autor, data, leitura */}
          <div className="post-meta" style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40, flexWrap: 'wrap' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{post.autor[0]}</span>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#f5f5f7', marginBottom: 2 }}>{post.autor}</p>
              <p style={{ fontSize: 11, color: '#555' }}>Casa Criative Digital</p>
            </div>
            <span style={{ color: '#2a2a2a', fontSize: 14 }}>|</span>
            <span style={{ fontSize: 12, color: '#555' }}>{post.data}</span>
            <span style={{ fontSize: 12, color: '#555' }}>·</span>
            <span style={{ fontSize: 12, color: '#555' }}>{readMin} min de leitura</span>
          </div>
        </div>

        {/* Featured image */}
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 0', marginBottom: 0 }}>
          <div style={{ width: '100%', aspectRatio: '16/7', background: 'linear-gradient(135deg,#0d0d0d 0%,#1a0f05 40%,#0d0d0d 100%)', borderRadius: 16, border: '0.5px solid rgba(255,210,160,0.1)', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {post.cover ? (
              <>
                <Image src={post.cover} alt={post.titulo} fill style={{ objectFit: 'cover' }} priority />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.5) 100%)' }} />
                <p style={{ position: 'absolute', bottom: 14, left: 20, fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.5)', fontStyle: 'italic', zIndex: 1 }}>
                  {post.titulo}
                </p>
              </>
            ) : (
              <>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 50%, rgba(196,122,74,0.12) 0%, transparent 60%)' }} />
                <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c47a4a', marginBottom: 8 }}>{post.categoria}</p>
                  <p style={{ fontSize: 13, color: '#333', maxWidth: 300 }}>{post.titulo.slice(0, 50)}…</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Conteúdo */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 0' }}>

        {/* Article body */}
        <article>
          {post.blocks.map((block, i) => {
            if (block.type === 'h2') return (
              <h2 key={i} style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.5px', lineHeight: 1.25, marginTop: 48, marginBottom: 16 }}>
                {block.text}
              </h2>
            )
            if (block.type === 'h3') return (
              <h3 key={i} style={{ fontSize: 17, fontWeight: 600, color: '#e0e0e2', letterSpacing: '-0.2px', lineHeight: 1.3, marginTop: 32, marginBottom: 12 }}>
                {block.text}
              </h3>
            )
            if (block.type === 'p') return (
              <p key={i} style={{ fontSize: 15, fontWeight: 300, color: '#86868b', lineHeight: 1.8, marginBottom: 18 }}>
                {block.text}
              </p>
            )
            if (block.type === 'list') return (
              <ul key={i} style={{ margin: '8px 0 20px', paddingLeft: 0, listStyle: 'none' }}>
                {block.items.map((item, j) => (
                  <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '8px 0', borderBottom: '0.5px solid #111' }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: BG, flexShrink: 0, marginTop: 8 }} />
                    <span style={{ fontSize: 14, fontWeight: 300, color: '#86868b', lineHeight: 1.65 }}>{item}</span>
                  </li>
                ))}
              </ul>
            )
            if (block.type === 'quote') return (
              <blockquote key={i} style={{ margin: '32px 0', padding: '20px 24px', borderLeft: '3px solid #c47a4a', background: 'rgba(196,122,74,0.06)', borderRadius: '0 10px 10px 0' }}>
                <p style={{ fontSize: 16, fontWeight: 400, color: '#c47a4a', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>
                  "{block.text}"
                </p>
              </blockquote>
            )
            return null
          })}
        </article>

        {/* CTA inline */}
        <div style={{ margin: '56px 0', padding: '32px', background: 'linear-gradient(140deg,rgba(255,255,255,0.04),rgba(120,70,40,0.08),rgba(0,0,0,0.5))', border: '0.5px solid rgba(255,210,160,0.15)', borderRadius: 16 }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c47a4a', marginBottom: 10 }}>Casa Criative Digital</p>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.4px', marginBottom: 10 }}>Precisa de ajuda para colocar isso em prática?</h3>
          <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', lineHeight: 1.65, marginBottom: 22 }}>
            Nossa equipe em Curitiba transforma estratégia em resultado. Tráfego pago, sites, SEO e design — tudo sob o mesmo teto.
          </p>
          <a href="https://wa.me/5541998170428" style={{ display: 'inline-block', background: BG, color: '#fff', borderRadius: 10, padding: '11px 24px', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
            Falar com especialista →
          </a>
        </div>

        {/* Author bio */}
        <div style={{ padding: '28px 0', borderTop: '0.5px solid #1d1d1f', borderBottom: '0.5px solid #1d1d1f', display: 'flex', gap: 20, alignItems: 'center', marginBottom: 64 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: BG, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontSize: 20, fontWeight: 700, color: '#fff' }}>{post.autor[0]}</span>
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f7', marginBottom: 4 }}>{post.autor}</p>
            <p style={{ fontSize: 13, fontWeight: 300, color: '#555', lineHeight: 1.6 }}>
              {post.autor === 'Aline Ribeiro'
                ? 'Co-fundadora da Casa Criative Digital. Especialista em Social Media, Design Gráfico e criação de conteúdo estratégico.'
                : 'Fundador da Casa Criative Digital. Especialista em Tráfego Pago, criação de sites e marketing digital em Curitiba desde 2021.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Posts relacionados */}
      {related.length > 0 && (
        <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '56px 24px 80px' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 28, textAlign: 'center' }}>Continue lendo</p>
            <div className="r-related" style={{ gap: 16 }}>
              {related.map(r => (
                <Link key={r.slug} href={`/blog/${r.slug}`} style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg,rgba(255,255,255,0.04),rgba(120,70,40,0.06),rgba(0,0,0,0.5))', border: '0.5px solid rgba(255,210,160,0.1)', borderRadius: 14, overflow: 'hidden' }}>
                  <div style={{ width: '100%', aspectRatio: '16/7', background: 'linear-gradient(135deg,#111,#1a0f05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#333' }}>{r.categoria}</span>
                  </div>
                  <div style={{ padding: '16px 18px 20px' }}>
                    <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c47a4a', marginBottom: 8, display: 'block' }}>{r.categoria}</span>
                    <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f7', lineHeight: 1.4, marginBottom: 8 }}>{r.titulo}</h3>
                    <p style={{ fontSize: 12, fontWeight: 300, color: '#6e6e73', lineHeight: 1.6, marginBottom: 12 }}>{r.desc.slice(0, 90)}…</p>
                    <span style={{ fontSize: 12, color: '#c47a4a', fontWeight: 500 }}>Leia mais →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
