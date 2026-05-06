import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sites e Landing Pages de Alta Performance | Casa Criative Digital',
  description: 'Criamos sites e landing pages com design premium, código limpo e copy estratégico. Entrega em 5 dias, garantia de 30 dias. Solicite seu orçamento.',
  alternates: { canonical: 'https://casacriative.com.br/lp-captacao' },
  openGraph: {
    title: 'Sites que vendem como nunca antes | Casa Criative Digital',
    description: 'Design premium, código limpo e copy estratégico. Entrega em 5 dias, garantia 30 dias.',
    url: 'https://casacriative.com.br/lp-captacao',
    type: 'website',
    siteName: 'Casa Criative Digital',
    images: [
      {
        url: 'https://casacriative.com.br/logo.webp',
        width: 120,
        height: 34,
        alt: 'Casa Criative Digital',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Sites que vendem | Casa Criative Digital',
    description: 'Design premium, código limpo e copy estratégico. Entrega em 5 dias.',
    images: ['https://casacriative.com.br/logo.webp'],
  },
}

export default function LpCaptacaoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
