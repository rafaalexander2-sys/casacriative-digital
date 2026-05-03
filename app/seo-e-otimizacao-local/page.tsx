import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ServiceHero from '@/components/ServiceHero'
import SEORanking from '@/components/SEORanking'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SEO em Curitiba | Otimização para Google e Google Meu Negócio',
  description: 'Serviço de SEO em Curitiba: auditoria técnica, otimização on-page, link building e Google Meu Negócio. Apareça na primeira página do Google e atraia clientes sem pagar por cliques.',
  keywords: ['seo curitiba', 'otimização de sites curitiba', 'google meu negócio curitiba', 'seo local curitiba', 'posicionamento google curitiba'],
  alternates: { canonical: 'https://casacriative.com.br/seo-e-otimizacao-local' },
  openGraph: { title: 'SEO em Curitiba | Casa Criative Digital', description: 'Apareça no topo do Google com SEO estratégico. Auditoria, otimização e Google Meu Negócio em Curitiba.', url: 'https://casacriative.com.br/seo-e-otimizacao-local', type: 'website' },
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

const faq = [
  { q: 'Quanto tempo leva para aparecer na primeira página do Google com SEO?', a: 'O prazo médio para resultados visíveis é de 3 a 6 meses, dependendo do nível de concorrência das palavras-chave e da situação atual do site. SEO é um investimento de médio e longo prazo com resultados sustentáveis e crescentes.' },
  { q: 'O que é Google Meu Negócio e por que devo otimizá-lo?', a: 'Google Meu Negócio é o perfil da sua empresa nos mapas e resultados locais do Google. Um perfil bem otimizado faz sua empresa aparecer para buscas como "agência de marketing perto de mim" ou "dentista em Curitiba", atraindo clientes locais sem custo por clique.' },
  { q: 'SEO substitui o tráfego pago?', a: 'Não substitui — complementa. O tráfego pago gera resultados imediatos enquanto o SEO constrói autoridade orgânica sustentável. A estratégia ideal combina os dois canais: anúncios para resultados de curto prazo e SEO para médio e longo prazo.' },
  { q: 'A Casa Criative faz auditoria de SEO gratuita?', a: 'Sim. Oferecemos uma auditoria inicial gratuita do seu site para identificar os principais pontos de melhoria. Entre em contato pelo WhatsApp (41) 99817-0428 para agendar.' },
  { q: 'Qual a diferença entre SEO local e SEO nacional?', a: 'SEO local otimiza sua presença para buscas de clientes próximos — como "pizzaria em Curitiba" — usando Google Meu Negócio e palavras-chave geográficas. SEO nacional compete por termos mais amplos em todo o Brasil, exigindo mais conteúdo e autoridade de domínio.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'SEO e Otimização Local em Curitiba',
      description: 'Serviço de SEO técnico, otimização on-page, link building e gestão de Google Meu Negócio para empresas em Curitiba e no Brasil.',
      provider: { '@id': 'https://casacriative.com.br/#organization' },
      areaServed: { '@type': 'Country', name: 'Brasil' },
      url: 'https://casacriative.com.br/seo-e-otimizacao-local',
      serviceType: 'SEO',
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
        { '@type': 'ListItem', position: 2, name: 'SEO e Otimização Local', item: 'https://casacriative.com.br/seo-e-otimizacao-local' },
      ],
    },
  ],
}

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
          <div className="r3" style={{ gap: 12 }}>
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
          <div className="r3" style={{ gap: 12 }}>
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

      {/* FAQ */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>FAQ</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.5px', marginBottom: 32 }}>Perguntas frequentes sobre SEO</h2>
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
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.8px', marginBottom: 14 }}>Quer aparecer no topo do Google?</h2>
        <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', marginBottom: 28 }}>Solicite uma auditoria gratuita do seu site.</p>
        <a href="https://wa.me/5541998170428" style={{ display: 'inline-block', background: BG, color: '#fff', borderRadius: 10, padding: '12px 32px', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
          Falar no WhatsApp
        </a>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Footer />
    </main>
  )
}
