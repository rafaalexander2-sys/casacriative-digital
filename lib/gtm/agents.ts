import Anthropic from '@anthropic-ai/sdk'
import {
  Lead,
  ProspectResult,
  OutreachMessage,
  ContentBrief,
  GTMCampaign,
} from './types'
import {
  PROSPECT_QUALIFIER_PROMPT,
  OUTREACH_WRITER_PROMPT,
  CONTENT_STRATEGIST_PROMPT,
  CAMPAIGN_BUILDER_PROMPT,
  OBJECTION_HANDLER_PROMPT,
} from './prompts'

function getClient(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('ANTHROPIC_API_KEY não configurada')
  return new Anthropic({ apiKey: key })
}

function extractJSON(text: string): string {
  const match = text.match(/```json\s*([\s\S]*?)```/) ||
    text.match(/```\s*([\s\S]*?)```/) ||
    text.match(/(\{[\s\S]*\})/);
  return match ? match[1].trim() : text.trim()
}

// ── AGENTE 1: Qualificador de Lead ─────────────────────────────────────────
export async function qualifyLead(lead: Lead): Promise<ProspectResult> {
  const client = getClient()

  const prompt = `Analise este lead e retorne um JSON com a qualificação:

Lead:
- Empresa: ${lead.empresa}
- Segmento: ${lead.segmento}
- Cidade: ${lead.cidade ?? 'não informada'}
- Site: ${lead.site ?? 'sem site'}
- Instagram: ${lead.instagram ?? 'não informado'}
- Responsável: ${lead.responsavel ?? 'não informado'}
- Dor relatada: ${lead.dor ?? 'não informada'}
- Notas adicionais: ${lead.notas ?? 'nenhuma'}

Retorne EXATAMENTE este JSON (sem markdown):
{
  "score": <número 0-100>,
  "justificativa": "<por que este score>",
  "doresIdentificadas": ["<dor 1>", "<dor 2>", "<dor 3>"],
  "abordagemRecomendada": "<como abordar este lead especificamente>",
  "canalPrioritario": "<whatsapp|email|linkedin|instagram>",
  "urgencia": "<alta|media|baixa>"
}`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    system: PROSPECT_QUALIFIER_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return JSON.parse(extractJSON(text)) as ProspectResult
}

// ── AGENTE 2: Escritor de Outreach ─────────────────────────────────────────
export async function writeOutreach(
  lead: Lead,
  qualification: ProspectResult,
  canal: 'whatsapp' | 'email' | 'linkedin' | 'instagram'
): Promise<OutreachMessage> {
  const client = getClient()

  const prompt = `Escreva uma sequência de outreach para:

Lead: ${lead.empresa} (${lead.segmento}, ${lead.cidade ?? 'Curitiba'})
Score: ${qualification.score}/100
Dores: ${qualification.doresIdentificadas.join(', ')}
Canal: ${canal}
Abordagem: ${qualification.abordagemRecomendada}

Retorne EXATAMENTE este JSON (sem markdown):
{
  "canal": "${canal}",
  "assunto": "<assunto do email - apenas para email, vazio para outros>",
  "mensagem": "<primeira mensagem de contato>",
  "followUp1": "<follow-up 3 dias depois - diferente ângulo>",
  "followUp2": "<follow-up 7 dias depois - urgência/escassez suave>",
  "cta": "<call-to-action específico usado na mensagem>"
}`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1200,
    system: OUTREACH_WRITER_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return JSON.parse(extractJSON(text)) as OutreachMessage
}

// ── AGENTE 3: Estrategista de Conteúdo ─────────────────────────────────────
export async function generateContentBrief(
  tema: string,
  segmentoAlvo: string,
  intencao: 'informacional' | 'comercial' | 'transacional'
): Promise<ContentBrief> {
  const client = getClient()

  const prompt = `Crie um brief de conteúdo para nosso blog:

Tema: ${tema}
Segmento-alvo do leitor: ${segmentoAlvo}
Intenção de busca: ${intencao}

Retorne EXATAMENTE este JSON (sem markdown):
{
  "titulo": "<título SEO otimizado com keyword>",
  "subtitulo": "<subtítulo que complementa>",
  "palavrasChave": ["<kw 1>", "<kw 2>", "<kw 3>", "<kw 4>", "<kw 5>"],
  "estrutura": ["<H2 1>", "<H2 2>", "<H2 3>", "<H2 4>", "<H2 5>"],
  "introducao": "<parágrafo de abertura que fisga o leitor (80 palavras)>",
  "angulo": "<diferencial único deste artigo vs concorrentes>",
  "cta": "<call-to-action ao fim do artigo>"
}`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1000,
    system: CONTENT_STRATEGIST_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return JSON.parse(extractJSON(text)) as ContentBrief
}

// ── AGENTE 4: Construtor de Campanha GTM ───────────────────────────────────
export async function buildGTMCampaign(
  segmento: string,
  servico: string,
  cidade: string
): Promise<GTMCampaign> {
  const client = getClient()

  const prompt = `Crie uma campanha GTM completa:

Segmento-alvo: ${segmento}
Serviço a vender: ${servico}
Cidade/região: ${cidade}

Retorne EXATAMENTE este JSON (sem markdown):
{
  "nome": "<nome da campanha>",
  "segmentoAlvo": "${segmento}",
  "promessa": "<value proposition única em 1 frase impactante>",
  "provas": ["<prova 1>", "<prova 2>", "<prova 3>"],
  "objecoes": ["<objeção 1 + como quebrar>", "<objeção 2 + como quebrar>", "<objeção 3 + como quebrar>"],
  "sequenciaOutreach": [
    {
      "canal": "whatsapp",
      "assunto": "",
      "mensagem": "<toque 1 - primeiro contato>",
      "followUp1": "<toque 2 - 3 dias>",
      "followUp2": "<toque 3 - 7 dias>",
      "cta": "<CTA específico>"
    }
  ]
}`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    system: CAMPAIGN_BUILDER_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return JSON.parse(extractJSON(text)) as GTMCampaign
}

// ── AGENTE 5: Quebrador de Objeções ────────────────────────────────────────
export async function handleObjection(
  objecao: string,
  contexto?: string
): Promise<{ resposta: string; reframe: string; prova: string; fechamento: string }> {
  const client = getClient()

  const prompt = `O prospect disse: "${objecao}"
${contexto ? `Contexto da conversa: ${contexto}` : ''}

Retorne EXATAMENTE este JSON (sem markdown):
{
  "resposta": "<resposta empática e direta para usar agora - tom natural de conversa>",
  "reframe": "<como mudar a perspectiva deles>",
  "prova": "<evidência ou case que destrói a objeção>",
  "fechamento": "<pergunta de fechamento para avançar na venda>"
}`

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    system: OBJECTION_HANDLER_PROMPT,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  return JSON.parse(extractJSON(text))
}

// ── AGENTE 6: Pipeline Completo (Qualifica + Escreve) ──────────────────────
export async function runFullProspectPipeline(lead: Lead): Promise<{
  qualification: ProspectResult
  whatsapp: OutreachMessage
  email: OutreachMessage
}> {
  const qualification = await qualifyLead(lead)
  const canal = qualification.canalPrioritario

  const [primary, secondary] = await Promise.all([
    writeOutreach(lead, qualification, canal === 'email' ? 'email' : 'whatsapp'),
    writeOutreach(lead, qualification, canal === 'email' ? 'whatsapp' : 'email'),
  ])

  return {
    qualification,
    whatsapp: primary.canal === 'whatsapp' ? primary : secondary,
    email: primary.canal === 'email' ? primary : secondary,
  }
}
