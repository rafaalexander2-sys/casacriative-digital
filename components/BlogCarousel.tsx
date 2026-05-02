'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

const posts = [
  { tag: 'Tráfego Pago', title: 'Como dobrar seu ROI no Google Ads em 30 dias', desc: 'Estratégias práticas para otimizar campanhas e reduzir custo por clique.', date: '28 Abr 2025', href: '/blog/roi-google-ads' },
  { tag: 'SEO', title: 'SEO local: como aparecer no Google Meu Negócio', desc: 'Guia completo para dominar as buscas locais em Curitiba.', date: '20 Abr 2025', href: '/blog/seo-local' },
  { tag: 'Sites', title: '5 elementos que fazem um site converter mais', desc: 'Design, velocidade e copywriting que transformam visitantes em clientes.', date: '10 Abr 2025', href: '/blog/site-conversao' },
  { tag: 'Social Media', title: 'Instagram em 2025: o que funciona de verdade', desc: 'Formatos, frequência e estratégias para crescer com consistência.', date: '02 Abr 2025', href: '/blog/instagram-2025' },
  { tag: 'Design', title: 'Identidade visual que vende: guia para PMEs', desc: 'Como criar uma marca profissional mesmo com orçamento reduzido.', date: '25 Mar 2025', href: '/blog/identidade-visual' },
  { tag: 'Marketing', title: 'Funil de vendas digital: da atração à conversão', desc: 'Entenda cada etapa e como otimizar para gerar mais clientes.', date: '15 Mar 2025', href: '/blog/funil-vendas' },
]

const cfgMap: Record<number, { scale: number; opacity: number; width: string; blur: string; zIndex: number }> = {
  0:  { scale: 1.06, opacity: 1,    width: '260px', blur: 'none', zIndex: 5 },
  1:  { scale: 0.95, opacity: 0.85, width: '200px', blur: 'none', zIndex: 4 },
  2:  { scale: 0.84, opacity: 0.45, width: '160px', blur: '1.5px', zIndex: 3 },
}

export default function BlogCarousel() {
  const [active, setActive] = useState(2)

  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % posts.length), 4000)
    return () => clearInterval(t)
  }, [])

  const visible = [-2, -1, 0, 1, 2].map(offset => ({
    post: posts[(active + offset + posts.length) % posts.length],
    offset,
    cfg: cfgMap[Math.abs(offset)],
  }))

  return (
    <section style={{ background: '#000', paddingTop: 80 }}>
      <style>{`
        .glass-card {
          position: relative;
          border-radius: 20px;
          background: linear-gradient(140deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 18%, rgba(120,70,40,0.10) 40%, rgba(0,0,0,0.55) 80%);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          overflow: hidden;
          text-decoration: none;
          display: block;
          transition: all 0.4s cubic-bezier(0.4,0,0.2,1);
        }
        .glass-card::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 20px;
          padding: 1px;
          background: linear-gradient(120deg, rgba(255,210,160,0.9) 0%, rgba(255,210,160,0.4) 12%, rgba(255,255,255,0.05) 28%, rgba(255,210,160,0.15) 50%, rgba(255,210,160,0) 75%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .glass-card::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: radial-gradient(circle at 20% 10%, rgba(255,220,180,0.45) 0%, rgba(255,220,180,0.15) 12%, rgba(255,220,180,0.04) 22%, transparent 35%);
          pointer-events: none;
        }
        .blog-tag {
          display: inline-block;
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #e7d3c2;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.18);
          margin-bottom: 12px;
        }
      `}</style>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px' }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#86868b', marginBottom: 10, textAlign: 'center' }}>
          Blog
        </p>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.8px', textAlign: 'center', marginBottom: 48 }}>
          Conteúdo que transforma.
        </h2>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center', padding: '0 24px 8px' }}>
        {visible.map(({ post, offset, cfg }) => (
          <Link
            key={post.href + offset}
            href={post.href}
            className="glass-card"
            onClick={() => setActive((active + offset + posts.length) % posts.length)}
            style={{
              flex: `0 0 ${cfg.width}`,
              transform: `scale(${cfg.scale})`,
              opacity: cfg.opacity,
              filter: cfg.blur !== 'none' ? `blur(${cfg.blur})` : 'none',
              zIndex: cfg.zIndex,
              padding: offset === 0 ? '28px 24px' : '20px 18px',
            }}
          >
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: BG, opacity: offset === 0 ? 1 : 0.5 }} />
            <div style={{ height: offset === 0 ? 160 : 100, background: 'rgba(255,255,255,0.03)', borderRadius: 10, marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
  <div style={{ width: 32, height: 2, borderRadius: 1, background: BG, opacity: 0.6 }} />
</div>

            <div className="blog-tag">{post.tag}</div>

            <p style={{ fontSize: offset === 0 ? 15 : 12, fontWeight: 600, color: '#fff', letterSpacing: '-0.3px', lineHeight: 1.35, marginBottom: 8, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
              {post.title}
            </p>

            {offset === 0 && (
              <p style={{ fontSize: 12, fontWeight: 300, color: '#c7a88c', lineHeight: 1.55, marginBottom: 16, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
                {post.desc}
              </p>
            )}

            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: offset === 0 ? 0 : 8 }}>{post.date}</p>
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 36 }}>
        {posts.map((_, i) => (
          <div key={i} onClick={() => setActive(i)}
            style={{ width: i === active ? 24 : 6, height: 6, borderRadius: 3, background: i === active ? BG : 'rgba(255,255,255,0.15)', cursor: 'pointer', transition: 'all 0.3s' }} />
        ))}
      </div>
    </section>
  )
}