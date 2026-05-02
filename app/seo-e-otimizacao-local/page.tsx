import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ServiceHero from '@/components/ServiceHero'
import SEORanking from '@/components/SEORanking'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SEO e Google Meu Negócio em Curitiba | Casa Criative Digital',
  description: 'Auditoria de SEO, otimização local e Google Meu Negócio para empresas de Curitiba. Apareça no topo das buscas organicamente.',
}

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

const seoServicos = [
  { titulo: 'Otimização de Conteúdo', desc: 'Aprimoramos textos e imagens para torná-los mais relevantes e alinhados às palavras-chave estratégicas do seu negócio.' },
  { titulo: 'Link Building', desc: 'Desenvolvemos estratégias para adquirir backlinks de qualidade, aumentando a autoridade e a credibilidade do seu site.' },
  { titulo: 'Implementações Técnicas', desc: 'Corrigimos aspectos como velocidade de carregamento, estrutura de URLs e compatibilidade mobile, garantindo uma experiência de usuário otimizada.' },
]

const gmbServicos = [
  { titulo: 'Criação de Perfil', desc: 'Configuramos seu perfil com informações precisas e completas, incluindo endereço, horário de funcionamento e categorias relevantes.' },
  { titulo: 'Otimização de Conteúdo', desc: 'Adicionamos descrições atrativas, fotos de alta qualidade e atualizações regulares para engajar potenciais clientes.' },
  { titulo: 'Gerenciamento de Avaliações', desc: 'Monitoramos e respondemos a avaliações de clientes, fortalecendo a reputação online da sua empresa.' },
]

export default function SEO() {
  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <Navbar />

      <section style={{ paddingTop: 52, background: '#050505' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <SEORanking />
        </div>
      </section>

      <ServiceHero compact
        tag="SEO & Google Meu Negócio"
        title="SEO e"
        highlight="Google Meu Negócio"
        subtitle="Agência Especializada em Anúncios on-line, Criação de sites e SEO em Curitiba"
        desc="Na Casa Criative, oferecemos serviços especializados para aprimorar a presença online da sua empresa, focando em SEO e otimização do Google Meu Negócio."
        ctaLabel="Marque uma reunião agora!"
      />

      {/* SEO Técnico */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>Tráfego Orgânico</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.5px', lineHeight: 1.25, marginBottom: 14 }}>
            Revisão de Sites para Ranqueamento SEO
          </h2>
          <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', lineHeight: 1.75, marginBottom: 10 }}>
            Realizamos auditorias completas para identificar e corrigir fatores que impactam o desempenho do seu site nos mecanismos de busca.
          </p>
          <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', lineHeight: 1.75, marginBottom: 40 }}>
            Desde 2021, ajudamos empresas a fortalecerem sua presença online e aumentarem suas vendas por meio de estratégias eficientes de SEO.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {seoServicos.map((s, i) => (
              <div key={i} style={{ background: 'linear-gradient(140deg,rgba(255,255,255,0.05),rgba(120,70,40,0.08),rgba(0,0,0,0.5))', border: '0.5px solid rgba(255,210,160,0.12)', borderRadius: 14, padding: '22px 18px' }}>
                <div style={{ width: 24, height: 1.5, background: BG, borderRadius: 1, marginBottom: 14 }} />
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f7', marginBottom: 8 }}>{s.titulo}</h3>
                <p style={{ fontSize: 13, fontWeight: 300, color: '#86868b', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Meu Negócio */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>Tráfego Orgânico Local</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.5px', lineHeight: 1.25, marginBottom: 14 }}>
            Criação e Revisão do Google Meu Negócio
          </h2>
          <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', lineHeight: 1.75, marginBottom: 10 }}>
            Um perfil bem estruturado no Google Meu Negócio é essencial para destacar sua empresa nas buscas locais.
          </p>
          <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', lineHeight: 1.75, marginBottom: 40 }}>
            Desde 2021, ajudamos empresas a fortalecerem sua presença online e aumentarem suas vendas por meio de estratégias eficientes de marketing local.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {gmbServicos.map((s, i) => (
              <div key={i} style={{ background: 'linear-gradient(140deg,rgba(255,255,255,0.05),rgba(120,70,40,0.08),rgba(0,0,0,0.5))', border: '0.5px solid rgba(255,210,160,0.12)', borderRadius: 14, padding: '22px 18px' }}>
                <div style={{ width: 24, height: 1.5, background: BG, borderRadius: 1, marginBottom: 14 }} />
                <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f7', marginBottom: 8 }}>{s.titulo}</h3>
                <p style={{ fontSize: 13, fontWeight: 300, color: '#86868b', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.8px', marginBottom: 14 }}>Quer aparecer no topo do Google?</h2>
        <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', marginBottom: 28 }}>Solicite uma auditoria gratuita do seu site.</p>
        <a href="https://wa.me/5541998170428" style={{ display: 'inline-block', background: BG, color: '#fff', borderRadius: 10, padding: '12px 32px', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
          Falar no WhatsApp
        </a>
      </section>

      <Footer />
    </main>
  )
}
