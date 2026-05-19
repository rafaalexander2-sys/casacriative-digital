import { NextRequest, NextResponse } from 'next/server'
import { buildGTMCampaign } from '@/lib/gtm/agents'

export async function POST(req: NextRequest) {
  try {
    const { segmento, servico, cidade } = await req.json()
    if (!segmento || !servico) {
      return NextResponse.json({ error: 'segmento e servico são obrigatórios' }, { status: 400 })
    }
    const result = await buildGTMCampaign(segmento, servico, cidade ?? 'Curitiba')
    return NextResponse.json(result)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro desconhecido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
