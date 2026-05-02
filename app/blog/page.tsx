import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Casa Criative Digital',
  description: 'Dicas sobre Criação de Sites Profissionais, Tráfego Pago, Marketing Digital, Design Gráfico e muito mais.',
}

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

const posts = [
  {
    categoria: 'Design Gráfico',
    titulo: 'Designers Gráficos e a IA: Seremos Substituídos em 2024?',
    desc: 'Exploramos como a inteligência artificial está moldando o futuro do design gráfico e o que os profissionais precisam fazer para se adaptar e prosperar.',
    href: '/blog/designers-graficos-e-ia',
    data: '14 Nov 2023',
  },
  {
    categoria: 'Design Gráfico',
    titulo: 'Design Gráfico e o Rebranding da RECORD: 3 Tendências 2023',
    desc: 'Analisamos as escolhas criativas por trás do rebranding da RECORD TV e as 3 tendências de design que dominaram o ano de 2023.',
    href: '/blog/design-grafico',
    data: '14 Nov 2023',
  },
  {
    categoria: 'Social Media',
    titulo: 'TikTok Video Marketing 2023: Dominando Vídeos Curtos nas Redes Sociais',
    desc: 'Guia completo para criar estratégias de vídeos curtos que engajam, convertem e ampliam seu alcance orgânico no TikTok e Instagram Reels.',
    href: '/blog/tiktok-video-marketing-2023',
    data: '12 Nov 2023',
  },
  {
    categoria: 'Social Media',
    titulo: 'Mídias Sociais: Descubra as Principais Tendências para 2024',
    desc: 'Do social commerce ao conteúdo gerado por IA: conheça as tendências que vão redefinir o marketing nas redes sociais no próximo ano.',
    href: '/blog/midias-sociais',
    data: '10 Nov 2023',
  },
  {
    categoria: 'Social Media',
    titulo: 'Citações no Instagram: 11 Aplicativos para Experimentar',
    desc: 'Selecionamos os 11 melhores aplicativos para criar posts de citações visualmente impactantes e aumentar o engajamento no Instagram.',
    href: '/blog/citacoes-no-instagram',
    data: '10 Nov 2023',
  },
  {
    categoria: 'Tráfego Pago',
    titulo: 'Facebook e Instagram Pagos: A 1° Nova Estratégia da Meta',
    desc: 'A Meta anunciou planos de assinatura paga para usuários europeus. Entenda o impacto para anunciantes e como adaptar sua estratégia.',
    href: '/blog/facebook-e-instagram-pagos',
    data: '09 Nov 2023',
  },
  {
    categoria: 'Tráfego Pago',
    titulo: 'Tráfego Pago em 2023: Ainda é a Chave para o Sucesso no Marketing Digital?',
    desc: 'Com CPMs em alta e concorrência crescente, analisamos se o tráfego pago ainda compensa e quais plataformas entregam melhor ROI.',
    href: '/blog/trafego-pago-em-2023',
    data: '13 Out 2023',
  },
]

const categorias = ['Todos', 'Design Gráfico', 'Notícias', 'Social Media', 'Tráfego Pago']

export default function Blog() {
  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: '140px 24px 80px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c47a4a', marginBottom: 16 }}>
          Casa Criative
        </p>
        <h1 style={{ fontSize: 48, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-2px', lineHeight: 1.05, maxWidth: 600, margin: '0 auto 20px' }}>
          Blog
        </h1>
        <p style={{ fontSize: 17, fontWeight: 300, color: '#86868b', lineHeight: 1.65, maxWidth: 520, margin: '0 auto' }}>
          Dicas sobre Criação de Sites, Tráfego Pago, Marketing Digital, Design Gráfico e muito mais.
        </p>
      </section>

      {/* Categorias */}
      <section style={{ padding: '0 24px 56px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {categorias.map((c, i) => (
            <span key={c} style={{ fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? '#f5f5f7' : '#86868b', background: i === 0 ? 'rgba(255,210,160,0.1)' : 'rgba(255,255,255,0.04)', border: `0.5px solid ${i === 0 ? 'rgba(255,210,160,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 10, padding: '7px 18px', cursor: 'pointer' }}>
              {c}
            </span>
          ))}
        </div>
      </section>

      {/* Cards de posts */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {posts.map((p, i) => (
            <Link
              key={i}
              href={p.href}
              style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'linear-gradient(160deg,rgba(255,255,255,0.05),rgba(120,70,40,0.06),rgba(0,0,0,0.5))', border: '0.5px solid rgba(255,210,160,0.1)', borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.2s, transform 0.2s' }}
            >
              {/* Imagem / placeholder */}
              <div style={{ width: '100%', aspectRatio: '16/9', background: 'linear-gradient(135deg,#111,#1a0f05)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#333' }}>
                  {p.categoria}
                </span>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 40%, rgba(196,122,74,0.08) 0%, transparent 60%)' }} />
              </div>

              {/* Conteúdo */}
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

      {/* CTA newsletter */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.8px', marginBottom: 12 }}>Receba novos artigos por e-mail.</h2>
        <p style={{ fontSize: 15, fontWeight: 300, color: '#86868b', marginBottom: 28 }}>Sem spam. Conteúdo prático sobre marketing digital, uma vez por semana.</p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center', maxWidth: 420, margin: '0 auto' }}>
          <input type="email" placeholder="seu@email.com" style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,210,160,0.2)', borderRadius: 10, padding: '12px 16px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'inherit' }} />
          <button style={{ background: BG, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 24px', fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
            Assinar
          </button>
        </div>
      </section>

      <Footer />
    </main>
  )
}
