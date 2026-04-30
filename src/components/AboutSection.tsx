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
        y: 28,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      })
      gsap.from(rail.current?.querySelectorAll('.about-node') ?? [], {
        x: -20,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: rail.current, start: 'top 92%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <section id="about" ref={section} className="scroll-mt-28 px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/70">About</p>
        <h2 className="mt-3 max-w-3xl font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-[1.08] tracking-[-0.02em]">
          {site.about.headline}
        </h2>
        <p ref={copy} className="mt-6 max-w-2xl text-[15px] leading-relaxed text-muted-foreground md:mt-7 md:text-[17px] md:leading-relaxed">
          {site.about.paragraphs[0]}
        </p>

        <div ref={rail} className="mt-10 border-t border-border/60 pt-8 md:mt-12 md:pt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/70">Where I ship</p>
          <div className="mt-6 space-y-0 md:mt-7">
            {experience.map((job) => (
              <div
                key={job.company}
                className="about-node group relative grid gap-2 border-b border-border/40 py-5 md:grid-cols-[160px_1fr] md:gap-10 md:py-6"
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
                  <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted-foreground/95 md:mt-3">{job.points[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 md:mt-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/70">Achievements &amp; extras</p>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Highlights outside the day job: competitions, credentials, and habits that keep the craft sharp.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 md:mt-6">
            {highlights.slice(0, 6).map((h) => (
              <span
                key={h}
                className="rounded-full border border-border/60 bg-card/50 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur-sm transition hover:border-primary/35 hover:text-foreground light:border-stone-200/80 light:bg-white/70"
              >
                {h}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
