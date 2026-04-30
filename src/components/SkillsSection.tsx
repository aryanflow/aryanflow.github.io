import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { skillGroups } from '@/data/site'
import { cn } from '@/lib/utils'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function SkillsSection() {
  const section = useRef<HTMLElement>(null)
  const grid = useRef<HTMLDivElement>(null)
  const [reduceMotion, setReduceMotion] = useState(prefersReducedMotion)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const q = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', q)
    return () => mq.removeEventListener('change', q)
  }, [])

  useLayoutEffect(() => {
    const el = section.current
    const g = grid.current
    if (!el || !g || reduceMotion) return

    const cells = g.querySelectorAll('.skill-cell')
    const ctx = gsap.context(() => {
      gsap.from(cells, {
        y: 40,
        opacity: 0,
        scale: 0.94,
        duration: 0.55,
        stagger: 0.035,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
      })
    }, el)
    return () => ctx.revert()
  }, [reduceMotion])

  return (
    <section id="skills" ref={section} className="scroll-mt-28 px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Capabilities</p>
        <h2 className="mt-4 max-w-xl font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-[-0.02em]">
          Tools I trust in production.
        </h2>

        <div ref={grid} className="mt-14 space-y-14">
          {skillGroups.map((g) => (
            <div key={g.title}>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{g.title}</p>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                {g.items.map((s) => (
                  <div
                    key={s.name}
                    className={cn(
                      'skill-cell group flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-gradient-to-b from-card/40 to-transparent p-5 text-center transition duration-300',
                      'hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_20px_50px_-28px_rgba(0,0,0,0.55)]',
                    )}
                    data-cursor-hover
                  >
                    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.04] p-3 transition group-hover:border-primary/25 group-hover:bg-white/[0.07]">
                      <img src={s.icon} alt="" className="h-9 w-9 object-contain md:h-10 md:w-10" loading="lazy" />
                    </div>
                    <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-foreground md:text-xs">
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
