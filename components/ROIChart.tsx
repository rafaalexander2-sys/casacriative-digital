'use client'
import { useRef, useEffect } from 'react'

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'
const months = [
  { label: 'Jan', max: 60,  color: 'rgba(196,122,74,0.28)' },
  { label: 'Fev', max: 90,  color: 'rgba(196,122,74,0.42)' },
  { label: 'Mar', max: 110, color: 'rgba(196,122,74,0.55)' },
  { label: 'Abr', max: 140, color: 'rgba(196,122,74,0.68)' },
  { label: 'Mai', max: 170, color: 'rgba(196,122,74,0.82)' },
  { label: 'Jun', max: 200, color: '#c47a4a' },
]

function ease(t: number) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t) }

export default function ROIChart() {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLSpanElement>(null)
  const barRefs    = useRef<(HTMLDivElement | null)[]>([])
  const started    = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return
      started.current = true
      const t0 = performance.now()
      const dur = 2000
      const tick = (now: number) => {
        const p = ease(Math.min((now - t0) / dur, 1))
        barRefs.current.forEach((b, i) => { if (b) b.style.height = `${Math.round(p * months[i].max)}px` })
        if (counterRef.current) counterRef.current.textContent = `+${Math.round(p * 320)}%`
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.35 })
    if (wrapRef.current) obs.observe(wrapRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={wrapRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px' }}>
      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>
        ROI em tempo real
      </p>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.4px', marginBottom: 36, textAlign: 'center' }}>
        Seu investimento crescendo mês a mês.
      </h3>

      {/* Barras */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 200, borderBottom: '0.5px solid #2a2a2a', paddingBottom: 0, width: '100%', maxWidth: 380 }}>
        {months.map((m, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
            <div
              ref={el => { barRefs.current[i] = el }}
              style={{ width: '100%', height: 2, background: m.color, borderRadius: '3px 3px 0 0', transition: 'height 0.05s linear' }}
            />
            <span style={{ fontSize: 9, color: '#444', marginTop: 7 }}>{m.label}</span>
          </div>
        ))}
      </div>

      {/* Contador */}
      <p style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1, marginTop: 28, background: BG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        <span ref={counterRef}>+0%</span>
      </p>
      <p style={{ fontSize: 12, color: '#555', marginTop: 8 }}>retorno sobre investimento</p>
    </div>
  )
}
