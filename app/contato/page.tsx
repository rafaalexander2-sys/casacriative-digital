'use client'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'
const BRONZE = { background: BG, WebkitBackgroundClip: 'text' as const, WebkitTextFillColor: 'transparent' as const, backgroundClip: 'text' as const }

const servicos = ['Tráfego Pago', 'Sites & Landing Pages', 'SEO', 'Social Media', 'Design Gráfico', 'Pacote Completo']

const contatos = [
  { label: 'WhatsApp', valor: '+55 (41) 99817-0428', href: 'https://wa.me/5541998170428' },
  { label: 'E-mail', valor: 'contato@casacriative.com.br', href: 'mailto:contato@casacriative.com.br' },
  { label: 'Horário', valor: 'Seg–Sex, 9h às 17h', href: null },
  { label: 'Localização', valor: 'Curitiba, PR — Brasil', href: null },
]

export default function Contato() {
  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>
      <style>{`
        .contact-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 0.5px solid rgba(255,210,160,0.2);
          border-radius: 10px;
          padding: 13px 16px;
          font-size: 14px;
          color: #fff;
          outline: none;
          font-family: inherit;
          transition: border-color 0.2s;
          box-sizing: border-box;
        }
        .contact-input:focus { border-color: rgba(255,210,160,0.5); }
        .contact-input::placeholder { color: rgba(255,255,255,0.28); }
        .contact-select {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 0.5px solid rgba(255,210,160,0.2);
          border-radius: 10px;
          padding: 13px 16px;
          color: rgba(255,255,255,0.5);
          outline: none;
          font-family: inherit;
          font-size: 14px;
          cursor: pointer;
          box-sizing: border-box;
        }
        .contact-select option { background: #1a1a1a; color: #fff; }
        .glass-card-contact {
          position: relative;
          border-radius: 16px;
          background: linear-gradient(140deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 20%, rgba(120,70,40,0.08) 40%, rgba(0,0,0,0.6) 80%);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          padding: 40px;
          overflow: hidden;
          border: 0.5px solid rgba(255,210,160,0.15);
        }
        .glass-card-contact::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 16px;
          background: radial-gradient(circle at 20% 10%, rgba(255,220,180,0.25) 0%, transparent 28%);
          pointer-events: none;
        }
      `}</style>

      <Navbar />

      {/* Hero */}
      <section style={{ padding: '140px 24px 80px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#c47a4a', marginBottom: 16 }}>
          Contato
        </p>
        <h1 style={{ fontSize: 48, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-2px', lineHeight: 1.05, maxWidth: 600, margin: '0 auto 20px' }}>
          Vamos fazer sua<br />
          <span style={{ background: BG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            marca crescer.
          </span>
        </h1>
        <p style={{ fontSize: 17, fontWeight: 300, color: '#86868b', lineHeight: 1.65, maxWidth: 460, margin: '0 auto' }}>
          Sem compromisso. A primeira conversa é totalmente gratuita.
        </p>
      </section>

      {/* Formulário + Info */}
      <section style={{ padding: '0 24px 100px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 40, alignItems: 'start' }}>

          {/* Info */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28, marginBottom: 40 }}>
              {contatos.map((c, i) => (
                <div key={i}>
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555', marginBottom: 4 }}>{c.label}</p>
                  {c.href
                    ? <a href={c.href} style={{ fontSize: 15, textDecoration: 'none', ...BRONZE }}>{c.valor}</a>
                    : <p style={{ fontSize: 15, color: '#86868b' }}>{c.valor}</p>
                  }
                </div>
              ))}
            </div>

            <div style={{ height: '0.5px', background: 'linear-gradient(90deg,transparent,#c47a4a,transparent)', marginBottom: 28 }} />

            <p style={{ fontSize: 13, fontWeight: 300, color: '#555', lineHeight: 1.7 }}>
              Respondemos em até 24h úteis. Para urgências, use o WhatsApp.
            </p>
          </div>

          {/* Formulário */}
          <div className="glass-card-contact">
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: BG, borderRadius: '16px 16px 0 0' }} />
            <form onSubmit={e => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: '#f5f5f7', letterSpacing: '-0.5px', marginBottom: 4 }}>Envie sua mensagem</h2>
              <p style={{ fontSize: 13, fontWeight: 300, color: '#86868b', marginBottom: 12 }}>Preencha abaixo e retornamos em até 24h.</p>
              <input className="contact-input" type="text" placeholder="Nome completo" required />
              <input className="contact-input" type="email" placeholder="E-mail" required />
              <input className="contact-input" type="tel" placeholder="Telefone / WhatsApp" />
              <input className="contact-input" type="text" placeholder="Instagram (@suamarca)" />
              <input className="contact-input" type="text" placeholder="Nicho de atuação" />
              <select className="contact-select">
                <option value="" disabled>Serviço de interesse</option>
                {servicos.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <button type="submit" style={{ background: BG, color: '#fff', border: 'none', borderRadius: 10, padding: '14px 28px', fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', marginTop: 6 }}>
                Enviar mensagem
              </button>
            </form>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}
