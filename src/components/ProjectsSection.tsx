import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ExternalLink, Github, Lock, MoveUpRight } from 'lucide-react'
import { projects, type Project } from '@/data/site'
import { Magnetic } from '@/components/Magnetic'
import { cn } from '@/lib/utils'

export function ProjectsSection() {
  return (
    <section id="work" className="scroll-mt-28 px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Selected work</p>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.85rem,4.5vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em]">
          Products, platforms, and experiments.
        </h2>
        <ul className="mt-16 grid list-none grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
          {projects.map((p) => (
            <li key={p.title} className={cn(p.featured && 'md:col-span-2')}>
              <ProjectCard project={p} large={p.featured} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ProjectCard({ project, large }: { project: Project; large?: boolean }) {
  const root = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const vref = useRef<HTMLVideoElement>(null)

  useLayoutEffect(() => {
    const rootEl = root.current
    const media = mediaRef.current
    const inner = innerRef.current
    if (!rootEl || !media || !inner) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const ctx = gsap.context(() => {
      gsap.from(rootEl, {
        y: 56,
        opacity: 0,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootEl, start: 'top 90%', toggleActions: 'play none none reverse' },
      })
      gsap.to(inner, {
        yPercent: large ? -5 : -7,
        ease: 'none',
        scrollTrigger: { trigger: rootEl, start: 'top bottom', end: 'bottom top', scrub: 0.45 },
      })
    }, rootEl)
    return () => ctx.revert()
  }, [large])

  return (
    <article
      ref={root}
      className={cn(
        'group relative overflow-hidden rounded-[1.35rem] border border-border/50 bg-card/30 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.65)] backdrop-blur-sm transition-colors duration-500 hover:border-primary/25',
        large && 'md:grid md:min-h-[380px] md:grid-cols-[1.12fr_1fr]',
      )}
    >
      {project.badge && (
        <div className="absolute right-4 top-4 z-20 rounded-full border border-border/60 bg-background/80 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-foreground backdrop-blur-md">
          {project.badge}
        </div>
      )}
      {project.confidential && !project.badge && (
        <div className="absolute right-4 top-4 z-20 flex items-center gap-1 rounded-full border border-border/60 bg-background/80 px-3 py-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground backdrop-blur-md">
          <Lock className="h-3 w-3" />
          Internal
        </div>
      )}

      <div
        ref={mediaRef}
        className={cn('relative overflow-hidden bg-zinc-950', large ? 'min-h-[220px] md:min-h-full' : 'h-52')}
      >
        <div ref={innerRef} className="h-[108%] w-full will-change-transform">
          {project.media.type === 'video' ? (
            <video
              ref={vref}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              src={project.media.src}
              muted
              loop
              playsInline
              preload="metadata"
              onMouseEnter={() => vref.current?.play().catch(() => undefined)}
              onMouseLeave={() => {
                if (vref.current) {
                  vref.current.pause()
                  vref.current.currentTime = 0
                }
              }}
            />
          ) : (
            <img
              src={project.media.src}
              alt={project.media.alt}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              loading="lazy"
            />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent opacity-95" />
      </div>

      <div className={cn('flex flex-col justify-center space-y-3 p-6 md:p-9', large && 'md:py-10')}>
        <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">{project.title}</h3>
        <p className="text-sm font-medium text-primary/90">{project.subtitle}</p>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">{project.description}</p>
        {project.confidential && !project.links?.length ? (
          <p className="inline-flex w-fit items-center gap-2 rounded-xl border border-border/80 bg-secondary/40 px-3 py-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Under NDA
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 pt-2">
            {project.links?.map((l) => (
              <Magnetic key={l.href} strength={0.25}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/60 px-4 py-2 text-xs font-semibold transition hover:border-primary/40 hover:bg-card/80"
                  data-cursor-hover
                >
                  {l.label === 'github' ? <Github className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
                  {l.label === 'github' ? 'GitHub' : 'Live'}
                  <MoveUpRight className="h-3 w-3 opacity-40" />
                </a>
              </Magnetic>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
