'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const links = [
  { label: 'Servicos', href: '#servicos' },
  { label: 'Quem Somos', href: '/quem-somos' },
  { label: 'Cases', href: '#cases' },
  { label: 'Blog', href: '/blog' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-11 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0)',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '0.5px solid #1d1d1f' : '0.5px solid transparent',
      }}
    >
      <Link href="/" className="flex flex-col leading-none">
        <span
          className="font-bold text-white"
          style={{ fontSize: 15, letterSpacing: '-0.3px' }}
        >
          casacriative
        </span>
        <span className="text-xs tracking-widest" style={{ color: '#555' }}>
          digital
        </span>
      </Link>

      <nav className="hidden md:flex gap-6">
        {links.map(l => (
          <Link
            key={l.label}
            href={l.href}
            className="text-sm transition-colors hover:text-white"
            style={{ color: '#86868b' }}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      
        href="https://wa.me/5541998170428"
        className="text-sm font-medium transition-opacity hover:opacity-80"
        style={{ color: '#c47a4a' }}
      >
        Fale Conosco
      </a>
    </motion.header>
  )
}