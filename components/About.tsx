
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
        <div className="about-img" style={{ borderRadius: 10, overflow: 'hidden', border: '0.5px solid #3a3a3c', minHeight: 300 }}>
          <img src="/quemsomos.jpeg" alt="Equipe Casa Criative Digital" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom', display: 'block' }} />
        </div>
      </div>
    </section>
  )
}