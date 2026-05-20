const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

// ── Contact form ──────────────────────────────────────────────────────────────

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
    return new Response(JSON.stringify({ ok: false, detail: err }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

// ── Message generation (Perplexity) ───────────────────────────────────────────

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
Escreva em ${lang}. Máximo 150 palavras. NÃO use emojis. Retorne APENAS o texto da mensagem.`

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
        { role: 'user', content: `Nome: ${prospect.name}\nCargo: ${prospect.title}\nEmpresa: ${prospect.company}\nSetor: ${prospect.sector}\nPaís: ${prospect.country === 'PT' ? 'Portugal' : 'Espanha'}` },
      ],
    }),
  })

  const data = await res.json()
  const message = data.choices?.[0]?.message?.content || ''
  return new Response(JSON.stringify({ message }), {
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

// ── Instagram prospecting (Apify) ─────────────────────────────────────────────

// Hashtags por setor para PT e ES
const HASHTAGS = {
  PT: [
    'restauranteportugal', 'restaurantelisboa', 'restaurantoporto',
    'clinicalisboa', 'clinicaportugal', 'saudeportugal',
    'cabelereiroPortugal', 'belezaportugal', 'esteticalisboa',
    'negociolocal', 'empresaportugal', 'empreendedorismoportugal',
    'ginasiolisboa', 'fitnessportugal',
    'advocaciaportugal', 'advogadoportugal',
  ],
  ES: [
    'restaurantemadrid', 'restaurantebarcelona', 'hosteleria',
    'clinicamadrid', 'saludybienestar', 'clinicaestetica',
    'peluqueriamadrid', 'esteticamadrid', 'bellezaespana',
    'negociolocal', 'emprendedoresespana', 'pymesespana',
    'gimnasioespana', 'fitnessespana',
    'abogadosespana', 'despachoabogados',
  ],
}

async function startApifyScrape(request, env) {
  if (!env.APIFY_API_KEY) {
    return new Response(JSON.stringify({ error: 'APIFY_API_KEY not configured' }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const { country = 'PT', sector = 'all', limit = 30 } = await request.json()
  const countryKey = country === 'ES' ? 'ES' : 'PT'

  // Seleciona hashtags relevantes para o setor
  const sectorHashtagMap = {
    'Restaurante / Alimentação': countryKey === 'PT'
      ? ['restauranteportugal', 'restaurantelisboa', 'restaurantoporto']
      : ['restaurantemadrid', 'restaurantebarcelona', 'hosteleria'],
    'Clínica / Saúde': countryKey === 'PT'
      ? ['clinicalisboa', 'clinicaportugal', 'saudeportugal']
      : ['clinicamadrid', 'saludybienestar'],
    'Estética / Beleza': countryKey === 'PT'
      ? ['cabelereiroPortugal', 'belezaportugal', 'esteticalisboa']
      : ['peluqueriamadrid', 'esteticamadrid', 'bellezaespana'],
    'Academia / Fitness': countryKey === 'PT'
      ? ['ginasiolisboa', 'fitnessportugal']
      : ['gimnasioespana', 'fitnessespana'],
    'Advocacia / Jurídico': countryKey === 'PT'
      ? ['advocaciaportugal', 'advogadoportugal']
      : ['abogadosespana', 'despachoabogados'],
  }

  const hashtags = sector !== 'all' && sectorHashtagMap[sector]
    ? sectorHashtagMap[sector]
    : HASHTAGS[countryKey].slice(0, 5)

  // 1. Roda o hashtag scraper
  const hashtagRun = await fetch(
    `https://api.apify.com/v2/acts/apify~instagram-hashtag-scraper/runs?token=${env.APIFY_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        hashtags,
        resultsLimit: limit,
        addParentData: true,
      }),
    }
  )

  if (!hashtagRun.ok) {
    const err = await hashtagRun.text()
    return new Response(JSON.stringify({ error: 'Apify run failed', detail: err }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const runData = await hashtagRun.json()
  const runId = runData.data?.id

  return new Response(JSON.stringify({
    ok: true,
    runId,
    hashtags,
    message: `Scraping iniciado. ${hashtags.length} hashtags. Chame /instagram-results?runId=${runId} em ~1 minuto.`,
  }), {
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

async function getApifyResults(request, env) {
  if (!env.APIFY_API_KEY) {
    return new Response(JSON.stringify({ error: 'APIFY_API_KEY not configured' }), {
      status: 500,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  const url = new URL(request.url)
  const runId = url.searchParams.get('runId')

  if (!runId) {
    return new Response(JSON.stringify({ error: 'runId required' }), {
      status: 400,
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // Verifica status do run
  const statusRes = await fetch(
    `https://api.apify.com/v2/actor-runs/${runId}?token=${env.APIFY_API_KEY}`
  )
  const statusData = await statusRes.json()
  const status = statusData.data?.status

  if (status !== 'SUCCEEDED') {
    return new Response(JSON.stringify({ ok: false, status, message: 'Ainda processando...' }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }

  // Pega os resultados
  const datasetId = statusData.data?.defaultDatasetId
  const itemsRes = await fetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${env.APIFY_API_KEY}&limit=100`
  )
  const items = await itemsRes.json()

  // Transforma em prospects do dashboard
  const prospects = items
    .filter(item => item.ownerUsername && item.ownerFullName)
    .map(item => ({
      id: Math.random().toString(36).slice(2, 10),
      name: item.ownerFullName || item.ownerUsername,
      title: 'Dono(a)',
      company: item.ownerUsername,
      country: 'PT',
      sector: 'Outro',
      companySize: '1-10',
      linkedinUrl: '',
      instagramUrl: `https://instagram.com/${item.ownerUsername}`,
      email: '',
      companyWebsite: item.ownerBiography?.match(/https?:\/\/[^\s]+/)?.[0] || '',
      notes: item.ownerBiography?.slice(0, 200) || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    }))

  // Deduplica por username
  const unique = Array.from(new Map(prospects.map(p => [p.company, p])).values())

  return new Response(JSON.stringify({ ok: true, count: unique.length, prospects: unique }), {
    headers: { ...CORS, 'Content-Type': 'application/json' },
  })
}

// ── Router ─────────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS })
    }

    const url = new URL(request.url)

    // GET endpoints
    if (request.method === 'GET') {
      if (url.pathname === '/instagram-results') {
        return await getApifyResults(request, env)
      }
      return new Response('Not found', { status: 404 })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    try {
      if (url.pathname === '/generate-message') return await handleGenerateMessage(request, env)
      if (url.pathname === '/instagram-scrape') return await startApifyScrape(request, env)
      return await handleContact(request, env)
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: e.message }), {
        status: 500,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }
  },
}
