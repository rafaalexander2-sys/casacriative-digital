'use client'

import { useRef, useState, useEffect } from 'react'

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

export default function HeroCity() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [reached, setReached] = useState(0)

  useEffect(() => {
    const video = videoRef.current

    const onScroll = () => {
      const scrollTop = window.scrollY
      const sectionHeight = window.innerHeight * 2.2
      const progress = Math.min(Math.max(scrollTop / sectionHeight, 0), 1)
      setReached(Math.round(progress * 347200))
      // readyState >= 1 = HAVE_METADATA (funciona mesmo com vídeo em cache)
      if (video && video.readyState >= 1) {
        video.currentTime = progress * video.duration
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section style={{ position: 'relative', background: '#000', height: '220vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          src="/hero.mp4"
          muted
          playsInline
          preload="auto"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />

        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,0.15) 0%,rgba(0,0,0,0) 20%,rgba(0,0,0,0) 50%,rgba(0,0,0,0.85) 100%)', pointerEvents: 'none' }} />

        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center', padding: '0 24px 80px', zIndex: 10 }}>
          <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#86868b', marginBottom: 16 }}>
            Agência Digital · Curitiba, PR
          </p>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-1.2px', lineHeight: 1.1, marginBottom: 14, fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', maxWidth: 680 }}>
            Tráfego Pago, Sites e SEO<br />para levar seu negócio ao{' '}
            <span style={{ background: BG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              topo.
            </span>
          </h1>
          <p style={{ fontSize: 15, fontWeight: 300, color: '#86868b', lineHeight: 1.55, marginBottom: 24, maxWidth: 460 }}>
            Estratégias personalizadas que atraem clientes e geram resultado real.
          </p>
          <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
            <a href="https://wa.me/5541998170428" className="btn-glass primary">Fale Conosco</a>
            <a href="#servicos" className="btn-glass secondary">Ver Serviços</a>
          </div>

          <div style={{ background: 'rgba(0,0,0,0.05)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', border: '0.5px solid rgba(255,210,160,0.12)', borderRadius: 10, padding: '8px 18px', textAlign: 'center' }}>
            <p style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.5px', fontFamily: 'Helvetica Neue,Helvetica,Arial,sans-serif', background: BG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              {reached.toLocaleString('pt-BR')}
            </p>
            <p style={{ fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#555', marginTop: 2 }}>
              pessoas alcançadas
            </p>
            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 3 }}>
              <div style={{ width: 1, height: 20, background: 'linear-gradient(to bottom,transparent,#c47a4a)' }} />
              <p style={{ fontSize: 9, color: '#3a3a3c' }}>scroll</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}