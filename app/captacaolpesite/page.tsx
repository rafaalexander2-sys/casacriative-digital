import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import HeroCity from '@/components/HeroCity'

export const metadata: Metadata = {
  title: 'Casa Criative | Captação de Clientes com Tráfego Pago em Curitiba',
  description: 'Atraia mais clientes com tráfego pago, criação de sites e SEO. Agência digital em Curitiba desde 2021.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function CaptacaoLP() {
  return (
    <main>
      <Navbar />
      <HeroCity />
    </main>
  )
}
