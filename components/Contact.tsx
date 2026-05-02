'use client'

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'
const BRONZE = { background: BG, WebkitBackgroundClip: 'text' as const, WebkitTextFillColor: 'transparent' as const, backgroundClip: 'text' as const }

const servicos = ['Tráfego Pago', 'Sites & Landing Pages', 'SEO', 'Social Media', 'Design Gráfico', 'Pacote Completo']

export default function Contact() {
  return (
    <section style={{ background: '#000', padding: '100px 0' }}>
      <style>{`
        .glass-form {
          position: relative;
          border-radius: 10px;
          background: linear-gradient(140deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 18%, rgba(120,70,40,0.08) 40%, rgba(0,0,0,0.6) 80%);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          padding: 40px;
          overflow: hidden;
        }
        .glass-form::before {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 10px;
          padding: 1px;
          background: linear-gradient(120deg, rgba(255,210,160,0.9) 0%, rgba(255,210,160,0.4) 12%, rgba(255,255,255,0.05) 28%, rgba(255,210,160,0.15) 50%, rgba(255,210,160,0) 75%);
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          pointer-events: none;
        }
        .glass-form::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 10px;
          background: radial-gradient(circle at 20% 10%, rgba(255,220,180,0.3) 0%, rgba(255,220,180,0.1) 12%, transparent 30%);
          pointer-events: none;
        }
        .form-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 0.5px solid rgba(255,210,160,0.2);
          border-radius: 10px;
          padding: 12px 16px;
          fontSize: 14px;
          color: #fff;
          outline: none;
          font-family: inherit;
          font-size: 14px;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .form-input:focus { border-color: rgba(255,210,160,0.5); }
        .form-input::placeholder { color: rgba(255,255,255,0.3); }
        .form-select {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 0.5px solid rgba(255,210,160,0.2);
          border-radius: 10px;
          padding: 12px 16px;
          color: rgba(255,255,255,0.6);
          outline: none;
          font-family: inherit;
          font-size: 14px;
          cursor: pointer;
          box-sizing: border-box;
        }
        .form-select option { background: #1a1a1a; color: #fff; }
      `}</style>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#c47a4a,#f0d5b0,#c47a4a,transparent)', marginBottom: 64 }} />

        <div className="r2" style={{ gap: 40, alignItems: 'start' }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: '#555', marginBottom: 16 }}>Contato</p>
            <h2 style={{ fontSize: 28, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.8px', lineHeight: 1.15, marginBottom: 12 }}>
              Pronto para ir ao topo?
            </h2>
            <p style={{ fontSize: 15, fontWeight: 300, color: '#86868b', lineHeight: 1.7, marginBottom: 32 }}>
              Entre em contato e descubra como transformar a presença digital do seu negócio. Sem compromisso.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 14 }}>
              {[
                { value: '+55 (41) 99817-0428', href: 'https://wa.me/5541998170428' },
                { value: 'contato@casacriative.com.br', href: 'mailto:contato@casacriative.com.br' },
                { value: 'Seg–Sex, 9h às 17h', href: null },
              ].map(item => (
                <div key={item.value} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: BG, flexShrink: 0 }} />
                  {item.href
                    ? <a href={item.href} style={{ fontSize: 14, textDecoration: 'none', ...BRONZE }}>{item.value}</a>
                    : <span style={{ fontSize: 14, color: '#86868b' }}>{item.value}</span>
                  }
                </div>
              ))}
            </div>
          </div>

          <div className="glass-form">
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: BG, borderRadius: '20px 20px 0 0' }} />
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column' as const, gap: 10, position: 'relative', zIndex: 1 }}>
              <input className="form-input" type="text" placeholder="Nome completo" />
              <input className="form-input" type="email" placeholder="E-mail" />
              <input className="form-input" type="tel" placeholder="Telefone / WhatsApp" />
              <input className="form-input" type="text" placeholder="Instagram (@suamarca)" />
              <input className="form-input" type="text" placeholder="Nicho de atuação" />
              <select className="form-select">
                <option value="" disabled selected>Serviço de interesse</option>
                {servicos.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button type="submit" style={{ background: BG, color: '#fff', border: 'none', borderRadius: 10, padding: '13px 28px', fontSize: 14, fontWeight: 500, cursor: 'pointer', width: '100%', fontFamily: 'inherit', marginTop: 6 }}>
                Enviar mensagem
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}