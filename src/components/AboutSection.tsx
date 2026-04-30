import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { experience, highlights, site } from '@/data/site'

export function AboutSection() {
  const section = useRef<HTMLElement>(null)
  const copy = useRef<HTMLParagraphElement>(null)
  const rail = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const el = section.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const ctx = gsap.context(() => {
      if (reduce) return
      gsap.from(copy.current, {
        y: 36,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 82%', toggleActions: 'play none none reverse' },
      })
      gsap.from(rail.current?.querySelectorAll('.about-node') ?? [], {
        x: -28,
        opacity: 0,
        duration: 0.65,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: rail.current, start: 'top 88%', toggleActions: 'play none none reverse' },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={section} className="scroll-mt-28 px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">About</p>
        <h2 className="mt-4 max-w-3xl font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
          Software that stays legible at 2 a.m.
        </h2>
        <p ref={copy} className="mt-8 max-w-2xl text-[15px] leading-relaxed text-muted-foreground md:text-[17px] md:leading-relaxed">
          {site.about.paragraphs[0]}
        </p>

        <div ref={rail} className="mt-16 border-t border-border/60 pt-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Where I ship</p>
          <div className="mt-8 space-y-0">
            {experience.map((job) => (
              <div
                key={job.company}
                className="about-node group relative grid gap-2 border-b border-border/40 py-6 md:grid-cols-[160px_1fr] md:gap-10 md:py-8"
              >
                <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground md:pt-1">
                  {job.period}
                </div>
                <div>
                  <p className="font-display text-lg font-semibold tracking-tight md:text-xl">
                    {job.role}
                    <span className="font-normal text-muted-foreground"> · </span>
                    {job.company}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{job.place}</p>
                  <p className="mt-3 max-w-prose text-sm leading-relaxed text-muted-foreground/95">{job.points[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-wrap gap-2">
          {highlights.slice(0, 5).map((h) => (
            <span
              key={h}
              className="rounded-full border border-border/70 bg-card/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm"
            >
              {h}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
