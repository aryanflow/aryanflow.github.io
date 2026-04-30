import { useEffect, useRef, useState } from 'react'
import type { SkillItem, SkillProficiency } from '@/data/site'
import { allSkillItems } from '@/data/site'
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
          'flex h-[1.2rem] w-[1.2rem] shrink-0 items-center justify-center rounded-full border border-primary/35 bg-primary/15 font-mono text-[7px] font-bold uppercase text-primary',
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
      className={cn(
        'h-[1.2rem] w-[1.2rem] shrink-0 object-contain transition-[transform,filter] duration-300',
        'motion-safe:group-hover/pill:scale-105 motion-safe:group-hover/pill:brightness-110 motion-safe:group-hover/pill:saturate-110',
        className,
      )}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
    />
  )
}

const PROFICIENCY_SUMMARY: Record<SkillProficiency, string> = {
  1: 'Occasional',
  2: 'Regular in production',
  3: 'Core - daily use',
}

function MarqueePill({ skill: s, allowFocus = true }: { skill: SkillItem; allowFocus?: boolean }) {
  const label = `${s.name}. ${PROFICIENCY_SUMMARY[s.proficiency]}. ${s.productionHint}`
  const tip = `${s.name} · ${PROFICIENCY_SUMMARY[s.proficiency]} · ${s.productionHint}`

  return (
    <button
      type="button"
      data-cursor-hover
      title={tip}
      aria-label={label}
      tabIndex={allowFocus ? 0 : -1}
      className={cn(
        'group/pill inline-flex shrink-0 items-center gap-2 rounded-full border border-border/60',
        'bg-gradient-to-br from-white/[0.09] via-white/[0.03] to-transparent px-3 py-2',
        'text-left text-[11px] font-medium tracking-tight text-foreground/[0.93]',
        'shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.07)] backdrop-blur-md md:gap-2.5 md:px-3.5 md:py-2.5 md:text-[12px]',
        'transition-[transform,box-shadow,border-color,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'light:border-stone-200/70 light:from-white/85 light:via-white/55 light:shadow-sm',
        'motion-safe:hover:-translate-y-px motion-safe:hover:border-primary/55 motion-safe:hover:shadow-[0_0_0_1px_hsl(var(--primary)_/_0.18),0_14px_36px_-18px_hsl(var(--primary)_/_0.42)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
      )}
    >
      <span
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          'bg-white/[0.07] ring-1 ring-white/[0.1]',
          'transition-[background-color,box-shadow] duration-300',
          'group-hover/pill:bg-white/[0.11] group-hover/pill:shadow-[0_0_16px_-4px_hsl(var(--primary)_/_0.32)] group-hover/pill:ring-primary/35',
          'light:bg-stone-100/90 light:ring-stone-200/85',
        )}
      >
        <SkillIcon name={s.name} icon={s.icon} />
      </span>
      <span className="whitespace-nowrap pr-0.5">{s.name}</span>
    </button>
  )
}

function splitIntoRows(items: SkillItem[], rowCount: number): SkillItem[][] {
  const rows: SkillItem[][] = Array.from({ length: rowCount }, () => [])
  items.forEach((item, i) => {
    rows[i % rowCount].push(item)
  })
  return rows
}

function MarqueeRow({
  items,
  reverse,
  durationSec,
}: {
  items: SkillItem[]
  reverse: boolean
  durationSec: number
}) {
  if (items.length === 0) return null

  return (
    <div
      className={cn(
        'skills-marquee-row relative overflow-hidden py-1',
        '[mask-image:linear-gradient(90deg,transparent_0%,black_12%,black_88%,transparent_100%)]',
      )}
    >
      <div
        className={cn('flex w-max', reverse ? 'skills-marquee-track-reverse' : 'skills-marquee-track')}
        style={{ animationDuration: `${durationSec}s` }}
      >
        {[0, 1].map((dup) => (
          <div
            key={dup}
            className="flex gap-3 md:gap-4"
            {...(dup === 1 ? { 'aria-hidden': true } : {})}
          >
            {items.map((s, i) => (
              <MarqueePill key={`${s.name}-${dup}-${i}`} skill={s} allowFocus={dup === 0} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const MARQUEE_ROWS = 3
const ROW_DURATIONS = [46, 58, 50]

export function SkillsSection() {
  const section = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(() => prefersReducedMotion())
  const reduceMotion = prefersReducedMotion()
  const rows = splitIntoRows(allSkillItems, MARQUEE_ROWS)

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
      aria-label="Technical capabilities - scrolling tool list; pause by hovering or focusing a control"
      className="relative scroll-mt-28 overflow-hidden px-5 py-20 md:px-10 md:py-28"
    >
      <p className="sr-only">
        Tools and technologies: {allSkillItems.map((s) => s.name).join(', ')}.
      </p>

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
          <p
            className={cn(
              'font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/[0.88]',
              'transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
              revealed ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
            )}
          >
            Capabilities
          </p>
          <h2
            style={{ transitionDelay: revealed ? '100ms' : '0ms' }}
            className={cn(
              'mt-3 font-display text-[clamp(1.55rem,3.8vw,2.75rem)] font-semibold leading-[1.12] tracking-[-0.02em] md:leading-tight',
              'transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
              revealed ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
            )}
          >
            Tools I trust in production.
          </h2>
          <p
            style={{ transitionDelay: revealed ? '190ms' : '0ms' }}
            className={cn(
              'mt-3 text-sm leading-relaxed text-muted-foreground md:text-[15px]',
              'transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
              revealed ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
            )}
          >
            Hover a row to pause - each pill has a short note on how I use it.
          </p>
        </div>

        <div
          className={cn(
            'mt-12 flex flex-col gap-4 md:mt-14 md:gap-5',
            'transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
            revealed ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
          )}
          style={{ transitionDelay: revealed ? '260ms' : '0ms' }}
        >
          {reduceMotion ? (
            <div className="flex flex-wrap justify-center gap-2 md:gap-2.5" role="list">
              {allSkillItems.map((s) => (
                <span key={s.name} role="listitem" className="contents">
                  <MarqueePill skill={s} />
                </span>
              ))}
            </div>
          ) : (
            <>
              {rows.map((rowItems, ri) => (
                <MarqueeRow
                  key={ri}
                  items={rowItems}
                  reverse={ri % 2 === 1}
                  durationSec={ROW_DURATIONS[ri] ?? 50}
                />
              ))}
            </>
          )}
        </div>

        <p
          style={{ transitionDelay: revealed ? '480ms' : '0ms' }}
          className={cn(
            'mt-12 text-center md:mt-14',
            'transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]',
            revealed ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0',
          )}
        >
          <a
            href="#work"
            className="group/cta inline-flex items-center gap-2 border-b border-primary/45 pb-0.5 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/88 transition-[color,border-color,transform] hover:border-primary hover:text-primary"
          >
            View projects using these tools
            <span
              className="inline-block transition-transform motion-safe:group-hover/cta:translate-x-1"
              aria-hidden
            >
              →
            </span>
          </a>
        </p>
      </div>
    </section>
  )
}
