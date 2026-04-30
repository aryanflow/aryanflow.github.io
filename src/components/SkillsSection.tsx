import { useEffect, useRef, useState } from 'react'
import { skillGroups } from '@/data/site'
import { cn } from '@/lib/utils'

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function SkillIcon({ name, icon, className }: { name: string; icon: string; className?: string }) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <span
        className={cn(
          'flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-primary/35 bg-primary/15 font-mono text-[9px] font-bold uppercase text-primary',
          className,
        )}
        aria-hidden
      >
        {name.slice(0, 2)}
      </span>
    )
  }

  return (
    <img
      src={icon}
      alt=""
      className={cn('h-5 w-5 shrink-0 object-contain md:h-[1.35rem] md:w-[1.35rem]', className)}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}

function flatSkillIndex(groupIndex: number, itemIndex: number): number {
  let n = 0
  for (let i = 0; i < groupIndex; i++) n += skillGroups[i].items.length
  return n + itemIndex
}

export function SkillsSection() {
  const section = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (prefersReducedMotion()) {
      setRevealed(true)
      return
    }
    const el = section.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setRevealed(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.06 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section
      id="skills"
      ref={section}
      data-skills-visible={revealed ? 'true' : 'false'}
      className="relative scroll-mt-28 overflow-hidden px-5 py-20 md:px-10 md:py-28"
    >
      <div
        className="pointer-events-none absolute -left-1/4 top-1/3 h-[min(70vw,520px)] w-[min(70vw,520px)] rounded-full bg-[radial-gradient(circle_at_center,hsl(var(--primary)_/_0.12),transparent_68%)] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-[-20%] h-[min(55vw,420px)] w-[min(55vw,420px)] rounded-full bg-[radial-gradient(circle_at_center,hsl(160_45%_45%_/_0.08),transparent_70%)] blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-foreground/70">Capabilities</p>
          <h2 className="mt-3 font-display text-[clamp(1.55rem,3.8vw,2.75rem)] font-semibold leading-[1.12] tracking-[-0.02em] md:leading-tight">
            Tools I trust in production
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            Languages, ML, infrastructure, and release tooling I use day to day.
          </p>
        </div>

        <div className="mt-12 space-y-14 md:mt-16 md:space-y-16">
          {skillGroups.map((group, gi) => (
            <div key={group.title} className="relative">
              <p
                className="pointer-events-none select-none font-display text-[clamp(3.5rem,14vw,9rem)] font-semibold leading-none tracking-[-0.06em] text-foreground/[0.045] md:text-[clamp(4rem,11vw,7.5rem)]"
                aria-hidden
              >
                {group.title.split(/\s+/)[0]}
              </p>

              <div className="relative -mt-[clamp(2.5rem,8vw,4.5rem)] border-l border-primary/30 pl-5 md:pl-7">
                <div className="absolute left-0 top-0 h-8 w-px bg-gradient-to-b from-primary/80 to-transparent md:h-10" aria-hidden />
                <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-foreground/75">{group.title}</p>
                <ul className="mt-4 flex flex-wrap gap-2 md:mt-5 md:gap-2.5" role="list">
                  {group.items.map((s, ii) => {
                    const sk = flatSkillIndex(gi, ii)
                    return (
                      <li key={s.name}>
                        <span
                          data-cursor-hover
                          style={{
                            transitionDelay: revealed ? `${Math.min(sk, 24) * 38}ms` : '0ms',
                          }}
                          className={cn(
                            'group inline-flex items-center gap-2.5 rounded-full border border-border/55 bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-transparent px-3.5 py-2 text-[11px] font-medium tracking-tight text-foreground/90 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.06)] backdrop-blur-md md:px-4 md:py-2.5 md:text-[12px]',
                            'transition-[opacity,transform,box-shadow,border-color] duration-[0.55s] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)]',
                            'light:border-stone-200/70 light:from-white/80 light:via-white/50 light:shadow-sm',
                            'hover:border-primary/45 hover:shadow-[0_0_0_1px_hsl(var(--primary)_/_0.12),0_16px_48px_-28px_hsl(var(--primary)_/_0.35)]',
                            'motion-safe:hover:-translate-y-px',
                            revealed ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                          )}
                        >
                          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.06] ring-1 ring-white/[0.08] transition duration-300 group-hover:bg-white/[0.1] group-hover:ring-primary/30 light:bg-stone-100/80 light:ring-stone-200/80">
                            <SkillIcon name={s.name} icon={s.icon} />
                          </span>
                          {s.name}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
