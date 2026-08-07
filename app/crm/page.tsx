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
  acceptMyInvitations,
  isAgencyMember,
  createClient,
  listMembers,
  listInvitations,
  inviteMember,
  cancelInvitation,
  removeMember,
} from '@/lib/crm-api'
import {
  PIPELINE,
  STATUS_LABELS,
  STATUS_COLORS,
  SOURCE_LABELS,
  ROLE_LABELS,
  type Lead,
  type LeadStatus,
  type LeadSource,
  type Workspace,
  type Member,
  type Invitation,
  type MemberRole,
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
  const [mode, setMode] = useState<'password' | 'magic'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setErr('')
    setMsg('')
    if (mode === 'password') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setErr(error.message)
    } else {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: typeof window !== 'undefined' ? window.location.href : undefined },
      })
      if (error) setErr(error.message)
      else setMsg('Enviámos um link de acesso para o seu e-mail. Abra-o para entrar.')
    }
    setBusy(false)
  }

  return (
    <Shell>
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <form onSubmit={signIn} style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 4 }}>
            <span style={{ background: BG, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>CRM</span> Casa Criative
          </h1>
          <p style={{ color: '#86868b', fontSize: 14, marginBottom: 12 }}>
            {mode === 'password' ? 'Entre com seu e-mail e senha.' : 'Receba um link de acesso no seu e-mail.'}
          </p>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="E-mail" required style={inputStyle} />
          {mode === 'password' && (
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Senha" required style={inputStyle} />
          )}
          {err && <p style={{ color: '#ef4444', fontSize: 13 }}>{err}</p>}
          {msg && <p style={{ color: '#22c55e', fontSize: 13 }}>{msg}</p>}
          <button type="submit" disabled={busy} style={btnStyle}>
            {busy ? '…' : mode === 'password' ? 'Entrar' : 'Enviar link de acesso'}
          </button>
          <button
            type="button"
            onClick={() => { setMode(mode === 'password' ? 'magic' : 'password'); setErr(''); setMsg('') }}
            style={{ background: 'none', border: 'none', color: '#86868b', cursor: 'pointer', fontSize: 13, marginTop: 4 }}
          >
            {mode === 'password' ? 'Entrar com link mágico (sem senha)' : 'Entrar com senha'}
          </button>
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
  const [showClients, setShowClients] = useState(false)
  const [isAgency, setIsAgency] = useState(false)
  const [dragId, setDragId] = useState<string | null>(null)
  const [err, setErr] = useState('')

  const loadWorkspaces = useCallback(() => {
    return getMyWorkspaces()
      .then(ws => {
        setWorkspaces(ws)
        setWsId(cur => cur || ws[0]?.id || '')
        return ws
      })
      .catch(e => setErr(e.message))
  }, [])

  useEffect(() => {
    // ao entrar: reclama convites pendentes, depois carrega workspaces e papel
    acceptMyInvitations()
      .catch(() => {}) // sem convites não é erro
      .then(() => loadWorkspaces())
      .then(() => isAgencyMember().then(setIsAgency).catch(() => {}))
  }, [loadWorkspaces])

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
          {isAgency && (
            <button onClick={() => setShowClients(true)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 10, color: '#fff', cursor: 'pointer', fontSize: 13, padding: '9px 16px', fontFamily: 'inherit' }}>Clientes</button>
          )}
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

      {showClients && (
        <ClientsManager
          workspaces={workspaces}
          onClose={() => setShowClients(false)}
          onChanged={loadWorkspaces}
        />
      )}
    </Shell>
  )
}

// ---------------------------------------------------------------- Clientes (agência)
function ClientsManager({ workspaces, onClose, onChanged }: { workspaces: Workspace[]; onClose: () => void; onChanged: () => void }) {
  const clients = workspaces.filter(w => !w.is_agency)
  const [selected, setSelected] = useState<Workspace | null>(clients[0] ?? null)
  const [newName, setNewName] = useState('')
  const [err, setErr] = useState('')

  const addClient = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    if (!newName.trim()) return
    try {
      const ws = await createClient(newName.trim())
      setNewName('')
      await onChanged()
      setSelected(ws)
    } catch (e: any) { setErr(e.message) }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 50 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: 720, maxHeight: '85vh', overflow: 'auto', background: '#111', borderRadius: 16, padding: 28, border: '0.5px solid rgba(255,210,160,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700 }}>Clientes</h2>
          <button onClick={onClose} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#86868b', cursor: 'pointer', fontSize: 20 }}>×</button>
        </div>

        <form onSubmit={addClient} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome do novo cliente" style={{ ...inputStyle, flex: 1 }} />
          <button type="submit" style={{ ...btnStyle, width: 'auto', padding: '12px 20px' }}>+ Cliente</button>
        </form>
        {err && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{err}</p>}

        <div style={{ display: 'flex', gap: 16 }}>
          {/* lista de clientes */}
          <div style={{ width: 200, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {clients.length === 0 && <p style={{ fontSize: 13, color: '#666' }}>Nenhum cliente ainda.</p>}
            {clients.map(c => (
              <button key={c.id} onClick={() => setSelected(c)} style={{ textAlign: 'left', background: selected?.id === c.id ? 'rgba(196,122,74,0.18)' : 'rgba(255,255,255,0.04)', border: 'none', borderRadius: 8, padding: '10px 12px', color: '#fff', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit' }}>{c.name}</button>
            ))}
          </div>
          {/* membros do cliente selecionado */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {selected ? <MembersPanel workspace={selected} /> : <p style={{ fontSize: 13, color: '#666' }}>Selecione um cliente.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------- Membros + convites
function MembersPanel({ workspace }: { workspace: Workspace }) {
  const [members, setMembers] = useState<Member[]>([])
  const [invites, setInvites] = useState<Invitation[]>([])
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<MemberRole>('member')
  const [err, setErr] = useState('')
  const [msg, setMsg] = useState('')

  const load = useCallback(() => {
    setErr('')
    Promise.all([listMembers(workspace.id), listInvitations(workspace.id)])
      .then(([m, i]) => { setMembers(m); setInvites(i) })
      .catch(e => setErr(e.message))
  }, [workspace.id])

  useEffect(() => { load() }, [load])

  const invite = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr('')
    setMsg('')
    if (!email.trim()) return
    try {
      await inviteMember(workspace.id, email, role)
      setEmail('')
      setMsg('Convite criado. A pessoa entra pelo link mágico no /crm e é ligada automaticamente.')
      load()
    } catch (e: any) { setErr(e.message) }
  }

  return (
    <div>
      <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 12 }}>{workspace.name}</h3>

      <form onSubmit={invite} style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="e-mail da pessoa" style={{ ...inputStyle, flex: '1 1 160px' }} />
        <select value={role} onChange={e => setRole(e.target.value as MemberRole)} style={{ ...inputStyle, width: 'auto' }}>
          {Object.entries(ROLE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <button type="submit" style={{ ...btnStyle, width: 'auto', padding: '12px 18px' }}>Convidar</button>
      </form>
      {err && <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 8 }}>{err}</p>}
      {msg && <p style={{ color: '#22c55e', fontSize: 12, marginBottom: 8 }}>{msg}</p>}

      <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', margin: '10px 0 6px' }}>Membros</p>
      {members.length === 0 && <p style={{ fontSize: 13, color: '#666' }}>Ninguém ainda.</p>}
      {members.map(m => (
        <div key={m.user_id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontSize: 14 }}>{m.email}</span>
          <span style={{ fontSize: 11, color: '#c47a4a' }}>{ROLE_LABELS[m.role]}</span>
          <button onClick={async () => { await removeMember(workspace.id, m.user_id); load() }} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 13 }}>remover</button>
        </div>
      ))}

      {invites.length > 0 && (
        <>
          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#666', margin: '14px 0 6px' }}>Convites pendentes</p>
          {invites.map(i => (
            <div key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 14, color: '#aaa' }}>{i.email}</span>
              <span style={{ fontSize: 11, color: '#c47a4a' }}>{ROLE_LABELS[i.role]}</span>
              <button onClick={async () => { await cancelInvitation(i.id); load() }} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#555', cursor: 'pointer', fontSize: 13 }}>cancelar</button>
            </div>
          ))}
        </>
      )}
    </div>
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
