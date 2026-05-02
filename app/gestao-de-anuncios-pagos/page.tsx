import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ServiceHero from '@/components/ServiceHero'
import ROIChart from '@/components/ROIChart'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gestão de Tráfego Pago | Casa Criative Digital',
  description: 'Agência especializada em Google Ads, Facebook e Instagram Ads em Curitiba. Transformamos cliques em conversões com máximo ROI.',
}

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

const features = [
  {
    titulo: 'Análise Personalizada',
    desc: 'Estudamos as necessidades do seu negócio e do seu público com profundidade, identificando oportunidades que realmente fazem a diferença.',
  },
  {
    titulo: 'Estratégias Sob Medida',
    desc: 'Desenvolvemos campanhas altamente otimizadas, focadas em aumentar sua visibilidade, atrair clientes qualificados e impulsionar suas vendas.',
  },
  {
    titulo: 'Acompanhamento Contínuo',
    desc: 'Monitoramos cada etapa das campanhas, ajustando estratégias com agilidade para garantir o máximo desempenho e retorno sobre o investimento (ROI).',
  },
]

const reviews = [
  { nome: 'Hugo Klem', tempo: '2 meses atrás', texto: 'Criativos incríveis, atendimento excelente e resultado acima das expectativas. Recomendo muito!' },
  { nome: 'Juliana Silva', tempo: '1 ano atrás', texto: 'Todas as vezes que precisei falar com eles, Rafael sempre me atendeu prontamente, coisa difícil de se ver hoje em dia em empresas de marketing. Conversar e ter acesso direto ao desenvolvedor foi fundamental para mim e pro meu site. Sempre conseguiu fazer tudo o que pedimos nos prazos. Tenho gostado muito de trabalhar com eles.' },
  { nome: 'Alessandra Wendy Ribeiro dos Santos', tempo: '1 ano atrás', texto: 'Minha parceria com a Casa Criative Digital já é bem longa, o trabalho deles são sempre entregues no prazo e com excelência. No quesito atendimento, são super atenciosos, são também super Impecáveis em tudo que estão designados a fazer, super recomendo.' },
  { nome: 'Cássio Miranda', tempo: '1 ano atrás', texto: 'Contamos com os serviços da Casa Criative por mais de uma vez e o trabalho sempre foi de excelência. Entrega no prazo, qualidade impecável e um time de atendimento fora do comum. Super indico!' },
]

export default function TrafegoPago() {
  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <Navbar />

      <section style={{ paddingTop: 52, background: '#050505' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <ROIChart />
        </div>
      </section>

      <ServiceHero compact
        tag="Tráfego Pago"
        title="Gestão de"
        highlight="Tráfego Pago"
        subtitle="Agência Especializada em Anúncios on-line, Criação de sites e Marketing digital em Curitiba"
        desc="Na Casa Criative, transformamos cliques em conversões. Maximizamos o ROI dos seus anúncios em Google Ads, Facebook, Instagram e outras mídias estratégicas."
        ctaLabel="Marque uma reunião agora!"
      />

      {/* Por que investir */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>Anúncios Online</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.5px', lineHeight: 1.25, marginBottom: 18 }}>
            Por que investir em tráfego pago?
          </h2>
          <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', lineHeight: 1.75, marginBottom: 12 }}>
            O tráfego orgânico é importante, mas os resultados podem ser mais lentos. Com tráfego pago, você alcança seu público-alvo de forma imediata e segmentada, colocando sua marca na frente de quem realmente importa.
          </p>
          <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', lineHeight: 1.75 }}>
            Além disso, é possível mensurar cada centavo investido, garantindo eficiência e clareza nas decisões. Desde 2021, ajudamos empresas a fortalecerem sua presença online e aumentarem suas vendas por meio de estratégias eficientes de tráfego pago.
          </p>
        </div>
      </section>

      {/* Features */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: 'linear-gradient(140deg,rgba(255,255,255,0.05),rgba(120,70,40,0.08),rgba(0,0,0,0.5))', border: '0.5px solid rgba(255,210,160,0.12)', borderRadius: 16, padding: '24px 20px' }}>
              <div style={{ width: 24, height: 1.5, background: BG, borderRadius: 1, marginBottom: 16 }} />
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f5f5f7', letterSpacing: '-0.2px', marginBottom: 10 }}>{f.titulo}</h3>
              <p style={{ fontSize: 13, fontWeight: 300, color: '#86868b', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12, textAlign: 'center' }}>Depoimentos</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.5px', textAlign: 'center', marginBottom: 40 }}>
            O que dizem nossos clientes.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {reviews.map((r, i) => (
              <div key={i} style={{ background: 'linear-gradient(140deg,rgba(255,255,255,0.04),rgba(0,0,0,0.5))', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '22px' }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
                  {[...Array(5)].map((_, j) => <span key={j} style={{ color: '#c47a4a', fontSize: 12 }}>★</span>)}
                </div>
                <p style={{ fontSize: 13, fontWeight: 300, color: '#86868b', lineHeight: 1.7, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{r.texto}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#f5f5f7' }}>{r.nome}</p>
                <p style={{ fontSize: 11, color: '#555' }}>{r.tempo}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.8px', marginBottom: 14 }}>Pronto para escalar suas vendas?</h2>
        <a href="https://wa.me/5541998170428" style={{ display: 'inline-block', background: BG, color: '#fff', borderRadius: 10, padding: '12px 32px', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
          Falar no WhatsApp
        </a>
      </section>

      <Footer />
    </main>
  )
}
