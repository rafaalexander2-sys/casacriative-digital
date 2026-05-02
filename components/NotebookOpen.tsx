'use client'
import { useRef, useEffect } from 'react'

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

function ease(t: number) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t) }

export default function NotebookOpen() {
  const wrapRef   = useRef<HTMLDivElement>(null)
  const screenRef = useRef<HTMLDivElement>(null)
  const pctRef    = useRef<HTMLSpanElement>(null)
  const started   = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return
      started.current = true
      const t0  = performance.now()
      const dur = 1600
      const tick = (now: number) => {
        const p = ease(Math.min((now - t0) / dur, 1))
        const angle = -112 + p * 112
        if (screenRef.current) screenRef.current.style.transform = `rotateX(${angle}deg)`
        if (pctRef.current) pctRef.current.textContent = `${Math.round(p * 100)}%`
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
        Entrega
      </p>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.4px', marginBottom: 36, textAlign: 'center' }}>
        Seu site se revelando para o mundo.
      </h3>

      {/* Notebook */}
      <div style={{ width: 300, height: 220, position: 'relative', perspective: 800 }}>
        {/* Tela */}
        <div
          ref={screenRef}
          style={{
            position: 'absolute', bottom: 26, left: 0, right: 0,
            transformOrigin: 'bottom center',
            transform: 'rotateX(-112deg)',
            background: '#0d0d0d',
            borderRadius: '10px 10px 0 0',
            border: '1px solid #2a2a2a',
            overflow: 'hidden',
            height: 185,
          }}
        >
          {/* Browser chrome */}
          <div style={{ padding: '10px 10px 6px', background: '#111', borderBottom: '0.5px solid #222', display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#28c840' }} />
            <div style={{ flex: 1, height: 14, background: '#1a1a1a', borderRadius: 4, marginLeft: 6 }} />
          </div>
          {/* Content */}
          <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 7 }}>
            <div style={{ height: 44, background: BG, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', letterSpacing: '0.05em' }}>casacriative.com.br</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[1,2,3].map(n => <div key={n} style={{ flex: 1, height: 30, background: '#1a1a1a', borderRadius: 4, border: '0.5px solid #2a2a2a' }} />)}
            </div>
            <div style={{ height: 18, background: '#1a1a1a', borderRadius: 4, border: '0.5px solid #2a2a2a' }} />
          </div>
        </div>
        {/* Base */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 26, background: '#1a1a1a', borderRadius: '0 0 10px 10px', border: '1px solid #2a2a2a' }} />
      </div>

      {/* Contador */}
      <p style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1, marginTop: 28, background: BG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        <span ref={pctRef}>0%</span>
      </p>
      <p style={{ fontSize: 12, color: '#555', marginTop: 8 }}>carregamento do seu novo site</p>
    </div>
  )
}
