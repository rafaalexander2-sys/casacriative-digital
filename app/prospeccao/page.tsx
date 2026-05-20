'use client'

import { useState, useEffect, useCallback } from 'react'
import { generateMessage } from '@/lib/message-templates'
import {
  Prospect,
  ProspectStatus,
  ProspectCountry,
  Campaign,
  SECTOR_OPTIONS,
  SIZE_OPTIONS,
  STATUS_LABELS,
  STATUS_COLORS,
} from '@/lib/prospecting-types'

const DAILY_LIMIT = 20
const STORAGE_KEY = 'cc_prospects'
const CAMPAIGN_KEY = 'cc_campaign'
const PORTFOLIO_KEY = 'cc_portfolio_url'

function generateId() {
  return Math.random().toString(36).slice(2, 10)
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function loadProspects(): Prospect[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveProspects(list: Prospect[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

function loadCampaign(): Campaign {
  if (typeof window === 'undefined') return { dailyLimit: DAILY_LIMIT, sentToday: 0, lastResetDate: todayStr() }
  try {
    const raw = localStorage.getItem(CAMPAIGN_KEY)
    if (!raw) return { dailyLimit: DAILY_LIMIT, sentToday: 0, lastResetDate: todayStr() }
    const c: Campaign = JSON.parse(raw)
    if (c.lastResetDate !== todayStr()) {
      return { ...c, sentToday: 0, lastResetDate: todayStr() }
    }
    return c
  } catch {
    return { dailyLimit: DAILY_LIMIT, sentToday: 0, lastResetDate: todayStr() }
  }
}

function saveCampaign(c: Campaign) {
  localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(c))
}

const WORKER_URL = process.env.NEXT_PUBLIC_WORKER_URL || ''

type Tab = 'queue' | 'add' | 'stats' | 'instagram'

const emptyForm = {
  name: '',
  title: '',
  company: '',
  country: 'PT' as ProspectCountry,
  sector: SECTOR_OPTIONS[0],
  companySize: SIZE_OPTIONS[0],
  linkedinUrl: '',
  email: '',
  companyWebsite: '',
  notes: '',
}

export default function ProspeccaoPage() {
  const [tab, setTab] = useState<Tab>('queue')
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [campaign, setCampaign] = useState<Campaign>({ dailyLimit: DAILY_LIMIT, sentToday: 0, lastResetDate: todayStr() })
  const [form, setForm] = useState(emptyForm)
  const [filter, setFilter] = useState<ProspectStatus | 'all'>('all')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [igCountry, setIgCountry] = useState<ProspectCountry>('PT')
  const [igSector, setIgSector] = useState('all')
  const [igRunId, setIgRunId] = useState<string | null>(null)
  const [igLoading, setIgLoading] = useState(false)
  const [igStatus, setIgStatus] = useState('')
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [editingPortfolio, setEditingPortfolio] = useState(false)

  useEffect(() => {
    setProspects(loadProspects())
    setCampaign(loadCampaign())
    setPortfolioUrl(localStorage.getItem(PORTFOLIO_KEY) || 'casacriative.com.br')
  }, [])

  const persist = useCallback((list: Prospect[]) => {
    setProspects(list)
    saveProspects(list)
  }, [])

  const persistCampaign = useCallback((c: Campaign) => {
    setCampaign(c)
    saveCampaign(c)
  }, [])

  async function handleInstagramScrape() {
    setIgLoading(true)
    setIgStatus('Iniciando busca no Instagram...')
    try {
      const res = await fetch(`${WORKER_URL}/instagram-scrape`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country: igCountry, sector: igSector === 'all' ? 'all' : igSector, limit: 30 }),
      })
      const data = await res.json()
      if (data.runId) {
        setIgRunId(data.runId)
        setIgStatus(`Scraping iniciado. Aguardando resultados...`)
        pollApifyResults(data.runId)
      } else {
        setIgStatus('Erro: ' + (data.error || 'Falha ao iniciar'))
        setIgLoading(false)
      }
    } catch (e) {
      setIgStatus('Erro de conexão com o Worker.')
      setIgLoading(false)
    }
  }

  async function pollApifyResults(runId: string) {
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      setIgStatus(`Aguardando Apify... (${attempts * 10}s)`)
      try {
        const res = await fetch(`${WORKER_URL}/instagram-results?runId=${runId}`)
        const data = await res.json()
        if (data.ok && data.prospects?.length > 0) {
          clearInterval(interval)
          const next = [...data.prospects, ...prospects]
          persist(next)
          setIgStatus(`✅ ${data.count} prospects importados do Instagram!`)
          setIgLoading(false)
          setTab('queue')
        } else if (attempts > 18) {
          clearInterval(interval)
          setIgStatus('Timeout — tente novamente.')
          setIgLoading(false)
        }
      } catch {
        // keep polling
      }
    }, 10_000)
  }

  function handleExportQueue() {
    const data = JSON.stringify(prospects, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `queue-${todayStr()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportResult(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try {
        const imported: Prospect[] = JSON.parse(ev.target?.result as string)
        persist(imported)
        alert(`${imported.filter(p => p.status === 'sent').length} enviadas importadas com sucesso.`)
      } catch {
        alert('Arquivo inválido.')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleFormChange(key: string, value: string) {
    setForm(f => ({ ...f, [key]: value }))
  }

  function handleAddProspect() {
    if (!form.name || !form.company || !form.linkedinUrl) return
    setSaving(true)
    const p: Prospect = {
      id: generateId(),
      ...form,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }
    const next = [p, ...prospects]
    persist(next)
    setForm(emptyForm)
    setTab('queue')
    setSaving(false)
  }

  function handleGenerate(prospect: Prospect) {
    const message = generateMessage(prospect, portfolioUrl)
    const next = prospects.map(p =>
      p.id === prospect.id
        ? { ...p, generatedMessage: message, status: 'message_ready' as ProspectStatus }
        : p
    )
    persist(next)
    setSelectedId(prospect.id)
  }

  function handleCopy(prospect: Prospect) {
    if (!prospect.generatedMessage) return
    navigator.clipboard.writeText(prospect.generatedMessage)
    setCopied(prospect.id)
    setTimeout(() => setCopied(null), 2000)
  }

  function handleMarkSent(prospect: Prospect) {
    if (campaign.sentToday >= campaign.dailyLimit) return
    const next = prospects.map(p =>
      p.id === prospect.id
        ? { ...p, status: 'sent' as ProspectStatus, sentAt: new Date().toISOString() }
        : p
    )
    persist(next)
    const c = { ...campaign, sentToday: campaign.sentToday + 1 }
    persistCampaign(c)
  }

  function handleStatusChange(prospect: Prospect, status: ProspectStatus) {
    const next = prospects.map(p => (p.id === prospect.id ? { ...p, status } : p))
    persist(next)
  }

  function handleDelete(id: string) {
    persist(prospects.filter(p => p.id !== id))
    if (selectedId === id) setSelectedId(null)
  }

  const filtered = prospects
    .filter(p => filter === 'all' || p.status === filter)
    .filter(p =>
      searchQuery === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company.toLowerCase().includes(searchQuery.toLowerCase())
    )

  const selected = selectedId ? prospects.find(p => p.id === selectedId) : null

  const stats = {
    total: prospects.length,
    pending: prospects.filter(p => p.status === 'pending').length,
    ready: prospects.filter(p => p.status === 'message_ready').length,
    sent: prospects.filter(p => p.status === 'sent').length,
    replied: prospects.filter(p => p.status === 'replied').length,
  }

  const canSendMore = campaign.sentToday < campaign.dailyLimit

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-xs font-bold text-black">
            CC
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight">Prospecção LinkedIn</h1>
            <p className="text-xs text-zinc-500">Portugal &amp; Espanha · PMEs</p>
          </div>
        </div>

        {/* Bot actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportQueue}
            className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
            title="Exporta queue.json para rodar o bot"
          >
            Exportar para Bot
          </button>
          <label className="text-xs px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg cursor-pointer transition-colors">
            Importar Resultado
            <input type="file" accept=".json" onChange={handleImportResult} className="hidden" />
          </label>
        </div>

        {/* Portfolio URL */}
        <div className="flex items-center gap-2">
          {editingPortfolio ? (
            <input
              autoFocus
              type="text"
              value={portfolioUrl}
              onChange={e => setPortfolioUrl(e.target.value)}
              onBlur={() => { localStorage.setItem(PORTFOLIO_KEY, portfolioUrl); setEditingPortfolio(false) }}
              onKeyDown={e => { if (e.key === 'Enter') { localStorage.setItem(PORTFOLIO_KEY, portfolioUrl); setEditingPortfolio(false) } }}
              className="w-56 bg-zinc-900 border border-amber-600 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none"
            />
          ) : (
            <button
              onClick={() => setEditingPortfolio(true)}
              className="text-xs text-zinc-500 hover:text-amber-400 transition-colors border border-zinc-800 rounded px-2 py-1"
              title="Clique para editar o link do portfólio"
            >
              Portfolio: <span className="text-zinc-400">{portfolioUrl}</span>
            </button>
          )}
        </div>

        {/* Daily quota */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-zinc-500">Enviados hoje</p>
            <p className="text-sm font-mono font-semibold">
              <span className={canSendMore ? 'text-amber-400' : 'text-red-400'}>
                {campaign.sentToday}
              </span>
              <span className="text-zinc-600">/{campaign.dailyLimit}</span>
            </p>
          </div>
          <div className="w-20 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${campaign.sentToday >= campaign.dailyLimit ? 'bg-red-500' : 'bg-amber-500'}`}
              style={{ width: `${Math.min(100, (campaign.sentToday / campaign.dailyLimit) * 100)}%` }}
            />
          </div>
        </div>
      </header>

      <div className="flex" style={{ height: 'calc(100vh - 65px)' }}>
        {/* Sidebar */}
        <nav className="w-48 border-r border-zinc-800 p-4 flex flex-col gap-1 flex-shrink-0">
          {([['instagram', '🔍 Buscar Instagram'], ['queue', 'Fila'], ['add', '+ Adicionar'], ['stats', 'Estatísticas']] as [Tab, string][]).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                tab === t
                  ? 'bg-amber-600/20 text-amber-400 font-medium'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              {label}
            </button>
          ))}

          <div className="mt-4 border-t border-zinc-800 pt-4">
            <p className="text-xs text-zinc-600 mb-2 px-1">Filtrar por status</p>
            {(['all', 'pending', 'message_ready', 'sent', 'replied', 'no_reply'] as const).map(s => (
              <button
                key={s}
                onClick={() => { setFilter(s); setTab('queue') }}
                className={`text-left px-3 py-1.5 rounded-lg text-xs w-full transition-colors ${
                  filter === s && tab === 'queue'
                    ? 'bg-zinc-800 text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                {s === 'all' ? 'Todos' : STATUS_LABELS[s]}
                {s !== 'all' && (
                  <span className="ml-1 text-zinc-600">
                    ({prospects.filter(p => p.status === s).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Main content */}
        <main className="flex-1 overflow-hidden flex">
          {/* List panel */}
          <div className="flex-1 overflow-y-auto">
            {tab === 'instagram' && (
              <div className="p-6 max-w-md">
                <h2 className="text-base font-semibold mb-1">Buscar prospects no Instagram</h2>
                <p className="text-xs text-zinc-500 mb-5">O Apify busca perfis de PMEs por hashtag e importa automaticamente para a fila.</p>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-xs text-zinc-500 mb-1 block">País</span>
                    <select value={igCountry} onChange={e => setIgCountry(e.target.value as ProspectCountry)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-600">
                      <option value="PT">Portugal</option>
                      <option value="ES">Espanha</option>
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs text-zinc-500 mb-1 block">Setor</span>
                    <select value={igSector} onChange={e => setIgSector(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-600">
                      <option value="all">Todos os setores</option>
                      {['Restaurante / Alimentação','Clínica / Saúde','Estética / Beleza','Academia / Fitness','Advocacia / Jurídico'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>

                  <button onClick={handleInstagramScrape} disabled={igLoading}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-black text-sm font-semibold rounded-lg transition-colors">
                    {igLoading ? 'Buscando...' : 'Buscar agora'}
                  </button>

                  {igStatus && (
                    <div className={`text-xs px-3 py-2 rounded-lg ${igStatus.startsWith('✅') ? 'bg-green-900/30 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      {igStatus}
                    </div>
                  )}
                </div>

                <div className="mt-6 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <p className="text-xs text-amber-500 font-medium mb-2">Como funciona</p>
                  <ol className="text-xs text-zinc-400 space-y-1.5 list-decimal list-inside">
                    <li>Seleciona país e setor</li>
                    <li>Clica em Buscar — o Apify varre hashtags do Instagram</li>
                    <li>Perfis são importados automaticamente para a Fila</li>
                    <li>Gera mensagem e envia pelo bot</li>
                  </ol>
                </div>
              </div>
            )}

            {tab === 'queue' && (
              <div className="p-6">
                <div className="mb-4 flex gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Buscar por nome ou empresa..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-600"
                  />
                  <span className="text-xs text-zinc-500">{filtered.length} prospects</span>
                </div>

                {filtered.length === 0 && (
                  <div className="text-center py-16 text-zinc-600">
                    <p className="text-4xl mb-3">📋</p>
                    <p className="text-sm">Nenhum prospecto ainda.</p>
                    <button
                      onClick={() => setTab('add')}
                      className="mt-3 text-amber-400 text-sm hover:underline"
                    >
                      Adicionar o primeiro
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  {filtered.map(p => (
                    <div
                      key={p.id}
                      onClick={() => setSelectedId(prev => prev === p.id ? null : p.id)}
                      className={`border rounded-xl p-4 cursor-pointer transition-all ${
                        selectedId === p.id
                          ? 'border-amber-600/50 bg-amber-950/20'
                          : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-zinc-100 truncate">{p.name}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 flex-shrink-0">
                              {p.country}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-500 truncate mt-0.5">{p.title} · {p.company}</p>
                          <p className="text-xs text-zinc-600 mt-0.5">{p.sector}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${STATUS_COLORS[p.status]}`}>
                          {STATUS_LABELS[p.status]}
                        </span>
                      </div>

                      {selectedId === p.id && (
                        <div className="mt-4 pt-4 border-t border-zinc-800" onClick={e => e.stopPropagation()}>
                          {p.generatedMessage ? (
                            <div className="mb-3">
                              <p className="text-xs text-zinc-500 mb-2">Mensagem gerada:</p>
                              <div className="bg-zinc-950 rounded-lg p-3 text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap border border-zinc-800">
                                {p.generatedMessage}
                              </div>
                            </div>
                          ) : null}

                          <div className="flex flex-wrap gap-2 mt-3">
                            {!p.generatedMessage && (
                              <button
                                onClick={() => handleGenerate(p)}
                                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black text-xs font-medium rounded-lg transition-colors"
                              >
                                Gerar Mensagem
                              </button>
                            )}

                            {p.generatedMessage && (
                              <>
                                <button
                                  onClick={() => handleGenerate(p)}
                                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition-colors"
                                >
                                  Regenerar
                                </button>
                                <button
                                  onClick={() => handleCopy(p)}
                                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition-colors"
                                >
                                  {copied === p.id ? 'Copiado!' : 'Copiar'}
                                </button>
                                <a
                                  href={p.linkedinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-1.5 bg-blue-900/40 hover:bg-blue-900/60 text-blue-300 text-xs rounded-lg transition-colors"
                                >
                                  Abrir LinkedIn
                                </a>
                                {p.status !== 'sent' && canSendMore && (
                                  <button
                                    onClick={() => handleMarkSent(p)}
                                    className="px-3 py-1.5 bg-green-900/40 hover:bg-green-900/60 text-green-300 text-xs rounded-lg transition-colors"
                                  >
                                    Marcar como Enviada
                                  </button>
                                )}
                              </>
                            )}

                            {p.status === 'sent' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(p, 'replied')}
                                  className="px-3 py-1.5 bg-green-900/40 hover:bg-green-900/60 text-green-300 text-xs rounded-lg"
                                >
                                  Respondeu
                                </button>
                                <button
                                  onClick={() => handleStatusChange(p, 'no_reply')}
                                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs rounded-lg"
                                >
                                  Sem Resposta
                                </button>
                                <button
                                  onClick={() => handleStatusChange(p, 'not_interested')}
                                  className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs rounded-lg"
                                >
                                  Não Interessado
                                </button>
                              </>
                            )}

                            <button
                              onClick={() => handleDelete(p.id)}
                              className="ml-auto px-3 py-1.5 text-zinc-600 hover:text-red-400 text-xs rounded-lg transition-colors"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'add' && (
              <div className="p-6 max-w-xl">
                <h2 className="text-base font-semibold mb-5">Adicionar Prospecto</h2>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-xs text-zinc-500 mb-1 block">País *</span>
                      <select
                        value={form.country}
                        onChange={e => handleFormChange('country', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-600"
                      >
                        <option value="PT">Portugal (PT)</option>
                        <option value="ES">Espanha (ES)</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs text-zinc-500 mb-1 block">Tamanho da empresa *</span>
                      <select
                        value={form.companySize}
                        onChange={e => handleFormChange('companySize', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-600"
                      >
                        {SIZE_OPTIONS.map(s => (
                          <option key={s} value={s}>{s} funcionários</option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {[
                    { key: 'name', label: 'Nome completo *', placeholder: 'João Silva' },
                    { key: 'title', label: 'Cargo *', placeholder: 'Sócio-Gerente' },
                    { key: 'company', label: 'Empresa *', placeholder: 'Clínica Exemplo Lda' },
                    { key: 'linkedinUrl', label: 'URL LinkedIn *', placeholder: 'https://linkedin.com/in/...' },
                    { key: 'email', label: 'Email (opcional)', placeholder: 'joao@empresa.pt' },
                    { key: 'companyWebsite', label: 'Site da empresa (opcional)', placeholder: 'empresa.pt' },
                  ].map(({ key, label, placeholder }) => (
                    <label key={key} className="block">
                      <span className="text-xs text-zinc-500 mb-1 block">{label}</span>
                      <input
                        type="text"
                        value={(form as Record<string, string>)[key]}
                        onChange={e => handleFormChange(key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-amber-600"
                      />
                    </label>
                  ))}

                  <label className="block">
                    <span className="text-xs text-zinc-500 mb-1 block">Setor *</span>
                    <select
                      value={form.sector}
                      onChange={e => handleFormChange('sector', e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-600"
                    >
                      {SECTOR_OPTIONS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-xs text-zinc-500 mb-1 block">Notas (para personalizar mensagem)</span>
                    <textarea
                      value={form.notes}
                      onChange={e => handleFormChange('notes', e.target.value)}
                      placeholder="Ex: abriu há 6 meses, sem presença nas redes sociais, concorrente usa Google Ads..."
                      rows={3}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none focus:border-amber-600 resize-none"
                    />
                  </label>

                  <button
                    onClick={handleAddProspect}
                    disabled={!form.name || !form.company || !form.linkedinUrl || saving}
                    className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed text-black text-sm font-semibold rounded-lg transition-colors"
                  >
                    Adicionar à Fila
                  </button>
                </div>
              </div>
            )}

            {tab === 'stats' && (
              <div className="p-6">
                <h2 className="text-base font-semibold mb-5">Estatísticas da Campanha</h2>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { label: 'Total na fila', value: stats.total, color: 'text-zinc-100' },
                    { label: 'Mensagens enviadas', value: stats.sent, color: 'text-blue-400' },
                    { label: 'Responderam', value: stats.replied, color: 'text-green-400' },
                    {
                      label: 'Taxa de resposta',
                      value: stats.sent > 0 ? `${Math.round((stats.replied / stats.sent) * 100)}%` : '—',
                      color: 'text-amber-400',
                    },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                      <p className="text-xs text-zinc-500 mb-1">{label}</p>
                      <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">
                  <p className="text-xs text-zinc-500 mb-3">Quota diária — {todayStr()}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-zinc-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          campaign.sentToday >= campaign.dailyLimit ? 'bg-red-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, (campaign.sentToday / campaign.dailyLimit) * 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-mono text-zinc-300">
                      {campaign.sentToday}/{campaign.dailyLimit}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-2">
                    Limite de {campaign.dailyLimit}/dia para evitar restricções do LinkedIn.
                    Reinicia automaticamente às 00h00.
                  </p>
                </div>

                <div className="bg-zinc-900 border border-amber-900/30 rounded-xl p-4">
                  <p className="text-xs text-amber-500 font-medium mb-2">Fluxo recomendado</p>
                  <ol className="text-xs text-zinc-400 space-y-1.5 list-decimal list-inside">
                    <li>Adicionar prospectos com dados detalhados</li>
                    <li>Gerar mensagem personalizada com IA</li>
                    <li>Revisar e copiar a mensagem</li>
                    <li>Abrir o LinkedIn e enviar manualmente</li>
                    <li>Marcar como &ldquo;Enviada&rdquo; no sistema</li>
                    <li>Acompanhar respostas e atualizar status</li>
                  </ol>
                </div>

                {stats.sent > 0 && (
                  <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <p className="text-xs text-zinc-500 mb-3">Status detalhado</p>
                    {(['pending', 'message_ready', 'sent', 'replied', 'no_reply', 'not_interested'] as ProspectStatus[]).map(s => {
                      const count = prospects.filter(p => p.status === s).length
                      if (count === 0) return null
                      return (
                        <div key={s} className="flex items-center justify-between py-1.5 border-b border-zinc-800 last:border-0">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[s]}`}>
                            {STATUS_LABELS[s]}
                          </span>
                          <span className="text-sm font-mono text-zinc-300">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
