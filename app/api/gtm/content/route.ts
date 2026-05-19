import { NextRequest, NextResponse } from 'next/server'
import { generateContentBrief } from '@/lib/gtm/agents'

export async function POST(req: NextRequest) {
  try {
    const { tema, segmentoAlvo, intencao } = await req.json()
    if (!tema || !segmentoAlvo) {
      return NextResponse.json({ error: 'tema e segmentoAlvo são obrigatórios' }, { status: 400 })
    }
    const result = await generateContentBrief(
      tema,
      segmentoAlvo,
      intencao ?? 'comercial'
    )
    return NextResponse.json(result)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro desconhecido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
