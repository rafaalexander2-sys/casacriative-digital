export type ProspectStatus = 'pending' | 'following' | 'engaging' | 'message_ready' | 'sent' | 'replied' | 'no_reply' | 'not_interested'

export type ProspectCountry = 'PT' | 'ES'

export interface Prospect {
  id: string
  name: string
  title: string
  company: string
  country: ProspectCountry
  sector: string
  companySize: string
  linkedinUrl: string
  email?: string
  companyWebsite?: string
  notes?: string
  instagramUrl?: string
  whatsapp?: string
  status: ProspectStatus
  generatedMessage?: string
  followedAt?: string
  engagedAt?: string
  sentAt?: string
  repliedAt?: string
  createdAt: string
}

export interface Campaign {
  dailyLimit: number
  sentToday: number
  lastResetDate: string
}

export const SECTOR_OPTIONS = [
  'Restaurante / Alimentação',
  'Clínica / Saúde',
  'Advocacia / Jurídico',
  'Imobiliária / Construção',
  'Estética / Beleza',
  'Comércio / Loja',
  'Academia / Fitness',
  'Contabilidade / Finanças',
  'Turismo / Hotelaria',
  'Educação / Formação',
  'Tecnologia / Software',
  'Consultoria',
  'Arquitectura / Design',
  'Outro',
]

export const SIZE_OPTIONS = ['1-10', '11-50', '51-200']

export const STATUS_LABELS: Record<ProspectStatus, string> = {
  pending: 'Pendente',
  following: 'A Seguir',
  engaging: 'A Interagir',
  message_ready: 'Mensagem Pronta',
  sent: 'DM Enviada',
  replied: 'Respondeu',
  no_reply: 'Sem Resposta',
  not_interested: 'Não Interessado',
}

export const STATUS_COLORS: Record<ProspectStatus, string> = {
  pending: 'bg-zinc-700 text-zinc-300',
  following: 'bg-blue-900/60 text-blue-300',
  engaging: 'bg-violet-900/60 text-violet-300',
  message_ready: 'bg-amber-900/60 text-amber-300',
  sent: 'bg-teal-900/60 text-teal-300',
  replied: 'bg-green-900/60 text-green-300',
  no_reply: 'bg-zinc-700 text-zinc-400',
  not_interested: 'bg-red-900/40 text-red-400',
}
