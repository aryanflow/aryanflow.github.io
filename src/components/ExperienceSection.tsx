import { motion } from 'framer-motion'
import { Briefcase, GraduationCap, Trophy } from 'lucide-react'
import { education, experience, highlights } from '@/data/site'

const item = {
  hidden: { opacity: 0, y: 22 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.05 * i, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
}

export function ExperienceSection() {
  return (
    <section id="experience" className="scroll-mt-28 px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-400/90">Where I have shipped</p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight tracking-tight">
            Experience and education
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            The common thread: systems that stay understandable when load spikes, budgets tighten, or the roadmap moves.
          </p>
        </div>
        <div className="mt-16 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="mb-6 flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4 text-cyan-400/80" />
              <h3 className="font-mono text-xs uppercase tracking-widest">Roles</h3>
            </div>
            <div className="relative space-y-0 pl-0 sm:pl-1">
              <div className="absolute left-3 top-2 bottom-2 w-px -translate-x-1/2 bg-gradient-to-b from-cyan-500/50 via-border to-orange-500/30" />
              {experience.map((job, i) => (
                <motion.article
                  key={job.company}
                  custom={i}
                  variants={item}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '-8%' }}
                  className="card-lift relative pb-10 pl-10 last:pb-0 sm:pl-11"
                >
                  <span className="absolute left-3 top-2.5 z-[1] h-3 w-3 -translate-x-1/2 rounded-full border-2 border-cyan-400 bg-background shadow-[0_0_12px_hsl(188_100%_50%_/_0.35)] light:border-cyan-600 light:bg-amber-50" />
                  <div className="rounded-2xl border border-border/60 bg-card/40 p-5 shadow-sm transition hover:border-cyan-500/25 hover:shadow-md hover:shadow-cyan-500/5">
                    <h4 className="font-display text-lg font-semibold text-foreground md:text-xl">
                      {job.role} <span className="text-muted-foreground">at</span> {job.company}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {job.place} · {job.period}
                    </p>
                    <ul className="mt-4 space-y-2.5 text-sm leading-relaxed text-muted-foreground">
                      {job.points.map((p) => (
                        <li key={p} className="flex gap-2.5">
                          <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-cyan-400 to-orange-400" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
          <div className="space-y-10">
            <div>
              <div className="mb-4 flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4 text-orange-400/80" />
                <h3 className="font-mono text-xs uppercase tracking-widest">School</h3>
              </div>
              <ul className="space-y-3">
                {education.map((e) => (
                  <li
                    key={e.title}
                    className="card-lift rounded-2xl border border-border/70 bg-gradient-to-br from-card/60 to-card/30 p-4"
                  >
                    <p className="font-display font-semibold text-foreground">{e.title}</p>
                    <p className="text-sm text-muted-foreground">{e.where}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{e.meta}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="mb-4 flex items-center gap-2 text-muted-foreground">
                <Trophy className="h-4 w-4 text-fuchsia-400/80" />
                <h3 className="font-mono text-xs uppercase tracking-widest">Highlights</h3>
              </div>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                {highlights.map((h) => (
                  <li key={h} className="flex gap-2 rounded-lg px-1 py-1 transition hover:bg-secondary/50">
                    <span className="text-orange-400">✦</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
