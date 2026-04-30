import { useRef } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, Github, Lock, MoveUpRight } from 'lucide-react'
import { projects, type Project } from '@/data/site'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function ProjectsSection() {
  return (
    <section id="projects" className="scroll-mt-28 px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-400/90">Case studies in code</p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight tracking-tight">
            Work you can feel in the details
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Hackathon builds, internal platforms, and side quests. Each one is a stance on reliability, clarity, and how software should feel to
            the next person who opens the repo.
          </p>
        </div>
        <ul className="mt-16 grid list-none grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {projects.map((p, i) => (
            <motion.li
              key={p.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-6%' }}
              transition={{ delay: Math.min(i * 0.04, 0.2), duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={cn(p.featured && 'md:col-span-2')}
            >
              <ProjectCard project={p} large={p.featured} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function ProjectCard({ project, large }: { project: Project; large?: boolean }) {
  const vref = useRef<HTMLVideoElement>(null)
  return (
    <Card
      className={cn(
        'group relative overflow-hidden border-border/50 bg-gradient-to-b from-card/90 to-card/40 p-0 shadow-xl shadow-black/20',
        'transition duration-500 hover:border-cyan-500/35 hover:shadow-2xl hover:shadow-cyan-500/10',
        large && 'md:grid md:min-h-[380px] md:grid-cols-[1.15fr_1fr]',
      )}
    >
      {project.badge && (
        <div className="absolute right-4 top-4 z-20">
          <Badge variant="accent" className="shadow-lg">
            {project.badge}
          </Badge>
        </div>
      )}
      {project.confidential && !project.badge && (
        <div className="absolute right-4 top-4 z-20">
          <Badge variant="muted" className="gap-1">
            <Lock className="h-3 w-3" />
            Internal
          </Badge>
        </div>
      )}
      <div
        className={cn(
          'relative overflow-hidden bg-zinc-950',
          large ? 'min-h-[220px] md:min-h-full' : 'h-52',
        )}
      >
        {project.media.type === 'video' ? (
          <video
            ref={vref}
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            src={project.media.src}
            muted
            loop
            playsInline
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
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
            loading="lazy"
          />
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-90 md:opacity-100" />
        {large && (
          <div className="absolute bottom-0 left-0 right-0 p-6 md:hidden">
            <p className="font-display text-2xl font-bold text-white drop-shadow-lg">{project.title}</p>
          </div>
        )}
      </div>
      <div className={cn('flex flex-col justify-center space-y-3 p-6 md:p-8', large && 'md:py-10')}>
        <h3 className="font-display text-xl font-bold tracking-tight md:text-2xl">{project.title}</h3>
        <p className="text-sm font-medium text-cyan-400/95">{project.subtitle}</p>
        <p className="text-sm leading-relaxed text-muted-foreground md:text-[0.9375rem]">{project.description}</p>
        {project.confidential && !project.links?.length ? (
          <p className="inline-flex w-fit items-center gap-2 rounded-xl border border-border bg-secondary/60 px-3 py-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5" />
            Under NDA
          </p>
        ) : (
          <div className="flex flex-wrap gap-2 pt-1">
            {project.links?.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/70 px-3.5 py-1.5 text-xs font-semibold text-foreground/95 transition hover:border-cyan-500/45 hover:bg-cyan-500/10"
              >
                {l.label === 'github' ? <Github className="h-3.5 w-3.5" /> : <ExternalLink className="h-3.5 w-3.5" />}
                {l.label === 'github' ? 'Repository' : 'Open app'}
                <MoveUpRight className="h-3 w-3 opacity-50" />
              </a>
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}
