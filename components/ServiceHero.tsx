'use client'

import { useRef, useEffect } from 'react'

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

interface Props {
  tag: string
  title: string
  highlight?: string
  subtitle?: string
  desc: string
  ctaLabel?: string
  ctaHref?: string
  compact?: boolean
}

export default function ServiceHero({
  tag, title, highlight, subtitle, desc,
  ctaLabel = 'Marque uma reunião agora!',
  ctaHref = 'https://wa.me/5541998170428',
  compact = false,
}: Props) {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = sectionRef.current
    const onScroll = () => {
      const y = Math.min(window.scrollY * 0.18, 60)
      el?.style.setProperty('--sy', `${y}px`)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section
      ref={sectionRef}
      className={compact ? 'sh-compact' : 'sh-full'}
      style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}
    >
      <style>{`
        @keyframes orb-center {
          0%,100% { opacity: 0.55; transform: translateX(-50%) scale(1); }
          50%      { opacity: 0.9;  transform: translateX(-50%) scale(1.2); }
        }
        @keyframes orb-left {
          0%,100% { opacity: 0.28; transform: scale(1); }
          50%      { opacity: 0.5;  transform: scale(1.15); }
        }
        @keyframes orb-right {
          0%,100% { opacity: 0.2;  transform: scale(1); }
          50%      { opacity: 0.38; transform: scale(1.1); }
        }
      `}</style>

      {/* Orb central — bronze quente */}
      <div style={{
        position: 'absolute',
        top: 'calc(18% + var(--sy, 0px))',
        left: '50%',
        width: 680,
        height: 340,
        background: 'radial-gradient(ellipse, rgba(196,122,74,0.18) 0%, rgba(139,69,19,0.08) 45%, transparent 70%)',
        animation: 'orb-center 7s ease-in-out infinite',
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      }} />

      {/* Orb esquerda — bronze escuro */}
      <div style={{
        position: 'absolute',
        top: 'calc(25% + var(--sy, 0px))',
        left: '5%',
        width: 380,
        height: 220,
        background: 'radial-gradient(ellipse, rgba(139,69,19,0.14) 0%, transparent 70%)',
        animation: 'orb-left 9s ease-in-out infinite 2.5s',
        pointerEvents: 'none',
      }} />

      {/* Orb direita — bronze claro */}
      <div style={{
        position: 'absolute',
        top: 'calc(10% + var(--sy, 0px))',
        right: '5%',
        width: 320,
        height: 220,
        background: 'radial-gradient(ellipse, rgba(232,196,154,0.12) 0%, transparent 70%)',
        animation: 'orb-right 8s ease-in-out infinite 4.5s',
        pointerEvents: 'none',
      }} />

      {/* Linha horizontal animada */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 1,
        background: 'linear-gradient(90deg, transparent, rgba(196,122,74,0.35), rgba(232,196,154,0.6), rgba(196,122,74,0.35), transparent)',
        backgroundSize: '200% auto',
        animation: 'line-sweep 4s linear infinite',
      }} />

      <style>{`
        @keyframes line-sweep {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>

      {/* Conteúdo */}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <p style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#c47a4a',
          marginBottom: 14,
        }}>
          {tag}
        </p>

        <h1 style={{
          fontSize: 30,
          fontWeight: 700,
          color: '#f5f5f7',
          letterSpacing: '-0.8px',
          lineHeight: 1.12,
          maxWidth: 620,
          margin: '0 auto 12px',
        }}>
          {title}
          {highlight && (
            <>
              {' '}
              <span style={{ background: BG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {highlight}
              </span>
            </>
          )}
        </h1>

        {subtitle && (
          <p style={{ fontSize: 12, fontWeight: 400, color: '#6e6e73', marginBottom: 10, letterSpacing: '0.02em' }}>
            {subtitle}
          </p>
        )}

        <p style={{
          fontSize: 15,
          fontWeight: 300,
          color: '#86868b',
          lineHeight: 1.65,
          maxWidth: 480,
          margin: subtitle ? '0 auto 28px' : '8px auto 28px',
        }}>
          {desc}
        </p>

        <a
          href={ctaHref}
          style={{
            display: 'inline-block',
            background: BG,
            color: '#fff',
            borderRadius: 10,
            padding: '11px 28px',
            fontSize: 14,
            fontWeight: 500,
            textDecoration: 'none',
          }}
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  )
}
