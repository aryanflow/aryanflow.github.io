import { useEffect, useRef, useState } from 'react'
import type { SkillProficiency } from '@/data/site'
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
          'flex h-[1.35rem] w-[1.35rem] shrink-0 items-center justify-center rounded-full border border-primary/35 bg-primary/15 font-mono text-[7px] font-bold uppercase text-primary',
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
      className={cn('h-[1.35rem] w-[1.35rem] shrink-0 object-contain', className)}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}

function ProficiencyDots({ level }: { level: SkillProficiency }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-[3px]" aria-hidden>
      {([0, 1, 2] as const).map((i) => (
        <span
          key={i}
          className={cn(
            'h-1 w-1 rounded-full',
            i < level ? 'bg-primary/75' : 'bg-muted-foreground/25',
          )}
        />
      ))}
    </span>
  )
}

function flatSkillIndex(groupIndex: number, itemIndex: number): number {
  let n = 0
  for (let i = 0; i < groupIndex; i++) n += skillGroups[i].items.length
  return n + itemIndex
}

/** Single ghost opacity across themes (~5.5% of foreground) */
const GHOST_CLASS =
  'select-none font-display font-semibold leading-none tracking-[-0.055em] text-foreground/[0.055] light:text-stone-950/[0.055]'

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
            Tools I trust in production.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]">
            Languages, ML, infrastructure, and release tooling I use day to day.
          </p>
        </div>

        <div className="mt-10 space-y-10 md:mt-12 md:space-y-12">
          {skillGroups.map((group, gi) => (
            <div key={group.title} className="relative border-l border-primary/30 pl-5 md:pl-7">
              <div
                className="absolute left-0 top-0 h-7 w-px bg-gradient-to-b from-primary/85 to-transparent md:h-9"
                aria-hidden
              />

              <p className="relative z-20 font-mono text-[10px] uppercase tracking-[0.26em] text-foreground/75">
                {group.title}
              </p>

              {/* Ghost locked to chip column: same width as grid, vertically centered with chip row only */}
              <div className="relative z-10 mt-3 overflow-hidden md:mt-4">
                <div className="pointer-events-none absolute inset-0 z-0 flex items-center" aria-hidden>
                  <span
                    className={cn(
                      GHOST_CLASS,
                      'block w-full max-w-full truncate text-left',
                      'text-[clamp(2.4rem,10.5vw,5.25rem)] md:text-[clamp(2.75rem,9vw,5rem)]',
                    )}
                  >
                    {group.ghostWord}
                  </span>
                </div>

                <ul
                  className="relative z-10 grid list-none grid-cols-2 gap-2 py-0.5 sm:grid-cols-3 md:grid-cols-3 md:gap-2.5 lg:grid-cols-6"
                  role="list"
                >
                  {group.items.map((s, ii) => {
                    const sk = flatSkillIndex(gi, ii)
                    return (
                      <li key={s.name} className="min-w-0">
                        <span
                          data-cursor-hover
                          title={s.productionHint}
                          aria-label={`${s.name}. ${s.productionHint}`}
                          style={{
                            transitionDelay: revealed ? `${Math.min(sk, 28) * 32}ms` : '0ms',
                          }}
                          className={cn(
                            'group/chip flex h-full min-h-[2.85rem] w-full min-w-0 cursor-default items-center gap-2.5 rounded-full border border-border/55 bg-gradient-to-br from-white/[0.07] via-white/[0.02] to-transparent px-3 py-2 text-left text-[11px] font-medium tracking-tight text-foreground/90 shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.06)] backdrop-blur-md md:min-h-[3rem] md:gap-3 md:px-3.5 md:py-2.5 md:text-[12px]',
                            'transition-[opacity,transform,box-shadow,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                            'light:border-stone-200/70 light:from-white/80 light:via-white/50 light:shadow-sm',
                            'motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-primary/50 motion-safe:hover:shadow-[0_0_0_1px_hsl(var(--primary)_/_0.14),0_18px_44px_-22px_hsl(var(--primary)_/_0.42)]',
                            revealed ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
                          )}
                        >
                          <span
                            className={cn(
                              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                              'bg-white/[0.07] ring-1 ring-white/[0.1]',
                              'transition-[background-color,box-shadow] duration-300',
                              'group-hover/chip:bg-white/[0.11] group-hover/chip:shadow-[0_0_20px_-4px_hsl(var(--primary)_/_0.35)] group-hover/chip:ring-primary/35',
                              'light:bg-stone-100/90 light:ring-stone-200/85',
                            )}
                          >
                            <SkillIcon name={s.name} icon={s.icon} />
                          </span>
                          <span className="flex min-w-0 flex-1 items-center gap-1.5 leading-tight">
                            <span className="min-w-0 truncate">{s.name}</span>
                            <ProficiencyDots level={s.proficiency} />
                          </span>
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
