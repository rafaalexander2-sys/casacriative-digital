import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ServiceHero from '@/components/ServiceHero'
import ROIChart from '@/components/ROIChart'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tráfego Pago em Curitiba | Google Ads e Meta Ads',
  description: 'Agência de tráfego pago em Curitiba especializada em Google Ads, Facebook Ads e Instagram Ads. Gestão profissional com ROI mensurável, criativos de alta performance e relatórios transparentes.',
  keywords: ['tráfego pago curitiba', 'google ads curitiba', 'facebook ads curitiba', 'instagram ads curitiba', 'gestão de anúncios curitiba', 'meta ads curitiba'],
  alternates: { canonical: 'https://casacriative.com.br/gestao-de-anuncios-pagos' },
  openGraph: { title: 'Tráfego Pago em Curitiba | Casa Criative Digital', description: 'Google Ads, Facebook e Instagram Ads em Curitiba com ROI mensurável. Solicite orçamento.', url: 'https://casacriative.com.br/gestao-de-anuncios-pagos', type: 'website' },
}

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

const features = [
  { titulo: 'Análise Personalizada', desc: 'Estudamos as necessidades do seu negócio e do seu público com profundidade, identificando oportunidades que realmente fazem a diferença.' },
  { titulo: 'Estratégias Sob Medida', desc: 'Desenvolvemos campanhas altamente otimizadas, focadas em aumentar sua visibilidade, atrair clientes qualificados e impulsionar suas vendas.' },
  { titulo: 'Acompanhamento Contínuo', desc: 'Monitoramos cada etapa das campanhas, ajustando estratégias com agilidade para garantir o máximo desempenho e retorno sobre o investimento (ROI).' },
]

const reviews = [
  { nome: 'Hugo Klem', tempo: '2 meses atrás', texto: 'Criativos incríveis, atendimento excelente e resultado acima das expectativas. Recomendo muito!' },
  { nome: 'Juliana Silva', tempo: '1 ano atrás', texto: 'Todas as vezes que precisei falar com eles, Rafael sempre me atendeu prontamente, coisa difícil de se ver hoje em dia em empresas de marketing. Conversar e ter acesso direto ao desenvolvedor foi fundamental para mim e pro meu site. Sempre conseguiu fazer tudo o que pedimos nos prazos. Tenho gostado muito de trabalhar com eles.' },
  { nome: 'Alessandra Wendy Ribeiro dos Santos', tempo: '1 ano atrás', texto: 'Minha parceria com a Casa Criative Digital já é bem longa, o trabalho deles são sempre entregues no prazo e com excelência. No quesito atendimento, são super atenciosos, são também super Impecáveis em tudo que estão designados a fazer, super recomendo.' },
  { nome: 'Cássio Miranda', tempo: '1 ano atrás', texto: 'Contamos com os serviços da Casa Criative por mais de uma vez e o trabalho sempre foi de excelência. Entrega no prazo, qualidade impecável e um time de atendimento fora do comum. Super indico!' },
]

const faq = [
  { q: 'Quanto custa a gestão de tráfego pago em Curitiba?', a: 'O investimento varia conforme volume de verba e serviços incluídos. Na Casa Criative Digital, trabalhamos com planos personalizados para cada negócio. Entre em contato pelo WhatsApp (41) 99817-0428 para um orçamento sem compromisso.' },
  { q: 'Quanto tempo leva para ver resultados com Google Ads ou Meta Ads?', a: 'Os primeiros resultados aparecem em 24–48h após a ativação das campanhas. A fase de aprendizado do algoritmo dura em média 30 a 45 dias, período em que as campanhas se tornam progressivamente mais eficientes e o custo por resultado cai.' },
  { q: 'Qual plataforma é melhor para anunciar: Google Ads ou Meta Ads (Facebook/Instagram)?', a: 'Depende do objetivo. Google Ads é ideal para capturar demanda existente — quem já pesquisa pelo seu produto ou serviço. Meta Ads (Facebook e Instagram) é mais eficiente para criar demanda e alcançar públicos que ainda não te conhecem. A estratégia ideal combina as duas plataformas.' },
  { q: 'A Casa Criative Digital atende clientes fora de Curitiba?', a: 'Sim. Apesar de ser sediada em Curitiba, Paraná, atendemos clientes em todo o Brasil de forma 100% remota, com reuniões por videochamada, relatórios mensais detalhados e comunicação direta pelo WhatsApp.' },
  { q: 'A verba de anúncios está inclusa na gestão?', a: 'Não. A verba investida em anúncios é paga diretamente à plataforma (Google ou Meta) pelo próprio cliente. A Casa Criative cobra a taxa de gestão separadamente, garantindo total transparência sobre onde cada real é investido.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['LocalBusiness', 'MarketingAgency'],
      '@id': 'https://casacriative.com.br/#organization',
      name: 'Casa Criative Digital',
      url: 'https://casacriative.com.br',
      telephone: '+55-41-99817-0428',
      address: { '@type': 'PostalAddress', addressLocality: 'Curitiba', addressRegion: 'PR', addressCountry: 'BR' },
      aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', bestRating: '5', worstRating: '1', ratingCount: '4' },
      review: reviews.map(r => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.nome },
        reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
        reviewBody: r.texto,
      })),
    },
    {
      '@type': 'Service',
      name: 'Gestão de Tráfego Pago em Curitiba',
      description: 'Gestão profissional de Google Ads, Facebook Ads e Instagram Ads em Curitiba com ROI mensurável e relatórios transparentes.',
      provider: { '@id': 'https://casacriative.com.br/#organization' },
      areaServed: { '@type': 'Country', name: 'Brasil' },
      url: 'https://casacriative.com.br/gestao-de-anuncios-pagos',
      serviceType: 'Tráfego Pago',
    },
    {
      '@type': 'FAQPage',
      mainEntity: faq.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://casacriative.com.br' },
        { '@type': 'ListItem', position: 2, name: 'Tráfego Pago em Curitiba', item: 'https://casacriative.com.br/gestao-de-anuncios-pagos' },
      ],
    },
  ],
}

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
        <div className="r3" style={{ maxWidth: 900, margin: '0 auto', gap: 12 }}>
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
          <div className="r2" style={{ gap: 12 }}>
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

      {/* FAQ */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>FAQ</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.5px', marginBottom: 32 }}>Perguntas frequentes sobre tráfego pago</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faq.map((item, i) => (
              <div key={i} style={{ padding: '22px 0', borderBottom: i < faq.length - 1 ? '0.5px solid #1d1d1f' : 'none' }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f5f5f7', marginBottom: 8 }}>{item.q}</h3>
                <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', lineHeight: 1.7, margin: 0 }}>{item.a}</p>
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

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Footer />
    </main>
  )
}
