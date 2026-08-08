'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { INGEST_URL } from '@/lib/track'
import {
  getMyWorkspaces,
  getLeads,
  createLead,
  updateLeadStatus,
  deleteLead,
  acceptMyInvitations,
  isAgencyMember,
  createClient,
  listMembers,
  listInvitations,
  cancelInvitation,
  removeMember,
  addPerson,
  getStages,
  canManageFunnel,
  createStage,
  updateStage,
  deleteStage,
  reorderStages,
  updateLead,
  getLeadEvents,
  addNote,
} from '@/lib/crm-api'
import {
  SOURCE_LABELS,
  ROLE_LABELS,
  KIND_LABELS,
  DEAL_TYPE_LABELS,
  type Lead,
  type LeadSource,
  type Workspace,
  type Member,
  type Invitation,
  type MemberRole,
  type PipelineStage,
  type StageKind,
  type DealType,
  type LeadEvent,
} from '@/lib/crm-types'

// ---- design tokens (estilo Pipedrive, claro) ----
const C = {
  bg: '#f6f7f9',
  panel: '#ffffff',
  border: '#e6e8eb',
  text: '#1f2430',
  muted: '#7b8493',
  brand: '#c47a4a',
  brandDark: '#8b4513',
  col: '#eceef1',
}
const BRL = (n?: number | null) =>
  n == null ? '—' : n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

type View = 'pipeline' | 'relatorios' | 'clientes' | 'config'

export default function CrmPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false) })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  return (
    <>
      <MotionStyles />
      {loading ? <SkeletonApp /> : session ? <App session={session} /> : <Login />}
    </>
  )
}

function Center({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ background: C.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, system-ui, sans-serif' }}>
      {children}
    </main>
  )
}

// ---- Motion: keyframes + utilitários (injetado uma vez) ----
function MotionStyles() {
  return (
    <style>{`
      @keyframes cc-fade-up { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: none } }
      @keyframes cc-overlay-in { from { opacity: 0 } to { opacity: 1 } }
      @keyframes cc-modal-in { from { opacity: 0; transform: translateY(10px) scale(.985) } to { opacity: 1; transform: none } }
      @keyframes cc-shimmer { 0% { background-position: -450px 0 } 100% { background-position: 450px 0 } }
      @keyframes cc-spin { to { transform: rotate(360deg) } }
      .cc-fade-up { animation: cc-fade-up .28s cubic-bezier(.2,0,0,1) both }
      .cc-overlay { animation: cc-overlay-in .18s ease both }
      .cc-modal { animation: cc-modal-in .26s cubic-bezier(.2,0,0,1) both }
      .cc-card { transition: transform .16s cubic-bezier(.2,0,0,1), box-shadow .16s ease }
      .cc-card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(20,30,50,.12) }
      .cc-card:active { transform: scale(.99) }
      .cc-btn { transition: transform .12s ease, filter .16s ease, opacity .16s ease }
      .cc-btn:hover:not(:disabled) { filter: brightness(1.06) }
      .cc-btn:active:not(:disabled) { transform: translateY(1px) scale(.99) }
      .cc-btn:disabled { opacity: .65; cursor: default }
      .cc-nav { transition: background .16s ease, color .16s ease }
      .cc-nav:hover { background: rgba(196,122,74,.08) }
      .cc-skel { background: linear-gradient(90deg,#e9ebee 25%,#f4f6f8 37%,#e9ebee 63%); background-size: 900px 100%; animation: cc-shimmer 1.25s infinite linear; border-radius: 8px }
      .cc-spin { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.45); border-top-color: #fff; border-radius: 50%; animation: cc-spin .7s linear infinite; vertical-align: -2px }
      .cc-spin-dark { border-color: rgba(31,36,48,.25); border-top-color: ${C.brand} }
      /* feedback global consistente */
      button { transition: filter .15s ease, transform .1s ease, background .15s ease, opacity .15s ease }
      button:active:not(:disabled) { transform: translateY(1px) }
      input, select, textarea { transition: border-color .15s ease, box-shadow .15s ease }
      input:focus, select:focus, textarea:focus { border-color: ${C.brand}; box-shadow: 0 0 0 3px rgba(196,122,74,.14) }
      @media (prefers-reduced-motion: reduce) {
        *, *::before, *::after { animation-duration: .001ms !important; animation-iteration-count: 1 !important; transition-duration: .001ms !important }
      }
    `}</style>
  )
}

function Spinner({ dark }: { dark?: boolean }) {
  return <span className={dark ? 'cc-spin cc-spin-dark' : 'cc-spin'} aria-label="a carregar" />
}

// ---- Skeleton do app inteiro (carregamento inicial) ----
function SkeletonApp() {
  return (
    <main style={{ display: 'flex', height: '100vh', background: C.bg, fontFamily: 'Outfit, system-ui, sans-serif', overflow: 'hidden' }}>
      <aside style={{ width: 224, flexShrink: 0, background: C.panel, borderRight: `1px solid ${C.border}`, padding: 18 }}>
        <div className="cc-skel" style={{ height: 22, width: 140, marginBottom: 22 }} />
        <div className="cc-skel" style={{ height: 38, marginBottom: 18 }} />
        {[0, 1, 2, 3].map(i => <div key={i} className="cc-skel" style={{ height: 34, marginBottom: 8 }} />)}
      </aside>
      <section style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ height: 60, borderBottom: `1px solid ${C.border}`, background: C.panel, display: 'flex', alignItems: 'center', padding: '0 20px' }}>
          <div className="cc-skel" style={{ height: 20, width: 120 }} />
        </div>
        <div style={{ display: 'flex', gap: 12, padding: 16 }}>
          {[0, 1, 2, 3, 4].map(c => <SkeletonColumn key={c} />)}
        </div>
      </section>
    </main>
  )
}

function SkeletonColumn() {
  return (
    <div style={{ width: 264, flexShrink: 0, background: C.col, borderRadius: 12, padding: 12 }}>
      <div className="cc-skel" style={{ height: 16, width: 100, marginBottom: 14 }} />
      {[0, 1, 2].map(i => <div key={i} className="cc-skel" style={{ height: 64, marginBottom: 8, background: '#e3e6ea', borderRadius: 8 }} />)}
    </div>
  )
}

// ================================================================ LOGIN
function Login() {
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr(''); setMsg('')
    if (mode === 'password') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setErr(error.message)
    } else {
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.href : undefined } })
      if (error) setErr(error.message); else setMsg('Enviámos um link de acesso para o seu e-mail.')
    }
    setBusy(false)
  }

  return (
    <Center>
      <form onSubmit={signIn} className="cc-fade-up" style={{ width: '100%', maxWidth: 380, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32, display: 'flex', flexDirection: 'column', gap: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 2 }}>
          <span style={{ color: C.brand }}>CRM</span> Casa Criative
        </div>
        <p style={{ color: C.muted, fontSize: 14, marginBottom: 10 }}>{mode === 'password' ? 'Entre com seu e-mail e senha.' : 'Receba um link de acesso no e-mail.'}</p>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="E-mail" required style={input} />
        {mode === 'password' && <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Senha" required style={input} />}
        {err && <p style={{ color: '#dc2626', fontSize: 13 }}>{err}</p>}
        {msg && <p style={{ color: '#16a34a', fontSize: 13 }}>{msg}</p>}
        <button type="submit" disabled={busy} className="cc-btn" style={btn}>{busy ? <Spinner /> : mode === 'password' ? 'Entrar' : 'Enviar link'}</button>
        <button type="button" onClick={() => { setMode(mode === 'password' ? 'magic' : 'password'); setErr(''); setMsg('') }} style={linkBtn}>
          {mode === 'password' ? 'Entrar com link mágico (sem senha)' : 'Entrar com senha'}
        </button>
      </form>
    </Center>
  )
}

// ================================================================ APP SHELL
function App({ session }: { session: Session }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [wsId, setWsId] = useState('')
  const [isAgency, setIsAgency] = useState(false)
  const [view, setView] = useState<View>('pipeline')
  const [leads, setLeads] = useState<Lead[]>([])
  const [leadsLoading, setLeadsLoading] = useState(true)
  const [stages, setStages] = useState<PipelineStage[]>([])
  const [canManage, setCanManage] = useState(false)
  const [err, setErr] = useState('')

  const loadWorkspaces = useCallback(() => {
    return getMyWorkspaces().then(ws => {
      setWorkspaces(ws)
      setWsId(cur => cur || ws[0]?.id || '')
      return ws
    }).catch(e => setErr(e.message))
  }, [])

  useEffect(() => {
    acceptMyInvitations().catch(() => {})
      .then(() => loadWorkspaces())
      .then(() => isAgencyMember().then(setIsAgency).catch(() => {}))
  }, [loadWorkspaces])

  const refreshLeads = useCallback((id: string) => {
    if (!id) return
    setLeadsLoading(true)
    getLeads(id).then(setLeads).catch(e => setErr(e.message)).finally(() => setLeadsLoading(false))
  }, [])
  const loadStages = useCallback((id: string) => {
    if (!id) return
    getStages(id).then(setStages).catch(e => setErr(e.message))
    canManageFunnel(id).then(setCanManage).catch(() => setCanManage(false))
  }, [])
  useEffect(() => { refreshLeads(wsId); loadStages(wsId) }, [wsId, refreshLeads, loadStages])

  const ws = workspaces.find(w => w.id === wsId)
  const nav: { id: View; label: string; icon: string; agency?: boolean }[] = [
    { id: 'pipeline', label: 'Pipeline', icon: '▦' },
    { id: 'relatorios', label: 'Relatórios', icon: '▤' },
    { id: 'clientes', label: 'Clientes', icon: '◍', agency: true },
    { id: 'config', label: 'Configurações', icon: '⚙' },
  ]

  return (
    <main style={{ display: 'flex', height: '100vh', background: C.bg, color: C.text, fontFamily: 'Outfit, system-ui, sans-serif', overflow: 'hidden' }}>
      {/* SIDEBAR */}
      <aside style={{ width: 224, flexShrink: 0, background: C.panel, borderRight: `1px solid ${C.border}`, display: 'flex', flexDirection: 'column', padding: '18px 14px' }}>
        <div style={{ fontSize: 20, fontWeight: 800, padding: '0 8px 16px' }}>
          <span style={{ color: C.brand }}>CRM</span> <span style={{ color: C.text }}>Casa Criative</span>
        </div>

        {/* workspace selector */}
        <label style={{ fontSize: 11, color: C.muted, padding: '0 8px 4px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Espaço</label>
        <select value={wsId} onChange={e => setWsId(e.target.value)} style={{ ...input, padding: '9px 10px', marginBottom: 16 }}>
          {workspaces.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>

        {/* nav */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {nav.filter(n => !n.agency || isAgency).map(n => (
            <button key={n.id} onClick={() => setView(n.id)} className="cc-nav" style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: 14, fontFamily: 'inherit', textAlign: 'left',
              background: view === n.id ? 'rgba(196,122,74,0.12)' : 'transparent',
              color: view === n.id ? C.brandDark : C.text, fontWeight: view === n.id ? 600 : 500,
            }}>
              <span style={{ width: 18, textAlign: 'center', opacity: .8 }}>{n.icon}</span>{n.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', borderTop: `1px solid ${C.border}`, paddingTop: 12 }}>
          <p style={{ fontSize: 12, color: C.muted, padding: '0 8px 8px', wordBreak: 'break-all' }}>{session.user.email}</p>
          <button onClick={() => supabase.auth.signOut()} style={{ ...linkBtn, textAlign: 'left', padding: '0 8px' }}>Sair</button>
        </div>
      </aside>

      {/* MAIN */}
      <section style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        {err && <div style={{ background: '#fef2f2', color: '#dc2626', fontSize: 13, padding: '8px 20px', borderBottom: `1px solid ${C.border}` }}>{err}</div>}
        <div key={view} className="cc-fade-up" style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
          {view === 'pipeline' && <PipelineView wsId={wsId} leads={leads} setLeads={setLeads} stages={stages} leadsLoading={leadsLoading} canManage={canManage} onStagesChanged={() => loadStages(wsId)} onErr={setErr} />}
          {view === 'relatorios' && <ReportsView ws={ws} leads={leads} stages={stages} />}
          {view === 'clientes' && isAgency && <ClientsView workspaces={workspaces} onChanged={loadWorkspaces} />}
          {view === 'config' && <SettingsView session={session} ws={ws} leads={leads} />}
        </div>
      </section>
    </main>
  )
}

// ================================================================ PIPELINE
function PipelineView({ wsId, leads, setLeads, stages, leadsLoading, canManage, onStagesChanged, onErr }: {
  wsId: string; leads: Lead[]; setLeads: React.Dispatch<React.SetStateAction<Lead[]>>
  stages: PipelineStage[]; leadsLoading: boolean; canManage: boolean; onStagesChanged: () => void; onErr: (m: string) => void
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [showFunnel, setShowFunnel] = useState(false)
  const [dragId, setDragId] = useState<string | null>(null)
  const [selected, setSelected] = useState<Lead | null>(null)

  const onDrop = async (stage: PipelineStage) => {
    const lead = leads.find(l => l.id === dragId); setDragId(null)
    if (!lead || lead.status === stage.key) return
    setLeads(ls => ls.map(l => l.id === lead.id ? { ...l, status: stage.key } : l))
    try { await updateLeadStatus(lead, stage) } catch (e: any) { onErr(e.message) }
  }
  const onDelete = async (lead: Lead) => {
    if (!confirm(`Apagar o lead "${lead.name}"? Esta ação não pode ser desfeita.`)) return
    setLeads(ls => ls.filter(l => l.id !== lead.id))
    try { await deleteLead(lead.id) } catch (e: any) { onErr(e.message) }
  }

  const wonKeys = stages.filter(s => s.kind === 'won').map(s => s.key)
  const closedKeys = stages.filter(s => s.kind !== 'open').map(s => s.key)
  const ganho = leads.filter(l => wonKeys.includes(l.status)).reduce((s, l) => s + (l.value ?? 0), 0)
  const emAberto = leads.filter(l => !closedKeys.includes(l.status)).length

  return (
    <>
      <Topbar title="Pipeline" right={
        <>
          <Stat label="Em aberto" value={String(emAberto)} />
          <Stat label="Ganho" value={BRL(ganho)} color="#16a34a" />
          {canManage && <button onClick={() => setShowFunnel(true)} className="cc-btn" style={{ ...btnGhost, width: 'auto', padding: '9px 14px' }}>Editar funil</button>}
          <button onClick={() => setShowAdd(true)} className="cc-btn" style={{ ...btn, width: 'auto', padding: '9px 16px' }}>+ Lead</button>
        </>
      } />

      <div style={{ flex: 1, overflow: 'hidden', padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, height: '100%', overflowX: 'auto', paddingBottom: 4 }}>
          {stages.map(stage => {
            const col = leads.filter(l => l.status === stage.key)
            const colVal = col.reduce((s, l) => s + (l.value ?? 0), 0)
            return (
              <div key={stage.id} onDragOver={e => e.preventDefault()} onDrop={() => onDrop(stage)}
                style={{ width: 264, flexShrink: 0, background: C.col, borderRadius: 12, display: 'flex', flexDirection: 'column', maxHeight: '100%' }}>
                <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: `2px solid ${stage.color}` }}>
                  <span style={{ width: 8, height: 8, borderRadius: 4, background: stage.color }} />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{stage.label}</span>
                  <span style={{ fontSize: 12, color: C.muted, marginLeft: 'auto' }}>{col.length}</span>
                </div>
                {colVal > 0 && <div style={{ fontSize: 11, color: C.muted, padding: '6px 14px 0' }}>{BRL(colVal)}</div>}
                <div style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
                  {leadsLoading && [0, 1].map(i => <div key={i} className="cc-skel" style={{ height: 64, background: '#e3e6ea' }} />)}
                  {!leadsLoading && col.map(lead => (
                    <div key={lead.id} draggable onDragStart={() => setDragId(lead.id)} onClick={() => setSelected(lead)} className="cc-card cc-fade-up"
                      style={{ background: C.panel, borderRadius: 8, padding: 12, cursor: 'grab', border: `1px solid ${C.border}`, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                        <b style={{ fontSize: 14 }}>{lead.name}</b>
                        <button onClick={e => { e.stopPropagation(); onDelete(lead) }} title="Apagar" style={{ background: 'none', border: 'none', color: '#cbd0d6', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
                      </div>
                      {lead.company && <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{lead.company}</p>}
                      <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 5, background: 'rgba(196,122,74,0.12)', color: C.brandDark }}>{SOURCE_LABELS[lead.source]}</span>
                        {lead.value != null && <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 700 }}>{BRL(lead.value)}</span>}
                      </div>
                      {(lead.phone || lead.email) && <p style={{ fontSize: 11, color: '#9aa1ab', marginTop: 6 }}>{lead.phone || lead.email}</p>}
                    </div>
                  ))}
                  {!leadsLoading && col.length === 0 && <p style={{ fontSize: 12, color: '#b6bcc4', textAlign: 'center', padding: 10 }}>vazio</p>}
                </div>
              </div>
            )
          })}
          {stages.length === 0 && <p style={{ fontSize: 13, color: C.muted, padding: 20 }}>Sem etapas. Rode o SQL schema-stages.sql.</p>}
        </div>
      </div>

      {showAdd && <AddLead firstStage={stages[0]?.key} onClose={() => setShowAdd(false)} onCreate={async input => {
        const lead = await createLead(wsId, input); setLeads(ls => [lead, ...ls]); setShowAdd(false)
      }} />}

      {showFunnel && <FunnelEditor wsId={wsId} stages={stages} onClose={() => setShowFunnel(false)} onChanged={onStagesChanged} />}

      {selected && <LeadDetail lead={selected} stages={stages}
        onClose={() => setSelected(null)}
        onSaved={u => { setLeads(ls => ls.map(l => l.id === u.id ? u : l)); setSelected(u) }}
        onDeleted={id => { setLeads(ls => ls.filter(l => l.id !== id)); setSelected(null) }} />}
    </>
  )
}

// ================================================================ LEAD DETAIL + HISTÓRICO
function LeadDetail({ lead, stages, onClose, onSaved, onDeleted }: {
  lead: Lead; stages: PipelineStage[]
  onClose: () => void; onSaved: (l: Lead) => void; onDeleted: (id: string) => void
}) {
  const [f, setF] = useState({
    name: lead.name, company: lead.company ?? '', email: lead.email ?? '', phone: lead.phone ?? '',
    value: lead.value != null ? String(lead.value) : '', service: lead.service ?? '',
    deal_type: (lead.deal_type ?? '') as '' | DealType, source: lead.source, notes: lead.notes ?? '',
  })
  const [events, setEvents] = useState<LeadEvent[]>([])
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const loadEvents = useCallback(() => { getLeadEvents(lead.id).then(setEvents).catch(() => {}) }, [lead.id])
  useEffect(() => { loadEvents() }, [loadEvents])

  const stageLabel = stages.find(s => s.key === lead.status)?.label ?? lead.status

  const save = async () => {
    setBusy(true); setErr('')
    try {
      const u = await updateLead(lead.id, {
        name: f.name, company: f.company || null, email: f.email || null, phone: f.phone || null,
        value: f.value ? Number(f.value) : null, service: f.service || null,
        deal_type: (f.deal_type || null) as DealType | null, source: f.source, notes: f.notes || null,
      })
      onSaved(u)
    } catch (e: any) { setErr(e.message) }
    setBusy(false)
  }

  const submitNote = async () => {
    if (!note.trim()) return
    try { await addNote(lead, note.trim()); setNote(''); loadEvents() } catch (e: any) { setErr(e.message) }
  }

  const fmtEvent = (ev: LeadEvent) => {
    if (ev.type === 'note') return ev.message
    if (ev.type === 'status_change') {
      const to = stages.find(s => s.key === ev.to_status)?.label ?? ev.to_status
      const from = stages.find(s => s.key === ev.from_status)?.label ?? ev.from_status
      return `Etapa: ${from ?? '—'} → ${to}`
    }
    if (ev.type === 'created') return 'Lead criado'
    return ev.type
  }
  const when = (iso: string) => new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })

  return (
    <div onClick={onClose} className="cc-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 50 }}>
      <div onClick={e => e.stopPropagation()} className="cc-modal" style={{ width: '100%', maxWidth: 560, maxHeight: '88vh', overflow: 'auto', background: C.panel, borderRadius: 16, padding: 24, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ fontSize: 11, color: C.muted }}>Etapa atual: <b style={{ color: C.text }}>{stageLabel}</b></span>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20 }}>×</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
          <input value={f.name} onChange={e => setF({ ...f, name: e.target.value })} placeholder="Nome" style={{ ...input, gridColumn: '1 / -1' }} />
          <input value={f.company} onChange={e => setF({ ...f, company: e.target.value })} placeholder="Empresa" style={input} />
          <input value={f.service} onChange={e => setF({ ...f, service: e.target.value })} placeholder="Serviço" style={input} />
          <input value={f.email} onChange={e => setF({ ...f, email: e.target.value })} placeholder="E-mail" style={input} />
          <input value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} placeholder="Telefone" style={input} />
          <input value={f.value} onChange={e => setF({ ...f, value: e.target.value })} type="number" placeholder="Valor (R$)" style={input} />
          <select value={f.deal_type} onChange={e => setF({ ...f, deal_type: e.target.value as DealType | '' })} style={input}>
            <option value="">Cobrança…</option>
            {Object.entries(DEAL_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
          <select value={f.source} onChange={e => setF({ ...f, source: e.target.value as LeadSource })} style={{ ...input, gridColumn: '1 / -1' }}>
            {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <textarea value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} placeholder="Anotações (resumo)" rows={2} style={{ ...input, resize: 'vertical', marginBottom: 8 }} />
        {err && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 8 }}>{err}</p>}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          <button onClick={() => { if (confirm(`Apagar o lead "${lead.name}"?`)) { deleteLead(lead.id).then(() => onDeleted(lead.id)) } }} style={{ ...btnGhost, width: 'auto', padding: '10px 14px', color: '#dc2626' }}>Apagar</button>
          <button onClick={save} disabled={busy} className="cc-btn" style={{ ...btn, marginLeft: 'auto', width: 'auto', padding: '10px 22px' }}>{busy ? <Spinner /> : 'Salvar'}</button>
        </div>

        <p style={label}>Histórico</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input value={note} onChange={e => setNote(e.target.value)} placeholder="Adicionar nota…" style={{ ...input, flex: 1 }} onKeyDown={e => e.key === 'Enter' && submitNote()} />
          <button onClick={submitNote} className="cc-btn" style={{ ...btn, width: 'auto', padding: '10px 16px' }}>Nota</button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {events.length === 0 && <p style={{ fontSize: 13, color: C.muted }}>Sem eventos ainda.</p>}
          {events.map(ev => (
            <div key={ev.id} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: `1px solid ${C.border}` }}>
              <span style={{ width: 8, height: 8, borderRadius: 4, background: ev.type === 'note' ? C.brand : ev.type === 'status_change' ? '#3b82f6' : '#cbd5e1', marginTop: 5, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, color: C.text }}>{fmtEvent(ev)}</p>
                <p style={{ fontSize: 11, color: C.muted }}>{when(ev.created_at)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ---- Editor do funil (etapas) ----
function FunnelEditor({ wsId, stages, onClose, onChanged }: { wsId: string; stages: PipelineStage[]; onClose: () => void; onChanged: () => void }) {
  const [list, setList] = useState<PipelineStage[]>(stages)
  const [newLabel, setNewLabel] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const reload = () => getStages(wsId).then(l => { setList(l); onChanged() }).catch(e => setErr(e.message))

  const add = async () => {
    if (!newLabel.trim()) return
    setBusy(true); setErr('')
    try { await createStage(wsId, { label: newLabel.trim(), position: list.length + 1 }); setNewLabel(''); await reload() }
    catch (e: any) { setErr(e.message) }
    setBusy(false)
  }
  const patch = async (id: string, p: Partial<PipelineStage>) => {
    setList(ls => ls.map(s => s.id === id ? { ...s, ...p } : s))
    try { await updateStage(id, p as any); onChanged() } catch (e: any) { setErr(e.message) }
  }
  const remove = async (id: string) => {
    if (!confirm('Apagar esta etapa? Os leads nela ficam sem etapa.')) return
    try { await deleteStage(id); await reload() } catch (e: any) { setErr(e.message) }
  }
  const move = async (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= list.length) return
    const next = [...list]; [next[i], next[j]] = [next[j], next[i]]
    setList(next)
    try { await reorderStages(next); onChanged() } catch (e: any) { setErr(e.message) }
  }

  return (
    <Modal onClose={onClose}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Editar funil</h2>
        <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 20 }}>×</button>
      </div>
      {err && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 8 }}>{err}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14, maxHeight: '50vh', overflowY: 'auto' }}>
        {list.map((s, i) => (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 6, border: `1px solid ${C.border}`, borderRadius: 8, padding: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <button onClick={() => move(i, -1)} disabled={i === 0} style={arrowBtn}>▲</button>
              <button onClick={() => move(i, 1)} disabled={i === list.length - 1} style={arrowBtn}>▼</button>
            </div>
            <input type="color" value={s.color} onChange={e => patch(s.id, { color: e.target.value })} style={{ width: 30, height: 30, border: 'none', background: 'none', cursor: 'pointer', padding: 0 }} />
            <input value={s.label} onChange={e => setList(ls => ls.map(x => x.id === s.id ? { ...x, label: e.target.value } : x))} onBlur={e => patch(s.id, { label: e.target.value })} style={{ ...input, flex: 1 }} />
            <select value={s.kind} onChange={e => patch(s.id, { kind: e.target.value as StageKind })} style={{ ...input, width: 'auto' }}>
              {Object.entries(KIND_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <button onClick={() => remove(s.id)} style={{ background: 'none', border: 'none', color: '#cbd0d6', cursor: 'pointer', fontSize: 18 }}>×</button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Nova etapa" style={{ ...input, flex: 1 }} onKeyDown={e => e.key === 'Enter' && add()} />
        <button onClick={add} disabled={busy} style={{ ...btn, width: 'auto', padding: '10px 18px' }}>+ Etapa</button>
      </div>
      <p style={{ fontSize: 11, color: C.muted, marginTop: 10 }}>Dica: marque uma etapa como <b>Ganho</b> ou <b>Perdido</b> — é o que conta na conversão e no que volta pro Meta/Google.</p>
    </Modal>
  )
}

// ================================================================ RELATÓRIOS
function ReportsView({ ws, leads, stages }: { ws?: Workspace; leads: Lead[]; stages: PipelineStage[] }) {
  const wonKeys = stages.filter(s => s.kind === 'won').map(s => s.key)
  const lostKeys = stages.filter(s => s.kind === 'lost').map(s => s.key)
  const closedKeys = [...wonKeys, ...lostKeys]
  const total = leads.length
  const won = leads.filter(l => wonKeys.includes(l.status))
  const lost = leads.filter(l => lostKeys.includes(l.status))
  const open = leads.filter(l => !closedKeys.includes(l.status))
  const wonVal = won.reduce((s, l) => s + (l.value ?? 0), 0)
  const openVal = open.reduce((s, l) => s + (l.value ?? 0), 0)
  const conv = won.length + lost.length > 0 ? Math.round((won.length / (won.length + lost.length)) * 100) : 0
  const ticket = won.length ? wonVal / won.length : 0

  const bySource = (Object.keys(SOURCE_LABELS) as LeadSource[])
    .map(s => ({ s, n: leads.filter(l => l.source === s).length })).filter(x => x.n > 0)
  const maxSource = Math.max(1, ...bySource.map(x => x.n))

  return (
    <>
      <Topbar title="Relatórios" subtitle={ws?.name} />
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
          <Card title="Total de leads" value={String(total)} />
          <Card title="Em aberto" value={String(open.length)} sub={BRL(openVal) + ' em pipeline'} />
          <Card title="Ganhos" value={String(won.length)} sub={BRL(wonVal)} color="#16a34a" />
          <Card title="Perdidos" value={String(lost.length)} color="#dc2626" />
          <Card title="Taxa de conversão" value={conv + '%'} />
          <Card title="Ticket médio" value={BRL(ticket)} />
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '4px 0 12px' }}>Por etapa</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24, maxWidth: 560 }}>
          {stages.map(s => {
            const n = leads.filter(l => l.status === s.key).length
            const pct = total ? (n / total) * 100 : 0
            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ width: 100, fontSize: 13, color: C.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.label}</span>
                <div style={{ flex: 1, background: C.col, borderRadius: 6, height: 20, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: s.color, transition: 'width .3s' }} />
                </div>
                <span style={{ width: 28, textAlign: 'right', fontSize: 13, fontWeight: 600 }}>{n}</span>
              </div>
            )
          })}
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 700, margin: '4px 0 12px' }}>Por origem</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 560 }}>
          {bySource.length === 0 && <p style={{ fontSize: 13, color: C.muted }}>Sem dados ainda.</p>}
          {bySource.map(({ s, n }) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ width: 90, fontSize: 13, color: C.muted }}>{SOURCE_LABELS[s]}</span>
              <div style={{ flex: 1, background: C.col, borderRadius: 6, height: 20, overflow: 'hidden' }}>
                <div style={{ width: `${(n / maxSource) * 100}%`, height: '100%', background: C.brand }} />
              </div>
              <span style={{ width: 28, textAlign: 'right', fontSize: 13, fontWeight: 600 }}>{n}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

// ================================================================ CONFIGURAÇÕES + BACKUP
function SettingsView({ session, ws, leads }: { session: Session; ws?: Workspace; leads: Lead[] }) {
  const exportCsv = () => {
    const cols = ['name', 'company', 'email', 'phone', 'source', 'status', 'value', 'created_at']
    const rows = leads.map(l => cols.map(c => JSON.stringify((l as any)[c] ?? '')).join(','))
    download(`leads-${ws?.name ?? 'export'}.csv`, [cols.join(','), ...rows].join('\n'), 'text/csv')
  }
  const exportJson = () => download(`backup-${ws?.name ?? 'export'}.json`, JSON.stringify(leads, null, 2), 'application/json')

  return (
    <>
      <Topbar title="Configurações" />
      <div style={{ flex: 1, overflow: 'auto', padding: 20, maxWidth: 640 }}>
        <Section title="Conta">
          <Row k="E-mail" v={session.user.email ?? ''} />
          <Row k="Espaço atual" v={ws?.name ?? '—'} />
        </Section>

        <Section title="Backup / Exportar">
          <p style={{ fontSize: 13, color: C.muted, marginBottom: 12 }}>Baixe os leads deste espaço. O JSON pode ser guardado como backup.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={exportCsv} style={{ ...btn, width: 'auto', padding: '10px 16px' }}>Exportar CSV</button>
            <button onClick={exportJson} style={{ ...btnGhost, width: 'auto', padding: '10px 16px' }}>Backup JSON</button>
          </div>
        </Section>
      </div>
    </>
  )
}

// ================================================================ CLIENTES (agência)
function ClientsView({ workspaces, onChanged }: { workspaces: Workspace[]; onChanged: () => void }) {
  // agência primeiro (equipe interna), depois os clientes
  const ordered = [...workspaces].sort((a, b) => Number(b.is_agency) - Number(a.is_agency) || a.name.localeCompare(b.name))
  const [selected, setSelected] = useState<Workspace | null>(ordered[0] ?? null)
  const [newName, setNewName] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => { if (!selected && ordered[0]) setSelected(ordered[0]) }, [ordered, selected])

  const addClient = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('')
    if (!newName.trim()) return
    try { const w = await createClient(newName.trim()); setNewName(''); await onChanged(); setSelected(w) }
    catch (e: any) { setErr(e.message) }
  }

  return (
    <>
      <Topbar title="Clientes" right={
        <form onSubmit={addClient} style={{ display: 'flex', gap: 8 }}>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Novo cliente" style={{ ...input, width: 180 }} />
          <button type="submit" style={{ ...btn, width: 'auto', padding: '9px 16px' }}>+ Cliente</button>
        </form>
      } />
      {err && <p style={{ color: '#dc2626', fontSize: 13, padding: '8px 20px' }}>{err}</p>}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <div style={{ width: 220, flexShrink: 0, borderRight: `1px solid ${C.border}`, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {ordered.map(c => (
            <button key={c.id} onClick={() => setSelected(c)} style={{
              textAlign: 'left', background: selected?.id === c.id ? 'rgba(196,122,74,0.12)' : 'transparent',
              color: selected?.id === c.id ? C.brandDark : C.text, fontWeight: selected?.id === c.id ? 600 : 500,
              border: 'none', borderRadius: 8, padding: '10px 12px', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.name}</span>
              {c.is_agency && <span style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em', color: '#fff', background: C.brand, borderRadius: 4, padding: '2px 5px' }}>Equipe</span>}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {selected ? <MembersPanel workspace={selected} /> : <p style={{ fontSize: 13, color: C.muted }}>Selecione um cliente.</p>}
        </div>
      </div>
    </>
  )
}

function MembersPanel({ workspace }: { workspace: Workspace }) {
  const [members, setMembers] = useState<Member[]>([])
  const [invites, setInvites] = useState<Invitation[]>([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<MemberRole>('member')
  const [err, setErr] = useState('')
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [busy, setBusy] = useState(false)

  const load = useCallback(() => {
    setErr('')
    Promise.all([listMembers(workspace.id), listInvitations(workspace.id)])
      .then(([m, i]) => { setMembers(m); setInvites(i) }).catch(e => setErr(e.message))
  }, [workspace.id])
  useEffect(() => { load(); setLink('') }, [load])

  const invite = async (e: React.FormEvent) => {
    e.preventDefault(); setErr(''); setLink(''); setCopied(false)
    if (!email.trim()) return
    setBusy(true)
    try { const r = await addPerson(workspace.id, email, role); setEmail(''); setLink(r.link); load() }
    catch (e: any) { setErr(e.message) }
    setBusy(false)
  }
  const copy = async () => { try { await navigator.clipboard.writeText(link); setCopied(true) } catch {} }

  return (
    <div>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>{workspace.name}</h3>
      <form onSubmit={invite} style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="e-mail da pessoa" style={{ ...input, flex: '1 1 180px' }} />
        <select value={role} onChange={e => setRole(e.target.value as MemberRole)} style={{ ...input, width: 'auto' }}>
          {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button type="submit" disabled={busy} className="cc-btn" style={{ ...btn, width: 'auto', padding: '10px 18px' }}>{busy ? <Spinner /> : 'Adicionar'}</button>
      </form>
      {err && <p style={{ color: '#dc2626', fontSize: 13, marginBottom: 8 }}>{err}</p>}
      {link && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 12, marginBottom: 12 }}>
          <p style={{ fontSize: 12, color: '#16a34a', marginBottom: 8 }}>✓ Conta criada. Envie este link à pessoa (ex.: WhatsApp):</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <input readOnly value={link} onClick={e => (e.target as HTMLInputElement).select()} style={{ ...input, flex: 1, fontSize: 12 }} />
            <button type="button" onClick={copy} style={{ ...btn, width: 'auto', padding: '10px 16px' }}>{copied ? 'Copiado!' : 'Copiar'}</button>
          </div>
        </div>
      )}

      <p style={label}>Membros</p>
      {members.length === 0 && <p style={{ fontSize: 13, color: C.muted }}>Ninguém ainda.</p>}
      {members.map(m => (
        <div key={m.user_id} style={rowLine}>
          <span style={{ fontSize: 14 }}>{m.email}</span>
          <span style={{ fontSize: 11, color: C.brand }}>{ROLE_LABELS[m.role]}</span>
          <button onClick={async () => { await removeMember(workspace.id, m.user_id); load() }} style={smallLink}>remover</button>
        </div>
      ))}

      {invites.length > 0 && (
        <>
          <p style={label}>Convites pendentes</p>
          {invites.map(i => (
            <div key={i.id} style={rowLine}>
              <span style={{ fontSize: 14, color: C.muted }}>{i.email}</span>
              <span style={{ fontSize: 11, color: C.brand }}>{ROLE_LABELS[i.role]}</span>
              <button onClick={async () => { await cancelInvitation(i.id); load() }} style={smallLink}>cancelar</button>
            </div>
          ))}
        </>
      )}

      <IngestBox workspace={workspace} />
    </div>
  )
}

// Webhook de captação: liga formulários/LPs deste cliente ao CRM
function IngestBox({ workspace }: { workspace: Workspace }) {
  const [copied, setCopied] = useState('')
  const token = workspace.ingest_token
  const copy = (text: string, tag: string) => { navigator.clipboard.writeText(text).then(() => { setCopied(tag); setTimeout(() => setCopied(''), 1500) }).catch(() => {}) }
  const snippet = `fetch("${INGEST_URL}", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    token: "${token ?? 'RODE_O_SQL_schema-ingest'}",
    name: "Nome do lead",
    email: "email@exemplo.com",
    phone: "+55 ...",
    source: "form"
  })
})`

  return (
    <div style={{ marginTop: 22, borderTop: `1px solid ${C.border}`, paddingTop: 16 }}>
      <p style={label}>Captação de leads (webhook)</p>
      <p style={{ fontSize: 13, color: C.muted, marginBottom: 10 }}>Use isto para ligar formulários/landing pages deste cliente. Todo lead cai direto aqui.</p>
      {!token && <p style={{ fontSize: 12, color: '#dc2626', marginBottom: 8 }}>Rode o SQL <b>schema-ingest.sql</b> no Supabase para gerar o token.</p>}
      <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input readOnly value={INGEST_URL} onClick={e => (e.target as HTMLInputElement).select()} style={{ ...input, flex: 1, fontSize: 12 }} />
        <button type="button" onClick={() => copy(INGEST_URL, 'url')} style={{ ...btnGhost, width: 'auto', padding: '10px 14px' }}>{copied === 'url' ? '✓' : 'URL'}</button>
      </div>
      {token && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <input readOnly value={token} onClick={e => (e.target as HTMLInputElement).select()} style={{ ...input, flex: 1, fontSize: 12 }} />
          <button type="button" onClick={() => copy(token, 'tok')} style={{ ...btnGhost, width: 'auto', padding: '10px 14px' }}>{copied === 'tok' ? '✓' : 'Token'}</button>
        </div>
      )}
      <details style={{ marginTop: 4 }}>
        <summary style={{ fontSize: 12, color: C.brand, cursor: 'pointer' }}>Ver exemplo de código</summary>
        <pre style={{ background: '#0f1420', color: '#cbd5e1', fontSize: 11, padding: 12, borderRadius: 8, overflow: 'auto', marginTop: 8 }}>{snippet}</pre>
        <button type="button" onClick={() => copy(snippet, 'code')} style={{ ...btnGhost, width: 'auto', padding: '8px 14px', marginTop: 6 }}>{copied === 'code' ? 'Copiado!' : 'Copiar código'}</button>
      </details>
    </div>
  )
}

// ================================================================ ADD LEAD
function AddLead({ firstStage, onClose, onCreate }: { firstStage?: string; onClose: () => void; onCreate: (i: Partial<Lead> & { name: string }) => Promise<void> }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', company: '', source: 'manual' as LeadSource, value: '', service: '', deal_type: '' as '' | DealType, notes: '' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setBusy(true); setErr('')
    try {
      await onCreate({ name: f.name, email: f.email || null, phone: f.phone || null, company: f.company || null, source: f.source, value: f.value ? Number(f.value) : null, service: f.service || null, deal_type: f.deal_type || null, notes: f.notes || null, ...(firstStage ? { status: firstStage } : {}) })
    } catch (e: any) { setErr(e.message); setBusy(false) }
  }

  return (
    <Modal onClose={onClose}>
      <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Novo lead</h2>
        <input placeholder="Nome *" required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} style={input} />
        <input placeholder="Empresa" value={f.company} onChange={e => setF({ ...f, company: e.target.value })} style={input} />
        <input placeholder="E-mail" type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} style={input} />
        <input placeholder="Telefone / WhatsApp" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} style={input} />
        <input placeholder="Serviço (ex.: Tráfego Pago)" value={f.service} onChange={e => setF({ ...f, service: e.target.value })} style={input} />
        <div style={{ display: 'flex', gap: 8 }}>
          <input placeholder="Valor (R$)" type="number" value={f.value} onChange={e => setF({ ...f, value: e.target.value })} style={{ ...input, flex: 1 }} />
          <select value={f.deal_type} onChange={e => setF({ ...f, deal_type: e.target.value as DealType | '' })} style={{ ...input, flex: 1 }}>
            <option value="">Cobrança…</option>
            {Object.entries(DEAL_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <textarea placeholder="Anotações" value={f.notes} onChange={e => setF({ ...f, notes: e.target.value })} rows={2} style={{ ...input, resize: 'vertical' }} />
        <select value={f.source} onChange={e => setF({ ...f, source: e.target.value as LeadSource })} style={input}>
          {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        {err && <p style={{ color: '#dc2626', fontSize: 13 }}>{err}</p>}
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <button type="button" onClick={onClose} style={btnGhost}>Cancelar</button>
          <button type="submit" disabled={busy} className="cc-btn" style={btn}>{busy ? <Spinner /> : 'Criar'}</button>
        </div>
      </form>
    </Modal>
  )
}

// ================================================================ UI helpers
function Topbar({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  return (
    <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: `1px solid ${C.border}`, background: C.panel, minHeight: 60 }}>
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 12, color: C.muted }}>{subtitle}</p>}
      </div>
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 18 }}>{right}</div>
    </header>
  )
}
function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return <span style={{ fontSize: 13, color: C.muted }}>{label}: <b style={{ color: color ?? C.text }}>{value}</b></span>
}
function Card({ title, value, sub, color }: { title: string; value: string; sub?: string; color?: string }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16 }}>
      <p style={{ fontSize: 12, color: C.muted, marginBottom: 6 }}>{title}</p>
      <p style={{ fontSize: 24, fontWeight: 800, color: color ?? C.text }}>{value}</p>
      {sub && <p style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{sub}</p>}
    </div>
  )
}
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 18, marginBottom: 16 }}>
      <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>{title}</h3>
      {children}
    </div>
  )
}
function Row({ k, v }: { k: string; v: string }) {
  return <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 14 }}><span style={{ color: C.muted }}>{k}</span><span>{v}</span></div>
}
function Modal({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <div onClick={onClose} className="cc-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(15,20,30,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 50 }}>
      <div onClick={e => e.stopPropagation()} className="cc-modal" style={{ width: '100%', maxWidth: 420, background: C.panel, borderRadius: 16, padding: 28, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>{children}</div>
    </div>
  )
}
function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }))
  const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url)
}

// ---- estilos base ----
const input: React.CSSProperties = { width: '100%', background: '#fff', border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, color: C.text, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }
const btn: React.CSSProperties = { flex: 1, background: `linear-gradient(135deg,#e8c49a 0%,#c47a4a 55%,#8b4513 100%)`, color: '#fff', border: 'none', borderRadius: 8, padding: '11px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }
const btnGhost: React.CSSProperties = { flex: 1, background: '#eef0f3', color: C.text, border: 'none', borderRadius: 8, padding: '11px 18px', fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }
const linkBtn: React.CSSProperties = { background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }
const label: React.CSSProperties = { fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', color: C.muted, margin: '16px 0 6px' }
const rowLine: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: 8, padding: '9px 0', borderBottom: `1px solid ${C.border}` }
const smallLink: React.CSSProperties = { marginLeft: 'auto', background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }
const arrowBtn: React.CSSProperties = { background: 'none', border: 'none', color: C.muted, cursor: 'pointer', fontSize: 9, lineHeight: 1, padding: 1 }
