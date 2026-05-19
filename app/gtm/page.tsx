'use client'

import { useState } from 'react'

type Tab = 'pipeline' | 'campaign' | 'content' | 'objection'

const SEGMENTOS = [
  'Clínica Odontológica', 'Clínica Estética', 'Consultório Médico',
  'Restaurante', 'Academia/Crossfit', 'Imobiliária', 'Escritório de Advocacia',
  'Escola/Curso', 'E-commerce', 'Loja de Roupas', 'Pet Shop', 'Auto Center',
  'Farmácia', 'Hotel/Pousada', 'Salão de Beleza',
]

const SERVICOS = [
  'Tráfego Pago (Google + Meta Ads)',
  'Criação de Site Profissional',
  'SEO e Otimização Local',
  'Social Media e Conteúdo',
  'Pacote Marketing Completo',
]

const OBJECOES_COMUNS = [
  'Muito caro, não tenho esse orçamento agora',
  'Já tentei agência antes e não funcionou',
  'Meu sobrinho faz isso por menos',
  'Preciso pensar, me manda uma proposta',
  'Não tenho tempo para acompanhar isso',
  'Já tenho uma agência',
]

export default function GTMDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('pipeline')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState('')

  // Pipeline state
  const [lead, setLead] = useState({
    empresa: '', segmento: '', cidade: 'Curitiba',
    site: '', instagram: '', responsavel: '', dor: '', notas: '',
  })

  // Campaign state
  const [campaign, setCampaign] = useState({
    segmento: SEGMENTOS[0], servico: SERVICOS[0], cidade: 'Curitiba',
  })

  // Content state
  const [content, setContent] = useState<{
    tema: string
    segmentoAlvo: string
    intencao: 'informacional' | 'comercial' | 'transacional'
  }>({
    tema: '', segmentoAlvo: '', intencao: 'comercial',
  })

  // Objection state
  const [objection, setObjection] = useState({ objecao: '', contexto: '' })

  async function callAPI(endpoint: string, body: object) {
    setLoading(true)
    setResult(null)
    setError('')
    try {
      const res = await fetch(`/api/gtm/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro na API')
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  function copyText(text: string, key: string) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(''), 2000)
  }

  const scoreColor = (score: number) =>
    score >= 70 ? 'text-green-400' : score >= 40 ? 'text-yellow-400' : 'text-red-400'

  const urgenciaColor = (u: string) =>
    u === 'alta' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
    u === 'media' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
    'bg-green-500/20 text-green-400 border-green-500/30'

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Header */}
      <div className="border-b border-white/5 bg-[#0d0d14]">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-sm font-bold">G</div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">GTM Engine</h1>
              <p className="text-xs text-white/40">Casa Criative Digital · Agentes de Vendas IA</p>
            </div>
          </div>
          <div className="flex gap-2 text-xs text-white/30">
            <span className="px-2 py-1 rounded-md bg-white/5 border border-white/10">claude-haiku</span>
            <span className="px-2 py-1 rounded-md bg-green-500/10 border border-green-500/20 text-green-400">5 agentes ativos</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit mb-8">
          {([
            { id: 'pipeline', label: 'Prospectar Lead', icon: '🎯' },
            { id: 'campaign', label: 'Montar Campanha', icon: '🚀' },
            { id: 'content', label: 'Brief de Conteúdo', icon: '✍️' },
            { id: 'objection', label: 'Quebrar Objeção', icon: '🛡️' },
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setResult(null); setError('') }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/20'
                  : 'text-white/50 hover:text-white/80'
              }`}
            >
              <span className="mr-1.5">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12">
          {/* Left: Input Panel */}
          <div className="bg-[#111118] border border-white/5 rounded-2xl p-6">

            {/* TAB: PIPELINE */}
            {activeTab === 'pipeline' && (
              <div>
                <h2 className="text-base font-semibold mb-1">Qualificar + Escrever Outreach</h2>
                <p className="text-sm text-white/40 mb-5">Preencha o que sabe sobre o lead. O agente qualifica e já escreve as mensagens.</p>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-white/50 block mb-1">Empresa *</label>
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50 placeholder-white/20"
                        placeholder="ex: Clínica Sorriso"
                        value={lead.empresa}
                        onChange={e => setLead({ ...lead, empresa: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 block mb-1">Segmento *</label>
                      <select
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50"
                        value={lead.segmento}
                        onChange={e => setLead({ ...lead, segmento: e.target.value })}
                      >
                        <option value="">Selecione...</option>
                        {SEGMENTOS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-white/50 block mb-1">Cidade</label>
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50 placeholder-white/20"
                        placeholder="Curitiba"
                        value={lead.cidade}
                        onChange={e => setLead({ ...lead, cidade: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 block mb-1">Responsável</label>
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50 placeholder-white/20"
                        placeholder="Dr. João"
                        value={lead.responsavel}
                        onChange={e => setLead({ ...lead, responsavel: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-white/50 block mb-1">Site</label>
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50 placeholder-white/20"
                        placeholder="clinicasorriso.com.br"
                        value={lead.site}
                        onChange={e => setLead({ ...lead, site: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-xs text-white/50 block mb-1">Instagram</label>
                      <input
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50 placeholder-white/20"
                        placeholder="@clinicasorriso"
                        value={lead.instagram}
                        onChange={e => setLead({ ...lead, instagram: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 block mb-1">Dor / Problema que mencionaram</label>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50 placeholder-white/20"
                      placeholder="ex: não aparece no Google, site antigo, sem leads..."
                      value={lead.dor}
                      onChange={e => setLead({ ...lead, dor: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 block mb-1">Notas adicionais</label>
                    <textarea
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50 placeholder-white/20 resize-none"
                      rows={2}
                      placeholder="qualquer info relevante sobre o lead..."
                      value={lead.notas}
                      onChange={e => setLead({ ...lead, notas: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={() => callAPI('pipeline', lead)}
                    disabled={loading || !lead.empresa || !lead.segmento}
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-semibold transition-all"
                  >
                    {loading ? '⚡ Agentes trabalhando...' : '🎯 Qualificar + Gerar Outreach'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB: CAMPAIGN */}
            {activeTab === 'campaign' && (
              <div>
                <h2 className="text-base font-semibold mb-1">Montar Campanha GTM</h2>
                <p className="text-sm text-white/40 mb-5">Gera sequência de outreach completa + value prop + quebra de objeções para um segmento.</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-white/50 block mb-1">Segmento-alvo</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50"
                      value={campaign.segmento}
                      onChange={e => setCampaign({ ...campaign, segmento: e.target.value })}
                    >
                      {SEGMENTOS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 block mb-1">Serviço principal</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50"
                      value={campaign.servico}
                      onChange={e => setCampaign({ ...campaign, servico: e.target.value })}
                    >
                      {SERVICOS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 block mb-1">Cidade / Região</label>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50 placeholder-white/20"
                      placeholder="Curitiba"
                      value={campaign.cidade}
                      onChange={e => setCampaign({ ...campaign, cidade: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={() => callAPI('campaign', campaign)}
                    disabled={loading}
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-semibold transition-all"
                  >
                    {loading ? '⚡ Construindo campanha...' : '🚀 Montar Campanha GTM'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB: CONTENT */}
            {activeTab === 'content' && (
              <div>
                <h2 className="text-base font-semibold mb-1">Gerar Brief de Conteúdo</h2>
                <p className="text-sm text-white/40 mb-5">Gera briefs otimizados para SEO para atrair leads inbound no blog.</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-white/50 block mb-1">Tema / Assunto *</label>
                    <input
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50 placeholder-white/20"
                      placeholder="ex: tráfego pago para clínicas, google ads curitiba..."
                      value={content.tema}
                      onChange={e => setContent({ ...content, tema: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 block mb-1">Segmento-alvo do leitor *</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50"
                      value={content.segmentoAlvo}
                      onChange={e => setContent({ ...content, segmentoAlvo: e.target.value })}
                    >
                      <option value="">Selecione...</option>
                      {SEGMENTOS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-white/50 block mb-1">Intenção de busca</label>
                    <div className="flex gap-2">
                      {(['informacional', 'comercial', 'transacional'] as const).map(i => (
                        <button
                          key={i}
                          onClick={() => setContent({ ...content, intencao: i })}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium capitalize border transition-all ${
                            content.intencao === i
                              ? 'bg-violet-600/30 border-violet-500/50 text-violet-300'
                              : 'bg-white/5 border-white/10 text-white/50'
                          }`}
                        >
                          {i}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => callAPI('content', content)}
                    disabled={loading || !content.tema || !content.segmentoAlvo}
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-semibold transition-all"
                  >
                    {loading ? '⚡ Criando brief...' : '✍️ Gerar Brief de Conteúdo'}
                  </button>
                </div>
              </div>
            )}

            {/* TAB: OBJECTION */}
            {activeTab === 'objection' && (
              <div>
                <h2 className="text-base font-semibold mb-1">Quebrar Objeção em Tempo Real</h2>
                <p className="text-sm text-white/40 mb-5">O lead falou uma objeção? Cole aqui e receba a resposta ideal para não perder a venda.</p>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-white/50 block mb-1">Objeção do lead</label>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {OBJECOES_COMUNS.map(o => (
                        <button
                          key={o}
                          onClick={() => setObjection({ ...objection, objecao: o })}
                          className={`text-left text-xs px-3 py-2 rounded-lg border transition-all ${
                            objection.objecao === o
                              ? 'bg-violet-600/20 border-violet-500/40 text-violet-300'
                              : 'bg-white/3 border-white/8 text-white/50 hover:text-white/70'
                          }`}
                        >
                          {o}
                        </button>
                      ))}
                    </div>
                    <textarea
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50 placeholder-white/20 resize-none"
                      rows={2}
                      placeholder="ou escreva a objeção exata do lead..."
                      value={objection.objecao}
                      onChange={e => setObjection({ ...objection, objecao: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 block mb-1">Contexto da conversa (opcional)</label>
                    <textarea
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-violet-500/50 placeholder-white/20 resize-none"
                      rows={2}
                      placeholder="ex: reunião presencial, interessado em tráfego pago, orçamento R$2k..."
                      value={objection.contexto}
                      onChange={e => setObjection({ ...objection, contexto: e.target.value })}
                    />
                  </div>
                  <button
                    onClick={() => callAPI('objection', objection)}
                    disabled={loading || !objection.objecao}
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl text-sm font-semibold transition-all"
                  >
                    {loading ? '⚡ Analisando objeção...' : '🛡️ Quebrar Objeção'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right: Output Panel */}
          <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 min-h-[400px]">
            {loading && (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-violet-500 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
                <p className="text-sm text-white/40">Agentes IA processando...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-sm text-red-400">
                <strong>Erro:</strong> {error}
                {error.includes('ANTHROPIC_API_KEY') && (
                  <p className="mt-2 text-xs text-red-300/70">Configure a variável de ambiente <code className="bg-red-500/20 px-1 rounded">ANTHROPIC_API_KEY</code> no seu .env.local</p>
                )}
              </div>
            )}

            {!loading && !error && !result && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                <div className="text-4xl opacity-30">🤖</div>
                <p className="text-sm text-white/30">Preencha o formulário e acione o agente</p>
              </div>
            )}

            {/* PIPELINE RESULT */}
            {!loading && result && activeTab === 'pipeline' && (
              <div className="space-y-5 overflow-y-auto max-h-[70vh]">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Análise do Lead</h3>
                  <span className={`text-2xl font-bold ${scoreColor(result.qualification?.score ?? 0)}`}>
                    {result.qualification?.score}/100
                  </span>
                </div>

                <div className="bg-white/3 rounded-xl p-4 space-y-3">
                  <div>
                    <p className="text-xs text-white/40 mb-1">Justificativa</p>
                    <p className="text-sm">{result.qualification?.justificativa}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">Dores Identificadas</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.qualification?.doresIdentificadas?.map((d: string, i: number) => (
                        <span key={i} className="text-xs bg-orange-500/15 text-orange-300 border border-orange-500/20 px-2 py-0.5 rounded-full">{d}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div>
                      <p className="text-xs text-white/40 mb-1">Canal</p>
                      <span className="text-xs bg-blue-500/15 text-blue-300 border border-blue-500/20 px-2 py-1 rounded-lg capitalize">
                        {result.qualification?.canalPrioritario}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs text-white/40 mb-1">Urgência</p>
                      <span className={`text-xs border px-2 py-1 rounded-lg capitalize ${urgenciaColor(result.qualification?.urgencia)}`}>
                        {result.qualification?.urgencia}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-1">Abordagem Recomendada</p>
                    <p className="text-sm text-violet-300">{result.qualification?.abordagemRecomendada}</p>
                  </div>
                </div>

                {[
                  { key: 'whatsapp', icon: '💬', label: 'WhatsApp' },
                  { key: 'email', icon: '📧', label: 'Email' },
                ].map(({ key, icon, label }) => {
                  const msg = result[key]
                  if (!msg) return null
                  return (
                    <div key={key} className="bg-white/3 rounded-xl p-4 space-y-3">
                      <h4 className="text-sm font-semibold flex items-center gap-2">
                        <span>{icon}</span> {label}
                      </h4>
                      {msg.assunto && (
                        <div>
                          <p className="text-xs text-white/40 mb-1">Assunto</p>
                          <p className="text-sm font-medium text-yellow-300">{msg.assunto}</p>
                        </div>
                      )}
                      {[
                        { label: 'Mensagem Inicial', value: msg.mensagem, copyKey: `${key}-msg` },
                        { label: 'Follow-up 1 (3 dias)', value: msg.followUp1, copyKey: `${key}-f1` },
                        { label: 'Follow-up 2 (7 dias)', value: msg.followUp2, copyKey: `${key}-f2` },
                      ].map(({ label: l, value, copyKey }) => (
                        <div key={copyKey}>
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-xs text-white/40">{l}</p>
                            <button
                              onClick={() => copyText(value, copyKey)}
                              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
                            >
                              {copied === copyKey ? '✓ Copiado' : 'Copiar'}
                            </button>
                          </div>
                          <p className="text-sm bg-white/5 rounded-lg p-3 leading-relaxed whitespace-pre-wrap">{value}</p>
                        </div>
                      ))}
                    </div>
                  )
                })}
              </div>
            )}

            {/* CAMPAIGN RESULT */}
            {!loading && result && activeTab === 'campaign' && (
              <div className="space-y-4 overflow-y-auto max-h-[70vh]">
                <div>
                  <h3 className="font-semibold">{result.nome}</h3>
                  <p className="text-sm text-violet-300 mt-1 font-medium">{result.promessa}</p>
                </div>
                <div className="bg-white/3 rounded-xl p-4">
                  <p className="text-xs text-white/40 mb-2">Provas Sociais / Argumentos</p>
                  {result.provas?.map((p: string, i: number) => (
                    <p key={i} className="text-sm flex gap-2 mb-1.5"><span className="text-green-400">✓</span>{p}</p>
                  ))}
                </div>
                <div className="bg-white/3 rounded-xl p-4">
                  <p className="text-xs text-white/40 mb-2">Objeções + Como Quebrar</p>
                  {result.objecoes?.map((o: string, i: number) => (
                    <p key={i} className="text-sm flex gap-2 mb-2"><span className="text-orange-400">⚡</span>{o}</p>
                  ))}
                </div>
                {result.sequenciaOutreach?.map((msg: any, i: number) => (
                  <div key={i} className="bg-white/3 rounded-xl p-4 space-y-3">
                    <p className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Sequência de Outreach</p>
                    {[
                      { label: 'Toque 1', value: msg.mensagem },
                      { label: 'Toque 2 (3 dias)', value: msg.followUp1 },
                      { label: 'Toque 3 (7 dias)', value: msg.followUp2 },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <div className="flex justify-between mb-1">
                          <p className="text-xs text-white/40">{label}</p>
                          <button onClick={() => copyText(value, label)} className="text-xs text-violet-400 hover:text-violet-300">
                            {copied === label ? '✓ Copiado' : 'Copiar'}
                          </button>
                        </div>
                        <p className="text-sm bg-white/5 rounded-lg p-3 whitespace-pre-wrap leading-relaxed">{value}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* CONTENT RESULT */}
            {!loading && result && activeTab === 'content' && (
              <div className="space-y-4 overflow-y-auto max-h-[70vh]">
                <div>
                  <h3 className="font-semibold text-lg leading-snug">{result.titulo}</h3>
                  <p className="text-sm text-white/60 mt-1">{result.subtitulo}</p>
                </div>
                <div className="bg-white/3 rounded-xl p-4">
                  <p className="text-xs text-white/40 mb-2">Palavras-Chave</p>
                  <div className="flex flex-wrap gap-1.5">
                    {result.palavrasChave?.map((kw: string) => (
                      <span key={kw} className="text-xs bg-blue-500/15 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full">{kw}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-white/3 rounded-xl p-4">
                  <p className="text-xs text-white/40 mb-2">Estrutura do Artigo (H2s)</p>
                  {result.estrutura?.map((h: string, i: number) => (
                    <p key={i} className="text-sm flex gap-2 mb-1.5 text-white/80"><span className="text-white/30">H2</span>{h}</p>
                  ))}
                </div>
                <div className="bg-white/3 rounded-xl p-4">
                  <div className="flex justify-between mb-1">
                    <p className="text-xs text-white/40">Introdução</p>
                    <button onClick={() => copyText(result.introducao, 'intro')} className="text-xs text-violet-400 hover:text-violet-300">
                      {copied === 'intro' ? '✓ Copiado' : 'Copiar'}
                    </button>
                  </div>
                  <p className="text-sm leading-relaxed">{result.introducao}</p>
                </div>
                <div className="bg-white/3 rounded-xl p-4">
                  <p className="text-xs text-white/40 mb-1">Ângulo Diferenciador</p>
                  <p className="text-sm text-violet-300">{result.angulo}</p>
                </div>
                <div className="bg-white/3 rounded-xl p-4">
                  <p className="text-xs text-white/40 mb-1">CTA do Artigo</p>
                  <p className="text-sm text-green-300">{result.cta}</p>
                </div>
              </div>
            )}

            {/* OBJECTION RESULT */}
            {!loading && result && activeTab === 'objection' && (
              <div className="space-y-4 overflow-y-auto max-h-[70vh]">
                <h3 className="font-semibold">Resposta para a Objeção</h3>
                {[
                  { label: 'Resposta Imediata', value: result.resposta, color: 'text-white', bg: 'bg-white/5', copyKey: 'resp' },
                  { label: 'Reframe (muda perspectiva)', value: result.reframe, color: 'text-violet-300', bg: 'bg-violet-500/10', copyKey: 'reframe' },
                  { label: 'Prova / Evidência', value: result.prova, color: 'text-green-300', bg: 'bg-green-500/10', copyKey: 'prova' },
                  { label: 'Pergunta de Fechamento', value: result.fechamento, color: 'text-yellow-300', bg: 'bg-yellow-500/10', copyKey: 'fecha' },
                ].map(({ label, value, color, bg, copyKey }) => (
                  <div key={copyKey} className={`rounded-xl p-4 ${bg} border border-white/5`}>
                    <div className="flex justify-between mb-2">
                      <p className="text-xs text-white/40">{label}</p>
                      <button onClick={() => copyText(value, copyKey)} className="text-xs text-violet-400 hover:text-violet-300">
                        {copied === copyKey ? '✓ Copiado' : 'Copiar'}
                      </button>
                    </div>
                    <p className={`text-sm leading-relaxed ${color}`}>{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
