const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS })
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    try {
      const { nome, email, telefone, instagram, nicho, servico } = await request.json()

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Site Casa Criative <onboarding@resend.dev>',
          to: ['rafaalexander2@gmail.com'],
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
        return new Response(JSON.stringify({ ok: false }), {
          status: 500,
          headers: { ...CORS, 'Content-Type': 'application/json' },
        })
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: e.message }), {
        status: 500,
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }
  },
}
