'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

interface Win {
  x: number; w: number; h: number
  row: number; on: boolean; color: string
}
interface Building {
  x: number; w: number; h: number; windows: Win[]
}

const WIN_COLORS = ['#c47a4a','#e8c49a','#f0d5b0','#8b4513','#d4855a','#f5e6c8','#a05a30']

export default function HeroCity() {
  const sectionRef  = useRef<HTMLDivElement>(null)
  const canvasRef   = useRef<HTMLCanvasElement>(null)
  const buildingsRef = useRef<Building[]>([])
  const [reached, setReached] = useState(0)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const textY       = useTransform(scrollYProgress, [0, 0.5], ['0%', '-12%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0])

  function generateBuildings(W: number, H: number): Building[] {
    const count = Math.floor(W / 36)
    const blds: Building[] = []
    for (let i = 0; i < count; i++) {
      const bw  = 20 + Math.floor(Math.random() * 22)
      const bh  = 60 + Math.floor(Math.random() * (H * 0.65))
      const bx  = Math.floor(i * (W / count) + Math.random() * 6)
      const wins: Win[] = []
      const cols = Math.floor(bw / 11)
      const rows = Math.floor(bh / 18)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          wins.push({
            x: bx + c * 11 + 3, w: 6, h: 9, row: r, on: false,
            color: WIN_COLORS[Math.floor(Math.random() * WIN_COLORS.length)],
          })
        }
      }
      blds.push({ x: bx, w: bw, h: bh, windows: wins })
    }
    return blds
  }

  function draw() {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    const W = canvas.width, H = canvas.height
    const blds = buildingsRef.current

    ctx.clearRect(0, 0, W, H)
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, W, H)

    // estrelas
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    for (let s = 0; s < 100; s++) {
      ctx.fillRect((s * 137.5) % W, (s * 97.3) % (H * 0.55), 1, 1)
    }

    blds.forEach(b => {
      const by = H - b.h
      ctx.fillStyle = '#111'
      ctx.fillRect(b.x, by, b.w, b.h)
      ctx.strokeStyle = '#1a1a1a'
      ctx.lineWidth = 0.5
      ctx.strokeRect(b.x, by, b.w, b.h)

      b.windows.forEach(win => {
        const wy = by + win.row * 18 + 5
        if (!win.on) {
          ctx.fillStyle = 'rgba(255,255,255,0.03)'
          ctx.fillRect(win.x, wy, win.w, win.h)
        } else {
          ctx.shadowColor = win.color
          ctx.shadowBlur  = 5
          ctx.fillStyle   = win.color
          ctx.fillRect(win.x, wy, win.w, win.h)
          ctx.shadowBlur  = 0
        }
      })
    })

    // linha bronze na base
    const lineGrad = ctx.createLinearGradient(0, 0, W, 0)
    lineGrad.addColorStop(0,   'transparent')
    lineGrad.addColorStop(0.3, '#c47a4a')
    lineGrad.addColorStop(0.5, '#f0d5b0')
    lineGrad.addColorStop(0.7, '#c47a4a')
    lineGrad.addColorStop(1,   'transparent')
    ctx.fillStyle = lineGrad
    ctx.fillRect(0, H - 1, W, 1)
  }

  function updateWindows(progress: number) {
    const allWins = buildingsRef.current.flatMap(b => b.windows)
    const toLit   = Math.floor(progress * allWins.length)
    allWins.forEach((w, i) => { w.on = i < toLit })
    setReached(Math.round(progress * 347200))
  }

  useEffect(() => {
    return scrollYProgress.on('change', val => {
      updateWindows(Math.min(Math.max(val, 0), 1))
      draw()
    })
  }, [scrollYProgress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      buildingsRef.current = generateBuildings(canvas.width, canvas.height)
      draw()
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <section ref={sectionRef} className="relative bg-black" style={{ height: '220vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden">

        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 25%, transparent 70%, rgba(0,0,0,0.5) 100%)'
        }} />

        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm font-medium tracking-widest uppercase mb-5"
            style={{ color: '#86868b' }}
          >
            Agência Digital · Curitiba, PR · Desde 2021
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="text-white font-bold leading-tight mb-5"
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: 'clamp(36px, 6vw, 72px)', letterSpacing: '-2px' }}
          >
            Tráfego Pago, Sites e SEO<br />
            para levar seu negócio ao{' '}
            <span className="text-bronze-pearl">topo.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg font-light mb-10 max-w-xl"
            style={{ color: '#86868b', lineHeight: 1.5 }}
          >
            Estratégias personalizadas que atraem clientes<br />e geram resultado real.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex gap-3 justify-center"
          >
            <a href="https://wa.me/5541998170428"
              className="bg-bronze-pearl text-white rounded-full px-7 py-3 text-sm font-medium hover:opacity-90 transition-opacity">
              Fale Conosco
            </a>
            <a href="#servicos"
              className="rounded-full px-7 py-3 text-sm font-medium border transition-colors"
              style={{ background: 'transparent', borderColor: '#c47a4a', color: '#e8c49a' }}>
              Ver Serviços
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center z-10"
        >
          <p className="text-bronze-pearl font-bold"
            style={{ fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', fontSize: 'clamp(24px, 3.5vw, 44px)', letterSpacing: '-1.5px' }}>
            {reached.toLocaleString('pt-BR')}
          </p>
          <p className="text-xs tracking-widest uppercase mt-1" style={{ color: '#555' }}>
            pessoas alcançadas
          </p>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.6 }}
            className="mt-4 flex flex-col items-center gap-1"
          >
            <div className="w-px h-8 bg-gradient-to-b from-transparent to-[#c47a4a]" />
            <p className="text-xs" style={{ color: '#3a3a3c' }}>scroll</p>
          </motion.div>
        </motion.div>

      </div>
    </section>
  )
}