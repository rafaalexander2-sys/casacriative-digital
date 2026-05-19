import { NextRequest, NextResponse } from 'next/server'
import { writeOutreach } from '@/lib/gtm/agents'
import { Lead, ProspectResult } from '@/lib/gtm/types'

export async function POST(req: NextRequest) {
  try {
    const { lead, qualification, canal } = await req.json() as {
      lead: Lead
      qualification: ProspectResult
      canal: 'whatsapp' | 'email' | 'linkedin' | 'instagram'
    }
    if (!lead || !qualification || !canal) {
      return NextResponse.json({ error: 'lead, qualification e canal são obrigatórios' }, { status: 400 })
    }
    const result = await writeOutreach(lead, qualification, canal)
    return NextResponse.json(result)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro desconhecido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
