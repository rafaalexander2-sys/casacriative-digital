import { NextRequest, NextResponse } from 'next/server'
import { qualifyLead } from '@/lib/gtm/agents'
import { Lead } from '@/lib/gtm/types'

export async function POST(req: NextRequest) {
  try {
    const lead: Lead = await req.json()
    if (!lead.empresa || !lead.segmento) {
      return NextResponse.json({ error: 'empresa e segmento são obrigatórios' }, { status: 400 })
    }
    const result = await qualifyLead(lead)
    return NextResponse.json(result)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro desconhecido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
