export interface Lead {
  empresa: string
  segmento: string
  cidade?: string
  site?: string
  instagram?: string
  responsavel?: string
  dor?: string // problema principal que o lead tem
  notas?: string
}

export interface ProspectResult {
  score: number // 0-100
  justificativa: string
  doresIdentificadas: string[]
  abordagemRecomendada: string
  canalPrioritario: 'whatsapp' | 'email' | 'linkedin' | 'instagram'
  urgencia: 'alta' | 'media' | 'baixa'
}

export interface OutreachMessage {
  canal: string
  assunto?: string
  mensagem: string
  followUp1: string
  followUp2: string
  cta: string
}

export interface ContentBrief {
  titulo: string
  subtitulo: string
  palavrasChave: string[]
  estrutura: string[]
  introducao: string
  angulo: string
  cta: string
}

export interface GTMCampaign {
  nome: string
  segmentoAlvo: string
  promessa: string
  provas: string[]
  objecoes: string[]
  sequenciaOutreach: OutreachMessage[]
}

export type AgentMode =
  | 'prospect-qualifier'
  | 'outreach-writer'
  | 'content-strategist'
  | 'campaign-builder'
  | 'objection-handler'
