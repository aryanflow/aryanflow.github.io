import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

type LenisContextValue = {
  lenis: Lenis | null
  scrollProgress: number
}

const LenisContext = createContext<LenisContextValue>({ lenis: null, scrollProgress: 0 })

export function useLenis() {
  return useContext(LenisContext)
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const html = document.documentElement
    if (prefersReducedMotion()) {
      html.classList.remove('lenis', 'lenis-smooth')
      return
    }

    html.classList.add('lenis', 'lenis-smooth')

    const instance = new Lenis({
      duration: 1.12,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      anchors: true,
      smoothWheel: true,
    })

    setLenis(instance)

    const onScroll = (l: Lenis) => {
      ScrollTrigger.update()
      setScrollProgress(l.progress)
    }
    instance.on('scroll', onScroll)
    setScrollProgress(instance.progress)

    const ticker = (time: number) => {
      instance.raf(time * 1000)
    }
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(ticker)
      instance.off('scroll', onScroll)
      instance.destroy()
      html.classList.remove('lenis', 'lenis-smooth')
      ScrollTrigger.refresh()
    }
  }, [])

  useEffect(() => {
    if (lenis) return
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [lenis])

  const value = useMemo(() => ({ lenis, scrollProgress }), [lenis, scrollProgress])

  return <LenisContext.Provider value={value}>{children}</LenisContext.Provider>
}
