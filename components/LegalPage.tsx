import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

export interface LegalSection {
  h: string
  body: React.ReactNode
}

export default function LegalPage({ title, updatedAt, intro, sections }: {
  title: string
  updatedAt: string
  intro?: React.ReactNode
  sections: LegalSection[]
}) {
  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <Navbar />
      <section style={{ padding: '120px 24px 100px' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <h1 style={{ fontSize: 34, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-1px', marginBottom: 8 }}>
            <span style={{ background: BG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{title}</span>
          </h1>
          <p style={{ fontSize: 13, color: '#555', marginBottom: 40 }}>Última atualização: {updatedAt}</p>

          {intro && <p style={{ fontSize: 15, fontWeight: 300, color: '#a1a1a6', lineHeight: 1.75, marginBottom: 36 }}>{intro}</p>}

          {sections.map((s, i) => (
            <div key={i} style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 18, fontWeight: 600, color: '#f5f5f7', marginBottom: 12 }}>{i + 1}. {s.h}</h2>
              <div style={{ fontSize: 15, fontWeight: 300, color: '#a1a1a6', lineHeight: 1.75 }}>{s.body}</div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </main>
  )
}
