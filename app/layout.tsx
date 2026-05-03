import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

const GA_ID = 'G-ZRFLKP3RVT'

const BASE = 'https://casacriative.com.br'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),
  title: {
    default: 'Casa Criative | Agência de Marketing Digital em Curitiba',
    template: '%s | Casa Criative Digital',
  },
  description: 'Agência de marketing digital em Curitiba especializada em Tráfego Pago, Criação de Sites, SEO e Social Media. +50 clientes atendidos, +R$700k em anúncios gerenciados desde 2021.',
  keywords: [
    'agência de marketing digital curitiba',
    'tráfego pago curitiba',
    'google ads curitiba',
    'facebook ads curitiba',
    'criação de sites curitiba',
    'seo curitiba',
    'social media curitiba',
    'design gráfico curitiba',
    'landing page curitiba',
    'gestão de anúncios curitiba',
  ],
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  authors: [{ name: 'Casa Criative Digital', url: BASE }],
  creator: 'Casa Criative Digital',
  publisher: 'Casa Criative Digital',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  alternates: { canonical: BASE },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: BASE,
    siteName: 'Casa Criative Digital',
    title: 'Casa Criative | Agência de Marketing Digital em Curitiba',
    description: 'Tráfego Pago, Sites, SEO e Social Media em Curitiba. Estratégias personalizadas que geram resultado real para o seu negócio.',
    images: [{ url: '/logo.webp', width: 400, height: 110, alt: 'Casa Criative Digital' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casa Criative | Agência de Marketing Digital em Curitiba',
    description: 'Tráfego Pago, Sites, SEO e Social Media em Curitiba. +50 clientes, resultados reais.',
    images: ['/logo.webp'],
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'MarketingAgency',
      '@id': `${BASE}/#organization`,
      name: 'Casa Criative Digital',
      url: BASE,
      logo: { '@type': 'ImageObject', url: `${BASE}/logo.webp` },
      description: 'Agência de marketing digital em Curitiba especializada em Tráfego Pago, Criação de Sites, SEO e Social Media.',
      telephone: '+55-41-99817-0428',
      email: 'contato@casacriative.com.br',
      foundingDate: '2021',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Curitiba',
        addressRegion: 'PR',
        addressCountry: 'BR',
      },
      areaServed: { '@type': 'Country', name: 'Brasil' },
      priceRange: '$$',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '17:00',
      },
      sameAs: [
        'https://www.instagram.com/casacriativedigital/',
        'https://www.facebook.com/casacriativedigital',
        'https://www.linkedin.com/company/casa-criative-digital/',
        'https://www.behance.net/casacriative',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${BASE}/#website`,
      url: BASE,
      name: 'Casa Criative Digital',
      publisher: { '@id': `${BASE}/#organization` },
      inLanguage: 'pt-BR',
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">{`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}</Script>
      </body>
    </html>
  )
}
