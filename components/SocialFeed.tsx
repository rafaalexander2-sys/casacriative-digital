'use client'
import { useRef, useEffect } from 'react'

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

const posts = [
  { emoji: '📸', bg: 'linear-gradient(135deg,#1a0f05,#2a1505)', maxLikes: 1840 },
  { emoji: '🎨', bg: 'linear-gradient(135deg,#050f1a,#051525)', maxLikes: 2310 },
  { emoji: '🎬', bg: 'linear-gradient(135deg,#0f051a,#150525)', maxLikes: 3100 },
  { emoji: '💬', bg: 'linear-gradient(135deg,#1a1005,#251505)', maxLikes: 1560 },
]

function ease(t: number) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t) }

export default function SocialFeed() {
  const wrapRef    = useRef<HTMLDivElement>(null)
  const postRefs   = useRef<(HTMLDivElement | null)[]>([])
  const likeRefs   = useRef<(HTMLSpanElement | null)[]>([])
  const engRef     = useRef<HTMLSpanElement>(null)
  const started    = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return
      started.current = true

      // Stagger posts in
      posts.forEach((_, i) => {
        setTimeout(() => {
          const el = postRefs.current[i]
          if (el) { el.style.opacity = '1'; el.style.transform = 'translateY(0)' }
        }, i * 280)
      })

      // Animate likes + engagement counter
      const t0 = performance.now()
      const dur = 2200
      const tick = (now: number) => {
        const p = ease(Math.min((now - t0) / dur, 1))
        likeRefs.current.forEach((el, i) => {
          if (el) el.textContent = Math.round(p * posts[i].maxLikes).toLocaleString('pt-BR')
        })
        if (engRef.current) engRef.current.textContent = Math.round(p * 34700).toLocaleString('pt-BR')
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
        Engajamento
      </p>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.4px', marginBottom: 36, textAlign: 'center' }}>
        Conteúdo que aparece, engaja e converte.
      </h3>

      {/* Feed 2x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, width: '100%', maxWidth: 320 }}>
        {posts.map((p, i) => (
          <div
            key={i}
            ref={el => { postRefs.current[i] = el }}
            style={{
              borderRadius: 12, overflow: 'hidden',
              border: '0.5px solid rgba(255,210,160,0.1)',
              opacity: 0,
              transform: 'translateY(20px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            <div style={{ height: 80, background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
              {p.emoji}
            </div>
            <div style={{ padding: '10px 12px', background: '#0a0a0a' }}>
              <span style={{ fontSize: 11, color: '#555' }}>
                <span ref={el => { likeRefs.current[i] = el }} style={{ color: '#f5f5f7', fontWeight: 600 }}>0</span> curtidas
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Contador */}
      <p style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1, marginTop: 28, background: BG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        <span ref={engRef}>0</span>
      </p>
      <p style={{ fontSize: 12, color: '#555', marginTop: 8 }}>pessoas alcançadas</p>
    </div>
  )
}
