import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { skillGroups } from '@/data/site'
import { cn } from '@/lib/utils'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function SkillsSection() {
  const flat = skillGroups.flatMap((g) => g.items.map((i) => i.name))
  const [reduceMotion, setReduceMotion] = useState(prefersReducedMotion)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduceMotion(mq.matches)
    const q = () => setReduceMotion(mq.matches)
    mq.addEventListener('change', q)
    return () => mq.removeEventListener('change', q)
  }, [])

  return (
    <section id="skills" className="scroll-mt-28 overflow-hidden px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-400/90">Hands on</p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight tracking-tight">
            Tools I reach for in production
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            From notebooks to deploys, the same question: will this still make sense at 2 a.m. when something breaks?
          </p>
        </div>
        <div className="relative mt-10 py-3">
          <div
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent"
            aria-hidden
          />
          <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_5%,black_95%,transparent)]">
            {reduceMotion ? (
              <p className="px-4 text-center font-mono text-sm text-muted-foreground/70">{flat.join(' · ')}</p>
            ) : (
              <div className="skills-marquee flex w-full overflow-hidden">
                <div className="skills-marquee-track flex w-max shrink-0 gap-8">
                  {flat.map((name, i) => (
                    <span key={`a-${name}-${i}`} className="whitespace-nowrap font-mono text-sm text-muted-foreground/55">
                      {name}
                    </span>
                  ))}
                  {flat.map((name, i) => (
                    <span key={`b-${name}-${i}`} className="whitespace-nowrap font-mono text-sm text-muted-foreground/55">
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {skillGroups.map((g, gi) => (
          <div key={g.title} className={cn(gi > 0 && 'mt-14')}>
            <h3 className="text-center font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{g.title}</h3>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
              {g.items.map((s, i) => (
                <motion.div
                  key={s.name}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.03 * (gi * 6 + i), duration: 0.45 }}
                  className="group flex flex-col items-center gap-3 rounded-2xl border border-border/60 bg-gradient-to-b from-card/50 to-transparent p-5 text-center transition duration-300 hover:-translate-y-1 hover:border-cyan-500/35 hover:shadow-lg hover:shadow-cyan-500/5 light:border-stone-200/80 light:from-white/60 light:hover:shadow-stone-300/30"
                >
                  <div className="rounded-2xl border border-white/5 bg-white/5 p-3 transition group-hover:scale-105 group-hover:border-cyan-500/20 light:border-stone-200/60 light:bg-stone-50/80">
                    <img src={s.icon} alt="" className="h-10 w-10 object-contain" loading="lazy" />
                  </div>
                  <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground">{s.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
