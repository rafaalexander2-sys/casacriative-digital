'use client'

// Página pública do briefing de uma tarefa.
// Quem recebe o link no WhatsApp abre aqui — sem login, sem acesso ao CRM.
// Os dados vêm da Edge Function "public-task", que só responde se o cartão
// estiver com o link ativado.

import { useEffect, useState } from 'react'
import { PUBLIC_TASK_URL, SUPABASE_ANON } from '@/lib/track'

const C = {
  bg: '#f6f7f9',
  panel: '#ffffff',
  border: '#e6e8eb',
  text: '#1f2430',
  muted: '#7b8493',
  brand: '#c47a4a',
  brandDark: '#8b4513',
}

const PRIORITY: Record<string, { label: string; color: string }> = {
  urgent: { label: 'Urgente', color: '#dc2626' },
  high: { label: 'Alta', color: '#f59e0b' },
  normal: { label: 'Normal', color: '#3b82f6' },
  low: { label: 'Baixa', color: '#94a3b8' },
}

type Payload = {
  workspace: string | null
  stage: { label: string; color: string } | null
  task: {
    title: string
    description: string | null
    priority: string
    start_date: string | null
    due_date: string | null
    tags: string[]
    estimate_hours: number | null
    assigned_to: string | null
  }
  checklist: { id: string; title: string; done: boolean }[]
  attachments: { id: string; name: string; mime_type: string | null; size_bytes: number | null; url: string | null }[]
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })

const fmtSize = (n?: number | null) =>
  n == null ? '' : n > 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`

export default function PublicTaskPage() {
  const [data, setData] = useState<Payload | null>(null)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get('t')
    if (!token) { setErr('Link incompleto. Peça o link novamente a quem enviou.'); setLoading(false); return }

    fetch(PUBLIC_TASK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON },
      body: JSON.stringify({ token }),
    })
      .then(async r => {
        const j = await r.json().catch(() => ({}))
        if (!r.ok || j.error) throw new Error(j.error || 'Não consegui carregar esta tarefa.')
        setData(j)
      })
      .catch(e => setErr(e.message))
      .finally(() => setLoading(false))
  }, [])

  const wrap: React.CSSProperties = {
    background: C.bg, minHeight: '100vh', fontFamily: 'Outfit, system-ui, sans-serif',
    color: C.text, padding: '24px 16px 48px',
  }
  const card: React.CSSProperties = {
    maxWidth: 620, margin: '0 auto', background: C.panel, border: `1px solid ${C.border}`,
    borderRadius: 16, padding: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
  }

  if (loading) {
    return (
      <main style={wrap}>
        <div style={{ ...card, textAlign: 'center', color: C.muted, fontSize: 14 }}>A carregar…</div>
      </main>
    )
  }

  if (err || !data) {
    return (
      <main style={wrap}>
        <div style={{ ...card, textAlign: 'center' }}>
          <p style={{ fontSize: 32, marginBottom: 10 }}>🔒</p>
          <h1 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>Tarefa indisponível</h1>
          <p style={{ fontSize: 14, color: C.muted }}>{err}</p>
        </div>
      </main>
    )
  }

  const { task, checklist, attachments, stage, workspace } = data
  const prio = PRIORITY[task.priority] ?? PRIORITY.normal
  const doneCount = checklist.filter(i => i.done).length
  const imgs = attachments.filter(a => a.mime_type?.startsWith('image/') && a.url)
  const docs = attachments.filter(a => !a.mime_type?.startsWith('image/') && a.url)

  return (
    <main style={wrap}>
      <div style={{ maxWidth: 620, margin: '0 auto 14px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 800 }}>
          <span style={{ color: C.brand }}>Casa</span> Criative
        </span>
        {workspace && <span style={{ fontSize: 12, color: C.muted, marginLeft: 'auto' }}>{workspace}</span>}
      </div>

      <article style={card}>
        {/* etiquetas + estado */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12, alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 700, padding: '3px 9px', borderRadius: 6, background: prio.color + '1a', color: prio.color }}>
            <span style={{ width: 6, height: 6, borderRadius: 3, background: prio.color }} />
            {prio.label}
          </span>
          {stage && (
            <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 6, background: stage.color + '1a', color: stage.color }}>{stage.label}</span>
          )}
          {task.tags?.map(t => (
            <span key={t} style={{ fontSize: 10, fontWeight: 600, letterSpacing: '.03em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 5, background: '#eef2f7', color: '#5b6472' }}>{t}</span>
          ))}
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.25, textWrap: 'balance', marginBottom: 14 }}>{task.title}</h1>

        {/* dados objetivos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 20 }}>
          {task.due_date && <Info k="Entrega" v={fmtDate(task.due_date)} strong />}
          {task.start_date && <Info k="Início" v={fmtDate(task.start_date)} />}
          {task.estimate_hours != null && <Info k="Estimativa" v={`${task.estimate_hours}h`} />}
          {task.assigned_to && <Info k="Responsável" v={task.assigned_to} />}
        </div>

        {task.description && (
          <section style={{ marginBottom: 22 }}>
            <p style={sectionLabel}>Briefing</p>
            <p style={{ fontSize: 15, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{task.description}</p>
          </section>
        )}

        {checklist.length > 0 && (
          <section style={{ marginBottom: 22 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
              <p style={{ ...sectionLabel, margin: 0 }}>O que precisa ser feito</p>
              <span style={{ fontSize: 11, color: C.muted, marginLeft: 'auto', fontVariantNumeric: 'tabular-nums' }}>{doneCount}/{checklist.length}</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: '#e6e8eb', overflow: 'hidden', marginBottom: 10 }}>
              <div style={{ width: `${(doneCount / checklist.length) * 100}%`, height: '100%', background: doneCount === checklist.length ? '#22c55e' : C.brand }} />
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {checklist.map(i => (
                <li key={i.id} style={{ display: 'flex', gap: 9, alignItems: 'flex-start', fontSize: 14 }}>
                  <span style={{ color: i.done ? '#22c55e' : '#cbd5e1', flexShrink: 0, lineHeight: 1.5 }}>{i.done ? '☑' : '☐'}</span>
                  <span style={{ color: i.done ? C.muted : C.text, textDecoration: i.done ? 'line-through' : 'none', lineHeight: 1.5 }}>{i.title}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {imgs.length > 0 && (
          <section style={{ marginBottom: 20 }}>
            <p style={sectionLabel}>Referências</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
              {imgs.map(a => (
                <a key={a.id} href={a.url!} target="_blank" rel="noreferrer" style={{ display: 'block', borderRadius: 10, overflow: 'hidden', border: `1px solid ${C.border}` }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.url!} alt={a.name} style={{ width: '100%', height: 140, objectFit: 'cover', display: 'block' }} />
                </a>
              ))}
            </div>
          </section>
        )}

        {docs.length > 0 && (
          <section>
            <p style={sectionLabel}>Arquivos</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {docs.map(a => (
                <a key={a.id} href={a.url!} target="_blank" rel="noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', border: `1px solid ${C.border}`, borderRadius: 8, textDecoration: 'none', color: C.text, fontSize: 14 }}>
                  <span>📎</span>
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.name}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>{fmtSize(a.size_bytes)}</span>
                </a>
              ))}
            </div>
          </section>
        )}
      </article>

      <p style={{ maxWidth: 620, margin: '16px auto 0', fontSize: 11, color: C.muted, textAlign: 'center' }}>
        Link somente-leitura. Dúvidas sobre a tarefa? Fale com quem enviou.
      </p>
    </main>
  )
}

function Info({ k, v, strong }: { k: string; v: string; strong?: boolean }) {
  return (
    <div>
      <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '.06em', color: C.muted, fontWeight: 600, marginBottom: 2 }}>{k}</p>
      <p style={{ fontSize: 14, fontWeight: strong ? 700 : 500, color: strong ? C.brandDark : C.text }}>{v}</p>
    </div>
  )
}

const sectionLabel: React.CSSProperties = {
  fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em',
  color: C.muted, fontWeight: 700, margin: '0 0 8px',
}
