import Image from 'next/image'

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'

export default function About() {
  return (
    <section style={{ background: '#000', padding: '100px 0' }}>
      <div className="r2" style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px', gap: 40, alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#555', marginBottom: 16 }}>Quem somos</p>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: 16 }}>
            Criatividade que move negócios.
          </h2>
          <p style={{ fontSize: 15, fontWeight: 300, color: '#86868b', lineHeight: 1.7, marginBottom: 16 }}>
            A Casa Criative é uma agência digital de Curitiba obcecada por resultado. Combinamos estratégia, design e tecnologia para colocar sua marca onde ela precisa estar, na frente do cliente certo, na hora certa.
          </p>
          <p style={{ fontSize: 15, fontWeight: 300, color: '#86868b', lineHeight: 1.7 }}>
            Não fazemos volume. Fazemos impacto. Cada projeto recebe atenção total, do primeiro briefing à última entrega.
          </p>
        </div>
        <div className="about-img" style={{ position: 'relative', height: 360, borderRadius: 10, overflow: 'hidden', background: 'linear-gradient(135deg, #1a1a1a 0%, #2a1a0a 50%, #1a1a1a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '0.5px solid #3a3a3c' }}>
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 28, fontWeight: 700, background: BG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.8px', marginBottom: 8 }}>
              Casa Criative
            </p>
            <p style={{ fontSize: 12, color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase' as const }}>
              Digital · Curitiba, PR
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}