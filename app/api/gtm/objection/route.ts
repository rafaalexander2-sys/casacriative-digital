import { NextRequest, NextResponse } from 'next/server'
import { handleObjection } from '@/lib/gtm/agents'

export async function POST(req: NextRequest) {
  try {
    const { objecao, contexto } = await req.json()
    if (!objecao) {
      return NextResponse.json({ error: 'objecao é obrigatória' }, { status: 400 })
    }
    const result = await handleObjection(objecao, contexto)
    return NextResponse.json(result)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro desconhecido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
