'use client'

import { useState, useEffect, useCallback } from 'react'
import { generateMessage } from '@/lib/message-templates'
import { generateAIMessage } from '@/lib/ai-messages'
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
const APIFY_KEY_STORAGE = 'cc_apify_key'
const PERPLEXITY_KEY_STORAGE = 'cc_perplexity_key'
const APIFY_BASE = 'https://api.apify.com/v2'

type Tab = 'queue' | 'kanban' | 'add' | 'stats' | 'instagram'

const emptyForm = {
  name: '',
  title: '',
  company: '',
  country: 'PT' as ProspectCountry,
  sector: SECTOR_OPTIONS[0],
  companySize: SIZE_OPTIONS[0],
  linkedinUrl: '',
  instagramUrl: '',
  whatsapp: '',
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
  const [apifyKey, setApifyKey] = useState('')
  const [editingApify, setEditingApify] = useState(false)
  const [perplexityKey, setPerplexityKey] = useState('')
  const [editingPerplexity, setEditingPerplexity] = useState(false)
  const [aiGenerating, setAiGenerating] = useState<string | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  const [dragId, setDragId] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<ProspectStatus | null>(null)

  useEffect(() => {
    setProspects(loadProspects())
    setCampaign(loadCampaign())
    setPortfolioUrl(localStorage.getItem(PORTFOLIO_KEY) || 'casacriative.com.br')
    setApifyKey(localStorage.getItem(APIFY_KEY_STORAGE) || '')
    setPerplexityKey(localStorage.getItem(PERPLEXITY_KEY_STORAGE) || '')
  }, [])

  const persist = useCallback((list: Prospect[]) => {
    setProspects(list)
    saveProspects(list)
  }, [])

  const persistCampaign = useCallback((c: Campaign) => {
    setCampaign(c)
    saveCampaign(c)
  }, [])


  const SECTOR_HASHTAGS: Record<string, Record<string, string[]>> = {
    'all':                       { PT: ['negociolocal','empresaportugal','empreendedorismoportugal','pmeportugal'], ES: ['negociolocal','pymesespana','emprendedoresespana','empresaespana'] },
    'Restaurante / Alimentação': { PT: ['restauranteportugal','restaurantelisboa','restaurantoporto','cafélisboa'], ES: ['restaurantemadrid','restaurantebarcelona','hosteleria','restauranteespana'] },
    'Clínica / Saúde':           { PT: ['clinicalisboa','clinicaportugal','saudeportugal','medicinaestetica'], ES: ['clinicamadrid','saludybienestar','clinicaestetica','clinicabarcelona'] },
    'Estética / Beleza':         { PT: ['cabelereiroPortugal','belezaportugal','esteticalisboa','salaobelezaportugal'], ES: ['peluqueriamadrid','esteticamadrid','bellezaespana','salondebelleza'] },
    'Academia / Fitness':        { PT: ['ginasiolisboa','fitnessportugal','personaltrainerportugal'], ES: ['gimnasioespana','fitnessespana','personaltrainerespana'] },
    'Turismo / Hotelaria':       { PT: ['hoteislisboa','alojamentoportugal','turismoportugal'], ES: ['hotelmadrid','turismoespana','alojamientoespana'] },
    'Comércio / Loja':           { PT: ['lojalisboa','comercioportugal','boutiquelisboa'], ES: ['tiendamadrid','comercioespana','boutiquesespana'] },
  }

  async function handleLoadSeeds() {
    setIgLoading(true)
    setIgStatus('Carregando leads reais de Portugal e Espanha...')
    try {
      const res = await fetch('/seeds-prospects.json')
      const seeds: Prospect[] = await res.json()
      const existing = new Set(prospects.map(p => p.linkedinUrl).filter(Boolean))
      const fresh = seeds.filter(s => !existing.has(s.linkedinUrl))
      persist([...fresh, ...prospects])
      setIgStatus(`✅ ${fresh.length} leads importados (PT + ES)!`)
      setTimeout(() => setTab('queue'), 800)
    } catch {
      setIgStatus('Erro ao carregar seeds.')
    } finally {
      setIgLoading(false)
    }
  }

  async function handleInstagramScrape() {
    if (!apifyKey) { setIgStatus('Cole a sua chave Apify no campo acima.'); return }
    setIgLoading(true)
    setIgStatus('Iniciando busca no Instagram...')
    try {
      const hashtags = SECTOR_HASHTAGS[igSector]?.[igCountry] ?? SECTOR_HASHTAGS['all'][igCountry]

      const runRes = await fetch(
        `${APIFY_BASE}/acts/apify~instagram-hashtag-scraper/runs?token=${apifyKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ hashtags, resultsLimit: 30, addParentData: true }),
        }
      )
      const runData = await runRes.json()
      const runId = runData.data?.id
      if (!runId) throw new Error(JSON.stringify(runData))
      setIgRunId(runId)
      setIgStatus(`Buscando no Instagram (${hashtags.slice(0,2).map(h=>'#'+h).join(', ')}...)`)
      pollApifyResults(runId)
    } catch (e: unknown) {
      setIgStatus('Erro: ' + (e instanceof Error ? e.message : 'falha'))
      setIgLoading(false)
    }
  }

  async function pollApifyResults(runId: string) {
    let attempts = 0
    const interval = setInterval(async () => {
      attempts++
      try {
        const statusRes = await fetch(`${APIFY_BASE}/actor-runs/${runId}?token=${apifyKey}`)
        const statusData = await statusRes.json()
        const status = statusData.data?.status
        setIgStatus(`Buscando no Instagram... ${attempts * 8}s`)
        if (status === 'SUCCEEDED') {
          clearInterval(interval)
          const datasetId = statusData.data?.defaultDatasetId
          const itemsRes = await fetch(`${APIFY_BASE}/datasets/${datasetId}/items?token=${apifyKey}&limit=100`)
          const items = await itemsRes.json()
          const newProspects = Array.from(
            new Map(
              (items as Record<string, unknown>[])
                .filter(item => item.ownerUsername && item.ownerFullName)
                .map(item => {
                  const username = item.ownerUsername as string
                  const p: Prospect = {
                    id: Math.random().toString(36).slice(2, 10),
                    name: (item.ownerFullName || username) as string,
                    title: 'Dono(a)',
                    company: username,
                    country: igCountry,
                    sector: igSector === 'all' ? 'Outro' : igSector,
                    companySize: '1-10',
                    linkedinUrl: '',
                    instagramUrl: `https://instagram.com/${username}`,
                    email: '',
                    companyWebsite: (item.ownerBiography as string)?.match(/https?:\/\/[^\s]+/)?.[0] || '',
                    notes: (item.ownerBiography as string)?.slice(0, 300) || '',
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                  }
                  return [username, p]
                })
            ).values()
          )
          persist([...(newProspects as Prospect[]), ...prospects])
          setIgStatus(`✅ ${newProspects.length} perfis do Instagram importados!`)
          setIgLoading(false)
          setTab('queue')
        } else if (status === 'FAILED' || attempts > 20) {
          clearInterval(interval)
          setIgStatus(status === 'FAILED' ? 'Falhou — tente novamente.' : 'Timeout — tente novamente.')
          setIgLoading(false)
        }
      } catch {
        // keep polling
      }
    }, 8_000)
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
    if (!form.name || !form.company) return
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

  async function handleGenerateAI(prospect: Prospect) {
    if (!perplexityKey) {
      setAiError('Configure a Chave Perplexity no cabeçalho.')
      setTimeout(() => setAiError(null), 4000)
      return
    }
    setAiGenerating(prospect.id)
    setAiError(null)
    try {
      const message = await generateAIMessage(prospect, perplexityKey)
      const next = prospects.map(p =>
        p.id === prospect.id
          ? { ...p, generatedMessage: message, status: 'message_ready' as ProspectStatus }
          : p
      )
      persist(next)
      setSelectedId(prospect.id)
    } catch (e: unknown) {
      setAiError(e instanceof Error ? e.message : 'Erro ao gerar com IA.')
      setTimeout(() => setAiError(null), 6000)
    } finally {
      setAiGenerating(null)
    }
  }

  function handleCopy(prospect: Prospect) {
    if (!prospect.generatedMessage) return
    navigator.clipboard.writeText(prospect.generatedMessage)
    setCopied(prospect.id)
    setTimeout(() => setCopied(null), 2000)
  }

  function handleMarkFollowing(prospect: Prospect) {
    const next = prospects.map(p =>
      p.id === prospect.id
        ? { ...p, status: 'following' as ProspectStatus, followedAt: new Date().toISOString() }
        : p
    )
    persist(next)
    if (prospect.instagramUrl) window.open(prospect.instagramUrl, '_blank', 'noopener,noreferrer')
  }

  function handleMarkEngaging(prospect: Prospect) {
    const next = prospects.map(p =>
      p.id === prospect.id
        ? { ...p, status: 'engaging' as ProspectStatus, engagedAt: new Date().toISOString() }
        : p
    )
    persist(next)
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

  function sortByPriority(list: Prospect[]): Prospect[] {
    const now = Date.now()
    const DAY = 86_400_000

    function priority(p: Prospect): number {
      // engaging = pronto para enviar DM agora → topo absoluto
      if (p.status === 'engaging') return 0
      // following há 2+ dias = pronto para interagir → urgente
      if (p.status === 'following') {
        const age = p.followedAt ? now - new Date(p.followedAt).getTime() : 0
        return age >= 2 * DAY ? 1 : 3
      }
      if (p.status === 'message_ready') return 2
      if (p.status === 'pending') return 4
      if (p.status === 'sent') return 5
      if (p.status === 'replied') return 6
      return 7 // no_reply, not_interested
    }

    function tiebreak(p: Prospect): number {
      // dentro do mesmo grupo: mais antigo/atrasado primeiro
      const ref =
        p.status === 'engaging' ? p.engagedAt :
        p.status === 'following' ? p.followedAt :
        p.status === 'sent' ? p.sentAt :
        p.createdAt
      return ref ? new Date(ref).getTime() : 0
    }

    return [...list].sort((a, b) => {
      const diff = priority(a) - priority(b)
      if (diff !== 0) return diff
      return tiebreak(a) - tiebreak(b)
    })
  }

  const filtered = sortByPriority(
    prospects
      .filter(p => filter === 'all' || p.status === filter)
      .filter(p =>
        searchQuery === '' ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.company.toLowerCase().includes(searchQuery.toLowerCase())
      )
  )

  const selected = selectedId ? prospects.find(p => p.id === selectedId) : null

  const stats = {
    total: prospects.length,
    pending: prospects.filter(p => p.status === 'pending').length,
    following: prospects.filter(p => p.status === 'following').length,
    engaging: prospects.filter(p => p.status === 'engaging').length,
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
            <h1 className="text-sm font-semibold tracking-tight">CC Prospecter</h1>
            <p className="text-xs text-zinc-500">Instagram · WhatsApp · PT &amp; ES</p>
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

        {/* Perplexity Key */}
        <div className="flex items-center gap-2">
          {editingPerplexity ? (
            <input
              autoFocus
              type="password"
              value={perplexityKey}
              onChange={e => setPerplexityKey(e.target.value)}
              onBlur={() => { localStorage.setItem(PERPLEXITY_KEY_STORAGE, perplexityKey); setEditingPerplexity(false) }}
              onKeyDown={e => { if (e.key === 'Enter') { localStorage.setItem(PERPLEXITY_KEY_STORAGE, perplexityKey); setEditingPerplexity(false) } }}
              placeholder="pplx-..."
              className="w-48 bg-zinc-900 border border-amber-600 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none placeholder-zinc-600"
            />
          ) : (
            <button
              onClick={() => setEditingPerplexity(true)}
              className={`text-xs transition-colors border rounded px-2 py-1 ${perplexityKey ? 'text-amber-400 border-amber-800/50 hover:border-amber-600' : 'text-zinc-600 border-zinc-800 hover:text-zinc-400'}`}
              title="Clique para configurar a chave Perplexity"
            >
              Chave Perplexity: <span className={perplexityKey ? 'text-green-400' : 'text-zinc-600'}>
                {perplexityKey ? '●●●●●●' : 'não configurada'}
              </span>
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
          {([['instagram', '🔍 Buscar Leads'], ['queue', 'Fila'], ['kanban', '📋 Kanban'], ['add', '+ Adicionar'], ['stats', 'Estatísticas']] as [Tab, string][]).map(([t, label]) => (
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
            {(['all', 'pending', 'following', 'engaging', 'message_ready', 'sent', 'replied', 'no_reply'] as const).map(s => (
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
              <div className="p-6 max-w-lg">
                <h2 className="text-base font-semibold mb-4">Como usar o CC Prospecter</h2>

                {/* Step 1 */}
                <div className={`mb-3 rounded-xl border p-4 ${perplexityKey ? 'border-green-800/40 bg-green-950/20' : 'border-amber-700/60 bg-amber-950/30'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${perplexityKey ? 'bg-green-700 text-white' : 'bg-amber-600 text-black'}`}>1</span>
                    <p className="text-sm font-semibold text-zinc-100">Configura a IA</p>
                    {perplexityKey && <span className="text-xs text-green-400 ml-auto">✓ pronto</span>}
                  </div>
                  {!perplexityKey ? (
                    <div>
                      <p className="text-xs text-zinc-400 mb-2">Cola a tua chave Perplexity para gerar mensagens personalizadas com IA.</p>
                      <input
                        type="password"
                        value={perplexityKey}
                        onChange={e => { setPerplexityKey(e.target.value); localStorage.setItem(PERPLEXITY_KEY_STORAGE, e.target.value) }}
                        placeholder="pplx-..."
                        className="w-full bg-zinc-900 border border-amber-600 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-700 focus:outline-none"
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-500">IA pronta para escrever mensagens personalizadas com base no bio do Instagram.</p>
                  )}
                </div>

                {/* Step 2 */}
                <div className="mb-3 rounded-xl border border-zinc-700 bg-zinc-900/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold w-5 h-5 rounded-full bg-zinc-600 text-white flex items-center justify-center flex-shrink-0">2</span>
                    <p className="text-sm font-semibold text-zinc-100">Busca leads no Instagram</p>
                  </div>
                  <p className="text-xs text-zinc-500 mb-3">Escolhe país + setor e clica buscar. O Apify vai procurar perfis por hashtag (#restaurantelisboa, #belezaportugal, etc.)</p>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <select value={igCountry} onChange={e => setIgCountry(e.target.value as ProspectCountry)}
                      className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-600">
                      <option value="PT">🇵🇹 Portugal</option>
                      <option value="ES">🇪🇸 Espanha</option>
                    </select>
                    <select value={igSector} onChange={e => setIgSector(e.target.value)}
                      className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 focus:outline-none focus:border-amber-600">
                      <option value="all">Todos os setores</option>
                      {['Restaurante / Alimentação','Clínica / Saúde','Estética / Beleza','Academia / Fitness','Turismo / Hotelaria','Comércio / Loja'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {apifyKey ? (
                    <button onClick={handleInstagramScrape} disabled={igLoading}
                      className="w-full py-2 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 text-zinc-100 text-sm font-semibold rounded-lg transition-colors">
                      {igLoading ? `Buscando... ${igStatus}` : '📸 Buscar no Instagram via Apify'}
                    </button>
                  ) : (
                    <div>
                      <input
                        type="password"
                        value={apifyKey}
                        onChange={e => { setApifyKey(e.target.value); localStorage.setItem(APIFY_KEY_STORAGE, e.target.value) }}
                        placeholder="Cola a chave Apify para buscar..."
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-amber-600 mb-2"
                      />
                      <p className="text-xs text-zinc-600">Ou usa os leads prontos abaixo ↓</p>
                    </div>
                  )}

                  {igStatus && !igLoading && (
                    <div className={`mt-2 text-xs px-3 py-2 rounded-lg ${igStatus.startsWith('✅') ? 'bg-green-900/30 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>
                      {igStatus}
                    </div>
                  )}

                  <div className="mt-3 pt-3 border-t border-zinc-800">
                    <p className="text-xs text-zinc-600 mb-2">Sem Apify? Usa 18 leads reais já prontos:</p>
                    <button onClick={handleLoadSeeds} disabled={igLoading}
                      className="w-full py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-black text-sm font-semibold rounded-lg transition-colors">
                      {igLoading ? 'Carregando...' : '⚡ Carregar 18 leads PT + ES grátis'}
                    </button>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="rounded-xl border border-zinc-700 bg-zinc-900/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold w-5 h-5 rounded-full bg-zinc-600 text-white flex items-center justify-center flex-shrink-0">3</span>
                    <p className="text-sm font-semibold text-zinc-100">Envia pelo Instagram ou WhatsApp</p>
                  </div>
                  <ol className="text-xs text-zinc-400 space-y-2 list-none">
                    <li className="flex gap-2"><span className="text-blue-400 font-bold flex-shrink-0">Dia 1</span> Clica <span className="text-blue-400 font-medium mx-1">"Seguir no Instagram"</span> — abre o perfil e marca como "a seguir"</li>
                    <li className="flex gap-2"><span className="text-violet-400 font-bold flex-shrink-0">Dia 2-3</span> Curte 1-2 posts, deixa um comentário genuíno no perfil deles</li>
                    <li className="flex gap-2"><span className="text-amber-400 font-bold flex-shrink-0">Dia 4</span> Clica <span className="text-violet-400 font-medium mx-1">"Já curti e comentei"</span> → gera mensagem com IA → clica <span className="text-rose-400 font-medium mx-1">"Enviar DM"</span></li>
                  </ol>
                </div>
              </div>
            )}

            {tab === 'kanban' && (() => {
              const COLUMNS: { status: ProspectStatus; label: string; color: string; dot: string }[] = [
                { status: 'pending',       label: 'Pendente',     color: 'border-zinc-700',     dot: 'bg-zinc-500' },
                { status: 'following',     label: 'A Seguir',     color: 'border-blue-700/60',  dot: 'bg-blue-500' },
                { status: 'engaging',      label: 'A Interagir',  color: 'border-violet-700/60',dot: 'bg-violet-500' },
                { status: 'sent',          label: 'DM Enviada',   color: 'border-teal-700/60',  dot: 'bg-teal-500' },
                { status: 'replied',       label: 'Respondeu',    color: 'border-green-700/60', dot: 'bg-green-500' },
                { status: 'no_reply',      label: 'Sem Resposta', color: 'border-zinc-700',     dot: 'bg-zinc-600' },
              ]
              const FLAG: Record<ProspectCountry, string> = { PT: '🇵🇹', ES: '🇪🇸' }
              const NOW = Date.now()
              const DAY = 86_400_000

              return (
                <div className="flex gap-3 p-4 overflow-x-auto h-full" style={{ minWidth: 'max-content' }}>
                  {COLUMNS.map(col => {
                    const cards = sortByPriority(prospects.filter(p => p.status === col.status))
                    const isOver = dragOver === col.status
                    return (
                      <div
                        key={col.status}
                        className={`flex flex-col rounded-xl border ${col.color} ${isOver ? 'ring-2 ring-amber-500/40' : ''} bg-zinc-900/60 w-52 flex-shrink-0 transition-all`}
                        onDragOver={e => { e.preventDefault(); setDragOver(col.status) }}
                        onDragLeave={() => setDragOver(null)}
                        onDrop={() => {
                          if (dragId) {
                            const p = prospects.find(x => x.id === dragId)
                            if (p) {
                              const extra: Partial<Prospect> =
                                col.status === 'following' ? { followedAt: p.followedAt || new Date().toISOString() } :
                                col.status === 'engaging'  ? { engagedAt: p.engagedAt || new Date().toISOString() } :
                                col.status === 'sent'      ? { sentAt: p.sentAt || new Date().toISOString() } : {}
                              const next = prospects.map(x => x.id === dragId ? { ...x, ...extra, status: col.status } : x)
                              persist(next)
                              if (col.status === 'sent' && p.status !== 'sent') {
                                const c = { ...campaign, sentToday: campaign.sentToday + 1 }
                                persistCampaign(c)
                              }
                            }
                          }
                          setDragId(null)
                          setDragOver(null)
                        }}
                      >
                        {/* Column header */}
                        <div className="px-3 py-2.5 flex items-center gap-2 border-b border-zinc-800">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${col.dot}`} />
                          <span className="text-xs font-semibold text-zinc-300">{col.label}</span>
                          <span className="ml-auto text-xs text-zinc-600 font-mono">{cards.length}</span>
                        </div>

                        {/* Cards */}
                        <div className="flex-1 overflow-y-auto p-2 space-y-2" style={{ maxHeight: 'calc(100vh - 160px)' }}>
                          {cards.length === 0 && (
                            <div className={`h-16 rounded-lg border-2 border-dashed flex items-center justify-center text-xs ${isOver ? 'border-amber-500/50 text-amber-500/50' : 'border-zinc-800 text-zinc-700'}`}>
                              {isOver ? 'Soltar aqui' : 'Vazio'}
                            </div>
                          )}
                          {cards.map(p => {
                            const isFollowingReady = p.status === 'following' && p.followedAt && (NOW - new Date(p.followedAt).getTime()) >= 2 * DAY
                            return (
                              <div
                                key={p.id}
                                draggable
                                onDragStart={() => setDragId(p.id)}
                                onDragEnd={() => { setDragId(null); setDragOver(null) }}
                                onClick={() => { setSelectedId(p.id); setTab('queue') }}
                                className={`bg-zinc-950 border rounded-lg p-2.5 cursor-grab active:cursor-grabbing transition-all hover:border-zinc-600 select-none ${dragId === p.id ? 'opacity-40' : ''} ${isFollowingReady ? 'border-amber-700/50' : 'border-zinc-800'}`}
                                title="Clica para abrir · Arrasta para mover"
                              >
                                <div className="flex items-start justify-between gap-1 mb-1.5">
                                  <span className="text-xs font-medium text-zinc-100 leading-tight truncate">{p.name.split(' ')[0]} {p.name.split(' ').slice(-1)[0]}</span>
                                  <span className="text-base flex-shrink-0 leading-none">{FLAG[p.country]}</span>
                                </div>
                                <p className="text-xs text-zinc-500 truncate mb-1.5">{p.company}</p>
                                <div className="flex items-center gap-1 flex-wrap">
                                  <span className="text-xs px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded truncate max-w-full">{p.sector.split(' /')[0]}</span>
                                  {isFollowingReady && (
                                    <span className="text-xs px-1.5 py-0.5 bg-amber-900/50 text-amber-400 rounded">pronto</span>
                                  )}
                                  {p.generatedMessage && (
                                    <span className="text-xs px-1.5 py-0.5 bg-violet-900/50 text-violet-400 rounded">msg ✓</span>
                                  )}
                                </div>
                                {p.status === 'following' && p.followedAt && (
                                  <p className="text-xs text-zinc-600 mt-1.5">
                                    {Math.floor((NOW - new Date(p.followedAt).getTime()) / DAY)}d a seguir
                                  </p>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })()}

            {tab === 'queue' && (
              <div className="p-6">
                {aiError && (
                  <div className="mb-4 px-4 py-2.5 bg-red-900/40 border border-red-800/50 rounded-lg text-xs text-red-300">
                    {aiError}
                  </div>
                )}
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

                          {/* Step indicators */}
                          {p.instagramUrl && (
                            <div className="flex items-center gap-1 mt-3 mb-2">
                              {(['following','engaging','sent'] as const).map((step, i) => {
                                const stepOrder = ['following','engaging','sent']
                                const currentIdx = stepOrder.indexOf(p.status)
                                const isDone = currentIdx > i
                                const isActive = currentIdx === i
                                return (
                                  <div key={step} className="flex items-center gap-1">
                                    <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${isDone ? 'bg-green-900/60 text-green-300' : isActive ? 'bg-amber-900/60 text-amber-300' : 'bg-zinc-800 text-zinc-600'}`}>
                                      {i+1}. {step === 'following' ? 'Seguir' : step === 'engaging' ? 'Interagir' : 'Enviar DM'}
                                    </div>
                                    {i < 2 && <span className="text-zinc-700 text-xs">→</span>}
                                  </div>
                                )
                              })}
                            </div>
                          )}

                          <div className="flex flex-wrap gap-2 mt-2">

                            {/* STEP 1 — PENDING: follow first */}
                            {p.status === 'pending' && p.instagramUrl && (
                              <button
                                onClick={() => handleMarkFollowing(p)}
                                className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 text-white text-xs font-semibold rounded-lg transition-colors"
                              >
                                1. Seguir no Instagram →
                              </button>
                            )}

                            {/* STEP 1 — PENDING, no Instagram: generate directly */}
                            {p.status === 'pending' && !p.instagramUrl && (
                              <>
                                <button onClick={() => handleGenerate(p)}
                                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black text-xs font-medium rounded-lg transition-colors">
                                  Gerar Mensagem
                                </button>
                                <button onClick={() => handleGenerateAI(p)} disabled={aiGenerating === p.id}
                                  className="px-3 py-1.5 bg-violet-700 hover:bg-violet-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors">
                                  {aiGenerating === p.id ? 'Gerando...' : 'Gerar com IA ✦'}
                                </button>
                              </>
                            )}

                            {/* STEP 2 — FOLLOWING: wait + engage */}
                            {p.status === 'following' && (
                              <div className="w-full">
                                <div className="mb-2 px-3 py-2 bg-blue-950/40 border border-blue-800/30 rounded-lg text-xs text-blue-300">
                                  📌 A seguir desde {p.followedAt ? new Date(p.followedAt).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' }) : '—'} — curte 1-2 posts e deixa um comentário genuíno antes de enviar a DM.
                                </div>
                                <button
                                  onClick={() => handleMarkEngaging(p)}
                                  className="px-3 py-1.5 bg-violet-700 hover:bg-violet-600 text-white text-xs font-semibold rounded-lg transition-colors"
                                >
                                  ✓ Já curti e comentei → Preparar DM
                                </button>
                                {p.instagramUrl && (
                                  <button
                                    onClick={() => window.open(p.instagramUrl, '_blank', 'noopener,noreferrer')}
                                    className="ml-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition-colors"
                                  >
                                    Abrir Instagram
                                  </button>
                                )}
                              </div>
                            )}

                            {/* STEP 3 — ENGAGING: generate + send DM */}
                            {(p.status === 'engaging' || p.status === 'message_ready') && (
                              <>
                                {!p.generatedMessage ? (
                                  <>
                                    <button onClick={() => handleGenerate(p)}
                                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-black text-xs font-medium rounded-lg transition-colors">
                                      Gerar Mensagem
                                    </button>
                                    <button onClick={() => handleGenerateAI(p)} disabled={aiGenerating === p.id}
                                      className="px-3 py-1.5 bg-violet-700 hover:bg-violet-600 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors">
                                      {aiGenerating === p.id ? 'Gerando...' : 'Gerar com IA ✦'}
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button onClick={() => handleGenerate(p)}
                                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition-colors">
                                      Regenerar
                                    </button>
                                    <button onClick={() => handleGenerateAI(p)} disabled={aiGenerating === p.id}
                                      className="px-3 py-1.5 bg-violet-900/60 hover:bg-violet-800/60 disabled:opacity-50 text-violet-300 text-xs rounded-lg transition-colors">
                                      {aiGenerating === p.id ? 'Gerando...' : 'IA ✦'}
                                    </button>
                                    <button onClick={() => handleCopy(p)}
                                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs rounded-lg transition-colors">
                                      {copied === p.id ? 'Copiado!' : 'Copiar'}
                                    </button>
                                    {p.instagramUrl && (
                                      <button
                                        onClick={() => {
                                          if (p.generatedMessage) navigator.clipboard.writeText(p.generatedMessage)
                                          window.open(p.instagramUrl, '_blank', 'noopener,noreferrer')
                                          handleMarkSent(p)
                                        }}
                                        className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white text-xs font-semibold rounded-lg transition-colors"
                                      >
                                        3. Enviar DM no Instagram →
                                      </button>
                                    )}
                                    {p.whatsapp && (
                                      <button
                                        onClick={() => {
                                          window.open(
                                            `https://wa.me/${p.whatsapp!.replace(/\D/g, '')}?text=${encodeURIComponent(p.generatedMessage || '')}`,
                                            '_blank', 'noopener,noreferrer'
                                          )
                                          handleMarkSent(p)
                                        }}
                                        className="px-3 py-1.5 bg-green-700 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition-colors"
                                      >
                                        Enviar WhatsApp →
                                      </button>
                                    )}
                                  </>
                                )}
                              </>
                            )}

                            {/* POST-SEND actions */}
                            {p.status === 'sent' && (
                              <>
                                <p className="w-full text-xs text-zinc-500 mb-1">DM enviada — como correu?</p>
                                <button onClick={() => handleStatusChange(p, 'replied')}
                                  className="px-3 py-1.5 bg-green-900/40 hover:bg-green-900/60 text-green-300 text-xs rounded-lg">
                                  Respondeu ✓
                                </button>
                                <button onClick={() => handleStatusChange(p, 'no_reply')}
                                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs rounded-lg">
                                  Sem Resposta
                                </button>
                                <button onClick={() => handleStatusChange(p, 'not_interested')}
                                  className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/50 text-red-400 text-xs rounded-lg">
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
                    { key: 'linkedinUrl', label: 'URL LinkedIn (opcional)', placeholder: 'https://linkedin.com/in/...' },
                    { key: 'instagramUrl', label: 'URL Instagram (opcional)', placeholder: 'https://instagram.com/empresa' },
                    { key: 'whatsapp', label: 'WhatsApp', placeholder: '+351 912 345 678' },
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
                    disabled={!form.name || !form.company || saving}
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

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { label: 'Total', value: stats.total, color: 'text-zinc-100' },
                    { label: 'A Seguir', value: stats.following, color: 'text-blue-400' },
                    { label: 'A Interagir', value: stats.engaging, color: 'text-violet-400' },
                    { label: 'DMs Enviadas', value: stats.sent, color: 'text-teal-400' },
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
                    <li><span className="text-blue-400">Dia 1:</span> Seguir no Instagram — abre o perfil e segues</li>
                    <li><span className="text-violet-400">Dia 2-3:</span> Curtir 1-2 posts, comentar genuinamente</li>
                    <li><span className="text-amber-400">Dia 4:</span> Gerar mensagem com IA personalizada</li>
                    <li><span className="text-rose-400">Dia 4:</span> Enviar DM pelo direct do Instagram</li>
                    <li>Registar se respondeu ou não</li>
                  </ol>
                </div>

                {stats.sent > 0 && (
                  <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                    <p className="text-xs text-zinc-500 mb-3">Status detalhado</p>
                    {(['pending', 'following', 'engaging', 'message_ready', 'sent', 'replied', 'no_reply', 'not_interested'] as ProspectStatus[]).map(s => {
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
