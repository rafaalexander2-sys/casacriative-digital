import type { Metadata } from 'next'
import { getWPPosts } from '@/lib/wp-posts'
import { posts as localPosts } from '@/lib/posts'

export const metadata: Metadata = {
  title: 'Agência de Marketing Digital em Curitiba | Tráfego Pago, Sites e SEO',
  description: 'Casa Criative Digital: agência de marketing digital em Curitiba com foco em Tráfego Pago, Criação de Sites e SEO. +50 clientes satisfeitos e +R$700k em anúncios gerenciados. Solicite orçamento.',
  alternates: { canonical: 'https://casacriative.com.br' },
  openGraph: {
    title: 'Casa Criative | Agência de Marketing Digital em Curitiba',
    description: 'Tráfego Pago, Sites, SEO e Social Media em Curitiba. Estratégias personalizadas que atraem clientes e geram resultado real.',
    url: 'https://casacriative.com.br',
    type: 'website',
  },
}

import Navbar from '@/components/Navbar'
import HeroCity from '@/components/HeroCity'
import Stats from '@/components/Stats'
import Services from '@/components/Services'
import About from '@/components/About'
import Reviews from '@/components/Reviews'
import BlogCarousel from '@/components/BlogCarousel'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default async function Home() {
  const wpPosts = await getWPPosts()
  const source = wpPosts.length > 0 ? wpPosts : localPosts
  const carouselPosts = source.map(p => ({
    tag: p.categoria,
    title: p.titulo,
    desc: p.desc,
    date: p.data,
    cover: p.cover ?? null,
    href: 'href' in p ? p.href : `/blog/${p.slug}`,
  }))

  return (
    <main>
      <Navbar />
      <HeroCity />
      <Stats />
      <Services />
      <About />
      <Reviews />
      <BlogCarousel posts={carouselPosts} />
      <Contact />
      <Footer />
    </main>
  )
}