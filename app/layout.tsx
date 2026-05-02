import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Casa Criative | Tráfego Pago, Sites e SEO em Curitiba',
  description: 'Agência digital em Curitiba especializada em Tráfego Pago, Criação de Sites e SEO. Desde 2021 conectamos marcas ao público certo com estratégia, design e dados.',
  keywords: 'tráfego pago curitiba, criação de sites curitiba, agência de marketing digital curitiba, SEO curitiba',
  metadataBase: new URL('https://casacriative.com.br'),
  openGraph: {
    title: 'Casa Criative | Tráfego Pago, Sites e SEO em Curitiba',
    description: 'Agência digital em Curitiba especializada em Tráfego Pago, Criação de Sites e SEO.',
    url: 'https://casacriative.com.br',
    siteName: 'Casa Criative',
    locale: 'pt_BR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}