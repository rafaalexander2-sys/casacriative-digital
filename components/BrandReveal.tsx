'use client'
import { useRef, useEffect } from 'react'

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

const palette = [
  { color: '#0d0d0d', label: 'Preto' },
  { color: '#c47a4a', label: 'Bronze' },
  { color: '#f5f5f7', label: 'Branco' },
  { color: '#6e6e73', label: 'Cinza' },
]

const letters = ['C', 'R', 'I', 'A', 'T', 'I', 'V', 'E']

function ease(t: number) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t) }

export default function BrandReveal() {
  const wrapRef     = useRef<HTMLDivElement>(null)
  const swatchRefs  = useRef<(HTMLDivElement | null)[]>([])
  const letterRefs  = useRef<(HTMLSpanElement | null)[]>([])
  const lineRef     = useRef<HTMLDivElement>(null)
  const pctRef      = useRef<HTMLSpanElement>(null)
  const started     = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return
      started.current = true

      // Swatches appear
      palette.forEach((_, i) => {
        setTimeout(() => {
          const el = swatchRefs.current[i]
          if (el) { el.style.transform = 'scale(1)'; el.style.opacity = '1' }
        }, i * 160)
      })

      // Line grows
      setTimeout(() => {
        if (lineRef.current) lineRef.current.style.width = '100%'
      }, 200)

      // Letters animate in
      letters.forEach((_, i) => {
        setTimeout(() => {
          const el = letterRefs.current[i]
          if (el) { el.style.opacity = '1'; el.style.transform = 'translateY(0)' }
        }, 500 + i * 80)
      })

      // Completion counter
      const t0 = performance.now()
      const dur = 2200
      const tick = (now: number) => {
        const p = ease(Math.min((now - t0) / dur, 1))
        if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`
        if (p < 1) requestAnimationFrame(tick)
      }
      setTimeout(() => requestAnimationFrame(tick), 300)
    }, { threshold: 0.3 })

    if (wrapRef.current) obs.observe(wrapRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={wrapRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px' }}>
      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>
        Identidade Visual
      </p>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.4px', marginBottom: 36, textAlign: 'center' }}>
        Sua marca ganhando vida do zero.
      </h3>

      {/* Paleta de cores */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        {palette.map((p, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div
              ref={el => { swatchRefs.current[i] = el }}
              style={{
                width: 52, height: 52, borderRadius: 14,
                background: p.color,
                border: p.color === '#f5f5f7' ? '0.5px solid #333' : 'none',
                transform: 'scale(0)', opacity: 0,
                transition: 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease',
                boxShadow: p.color === '#c47a4a' ? '0 4px 20px rgba(196,122,74,0.35)' : 'none',
              }}
            />
            <span style={{ fontSize: 9, color: '#555', letterSpacing: '0.05em' }}>{p.label}</span>
          </div>
        ))}
      </div>

      {/* Linha / separador animado */}
      <div style={{ width: '100%', maxWidth: 320, height: 1, background: '#1a1a1a', borderRadius: 1, marginBottom: 24, position: 'relative' }}>
        <div
          ref={lineRef}
          style={{
            position: 'absolute', inset: 0,
            width: 0, height: '100%',
            background: BG, borderRadius: 1,
            transition: 'width 0.9s cubic-bezier(0.22,1,0.36,1)',
          }}
        />
      </div>

      {/* Wordmark animado */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 32 }}>
        {letters.map((l, i) => (
          <span
            key={i}
            ref={el => { letterRefs.current[i] = el }}
            style={{
              fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px',
              background: BG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              opacity: 0, transform: 'translateY(14px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {l}
          </span>
        ))}
      </div>

      {/* Contador */}
      <p style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1, background: BG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        <span ref={pctRef}>0%</span>
      </p>
      <p style={{ fontSize: 12, color: '#555', marginTop: 8 }}>identidade visual construída</p>
    </div>
  )
}
