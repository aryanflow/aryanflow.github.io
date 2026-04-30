import { lazy, Suspense, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ArrowDown, ArrowRight, FileText } from 'lucide-react'
import { site } from '@/data/site'
import { Magnetic } from '@/components/Magnetic'
import { cn } from '@/lib/utils'

const HeroCanvas = lazy(() => import('@/components/HeroCanvas').then((m) => ({ default: m.HeroCanvas })))

export function HeroSection() {
  const root = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const metaRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLAnchorElement>(null)

  useLayoutEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (reduce) {
        gsap.set([headlineRef.current, subRef.current, metaRef.current, ctaRef.current, scrollRef.current], {
          opacity: 1,
          y: 0,
        })
        return
      }

      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.from(
        el.querySelectorAll('.hero-line > span'),
        { yPercent: 108, opacity: 0, duration: 0.82, stagger: 0.07, ease: 'power3.out' },
        0.12,
      )
        .from(subRef.current, { y: 28, opacity: 0, duration: 0.7 }, 0.32)
        .from(metaRef.current?.children ?? [], { y: 20, opacity: 0, duration: 0.55, stagger: 0.06 }, 0.45)
        .from(ctaRef.current?.children ?? [], { y: 22, opacity: 0, duration: 0.55, stagger: 0.07 }, 0.52)
        .from(scrollRef.current, { opacity: 0, y: 12, duration: 0.5 }, 0.75)

      gsap.to(el.querySelector('.hero-parallax'), {
        yPercent: 12,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    }, el)

    return () => ctx.revert()
  }, [])

  const lines = site.tagline.split(' ')

  return (
    <section
      id="top"
      ref={root}
      className="relative min-h-[100svh] overflow-hidden px-5 pb-24 pt-20 md:px-10 md:pb-28 md:pt-24"
    >
      <div className="hero-parallax pointer-events-none absolute inset-0 z-0">
        <Suspense fallback={null}>
          <HeroCanvas />
        </Suspense>
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,_hsl(var(--hero-glow)_/_0.35),_transparent_55%)]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col pt-2 md:min-h-[calc(100svh-5.5rem)] md:justify-center md:pt-0">
        <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-muted-foreground md:text-[11px]">Portfolio · 2026</p>

        <h1
          ref={headlineRef}
          className="mt-5 flex flex-wrap items-baseline gap-x-[0.22em] gap-y-0.5 font-display text-[clamp(2.4rem,7.5vw,4.75rem)] font-semibold leading-[0.98] tracking-[-0.03em] text-foreground md:mt-6"
        >
          {lines.map((word, i) => (
            <span key={`${word}-${i}`} className="hero-line inline-flex overflow-hidden">
              <span className="inline-block">{word}</span>
            </span>
          ))}
        </h1>

        <p
          ref={subRef}
          className="mt-8 max-w-xl text-[15px] leading-relaxed text-muted-foreground md:text-lg md:leading-relaxed"
        >
          {site.name} - {site.title}. Shipping production APIs, ML-backed products, and cloud work that holds when traffic
          spikes.
        </p>

        <div ref={metaRef} className="mt-6 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <span className="text-foreground/90">{site.role}</span>
          <a data-cursor-hover className="transition hover:text-primary" href={site.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a data-cursor-hover className="transition hover:text-primary" href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a data-cursor-hover className="transition hover:text-primary" href={`mailto:${site.email}`}>
            Email
          </a>
        </div>

        <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
          <Magnetic className="inline-flex">
            <a
              href="#work"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-medium text-background transition hover:opacity-90"
              data-cursor-hover
            >
              View work
              <ArrowRight className="h-4 w-4" />
            </a>
          </Magnetic>
          <Magnetic className="inline-flex" strength={0.22}>
            <a
              href={site.resume}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/40 px-6 py-3.5 text-sm font-medium backdrop-blur-sm transition hover:border-primary/40 hover:bg-card/70"
              data-cursor-hover
            >
              <FileText className="h-4 w-4 opacity-80" />
              Résumé
            </a>
          </Magnetic>
        </div>
      </div>

      <a
        ref={scrollRef}
        href="#about"
        className={cn(
          'absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground',
          'motion-safe:animate-float',
        )}
        data-cursor-hover
        aria-label="Scroll to about"
      >
        <span className="font-mono text-[9px] uppercase tracking-[0.35em]">Scroll</span>
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-border pt-1.5">
          <ArrowDown className="h-3 w-3 opacity-70" />
        </span>
      </a>
    </section>
  )
}
