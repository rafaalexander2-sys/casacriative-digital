'use client'

import { useState, useEffect, useCallback } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = {
  name: string
  enabled: boolean
  investimento: string
  impressoes: string
  alcance: string
  cliques: string
  ctr: string
  cpm: string
  cpc: string
  conversoes: string
  cpa: string
  roas: string
  destaque: string
}

type ReportData = {
  cliente: string
  mes: string
  ano: string
  objetivo: string
  resumo: string
  meta: Platform
  google: Platform
  linkedin: Platform
  observacoes: string
  proximosPassos: string
  gestora: string
}

// ─── Default data ─────────────────────────────────────────────────────────────

function emptyPlatform(name: string): Platform {
  return {
    name,
    enabled: false,
    investimento: '',
    impressoes: '',
    alcance: '',
    cliques: '',
    ctr: '',
    cpm: '',
    cpc: '',
    conversoes: '',
    cpa: '',
    roas: '',
    destaque: '',
  }
}

const defaultData: ReportData = {
  cliente: '',
  mes: '',
  ano: new Date().getFullYear().toString(),
  objetivo: '',
  resumo: '',
  meta: { ...emptyPlatform('Meta Ads'), enabled: true },
  google: emptyPlatform('Google Ads'),
  linkedin: emptyPlatform('LinkedIn Ads'),
  observacoes: '',
  proximosPassos: '',
  gestora: '',
}

const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(v: string, prefix = '') {
  if (!v) return '—'
  return prefix + v
}

function totalInvestimento(d: ReportData) {
  const vals = ['meta', 'google', 'linkedin'].flatMap((k) => {
    const p = d[k as keyof ReportData] as Platform
    if (!p.enabled || !p.investimento) return []
    return [parseFloat(p.investimento.replace(',', '.')) || 0]
  })
  if (!vals.length) return null
  return vals.reduce((a, b) => a + b, 0)
}

function bestRoas(d: ReportData) {
  const vals = ['meta', 'google', 'linkedin'].flatMap((k) => {
    const p = d[k as keyof ReportData] as Platform
    if (!p.enabled || !p.roas) return []
    return [{ name: p.name, v: parseFloat(p.roas.replace(',', '.')) || 0 }]
  })
  if (!vals.length) return null
  return vals.reduce((a, b) => (b.v > a.v ? b : a))
}

function totalConversoes(d: ReportData) {
  const vals = ['meta', 'google', 'linkedin'].flatMap((k) => {
    const p = d[k as keyof ReportData] as Platform
    if (!p.enabled || !p.conversoes) return []
    return [parseInt(p.conversoes) || 0]
  })
  if (!vals.length) return null
  return vals.reduce((a, b) => a + b, 0)
}

// ─── Components ───────────────────────────────────────────────────────────────

function Field({
  label, value, onChange, placeholder = '', type = 'text', textarea = false, rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  type?: string
  textarea?: boolean
  rows?: number
}) {
  const base: React.CSSProperties = {
    width: '100%',
    background: 'var(--nowa-paper)',
    border: '1px solid var(--nowa-bone)',
    borderRadius: 6,
    padding: '8px 12px',
    fontSize: 13,
    color: 'var(--nowa-ink)',
    fontFamily: 'inherit',
    outline: 'none',
    resize: textarea ? 'vertical' : undefined,
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--nowa-stone)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </label>
      {textarea ? (
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          style={base}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={base}
        />
      )}
    </div>
  )
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: 36, height: 20, borderRadius: 10,
          background: value ? 'var(--nowa-indigo)' : 'var(--nowa-bone)',
          position: 'relative', transition: '200ms',
        }}
      >
        <div style={{
          position: 'absolute', top: 3, left: value ? 19 : 3,
          width: 14, height: 14, borderRadius: 7,
          background: '#fff', transition: '200ms',
        }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--nowa-graphite)' }}>{label}</span>
    </label>
  )
}

function PlatformForm({
  platform, onChange,
}: {
  platform: Platform
  onChange: (p: Platform) => void
}) {
  const set = (k: keyof Platform) => (v: string | boolean) =>
    onChange({ ...platform, [k]: v })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Toggle label="Ativar plataforma" value={platform.enabled} onChange={set('enabled') as (v: boolean) => void} />
      {platform.enabled && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Investimento (€)" value={platform.investimento} onChange={set('investimento') as (v: string) => void} placeholder="ex: 350,00" />
            <Field label="ROAS" value={platform.roas} onChange={set('roas') as (v: string) => void} placeholder="ex: 4.2" />
            <Field label="Impressões" value={platform.impressoes} onChange={set('impressoes') as (v: string) => void} placeholder="ex: 85000" />
            <Field label="Alcance" value={platform.alcance} onChange={set('alcance') as (v: string) => void} placeholder="ex: 42000" />
            <Field label="Cliques" value={platform.cliques} onChange={set('cliques') as (v: string) => void} placeholder="ex: 1200" />
            <Field label="CTR (%)" value={platform.ctr} onChange={set('ctr') as (v: string) => void} placeholder="ex: 1,4" />
            <Field label="CPM (€)" value={platform.cpm} onChange={set('cpm') as (v: string) => void} placeholder="ex: 3.80" />
            <Field label="CPC (€)" value={platform.cpc} onChange={set('cpc') as (v: string) => void} placeholder="ex: 0.29" />
            <Field label="Conversões" value={platform.conversoes} onChange={set('conversoes') as (v: string) => void} placeholder="ex: 28" />
            <Field label="CPA (€)" value={platform.cpa} onChange={set('cpa') as (v: string) => void} placeholder="ex: 12,50" />
          </div>
          <Field label="Destaque do mês" value={platform.destaque} onChange={set('destaque') as (v: string) => void} placeholder="ex: Campanha de remarketing com ROAS 6.1" textarea rows={2} />
        </>
      )}
    </div>
  )
}

// ─── Report Preview ────────────────────────────────────────────────────────────

function KPICard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="kpi-card" style={{
      background: 'var(--nowa-lavender-pale)',
      border: '1px solid var(--nowa-lavender-mute)',
      borderRadius: 12,
      padding: '24px 20px',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--nowa-stone)' }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--nowa-ink)', lineHeight: 1.1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--nowa-stone)' }}>{sub}</div>}
    </div>
  )
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '8px 0', borderBottom: '1px solid var(--nowa-bone)' }}>
      <span style={{ fontSize: 13, color: 'var(--nowa-stone)' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--nowa-ink)' }}>{value}</span>
    </div>
  )
}

const PLATFORM_COLORS: Record<string, string> = {
  'Meta Ads': '#1877F2',
  'Google Ads': '#4285F4',
  'LinkedIn Ads': '#0A66C2',
}

function PlatformSection({ platform }: { platform: Platform }) {
  if (!platform.enabled) return null
  const color = PLATFORM_COLORS[platform.name] || 'var(--nowa-indigo)'

  return (
    <div className="platform-section" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        marginBottom: 20, paddingBottom: 16,
        borderBottom: `3px solid ${color}`,
      }}>
        <div style={{
          width: 10, height: 10, borderRadius: '50%',
          background: color, flexShrink: 0,
        }} />
        <h3 style={{
          fontFamily: 'var(--font-display)', fontWeight: 700,
          fontSize: 22, color: 'var(--nowa-ink)', margin: 0,
        }}>{platform.name}</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 32px' }}>
        <div>
          {platform.investimento && <MetricRow label="Investimento" value={`€ ${platform.investimento}`} />}
          {platform.impressoes && <MetricRow label="Impressões" value={parseInt(platform.impressoes).toLocaleString('pt-PT')} />}
          {platform.alcance && <MetricRow label="Alcance" value={parseInt(platform.alcance).toLocaleString('pt-PT')} />}
          {platform.cliques && <MetricRow label="Cliques" value={parseInt(platform.cliques).toLocaleString('pt-PT')} />}
          {platform.ctr && <MetricRow label="CTR" value={`${platform.ctr}%`} />}
        </div>
        <div>
          {platform.roas && <MetricRow label="ROAS" value={`${platform.roas}×`} />}
          {platform.cpm && <MetricRow label="CPM" value={`€ ${platform.cpm}`} />}
          {platform.cpc && <MetricRow label="CPC" value={`€ ${platform.cpc}`} />}
          {platform.conversoes && <MetricRow label="Conversões" value={platform.conversoes} />}
          {platform.cpa && <MetricRow label="CPA" value={`€ ${platform.cpa}`} />}
        </div>
      </div>

      {platform.destaque && (
        <div style={{
          marginTop: 16,
          padding: '12px 16px',
          background: `${color}10`,
          borderLeft: `3px solid ${color}`,
          borderRadius: '0 6px 6px 0',
          fontSize: 13,
          color: 'var(--nowa-graphite)',
        }}>
          <strong style={{ color: 'var(--nowa-ink)' }}>Destaque · </strong>{platform.destaque}
        </div>
      )}
    </div>
  )
}

function Report({ data }: { data: ReportData }) {
  const totalInv = totalInvestimento(data)
  const totalConv = totalConversoes(data)
  const topRoas = bestRoas(data)

  return (
    <div id="report-output" style={{
      fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
      color: 'var(--nowa-ink)',
      background: '#fff',
      width: '794px', /* A4 em 96dpi */
      minHeight: '1123px',
    }}>

      {/* CAPA */}
      <div style={{
        background: 'var(--nowa-mono-bg)',
        minHeight: 340,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '48px 56px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Detalhe decorativo */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 260, height: 260,
          borderRadius: '50%',
          background: 'var(--nowa-indigo)',
          opacity: 0.15,
        }} />
        <div style={{
          position: 'absolute', bottom: -40, right: 80,
          width: 140, height: 140,
          borderRadius: '50%',
          background: 'var(--nowa-lavender)',
          opacity: 0.08,
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--nowa-stone)', marginBottom: 16 }}>
            Relatório de Performance · Mídia Paga
          </div>
          <h1 style={{
            fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif',
            fontWeight: 900, fontStyle: 'italic',
            fontSize: 56, lineHeight: 1.05,
            color: 'var(--nowa-lavender)',
            margin: '0 0 20px',
          }}>
            {data.cliente || 'Nome do Cliente'}
          </h1>
          <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <div style={{ fontSize: 16, color: 'var(--nowa-mist)' }}>
              {data.mes && data.ano ? `${data.mes} ${data.ano}` : 'Período'}
            </div>
            {data.objetivo && (
              <>
                <div style={{ width: 1, height: 16, background: 'var(--nowa-stone)' }} />
                <div style={{ fontSize: 13, color: 'var(--nowa-stone)' }}>{data.objetivo}</div>
              </>
            )}
          </div>
        </div>

        {/* Rodapé da capa */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '16px 56px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.14em', color: 'var(--nowa-lavender)', textTransform: 'uppercase' }}>
            NOWA
          </div>
          {data.gestora && (
            <div style={{ fontSize: 11, color: 'var(--nowa-stone)' }}>Gestora · {data.gestora}</div>
          )}
        </div>
      </div>

      {/* CORPO */}
      <div style={{ padding: '48px 56px', display: 'flex', flexDirection: 'column', gap: 48 }}>

        {/* Resumo executivo */}
        <section>
          <h2 style={{
            fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif',
            fontSize: 28, fontWeight: 700,
            color: 'var(--nowa-ink)',
            margin: '0 0 8px',
          }}>Resumo Executivo</h2>
          <div style={{ width: 48, height: 3, background: 'var(--nowa-indigo)', marginBottom: 24 }} />

          {/* KPIs */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            <KPICard
              label="Investimento Total"
              value={totalInv !== null ? `€ ${totalInv.toFixed(2).replace('.', ',')}` : '—'}
            />
            <KPICard
              label="Conversões"
              value={totalConv !== null ? totalConv.toString() : '—'}
            />
            <KPICard
              label="Melhor ROAS"
              value={topRoas ? `${topRoas.v}×` : '—'}
              sub={topRoas ? topRoas.name : undefined}
            />
          </div>

          {data.resumo && (
            <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--nowa-graphite)', margin: 0 }}>
              {data.resumo}
            </p>
          )}
        </section>

        {/* Plataformas */}
        {(['meta', 'google', 'linkedin'] as const).some(k => data[k].enabled) && (
          <section>
            <h2 style={{
              fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif',
              fontSize: 28, fontWeight: 700,
              color: 'var(--nowa-ink)',
              margin: '0 0 8px',
            }}>Performance por Plataforma</h2>
            <div style={{ width: 48, height: 3, background: 'var(--nowa-indigo)', marginBottom: 24 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              <PlatformSection platform={data.meta} />
              <PlatformSection platform={data.google} />
              <PlatformSection platform={data.linkedin} />
            </div>
          </section>
        )}

        {/* Observações */}
        {data.observacoes && (
          <section>
            <h2 style={{
              fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif',
              fontSize: 28, fontWeight: 700,
              color: 'var(--nowa-ink)',
              margin: '0 0 8px',
            }}>Observações</h2>
            <div style={{ width: 48, height: 3, background: 'var(--nowa-indigo)', marginBottom: 24 }} />
            <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--nowa-graphite)', margin: 0, whiteSpace: 'pre-line' }}>
              {data.observacoes}
            </p>
          </section>
        )}

        {/* Próximos passos */}
        {data.proximosPassos && (
          <section>
            <h2 style={{
              fontFamily: '"Playfair Display", "Bodoni Moda", Georgia, serif',
              fontSize: 28, fontWeight: 700,
              color: 'var(--nowa-ink)',
              margin: '0 0 8px',
            }}>Próximos Passos</h2>
            <div style={{ width: 48, height: 3, background: 'var(--nowa-indigo)', marginBottom: 24 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.proximosPassos.split('\n').filter(Boolean).map((linha, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'var(--nowa-indigo)',
                    color: '#fff', fontSize: 11, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 1,
                  }}>{i + 1}</div>
                  <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--nowa-graphite)', margin: 0 }}>{linha}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rodapé */}
        <div style={{
          marginTop: 'auto',
          paddingTop: 32,
          borderTop: '1px solid var(--nowa-bone)',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.12em', color: 'var(--nowa-indigo)', textTransform: 'uppercase' }}>NOWA</div>
            <div style={{ fontSize: 11, color: 'var(--nowa-stone)' }}>Agência de Marketing Digital</div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--nowa-mist)', textAlign: 'right' }}>
            {data.mes} {data.ano}<br />
            Documento confidencial
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'nowa_relatorio_midia'

export default function RelatorioPage() {
  const [data, setData] = useState<ReportData>(defaultData)
  const [view, setView] = useState<'form' | 'preview'>('form')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setData(JSON.parse(raw))
    } catch { /* ignore */ }
  }, [])

  const save = useCallback((d: ReportData) => {
    setData(d)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(d))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }, [])

  const set = (k: keyof ReportData) => (v: string) => save({ ...data, [k]: v })
  const setPlatform = (k: 'meta' | 'google' | 'linkedin') => (p: Platform) => save({ ...data, [k]: p })

  const handlePrint = () => {
    if (view !== 'preview') {
      setView('preview')
      setTimeout(() => window.print(), 300)
    } else {
      window.print()
    }
  }

  const handleReset = () => {
    if (confirm('Limpar todos os dados do relatório?')) {
      localStorage.removeItem(STORAGE_KEY)
      setData(defaultData)
    }
  }

  return (
    <>
      <style>{`
        :root {
          --nowa-ink:           #0B0B11;
          --nowa-mono-bg:       #0E0E12;
          --nowa-graphite:      #2A2A33;
          --nowa-stone:         #6B6B73;
          --nowa-mist:          #BFBFC4;
          --nowa-bone:          #E6E6E6;
          --nowa-paper:         #FAFAF7;
          --nowa-cream:         #F5F2EC;
          --nowa-lavender-pale: #F2EBFB;
          --nowa-lavender-mute: #DCD4F0;
          --nowa-lavender:      #E8D8F8;
          --nowa-indigo:        #4D4C9A;
          --nowa-indigo-deep:   #353377;
          --nowa-white:         #FFFFFF;
          --font-display: "Playfair Display", "Bodoni Moda", Georgia, serif;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: var(--nowa-cream); }

        @media print {
          @page { margin: 0; size: A4; }
          body { background: white; }
          #relatorio-ui { display: none !important; }
          #report-output { width: 100% !important; box-shadow: none !important; }
          .kpi-card { break-inside: avoid; }
          .platform-section { break-inside: avoid; }
        }
        @media not print {
          #report-output { box-shadow: 0 8px 48px rgba(11,11,17,0.14); }
        }
      `}</style>

      {/* UI: header + form */}
      <div id="relatorio-ui">

        {/* Header */}
        <div style={{
          background: 'var(--nowa-mono-bg)',
          padding: '16px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--nowa-stone)', textTransform: 'uppercase' }}>Nowa</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--nowa-lavender)' }}>Gerador de Relatório · Mídia Paga</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {saved && <span style={{ fontSize: 12, color: 'var(--nowa-stone)' }}>Guardado ✓</span>}
            <button
              onClick={() => setView(view === 'form' ? 'preview' : 'form')}
              style={{
                padding: '8px 16px', borderRadius: 6, border: '1px solid var(--nowa-stone)',
                background: 'transparent', color: 'var(--nowa-mist)', cursor: 'pointer', fontSize: 13,
              }}
            >
              {view === 'form' ? 'Preview' : '← Editar'}
            </button>
            <button
              onClick={handlePrint}
              style={{
                padding: '8px 16px', borderRadius: 6, border: 'none',
                background: 'var(--nowa-indigo)', color: '#fff', cursor: 'pointer', fontSize: 13, fontWeight: 700,
              }}
            >
              Imprimir / PDF
            </button>
            <button
              onClick={handleReset}
              style={{
                padding: '8px 12px', borderRadius: 6, border: '1px solid #444',
                background: 'transparent', color: 'var(--nowa-stone)', cursor: 'pointer', fontSize: 12,
              }}
            >
              Limpar
            </button>
          </div>
        </div>

        {/* Layout */}
        {view === 'form' ? (
          <div style={{ display: 'flex', gap: 0, minHeight: 'calc(100vh - 56px)' }}>

            {/* Sidebar form */}
            <div style={{
              width: 340, flexShrink: 0,
              background: 'var(--nowa-cream)',
              borderRight: '1px solid var(--nowa-bone)',
              overflowY: 'auto',
              padding: 20,
              display: 'flex', flexDirection: 'column', gap: 24,
            }}>

              {/* Geral */}
              <section>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--nowa-indigo)', marginBottom: 12 }}>Geral</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Field label="Cliente" value={data.cliente} onChange={set('cliente')} placeholder="Nome do cliente" />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--nowa-stone)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Mês</label>
                      <select
                        value={data.mes}
                        onChange={e => set('mes')(e.target.value)}
                        style={{
                          width: '100%', background: 'var(--nowa-paper)',
                          border: '1px solid var(--nowa-bone)', borderRadius: 6,
                          padding: '8px 12px', fontSize: 13, color: 'var(--nowa-ink)',
                          fontFamily: 'inherit', outline: 'none',
                        }}
                      >
                        <option value="">Mês</option>
                        {MESES.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <Field label="Ano" value={data.ano} onChange={set('ano')} placeholder="2025" />
                  </div>
                  <Field label="Objetivo da campanha" value={data.objetivo} onChange={set('objetivo')} placeholder="ex: Geração de leads" />
                  <Field label="Gestora responsável" value={data.gestora} onChange={set('gestora')} placeholder="ex: Ana Santos" />
                  <Field label="Resumo executivo" value={data.resumo} onChange={set('resumo')} placeholder="Síntese dos resultados do mês..." textarea rows={4} />
                </div>
              </section>

              {/* Meta Ads */}
              <section>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1877F2', marginBottom: 12 }}>Meta Ads</div>
                <PlatformForm platform={data.meta} onChange={setPlatform('meta')} />
              </section>

              {/* Google Ads */}
              <section>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#4285F4', marginBottom: 12 }}>Google Ads</div>
                <PlatformForm platform={data.google} onChange={setPlatform('google')} />
              </section>

              {/* LinkedIn Ads */}
              <section>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#0A66C2', marginBottom: 12 }}>LinkedIn Ads</div>
                <PlatformForm platform={data.linkedin} onChange={setPlatform('linkedin')} />
              </section>

              {/* Texto livre */}
              <section>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--nowa-indigo)', marginBottom: 12 }}>Análise</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <Field label="Observações" value={data.observacoes} onChange={set('observacoes')} placeholder="O que funcionou bem, o que pode melhorar..." textarea rows={4} />
                  <Field label="Próximos Passos" value={data.proximosPassos} onChange={set('proximosPassos')} placeholder="Uma linha por passo (Enter para separar)" textarea rows={4} />
                </div>
              </section>
            </div>

            {/* Preview ao lado */}
            <div style={{
              flex: 1, overflowY: 'auto',
              background: '#E8E8EC',
              display: 'flex', justifyContent: 'center',
              padding: '40px 24px',
            }}>
              <Report data={data} />
            </div>
          </div>
        ) : (
          <div style={{
            overflowY: 'auto',
            background: '#E8E8EC',
            display: 'flex', justifyContent: 'center',
            padding: '40px 24px',
            minHeight: 'calc(100vh - 56px)',
          }}>
            <Report data={data} />
          </div>
        )}
      </div>

      {/* Print only */}
      <div id="print-only" style={{ display: 'none' }}>
        <Report data={data} />
      </div>

      <style>{`
        @media print {
          #print-only { display: block !important; }
        }
      `}</style>
    </>
  )
}
