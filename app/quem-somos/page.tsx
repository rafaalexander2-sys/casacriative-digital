import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ServiceHero from '@/components/ServiceHero'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Quem Somos | Casa Criative Digital',
  description: 'Agência digital de Curitiba especializada em Tráfego Pago, Sites e SEO. Desde 2021 conectamos marcas ao público certo com estratégia, design e dados.',
}

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

const tags = ['Landing Pages', 'Tráfego Pago', 'Branding', 'Social Media', 'SEO', 'Design Gráfico']

const timeline = [
  { ano: '2021', titulo: 'Fundação', desc: 'Nascemos em Curitiba com foco em sites e tráfego pago para PMEs.' },
  { ano: '2022', titulo: 'Equipe completa', desc: 'Social Media, Copywriting e Design integrados ao portfólio.' },
  { ano: '2023', titulo: 'Expansão nacional', desc: 'Projetos em São Paulo, Rio de Janeiro e demais capitais.' },
  { ano: 'Hoje', titulo: '+50 clientes · +700k em ads', desc: 'Referência em resultados digitais com o mesmo DNA criativo.' },
]

const mvv = [
  { num: '01', titulo: 'Missão', desc: 'Impulsionar negócios no digital com estratégias personalizadas, entregando crescimento mensurável para cada cliente.' },
  { num: '02', titulo: 'Visão', desc: 'Ser a principal referência em marketing digital do Sul do Brasil, expandindo com cases reais e parcerias de longo prazo.' },
  { num: '03', titulo: 'Valores', desc: 'Honestidade, comprometimento e qualidade. Transparência total em cada entrega, do briefing ao resultado final.' },
]

export default function QuemSomos() {
  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <Navbar />

      <ServiceHero
        tag="Quem Somos"
        title="Transformamos criatividade"
        highlight="em resultado."
        desc="Agência digital de Curitiba especializada em Tráfego Pago, Sites e SEO. Desde 2021 conectamos marcas ao público certo com estratégia, design e dados."
        ctaLabel="WhatsApp"
        ctaHref="https://wa.me/5541998170428"
      />

      {/* Sobre + Stats */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 14 }}>Sobre nós</p>
          <p style={{ fontSize: 15, fontWeight: 300, color: '#86868b', lineHeight: 1.75, marginBottom: 40, maxWidth: 600 }}>
            Nascemos para provar que agências digitais podem ser honestas, estratégicas e entregar resultados tangíveis. Cada projeto é pensado para destacar sua marca de forma marcante e profissional.
          </p>

          {/* Stats */}
          <div className="r3 stats-block" style={{ gap: 0, marginBottom: 40 }}>
            {[
              { valor: '+700k', label: 'em anúncios gerenciados' },
              { valor: '+50', label: 'clientes satisfeitos' },
              { valor: '5 anos', label: 'de mercado' },
            ].map((s, i) => (
              <div key={i} style={{ padding: '0 0 0 28px', borderLeft: i > 0 ? '0.5px solid #1d1d1f' : 'none' }}>
                <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-1.5px', lineHeight: 1, background: BG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 6 }}>{s.valor}</p>
                <p style={{ fontSize: 12, fontWeight: 300, color: '#86868b' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {tags.map(t => (
              <span key={t} style={{ fontSize: 12, fontWeight: 500, color: '#86868b', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '6px 14px' }}>{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* História */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>Nossa história</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.5px', lineHeight: 1.25, marginBottom: 14 }}>
            De Curitiba para o Brasil inteiro.
          </h2>
          <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', lineHeight: 1.75, marginBottom: 40, maxWidth: 560 }}>
            Desde 2021, ajudamos empresas a fortalecerem a presença online e aumentarem suas vendas por meio de estratégias eficientes de tráfego pago, sites que convertem e identidades visuais que comunicam valor.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {timeline.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 28, padding: '22px 0', borderBottom: i < timeline.length - 1 ? '0.5px solid #1d1d1f' : 'none' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#c47a4a', letterSpacing: '0.05em', minWidth: 36 }}>{t.ano}</p>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: '#f5f5f7', marginBottom: 5 }}>{t.titulo}</h3>
                  <p style={{ fontSize: 13, fontWeight: 300, color: '#86868b', lineHeight: 1.6 }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Missão, Visão, Valores */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className="r3" style={{ gap: 12 }}>
            {mvv.map((m, i) => (
              <div key={i} style={{ background: 'linear-gradient(140deg,rgba(255,255,255,0.05),rgba(120,70,40,0.08),rgba(0,0,0,0.5))', border: '0.5px solid rgba(255,210,160,0.12)', borderRadius: 16, padding: '28px 22px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#c47a4a', letterSpacing: '0.1em', marginBottom: 14 }}>{m.num}</p>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.2px', marginBottom: 10 }}>{m.titulo}</h3>
                <p style={{ fontSize: 13, fontWeight: 300, color: '#86868b', lineHeight: 1.7 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.8px', marginBottom: 10 }}>Pronto para ir ao topo?</h2>
        <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', marginBottom: 28 }}>Entre em contato e descubra como podemos transformar a presença digital do seu negócio.</p>
        <div className="cta-row" style={{ gap: 12, justifyContent: 'center' }}>
          <a href="https://wa.me/5541998170428" style={{ display: 'block', background: BG, color: '#fff', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 500, textDecoration: 'none', textAlign: 'center' }}>WhatsApp</a>
          <a href="/gestao-de-anuncios-pagos" style={{ display: 'block', background: 'rgba(255,255,255,0.06)', border: '0.5px solid rgba(255,210,160,0.2)', color: '#f5f5f7', borderRadius: 10, padding: '12px 28px', fontSize: 14, fontWeight: 500, textDecoration: 'none', textAlign: 'center' }}>Nossos Serviços</a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
