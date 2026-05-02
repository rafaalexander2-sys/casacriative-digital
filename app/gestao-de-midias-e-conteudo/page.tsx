import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ServiceHero from '@/components/ServiceHero'
import SocialFeed from '@/components/SocialFeed'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestão de Mídias Sociais e Conteúdo | Casa Criative Digital',
  description: 'Agência de Social Media especializada em Curitiba. Estratégias inteligentes, design de qualidade e conteúdos envolventes para fortalecer sua presença online.',
}

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

const servicos = [
  {
    titulo: 'Planejamento Estratégico',
    desc: 'Um calendário robusto de conteúdos alinhado aos seus objetivos de negócio.',
  },
  {
    titulo: 'Criação de Conteúdo de Alto Impacto',
    desc: 'Postagens criativas, vídeos, carrosséis e reels que captam a essência da sua marca.',
  },
  {
    titulo: 'Campanhas de Engajamento',
    desc: 'Estratégias para aumentar curtidas, comentários e compartilhamentos, conectando sua marca ao público certo.',
  },
]

export default function SocialMedia() {
  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <Navbar />

      <section style={{ paddingTop: 52, background: '#050505' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <SocialFeed />
        </div>
      </section>

      <ServiceHero compact
        tag="Social Media"
        title="Gestão de Mídias Sociais"
        highlight="e Criação de Conteúdo"
        subtitle="Agência Especializada em Anúncios on-line, Criação de sites e Marketing digital em Curitiba"
        desc="Na Casa Criative, transformamos redes sociais em verdadeiras vitrines para o sucesso da sua marca."
        ctaLabel="Marque uma reunião agora!"
      />

      {/* Muito além de postagens */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>Social Media</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.5px', lineHeight: 1.25, marginBottom: 18 }}>
            Muito Além de Postagens: Criamos Conexões
          </h2>
          <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', lineHeight: 1.75, marginBottom: 14 }}>
            O gerenciamento de mídias sociais é mais do que apenas manter um perfil ativo — é sobre criar relacionamentos autênticos, estabelecer autoridade e transformar seguidores em clientes fiéis.
          </p>
          <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', lineHeight: 1.75 }}>
            Desde 2021, ajudamos empresas a fortalecerem sua presença online e aumentarem suas vendas por meio de estratégias eficientes de Social Media e tráfego pago.
          </p>
        </div>
      </section>

      {/* Serviços */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div className="r3" style={{ maxWidth: 900, margin: '0 auto', gap: 12 }}>
          {servicos.map((s, i) => (
            <div key={i} style={{ background: 'linear-gradient(140deg,rgba(255,255,255,0.05),rgba(120,70,40,0.08),rgba(0,0,0,0.5))', border: '0.5px solid rgba(255,210,160,0.12)', borderRadius: 16, padding: '24px 20px' }}>
              <div style={{ width: 24, height: 1.5, background: BG, borderRadius: 1, marginBottom: 16 }} />
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f5f5f7', letterSpacing: '-0.2px', marginBottom: 10 }}>{s.titulo}</h3>
              <p style={{ fontSize: 13, fontWeight: 300, color: '#86868b', lineHeight: 1.7 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Portfólio */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>Portfólio</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.5px', marginBottom: 14 }}>Cases de Social Media</h2>
          <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', lineHeight: 1.75, marginBottom: 40 }}>
            Confira alguns dos projetos de gestão de mídias sociais que desenvolvemos para nossos clientes.
          </p>
          <div className="r3" style={{ gap: 12 }}>
            {[
              { titulo: 'UPLAY · São Braz', tag: 'Social Media', href: 'https://www.behance.net/gallery/173646747/UPLAY-SAO-BRAZ' },
              { titulo: 'Nutriblu · Design de Divulgação', tag: 'Social Media', href: 'https://www.behance.net/gallery/163232439/NUTRIBLU-DESIGN-DIVULGACAO' },
              { titulo: 'Social Media · Advogada Andria', tag: 'Social Media', href: 'https://www.behance.net/gallery/235860779/Social-Media-Advogada-Andria' },
            ].map((c, i) => (
              <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'linear-gradient(140deg,rgba(255,255,255,0.05),rgba(120,70,40,0.08),rgba(0,0,0,0.5))', border: '0.5px solid rgba(255,210,160,0.12)', borderRadius: 12, overflow: 'hidden', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,210,160,0.3)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,210,160,0.12)')}
              >
                <div style={{ width: '100%', aspectRatio: '16/9', background: 'linear-gradient(135deg,#111,#1a0f05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555' }}>{c.tag}</span>
                </div>
                <div style={{ padding: '14px 16px 16px' }}>
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#c47a4a', marginBottom: 6 }}>{c.tag}</p>
                  <h3 style={{ fontSize: 13, fontWeight: 600, color: '#f5f5f7', lineHeight: 1.4, marginBottom: 10 }}>{c.titulo}</h3>
                  <span style={{ fontSize: 12, color: '#c47a4a', fontWeight: 500 }}>Ver no Behance →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.8px', marginBottom: 12 }}>
          Destaque sua marca nas redes sociais!
        </h2>
        <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', marginBottom: 28 }}>
          Conquiste engajamento e resultados com estratégias únicas.
        </p>
        <a href="https://wa.me/5541998170428" style={{ display: 'inline-block', background: BG, color: '#fff', borderRadius: 10, padding: '12px 32px', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
          Falar no WhatsApp
        </a>
      </section>

      <Footer />
    </main>
  )
}
