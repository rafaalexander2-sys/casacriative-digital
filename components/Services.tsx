'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRef, useEffect } from 'react'

const services = [
  { tag: 'Tráfego Pago',          title: 'Performance que converte.',      desc: 'Google Ads e Meta Ads otimizados para máximo ROI.',   img: '/trafego.png' },
  { tag: 'Sites & Landing Pages',  title: 'Design que vende.',             desc: 'Sites rápidos, responsivos e prontos para escalar.',  img: '/sites.png' },
  { tag: 'SEO',                    title: 'Topo do Google, organicamente.', desc: 'Auditoria técnica, conteúdo e link building.',        img: '/seo.png' },
  { tag: 'Social Media',           title: 'Conteúdo que conecta.',          desc: 'Estratégia editorial, design e produção.',            img: '/social.png' },
]

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const update = () => {
      if (!wrapRef.current || !innerRef.current) return
      const rect = wrapRef.current.getBoundingClientRect()
      const progress = (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight
      innerRef.current.style.transform = `translateY(${progress * 28}px)`
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div ref={wrapRef} style={{ position: 'absolute', inset: '-14px' }}>
      <div ref={innerRef} style={{ position: 'relative', width: '100%', height: '100%', willChange: 'transform' }}>
        <Image src={src} alt={alt} fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
      </div>
    </div>
  )
}

export default function Services() {
  return (
    <>
      <style>{`
        @keyframes card-in {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .service-card {
          opacity: 0;
          animation: card-in 0.65s ease forwards;
        }
        .service-card:nth-child(1) { animation-delay: 0ms; }
        .service-card:nth-child(2) { animation-delay: 90ms; }
        .service-card:nth-child(3) { animation-delay: 180ms; }
        .service-card:nth-child(4) { animation-delay: 270ms; }
        .service-header-in {
          opacity: 0;
          animation: card-in 0.5s ease forwards;
        }
      `}</style>

      <section
        id="servicos"
        style={{
          background: '#080808',
          padding: '80px 20px',
        }}
      >
        {/* Header */}
        <div className="service-header-in" style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#86868b', marginBottom: 12 }}>
            O que fazemos
          </p>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.8px', color: '#f5f5f7', margin: 0 }}>
            Soluções que geram resultado.
          </h2>
        </div>

        {/* Grade de cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 16,
          maxWidth: 1100,
          margin: '0 auto',
        }}>
          {services.map((s, i) => (
            <article
              key={i}
              className="service-card glass glass-light"
              style={{
                borderRadius: 24,
                overflow: 'hidden',
              }}
            >
              {/* Imagem com parallax */}
              <div style={{ aspectRatio: '16/7', overflow: 'hidden', position: 'relative' }}>
                <ParallaxImage src={s.img} alt={s.title} />
              </div>

              {/* Texto */}
              <div style={{ padding: '24px 32px 32px', position: 'relative', zIndex: 10 }}>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 8, color: 'var(--bronze-light)' }}>
                  {s.tag}
                </p>
                <h3 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', lineHeight: 1.25, marginBottom: 10, color: '#f5f5f7' }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 14, fontWeight: 400, lineHeight: 1.6, marginBottom: 20, color: '#86868b' }}>
                  {s.desc}
                </p>
                <Link
                  href="/servicos"
                  style={{ fontSize: 14, fontWeight: 500, textDecoration: 'none', color: 'var(--bronze-light)', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                >
                  Saiba mais →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
