'use client'

import { useState } from 'react'
import Link from 'next/link'

export interface BlogCard {
  categoria: string
  titulo: string
  desc: string
  href: string
  data: string
  cover: string | null
}

// Filtro por categoria da página /blog. As categorias saem dos próprios posts,
// para não haver botão que não filtra nada.
export default function BlogGrid({ posts }: { posts: BlogCard[] }) {
  const categorias = ['Todos', ...Array.from(new Set(posts.map(p => p.categoria)))]
  const [ativa, setAtiva] = useState('Todos')
  const visiveis = ativa === 'Todos' ? posts : posts.filter(p => p.categoria === ativa)

  return (
    <>
      {/* Categorias */}
      <section style={{ padding: '0 24px 56px' }}>
        <div className="cats-wrap" style={{ maxWidth: 960, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {categorias.map(c => {
            const on = c === ativa
            return (
              <button key={c} type="button" onClick={() => setAtiva(c)} aria-pressed={on} style={{ fontSize: 13, fontWeight: on ? 600 : 400, color: on ? '#f5f5f7' : '#86868b', background: on ? 'rgba(255,210,160,0.1)' : 'rgba(255,255,255,0.04)', border: `0.5px solid ${on ? 'rgba(255,210,160,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '7px 18px', cursor: 'pointer', fontFamily: 'inherit' }}>
                {c}
              </button>
            )
          })}
        </div>
      </section>

      {/* Cards de posts */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '60px 24px 80px' }}>
        <div className="r3" style={{ maxWidth: 960, margin: '0 auto', gap: 16 }}>
          {visiveis.map(p => (
            <Link
              key={p.href}
              href={p.href}
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg,rgba(255,255,255,0.05),rgba(120,70,40,0.06),rgba(0,0,0,0.5))', border: '0.5px solid rgba(255,210,160,0.1)', borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s, transform 0.2s' }}
            >
              <div style={{ width: '100%', aspectRatio: '16/9', background: 'linear-gradient(135deg,#111,#1a0f05)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                {p.cover
                  ? <img src={p.cover} alt={p.titulo} loading="lazy" decoding="async" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <>
                      <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#333' }}>{p.categoria}</span>
                      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 40%, rgba(196,122,74,0.08) 0%, transparent 60%)' }} />
                    </>
                }
              </div>
              <div style={{ padding: '20px 20px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c47a4a', background: 'rgba(196,122,74,0.1)', border: '0.5px solid rgba(196,122,74,0.2)', borderRadius: 10, padding: '3px 10px', display: 'inline-block', marginBottom: 12, alignSelf: 'flex-start' }}>
                  {p.categoria}
                </span>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: '#f5f5f7', letterSpacing: '-0.2px', lineHeight: 1.45, marginBottom: 10, flex: 1 }}>
                  {p.titulo}
                </h2>
                <p style={{ fontSize: 13, fontWeight: 300, color: '#6e6e73', lineHeight: 1.65, marginBottom: 16 }}>
                  {p.desc}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: '#444' }}>{p.data}</span>
                  <span style={{ fontSize: 12, color: '#c47a4a', fontWeight: 500 }}>Leia mais →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
