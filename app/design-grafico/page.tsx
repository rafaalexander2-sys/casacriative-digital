import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ServiceHero from '@/components/ServiceHero'
import BrandReveal from '@/components/BrandReveal'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Design Gráfico e Identidade Visual | Casa Criative Digital',
  description: 'Criação de identidade visual, logotipo, materiais gráficos e design para redes sociais. Marca que vende em Curitiba.',
}

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

const servicos = [
  { tag: 'Branding', titulo: 'Identidade visual completa', desc: 'Logotipo, paleta de cores, tipografia, manual de marca e aplicações.' },
  { tag: 'Social Media', titulo: 'Templates para redes sociais', desc: 'Pacote de posts, stories e capas alinhados à identidade da sua marca.' },
  { tag: 'Impresso', titulo: 'Materiais impressos', desc: 'Cartão de visita, flyer, banner, folder e qualquer material offline.' },
  { tag: 'UI Design', titulo: 'Interface de sites e apps', desc: 'Wireframes e protótipos de alta fidelidade com foco em usabilidade.' },
]

const etapas = [
  { num: '01', titulo: 'Briefing criativo', desc: 'Entendemos seus valores, público, referências e objetivos antes de criar.' },
  { num: '02', titulo: 'Pesquisa e conceito', desc: 'Analisamos concorrentes e desenvolvemos o conceito criativo da marca.' },
  { num: '03', titulo: 'Apresentação', desc: 'Apresentamos propostas de design com justificativa de cada escolha.' },
  { num: '04', titulo: 'Refinamento', desc: 'Ajustamos com base no feedback até o resultado ser exatamente o que você precisa.' },
  { num: '05', titulo: 'Entrega dos arquivos', desc: 'Todos os formatos: PNG, SVG, PDF, AI e pacote completo de marca.' },
]

export default function DesignGrafico() {
  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <Navbar />

      <section style={{ paddingTop: 52, background: '#050505' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <BrandReveal />
        </div>
      </section>

      <ServiceHero compact
        tag="Design Gráfico"
        title="Identidade visual"
        highlight="que vende."
        desc="Design estratégico que comunica os valores da sua marca e gera reconhecimento. Do logotipo ao material impresso."
        ctaLabel="Quero minha identidade visual"
        ctaHref="/contato"
      />

      {/* Serviços */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12, textAlign: 'center' }}>O que criamos</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.5px', textAlign: 'center', marginBottom: 40 }}>Design para todas as frentes.</h2>
          <div className="r2" style={{ gap: 12 }}>
            {servicos.map((s, i) => (
              <div key={i} style={{ background: 'linear-gradient(140deg,rgba(255,255,255,0.05),rgba(120,70,40,0.08),rgba(0,0,0,0.5))', border: '0.5px solid rgba(255,210,160,0.12)', borderRadius: 16, padding: '24px 20px' }}>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c47a4a', marginBottom: 8 }}>{s.tag}</p>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f5f5f7', letterSpacing: '-0.2px', marginBottom: 8 }}>{s.titulo}</h3>
                <p style={{ fontSize: 13, fontWeight: 300, color: '#86868b', lineHeight: 1.65 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processo */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12, textAlign: 'center' }}>Processo criativo</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.5px', textAlign: 'center', marginBottom: 40 }}>Do conceito à entrega.</h2>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {etapas.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 28, padding: '22px 0', borderBottom: i < etapas.length - 1 ? '0.5px solid #1d1d1f' : 'none' }}>
                <p style={{ fontSize: 10, fontWeight: 600, color: '#555', letterSpacing: '0.1em', minWidth: 24 }}>{e.num}</p>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: '#f5f5f7', marginBottom: 5 }}>{e.titulo}</h3>
                  <p style={{ fontSize: 13, fontWeight: 300, color: '#86868b', lineHeight: 1.65 }}>{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfólio */}
      <section style={{ borderTop: '0.5px solid #1d1d1f', padding: '80px 24px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#555', marginBottom: 12, textAlign: 'center' }}>Portfólio</p>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.5px', textAlign: 'center', marginBottom: 14 }}>Cases de Design Gráfico</h2>
          <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', lineHeight: 1.75, marginBottom: 40, textAlign: 'center' }}>
            Identidades visuais, materiais gráficos e designs que fizeram a diferença para nossos clientes.
          </p>
          <div className="r3" style={{ gap: 12 }}>
            {[
              { titulo: 'Branding & Social Media – 4A Studio Feminino', tag: 'Branding', href: 'https://www.behance.net/gallery/191063317/Branding-Social-Media-4A-Studio-Feminino' },
              { titulo: 'Assessoria de Marketing – DMove', tag: 'Design Gráfico', href: 'https://www.behance.net/gallery/163229265/ASSESSORIA-DE-MARKETING-DMOVE' },
              { titulo: 'Página Revista', tag: 'Editorial', href: 'https://www.behance.net/gallery/156691977/Pagina-Revista' },
            ].map((c, i) => (
              <a key={i} href={c.href} target="_blank" rel="noopener noreferrer" className="portfolio-card" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'linear-gradient(140deg,rgba(255,255,255,0.05),rgba(120,70,40,0.08),rgba(0,0,0,0.5))', borderRadius: 12, overflow: 'hidden' }}>
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
        <h2 style={{ fontSize: 26, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.8px', marginBottom: 12 }}>Sua marca profissional começa aqui.</h2>
        <p style={{ fontSize: 14, fontWeight: 300, color: '#86868b', marginBottom: 28 }}>Orçamento em 24h. Sem compromisso.</p>
        <a href="/contato" style={{ display: 'inline-block', background: BG, color: '#fff', borderRadius: 10, padding: '12px 32px', fontSize: 14, fontWeight: 500, textDecoration: 'none' }}>
          Solicitar orçamento
        </a>
      </section>

      <Footer />
    </main>
  )
}
