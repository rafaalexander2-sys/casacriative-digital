'use client'

import { useState, useEffect } from 'react'

const reviews = [
  { name: 'Hugo Klem', text: 'Criativos incríveis, atendimento excelente e resultado acima das expectativas. Recomendo muito!', time: '2 meses atrás' },
  { name: 'Juliana Silva', text: 'Rafael sempre me atendeu prontamente. Acesso direto ao desenvolvedor foi fundamental para mim e pro meu site.', time: '1 ano atrás' },
  { name: 'Alessandra Ribeiro', text: 'Parceria longa, trabalho sempre entregue no prazo e com excelência. Super recomendo.', time: '1 ano atrás' },
  { name: 'Cássio Miranda', text: 'Contamos com os serviços da Casa Criative mais de uma vez. Entrega no prazo e qualidade impecável.', time: '1 ano atrás' },
  { name: 'Matheus Ville', text: 'Trabalho eficiente e com atenção às necessidades do cliente. Estou com eles há 3 anos e recomendo.', time: '1 ano atrás' },
]

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

function Stars() {
  return (
    <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
      {[0,1,2,3,4].map(i => (
        <svg key={i} width="13" height="13" viewBox="0 0 12 12">
          <path d="M6 1l1.27 2.57L10 4.07l-2 1.95.47 2.75L6 7.52 3.53 8.77 4 6.02 2 4.07l2.73-.5L6 1z" fill="#c47a4a"/>
        </svg>
      ))}
    </div>
  )
}

export default function Reviews() {
  const [active, setActive] = useState(0)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setActive(a => (a === reviews.length - 1 ? 0 : a + 1))
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  const r = reviews[active]

  if (isMobile) {
    return (
      <section style={{ background: '#f9f6f2', padding: '56px 20px', overflow: 'hidden' }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.5px', textAlign: 'center', marginBottom: 28 }}>
          O que nossos clientes dizem.
        </h2>

        <div style={{ position: 'relative', background: '#fff', borderRadius: 12, padding: '24px 20px', border: '1px solid #e8c49a', boxShadow: '0 4px 24px rgba(139,69,19,0.1)' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: BG, borderRadius: '12px 12px 0 0' }} />
          <Stars />
          <p style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.65, color: '#1d1d1f', marginBottom: 20 }}>
            {r.text}
          </p>
          <div style={{ borderTop: '0.5px solid #f0e8dc', paddingTop: 12, display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#1d1d1f' }}>{r.name}</p>
            <p style={{ fontSize: 12, color: '#86868b' }}>{r.time}</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20 }}>
          {reviews.map((_, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{ width: i === active ? 24 : 6, height: 6, borderRadius: 3, background: i === active ? BG : '#e0d4c4', cursor: 'pointer', transition: 'all 0.3s ease' }}
            />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section style={{ background: '#f9f6f2', padding: '64px 0', overflow: 'hidden' }}>
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#1d1d1f', letterSpacing: '-0.7px', textAlign: 'center', marginBottom: 36 }}>
          O que nossos clientes dizem.
        </h2>

        <div style={{ display: 'flex', gap: 12, overflow: 'hidden', justifyContent: 'center', alignItems: 'stretch' }}>
          {[-1, 0, 1].map(offset => {
            const idx = (active + offset + reviews.length) % reviews.length
            const rv = reviews[idx]
            const isCenter = offset === 0

            return (
              <div
                key={idx}
                onClick={() => !isCenter && setActive(idx)}
                style={{
                  flex: isCenter ? '0 0 54%' : '0 0 21%',
                  background: isCenter ? '#fff' : 'rgba(255,255,255,0.55)',
                  borderRadius: 10,
                  padding: isCenter ? '22px 24px' : '18px 16px',
                  border: isCenter ? '1px solid #e8c49a' : '1px solid #f0e8dc',
                  boxShadow: isCenter
                    ? '0 6px 32px rgba(139,69,19,0.1)'
                    : '0 2px 8px rgba(0,0,0,0.03)',
                  transform: isCenter ? 'scale(1)' : 'scale(0.94)',
                  transition: 'all 0.4s cubic-bezier(0.34,1.2,0.64,1)',
                  cursor: isCenter ? 'default' : 'pointer',
                  opacity: isCenter ? 1 : 0.45,
                  filter: isCenter ? 'none' : 'blur(1.5px)',
                  position: 'relative' as const,
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column' as const,
                }}
              >
                {isCenter && (
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: BG, borderRadius: '10px 10px 0 0' }} />
                )}
                <div style={{ flex: 1 }}>
                  <Stars />
                  <p style={{ fontSize: isCenter ? 14 : 11, fontWeight: 300, lineHeight: 1.6, color: '#1d1d1f' }}>
                    {rv.text}
                  </p>
                </div>
                <div style={{ borderTop: '0.5px solid #f0e8dc', paddingTop: 10, marginTop: 14, display: 'flex', justifyContent: 'space-between' }}>
                  <p style={{ fontSize: isCenter ? 12 : 10, fontWeight: 600, color: '#1d1d1f' }}>{rv.name}</p>
                  <p style={{ fontSize: isCenter ? 11 : 9, color: '#86868b' }}>{rv.time}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 24 }}>
          {reviews.map((_, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{ width: i === active ? 24 : 6, height: 6, borderRadius: 3, background: i === active ? BG : '#e0d4c4', cursor: 'pointer', transition: 'all 0.3s ease' }}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
