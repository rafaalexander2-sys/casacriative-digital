import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ServiceHero from '@/components/ServiceHero'
import NotebookOpen from '@/components/NotebookOpen'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Criação de Sites e Landing Pages em Curitiba',
  description: 'Criação de sites profissionais e landing pages de alta conversão em Curitiba. Design exclusivo, SEO incluído, hospedagem grátis por 1 ano, e-mail profissional e entrega em 48h.',
  keywords: ['criação de sites curitiba', 'landing page curitiba', 'desenvolvimento de sites curitiba', 'site profissional curitiba', 'site para empresa curitiba'],
  alternates: { canonical: 'https://casacriative.com.br/sites-e-landing-pages' },
  openGraph: { title: 'Criação de Sites e Landing Pages em Curitiba | Casa Criative', description: 'Sites profissionais e landing pages de alta conversão. Hospedagem grátis e entrega em 48h.', url: 'https://casacriative.com.br/sites-e-landing-pages', type: 'website' },
}

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

const diferenciais = [
  { titulo: 'Hospedagem Inclusa', desc: 'Na compra do seu site ganhe 1 ano de hospedagem Gratuitamente.' },
  { titulo: 'Domínio Grátis', desc: 'Domínio grátis por 1 ano — www.suaempresa.com.br.' },
  { titulo: 'Entrega em 48h', desc: 'Site personalizado para atender às necessidades da sua empresa.' },
  { titulo: 'E-mail Profissional', desc: 'E-mail profissional com o domínio da empresa incluso.' },
]

const beneficios = [
  'Site totalmente personalizado',
  'Otimizado para SEO — Mecanismos de Busca do Google',
  'Preparado para tráfego pago',
  'Textos otimizados por especialistas em copywriting e SEO',
  'Não é um site One Page',
  'Hospedagem por 1 ano inclusa',
  'Domínio grátis por 1 ano',
  'Mobile First — Otimizado para dispositivos móveis',
  'E-mail profissional',
]

const faq = [
  { q: 'Quanto custa criar um site profissional em Curitiba?', a: 'Sites profissionais na Casa Criative Digital são entregues com hospedagem e domínio gratuitos por 1 ano. O valor varia conforme o número de páginas e funcionalidades. Entre em contato pelo WhatsApp (41) 99817-0428 para um orçamento sem compromisso.' },
  { q: 'Em quanto tempo meu site fica pronto?', a: 'Entregamos landing pages em até 48h. Sites institucionais completos são entregues conforme a complexidade do projeto, sempre com prazo acordado no início do contrato.' },
  { q: 'O site é otimizado para o Google (SEO)?', a: 'Sim. Todos os sites desenvolvidos pela Casa Criative já saem com SEO técnico configurado: URLs amigáveis, meta tags otimizadas, imagens comprimidas, estrutura de headings, sitemap e integração com Google Search Console.' },
  { q: 'O site funciona bem no celular?', a: 'Sim. Todos os nossos sites são desenvolvidos com abordagem Mobile First — projetados primeiro para smartphones e depois adaptados para desktop, garantindo a melhor experiência em qualquer dispositivo.' },
  { q: 'Preciso pagar hospedagem após o primeiro ano?', a: 'No primeiro ano a hospedagem e o domínio são gratuitos. A partir do segundo ano, a renovação é por conta do cliente junto à empresa de hospedagem, com todo o suporte necessário da nossa equipe.' },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Service',
      name: 'Criação de Sites e Landing Pages em Curitiba',
      description: 'Desenvolvimento de sites profissionais e landing pages de alta conversão com SEO, hospedagem e domínio inclusos por 1 ano.',
      provider: { '@id': 'https://casacriative.com.br/#organization' },
      areaServed: { '@type': 'Country', name: 'Brasil' },
      url: 'https://casacriative.com.br/sites-e-landing-pages',
      serviceType: 'Criação de Sites',
      offers: {
        '@type': 'Offer',
        description: 'Site profissional com hospedagem e domínio grátis por 1 ano + e-mail profissional',
        availability: 'https://schema.org/InStock',
      },
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
        { '@type': 'ListItem', position: 2, name: 'Sites e Landing Pages', item: 'https://casacriative.com.br/sites-e-landing-pages' },
      ],
    },
  ],
}

export default function SitesLandingPages() {
  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <Navbar />

      <section style={{ paddingTop: 52, background: '#050505' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <NotebookOpen />
        </div>
      </section>

      <ServiceHero compact
        tag="Casa Criative"
        title="Sites e Landing Pages"
        highlight="Sob Medida"
        desc="Design, Conversão e Resultados para Seu Negócio em Curitiba, no Brasil ou no Mundo!"
        ctaLabel="Solicite seu orçamento"
      />

      {/* Diferenciais */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div className="r4" style={{ maxWidth: 900, margin: '0 auto', gap: 12 }}>
          {diferenciais.map((d, i) => (
            <div key={i} style={{ background: 'linear-gradient(140deg,rgba(255,255,255,0.05),rgba(120,70,40,0.08),rgba(0,0,0,0.5))', border: '0.5px solid rgba(255,210,160,0.12)', borderRadius: 14, padding: '22px 18px', textAlign: 'center' }}>
              <div style={{ width: 24, height: 1.5, background: BG, borderRadius: 1, margin: '0 auto 14px' }} />
              <h3 style={{ fontSize: 13, fontWeight: 600, color: '#f5f5f7', marginBottom: 8 }}>{d.titulo}</h3>
              <p style={{ fontSize: 12, fontWeight: 300, color: '#86868b', lineHeight: 1.6 }}>{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Portfólio */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>Portfólio</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.5px', marginBottom: 14 }}>Sites que Transformaram Negócios</h2>
          <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', lineHeight: 1.75, marginBottom: 40 }}>
            Confira alguns exemplos de sites que desenvolvemos para empreendedores como você, cada um personalizado e otimizado para atingir os melhores resultados.
          </p>
          <div className="r3" style={{ gap: 12 }}>
            {[
              { titulo: 'Site – Sistema de Segurança', tag: 'Site Institucional', img: '/portfolio-seguranca.png', href: 'https://www.behance.net/gallery/245921369/Site-Sistema-de-Seguranca' },
              { titulo: 'Landing Page – Odontologia', tag: 'Landing Page', img: '/portfolio-odontologia.png', href: 'https://www.behance.net/gallery/245921131/Landing-Page-Odontologia' },
              { titulo: 'Landing Page – Estética', tag: 'Landing Page', img: '/portfolio-estetica.png', href: 'https://www.behance.net/gallery/245920979/Landing-Page-Esttica' },
            ].map((c, i) => (
              <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className="portfolio-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'linear-gradient(140deg,rgba(255,255,255,0.05),rgba(120,70,40,0.08),rgba(0,0,0,0.5))', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden', position: 'relative' }}>
                  <img src={c.img} alt={c.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
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

      {/* Benefícios */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>Benefícios</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.5px', marginBottom: 32 }}>
            Afinal, o que está incluso no seu site ou LP?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {beneficios.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: i < beneficios.length - 1 ? '0.5px solid #1d1d1f' : 'none' }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: BG, flexShrink: 0 }} />
                <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b' }}>{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12 }}>FAQ</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.5px', marginBottom: 32 }}>Perguntas frequentes sobre criação de sites</h2>
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
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.8px', marginBottom: 14 }}>
          Não deixe sua marca passar despercebida.
        </h2>
        <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', marginBottom: 28 }}>
          Transforme seu negócio com sites e landing pages de alta conversão!
        </p>
        <a href="https://wa.me/5541998170428" style={{ display: 'inline-block', background: BG, color: '#fff', borderRadius: 10, padding: '12px 32px', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
          Peça seu site agora no WhatsApp
        </a>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Footer />
    </main>
  )
}
