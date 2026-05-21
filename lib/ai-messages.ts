import { Prospect } from './prospecting-types'

const PERPLEXITY_API = 'https://api.perplexity.ai/chat/completions'
const MODEL = 'sonar'

function buildPrompt(prospect: Prospect): string {
  const firstName = prospect.name.split(' ')[0]
  const lang = prospect.country === 'ES' ? 'espanhol europeu' : 'português europeu'
  const notes = prospect.notes?.trim()
  const instagramUrl = (prospect as Prospect & { instagramUrl?: string }).instagramUrl?.trim()

  let contextBlock = ''
  if (notes) contextBlock += `\nBio/contexto: ${notes}`
  if (instagramUrl) contextBlock += `\nInstagram: ${instagramUrl}`

  return `Escreve uma mensagem curta de prospecção para um dono de PME via Instagram ou WhatsApp.

Dados do prospect:
- Nome: ${firstName}
- Empresa: ${prospect.company}
- Setor: ${prospect.sector}
- País: ${prospect.country === 'ES' ? 'Espanha' : 'Portugal'}${contextBlock}

Instruções obrigatórias:
- Escreve em ${lang} (NÃO inglês, NÃO português do Brasil)
- Máximo 4 linhas curtas + pergunta final de CTA
- Linha 1: começa com a DOR específica do setor de ${firstName} (ex: agenda vazia, mesa vazia, reservas perdidas)
- Linha 2: o que fazemos = design de feed que vende + tráfego pago que converte, para o setor deles em ${prospect.country === 'ES' ? 'Espanha' : 'Portugal'}
- Linha 3: equipa brasileira = metade do preço das agências locais, mesmo resultado
- Pergunta final: convite para 10-15 minutos de conversa
- Se tiver bio/contexto: usa UM detalhe específico na linha 1 para personalizar
- PROIBIDO: mencionar portfólio, links, URLs, saudações genéricas

Devolve APENAS o texto da mensagem, sem comentários, sem aspas, sem introdução.`
}

export async function generateAIMessage(
  prospect: Prospect & { instagramUrl?: string },
  apiKey: string
): Promise<string> {
  if (!apiKey) throw new Error('Chave Perplexity não configurada.')

  const prompt = buildPrompt(prospect)

  const res = await fetch(PERPLEXITY_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 300,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Perplexity API ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.choices[0].message.content.trim()
}
