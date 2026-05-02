'use client'
import { useRef, useEffect, useState } from 'react'

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

const items = [
  { width: 94, name: '' },        // pos 1 — seu negócio (highlighted)
  { width: 71, name: 'concorrente A' },
  { width: 54, name: 'concorrente B' },
  { width: 38, name: 'concorrente C' },
  { width: 20, name: 'seu negócio' }, // pos 5 — initial
]

export default function SEORanking() {
  const wrapRef  = useRef<HTMLDivElement>(null)
  const posRef   = useRef<HTMLSpanElement>(null)
  const [yourPos, setYourPos] = useState(5)
  const started  = useRef(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started.current) return
      started.current = true
      const steps = [5, 4, 3, 2, 1]
      steps.forEach((pos, i) => {
        setTimeout(() => {
          setYourPos(pos)
          if (posRef.current) posRef.current.textContent = `${pos}º`
        }, i * 480)
      })
    }, { threshold: 0.35 })
    if (wrapRef.current) obs.observe(wrapRef.current)
    return () => obs.disconnect()
  }, [])

  // Build visible rows based on yourPos (1–5)
  const rows = Array.from({ length: 5 }, (_, i) => {
    const rank = i + 1
    const isYou = rank === yourPos
    const isOther = rank !== yourPos
    // competing bars — names shift around "seu negócio"
    const competitorNames = ['concorrente A', 'concorrente B', 'concorrente C', 'concorrente D']
    let competitor = 0
    const name = isYou ? 'seu negócio' : competitorNames[competitor++]
    const barWidth = isYou ? 94 : [71, 54, 38, 20][Math.min(rank - (rank < yourPos ? 0 : 1), 3)]
    return { rank, isYou, name: isYou ? 'seu negócio' : '', barWidth }
  })

  return (
    <div ref={wrapRef} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px' }}>
      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>
        Ranqueamento Google
      </p>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.4px', marginBottom: 36, textAlign: 'center' }}>
        Do fundo à primeira posição.
      </h3>

      <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 6 }}>
        {Array.from({ length: 5 }, (_, i) => {
          const rank = i + 1
          const isYou = rank === yourPos
          const competitors = ['concorrente A', 'concorrente B', 'concorrente C', 'concorrente D']
          const compIdx = rank <= yourPos ? rank - 1 : rank - 2
          const barWidths = [71, 54, 38, 20]
          const bw = isYou ? 94 : (barWidths[Math.min(compIdx, 3)] ?? 20)
          return (
            <div
              key={rank}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 14px', borderRadius: 8,
                border: `0.5px solid ${isYou ? 'rgba(196,122,74,0.4)' : '#1d1d1f'}`,
                background: isYou ? 'rgba(196,122,74,0.1)' : 'transparent',
                transition: 'all 0.45s ease',
              }}
            >
              <span style={{ fontSize: 16, fontWeight: 800, color: isYou ? '#c47a4a' : '#333', minWidth: 22, transition: 'color 0.45s' }}>
                {rank}
              </span>
              <div style={{ flex: 1, height: 5, background: '#1a1a1a', borderRadius: 3 }}>
                <div style={{
                  height: '100%', borderRadius: 3,
                  background: isYou ? BG : '#2a2a2a',
                  width: `${bw}%`,
                  transition: 'width 0.6s ease, background 0.45s',
                }} />
              </div>
              <span style={{ fontSize: 10, color: isYou ? '#c47a4a' : '#444', width: 88, textAlign: 'right', transition: 'color 0.45s', fontWeight: isYou ? 600 : 400 }}>
                {isYou ? 'seu negócio' : competitors[Math.min(compIdx, 3)]}
              </span>
            </div>
          )
        })}
      </div>

      <p style={{ fontSize: 56, fontWeight: 800, letterSpacing: '-2px', lineHeight: 1, marginTop: 28, background: BG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        <span ref={posRef}>5º</span>
      </p>
      <p style={{ fontSize: 12, color: '#555', marginTop: 8 }}>posição atual no Google</p>
    </div>
  )
}
