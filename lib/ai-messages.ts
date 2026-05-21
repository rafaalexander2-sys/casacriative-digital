import { Prospect } from './prospecting-types'

const PERPLEXITY_API = 'https://api.perplexity.ai/chat/completions'
const MODEL = 'sonar'

function buildPrompt(prospect: Prospect, portfolioUrl: string): string {
  const firstName = prospect.name.split(' ')[0]
  const lang = prospect.country === 'ES' ? 'espanhol' : 'português europeu'
  const notes = prospect.notes?.trim()
  const instagramUrl = (prospect as Prospect & { instagramUrl?: string }).instagramUrl?.trim()

  let contextBlock = ''
  if (notes) contextBlock += `\nNotas sobre o prospect: ${notes}`
  if (instagramUrl) contextBlock += `\nInstagram: ${instagramUrl}`

  return `Escreve uma mensagem de prospecção no LinkedIn para um dono de PME.

Dados do prospect:
- Nome: ${prospect.name} (trata por ${firstName})
- Cargo: ${prospect.title}
- Empresa: ${prospect.company}
- Setor: ${prospect.sector}
- País: ${prospect.country === 'ES' ? 'Espanha' : 'Portugal'}
- Tamanho da empresa: ${prospect.companySize} funcionários${contextBlock}

Instruções:
- Escreve em ${lang} (não inglês, não português do Brasil)
- Tom: direto, humano, sem jargão de vendas
- Máximo 5 linhas + CTA no final
- Menciona que somos uma agência brasileira com preços acessíveis e qualidade europeia
- Inclui o portfólio: ${portfolioUrl || 'casacriative.com.br'}
- Personaliza com base nas notas e no Instagram se disponíveis
- Não uses saudações genéricas tipo "Espero que estejas bem"
- Termina com uma pergunta para marcar uma call de 10-15 min

Devolve APENAS o texto da mensagem, sem comentários, sem aspas, sem introdução.`
}

export async function generateAIMessage(
  prospect: Prospect & { instagramUrl?: string },
  portfolioUrl: string,
  apiKey: string
): Promise<string> {
  if (!apiKey) throw new Error('Chave Perplexity não configurada.')

  const prompt = buildPrompt(prospect, portfolioUrl)

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
