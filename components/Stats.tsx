'use client'

import { useRef, useEffect, useState } from 'react'

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'
const SHIMMER = 'linear-gradient(90deg, #8b4513 0%, #e8c49a 40%, #c47a4a 60%, #8b4513 100%)'

const stats = [
  { prefix: '+', value: 700, suffix: 'k', label: 'Investimento gerenciado', desc: 'em anúncios pagos no Google e Meta', highlight: true },
  { prefix: '+', value: 50,  suffix: '',   label: 'Clientes atendidos',      desc: 'empresas que transformaram sua presença digital', highlight: false },
  { prefix: '',  value: 5,   suffix: ' anos', label: 'De experiência',       desc: 'no mercado digital com resultados reais', highlight: false },
]

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
}

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const delay = `${index * 160}ms`

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting && !started) setStarted(true) },
      { threshold: 0 }   // dispara assim que 1px entra na viewport
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [started])

  useEffect(() => {
    if (!started) return
    const duration = 2000
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setCount(Math.floor(easeOutExpo(t) * stat.value))
      if (t < 1) requestAnimationFrame(tick)
      else setCount(stat.value)
    }
    requestAnimationFrame(tick)
  }, [started, stat.value])

  return (
    <div
      ref={ref}
      style={{
        flex: 1,
        padding: '0 32px',
        borderRight: index < 2 ? '0.5px solid #e0e0e5' : 'none',
        position: 'relative',
      }}
    >
      {/* Linha que cresce na entrada */}
      <div style={{
        height: 1.5,
        borderRadius: 1,
        background: stat.highlight ? BG : '#d2d2d7',
        marginBottom: 20,
        width: started ? 44 : 0,
        transition: `width 1s cubic-bezier(0.4,0,0.2,1) ${delay}`,
      }} />

      <p style={{ fontSize: 12, color: '#6e6e73', marginBottom: 10, letterSpacing: '0.01em' }}>
        {stat.label}
      </p>

      {/* Número */}
      <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
        {stat.highlight && started && (
          <div style={{
            position: 'absolute',
            inset: '-12px -16px',
            background: 'radial-gradient(ellipse at 40% 50%, rgba(196,122,74,0.18) 0%, transparent 70%)',
            borderRadius: 16,
            animation: 'stat-glow 2.8s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        )}
        <p style={{
          fontSize: 44,
          fontWeight: 700,
          letterSpacing: '-2.5px',
          lineHeight: 1,
          ...(stat.highlight ? {
            background: SHIMMER,
            backgroundSize: '200% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: started ? 'stat-shimmer 3.5s linear infinite' : 'none',
          } : { color: '#1d1d1f' }),
        }}>
          {stat.prefix}{count}{stat.suffix}
        </p>
      </div>

      <p style={{ fontSize: 14, fontWeight: 300, color: '#6e6e73', lineHeight: 1.6 }}>
        {stat.desc}
      </p>
    </div>
  )
}

export default function Stats() {
  return (
    <section style={{ background: '#fff', padding: '88px 0', overflow: 'hidden' }}>
      <style>{`
        @keyframes stat-shimmer {
          0%   { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes stat-glow {
          0%, 100% { opacity: 0.5; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.08); }
        }
      `}</style>
      <div className="stats-row" style={{
        maxWidth: 780,
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 0,
      }}>
        {stats.map((s, i) => <StatCard key={s.label} stat={s} index={i} />)}
      </div>
    </section>
  )
}
