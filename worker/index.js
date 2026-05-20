const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

async function handleContact(request, env) {
  const { nome, email, telefone, instagram, nicho, servico } = await request.json()

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Site Casa Criative <onboarding@resend.dev>',
      to: ['rafaalexander2@gmail.com', 'santosaline2802@gmail.com'],
      reply_to: email,
      subject: `Novo contato: ${nome} — ${servico}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px;background:#f9f9f9;border-radius:8px">
          <h2 style="color:#c47a4a;margin-bottom:24px">Novo contato pelo site</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="padding:8px 0;color:#555;font-size:13px;width:120px">Nome</td><td style="padding:8px 0;font-weight:600">${nome}</td></tr>
            <tr><td style="padding:8px 0;color:#555;font-size:13px">E-mail</td><td style="padding:8px 0;font-weight:600"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#555;font-size:13px">Telefone</td><td style="padding:8px 0;font-weight:600">${telefone}</td></tr>
            <tr><td style="padding:8px 0;color:#555;font-size:13px">Instagram</td><td style="padding:8px 0;font-weight:600">${instagram}</td></tr>
            <tr><td style="padding:8px 0;color:#555;font-size:13px">Nicho</td><td style="padding:8px 0;font-weight:600">${nicho}</td></tr>
            <tr><td style="padding:8px 0;color:#555;font-size:13px">Serviço</td><td style="padding:8px 0;font-weight:600">${servico}</td></tr>
          </table>
        </div>
      `,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('Resend error:', err)
    return new Response(JSON.stringify({ ok: false, detail: err }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

async function handleGenerateMessage(request, env) {
  if (!env.PERPLEXITY_API_KEY) {
    return new Response(JSON.stringify({ error: 'PERPLEXITY_API_KEY not configured' }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const prospect = await request.json()
  const isPortuguese = prospect.country === 'PT'
  const lang = isPortuguese ? 'português europeu' : 'espanhol'

  const systemPrompt = `Você é um especialista em copywriting B2B para agências de marketing digital.
Escreva mensagens de prospecção no LinkedIn extremamente personalizadas, diretas e humanas.

REGRAS OBRIGATÓRIAS:
- Escreva em ${lang} (não brasileiro)
- Máximo 150 palavras
- NÃO use emojis
- NÃO mencione "Casa Criative" — apresente como consultor independente
- Comece com o primeiro nome da pessoa, nunca com "Olá" ou "Oi"
- Mencione algo específico do setor/empresa para parecer personalizado
- Ofereça UM resultado claro e específico (ex: "mais clientes locais via Google", "página que converte visitantes em orçamentos")
- Termine com uma pergunta direta e fácil de responder
- Tom: profissional mas próximo, sem firulas corporativas
- Retorne APENAS o texto da mensagem, sem comentários ou explicações`

  const userPrompt = `Crie uma mensagem de prospecção no LinkedIn para:

Nome: ${prospect.name}
Cargo: ${prospect.title}
Empresa: ${prospect.company}
Setor: ${prospect.sector}
País: ${prospect.country === 'PT' ? 'Portugal' : 'Espanha'}
Tamanho da empresa: ${prospect.companySize} funcionários
${prospect.notes ? `Notas adicionais: ${prospect.notes}` : ''}`

  const res = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.PERPLEXITY_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'sonar',
      max_tokens: 400,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return new Response(JSON.stringify({ error: 'Perplexity API error', detail: err }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const data = await res.json()
  const message = data.choices?.[0]?.message?.content || ''

  return new Response(JSON.stringify({ message }), {
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    const url = new URL(request.url)

    try {
      if (url.pathname === '/generate-message') {
        return await handleGenerateMessage(request, env)
      }
      return await handleContact(request, env)
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: e.message }), {
        status: 500,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }
  },
}
