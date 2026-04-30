import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider'
import { ScrollProgress } from '@/components/ScrollProgress'
import { CustomCursor } from '@/components/CustomCursor'
import { SiteNav } from '@/components/SiteNav'
import { HeroSection } from '@/components/HeroSection'
import { AboutSection } from '@/components/AboutSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { SkillsSection } from '@/components/SkillsSection'
import { ContactSection } from '@/components/ContactSection'
import { SiteFooter } from '@/components/SiteFooter'

function IntroCurtain() {
  const veil = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = veil.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      el.style.display = 'none'
      return
    }
    const tl = gsap.timeline({ defaults: { ease: 'power3.inOut' } })
    tl.to(el, { scaleY: 0, transformOrigin: 'top', duration: 0.95, ease: 'power4.inOut' }, 0.08)
      .to(
        el,
        {
          opacity: 0,
          duration: 0.25,
          onComplete: () => {
            el.style.pointerEvents = 'none'
            el.style.display = 'none'
          },
        },
        '-=0.35',
      )
    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div
      ref={veil}
      className="intro-veil pointer-events-auto fixed inset-0 z-[200] bg-foreground"
      aria-hidden
    />
  )
}

export default function App() {
  return (
    <SmoothScrollProvider>
      <IntroCurtain />
      <CustomCursor />
      <div className="relative min-h-screen">
        <ScrollProgress />
        <div className="noise" aria-hidden />
        <div className="ambient-grid" aria-hidden />
        <SiteNav />
        <main className="relative z-10">
          <HeroSection />
          <div className="section-rule mx-auto max-w-5xl" />
          <AboutSection />
          <div className="section-rule mx-auto max-w-5xl" />
          <ProjectsSection />
          <div className="section-rule mx-auto max-w-5xl" />
          <SkillsSection />
          <div className="section-rule mx-auto max-w-5xl" />
          <ContactSection />
          <SiteFooter />
        </main>
      </div>
    </SmoothScrollProvider>
  )
}
