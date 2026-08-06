'use client'

import { useEffect, useState, useCallback } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import {
  getMyWorkspaces,
  getLeads,
  createLead,
  updateLeadStatus,
  deleteLead,
} from '@/lib/crm-api'
import {
  PIPELINE,
  STATUS_LABELS,
  STATUS_COLORS,
  SOURCE_LABELS,
  type Lead,
  type LeadStatus,
  type LeadSource,
  type Workspace,
} from '@/lib/crm-types'

const BRONZE = '#c47a4a'
const BG = 'linear-gradient(135deg,#e8c49a 0%,#c47a4a 50%,#8b4513 100%)'
const BRL = (n?: number | null) =>
  n == null ? '—' : n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function CrmPage() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => sub.subscription.unsubscribe()
  }, [])

  if (loading)
    return <Shell><p style={{ color: '#86868b' }}>A carregar…</p></Shell>

  return session ? <Board session={session} /> : <Login />
}

// ---------------------------------------------------------------- Shell
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ background: '#000', minHeight: '100vh', color: '#fff', fontFamily: 'Outfit, system-ui, sans-serif' }}>
      {children}
    </main>
  )
}

// ---------------------------------------------------------------- Login
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setErr(error.message)
    setBusy(false)
  }

  return (
    <Shell>
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <form onSubmit={signIn} style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
            <span style={{ background: BG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CRM</span> Casa Criative
          </h1>
          <p style={{ color: '#86868b', fontSize: 14, marginBottom: 12 }}>Entre com seu e-mail e senha.</p>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="E-mail" required style={inputStyle} />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Senha" required style={inputStyle} />
          {err && <p style={{ color: '#ef4444', fontSize: 13 }}>{err}</p>}
          <button type="submit" disabled={busy} style={btnStyle}>{busy ? '…' : 'Entrar'}</button>
        </form>
      </div>
    </Shell>
  )
}

// ---------------------------------------------------------------- Board
function Board({ session }: { session: Session }) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [wsId, setWsId] = useState<string>('')
  const [leads, setLeads] = useState<Lead[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [dragId, setDragId] = useState<string | null>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    getMyWorkspaces()
      .then(ws => {
        setWorkspaces(ws)
        if (ws[0]) setWsId(ws[0].id)
      })
      .catch(e => setErr(e.message))
  }, [])

  const refresh = useCallback((id: string) => {
    getLeads(id).then(setLeads).catch(e => setErr(e.message))
  }, [])

  useEffect(() => {
    if (wsId) refresh(wsId)
  }, [wsId, refresh])

  const onDrop = async (status: LeadStatus) => {
    const lead = leads.find(l => l.id === dragId)
    setDragId(null)
    if (!lead || lead.status === status) return
    setLeads(ls => ls.map(l => (l.id === lead.id ? { ...l, status } : l))) // otimista
    try {
      await updateLeadStatus(lead, status)
    } catch (e: any) {
      setErr(e.message)
      refresh(wsId)
    }
  }

  const onDelete = async (id: string) => {
    setLeads(ls => ls.filter(l => l.id !== id))
    try {
      await deleteLead(id)
    } catch (e: any) {
      setErr(e.message)
      refresh(wsId)
    }
  }

  // métricas rápidas
  const ganhos = leads.filter(l => l.status === 'ganho')
  const totalGanho = ganhos.reduce((s, l) => s + (l.value ?? 0), 0)
  const emAberto = leads.filter(l => !['ganho', 'perdido'].includes(l.status)).length

  return (
    <Shell>
      {/* Topo */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '18px 24px', borderBottom: '0.5px solid rgba(255,210,160,0.15)', flexWrap: 'wrap' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700 }}>
          <span style={{ background: BG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CRM</span>
        </h1>
        {workspaces.length > 1 && (
          <select value={wsId} onChange={e => setWsId(e.target.value)} style={{ ...inputStyle, width: 'auto', padding: '8px 12px' }}>
            {workspaces.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 20, alignItems: 'center', fontSize: 13 }}>
          <span style={{ color: '#86868b' }}>Em aberto: <b style={{ color: '#fff' }}>{emAberto}</b></span>
          <span style={{ color: '#86868b' }}>Ganho: <b style={{ color: '#22c55e' }}>{BRL(totalGanho)}</b></span>
          <button onClick={() => setShowAdd(true)} style={{ ...btnStyle, padding: '9px 16px', width: 'auto' }}>+ Lead</button>
          <button onClick={() => supabase.auth.signOut()} style={{ background: 'none', border: 'none', color: '#86868b', cursor: 'pointer', fontSize: 13 }}>Sair</button>
        </div>
      </header>

      {err && <p style={{ color: '#ef4444', padding: '8px 24px', fontSize: 13 }}>{err}</p>}

      {/* Kanban */}
      <div style={{ display: 'flex', gap: 12, padding: 20, overflowX: 'auto', alignItems: 'flex-start' }}>
        {PIPELINE.map(status => {
          const col = leads.filter(l => l.status === status)
          return (
            <div
              key={status}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(status)}
              style={{ minWidth: 260, flex: '1 0 260px', background: 'rgba(255,255,255,0.03)', borderRadius: 14, padding: 12, border: '0.5px solid rgba(255,255,255,0.06)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: STATUS_COLORS[status] }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>{STATUS_LABELS[status]}</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: '#86868b' }}>{col.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {col.map(lead => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => setDragId(lead.id)}
                    style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: 12, cursor: 'grab', border: '0.5px solid rgba(255,210,160,0.1)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                      <b style={{ fontSize: 14 }}>{lead.name}</b>
                      <button onClick={() => onDelete(lead.id)} title="Apagar" style={{ background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>×</button>
                    </div>
                    {lead.company && <p style={{ fontSize: 12, color: '#86868b', marginTop: 2 }}>{lead.company}</p>}
                    <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 6, background: 'rgba(196,122,74,0.15)', color: BRONZE }}>{SOURCE_LABELS[lead.source]}</span>
                      {lead.value != null && <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 600 }}>{BRL(lead.value)}</span>}
                    </div>
                    {(lead.phone || lead.email) && (
                      <p style={{ fontSize: 11, color: '#666', marginTop: 6 }}>{lead.phone || lead.email}</p>
                    )}
                  </div>
                ))}
                {col.length === 0 && <p style={{ fontSize: 12, color: '#444', textAlign: 'center', padding: 12 }}>vazio</p>}
              </div>
            </div>
          )
        })}
      </div>

      {showAdd && (
        <AddLead
          onClose={() => setShowAdd(false)}
          onCreate={async input => {
            const lead = await createLead(wsId, input)
            setLeads(ls => [lead, ...ls])
            setShowAdd(false)
          }}
        />
      )}
    </Shell>
  )
}

// ---------------------------------------------------------------- Add Lead
function AddLead({ onClose, onCreate }: { onClose: () => void; onCreate: (i: Partial<Lead> & { name: string }) => Promise<void> }) {
  const [f, setF] = useState({ name: '', email: '', phone: '', company: '', source: 'manual' as LeadSource, value: '' })
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    try {
      await onCreate({
        name: f.name,
        email: f.email || null,
        phone: f.phone || null,
        company: f.company || null,
        source: f.source,
        value: f.value ? Number(f.value) : null,
      })
    } catch (e: any) {
      setErr(e.message)
      setBusy(false)
    }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 50 }}>
      <form onClick={e => e.stopPropagation()} onSubmit={submit} style={{ width: '100%', maxWidth: 400, background: '#111', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 10, border: '0.5px solid rgba(255,210,160,0.15)' }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Novo lead</h2>
        <input placeholder="Nome *" required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} style={inputStyle} />
        <input placeholder="Empresa" value={f.company} onChange={e => setF({ ...f, company: e.target.value })} style={inputStyle} />
        <input placeholder="E-mail" type="email" value={f.email} onChange={e => setF({ ...f, email: e.target.value })} style={inputStyle} />
        <input placeholder="Telefone / WhatsApp" value={f.phone} onChange={e => setF({ ...f, phone: e.target.value })} style={inputStyle} />
        <input placeholder="Valor estimado (R$)" type="number" value={f.value} onChange={e => setF({ ...f, value: e.target.value })} style={inputStyle} />
        <select value={f.source} onChange={e => setF({ ...f, source: e.target.value as LeadSource })} style={inputStyle}>
          {Object.entries(SOURCE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        {err && <p style={{ color: '#ef4444', fontSize: 13 }}>{err}</p>}
        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
          <button type="button" onClick={onClose} style={{ ...btnStyle, background: 'rgba(255,255,255,0.08)', color: '#fff' }}>Cancelar</button>
          <button type="submit" disabled={busy} style={btnStyle}>{busy ? '…' : 'Criar'}</button>
        </div>
      </form>
    </div>
  )
}

// ---------------------------------------------------------------- estilos
const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.06)',
  border: '0.5px solid rgba(255,210,160,0.2)',
  borderRadius: 10,
  padding: '12px 14px',
  fontSize: 14,
  color: '#fff',
  outline: 'none',
  fontFamily: 'inherit',
  boxSizing: 'border-box',
}

const btnStyle: React.CSSProperties = {
  flex: 1,
  background: BG,
  color: '#fff',
  border: 'none',
  borderRadius: 10,
  padding: '13px 20px',
  fontSize: 14,
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
}
