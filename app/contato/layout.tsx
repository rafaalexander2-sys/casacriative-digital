import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fale Conosco',
  description: 'Entre em contato com a Casa Criative Digital em Curitiba. WhatsApp (41) 99817-0428 • contato@casacriative.com.br • Atendimento Seg–Sex, 9h às 17h. Solicite seu orçamento sem compromisso.',
  alternates: { canonical: 'https://casacriative.com.br/contato' },
  openGraph: {
    title: 'Fale Conosco | Casa Criative Digital',
    description: 'Entre em contato com a Casa Criative Digital. WhatsApp, e-mail e formulário disponíveis. Orçamento sem compromisso.',
    url: 'https://casacriative.com.br/contato',
  },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
