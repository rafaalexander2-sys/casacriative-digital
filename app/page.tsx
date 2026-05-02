import Navbar from '@/components/Navbar'
import HeroCity from '@/components/HeroCity'
import Stats from '@/components/Stats'
import Services from '@/components/Services'
import About from '@/components/About'
import Reviews from '@/components/Reviews'
import BlogCarousel from '@/components/BlogCarousel'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroCity />
      <Stats />
      <Services />
      <About />
      <Reviews />
      <BlogCarousel />
      <Contact />
      <Footer />
    </main>
  )
}