import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, FileText, Mail } from 'lucide-react'
import { site, projects, skillGroups, allSkillItems, experience, education, highlights } from '@/data/site'
import { initEmailjs, sendContactForm } from '@/lib/emailjs'
import { cn } from '@/lib/utils'

const field =
  'w-full rounded-2xl border border-border/60 bg-card/40 px-4 py-3 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/35'

export function MobileView() {
  const [dismissBanner, setDismissBanner] = useState(false)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initEmailjs()
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true)
    setError(null)
    const form = e.currentTarget
    try {
      await sendContactForm(form)
      setDone(true)
      form.reset()
      setTimeout(() => setDone(false), 3200)
    } catch {
      setError('Could not send right now. Email me directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      <div className="noise" aria-hidden />
      <div className="ambient-grid" aria-hidden />

      <AnimatePresence>
        {!dismissBanner && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sticky top-0 z-50 overflow-hidden border-b border-border/60 bg-card/90 backdrop-blur-md"
          >
            <div className="flex items-center justify-between gap-3 px-4 py-2.5 text-center text-sm text-muted-foreground">
              <span>Best experienced on desktop</span>
              <button
                type="button"
                className="shrink-0 rounded-full border border-border px-2 py-1 text-xs"
                onClick={() => setDismissBanner(true)}
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="relative z-10 mx-auto max-w-lg px-5 pb-24 pt-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Portfolio · 2026</p>
        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight">{site.tagline}</h1>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          {site.name} - {site.title}. Shipping production APIs, ML-backed products, and cloud work that holds when traffic
          spikes.
        </p>
        <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-foreground/80">{site.role}</p>
        <div className="mt-6 flex flex-wrap gap-4 text-sm">
          <a href={site.github} className="text-primary" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={site.linkedin} className="text-primary" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={`mailto:${site.email}`} className="text-primary">
            Email
          </a>
          <a href={site.resume} className="inline-flex items-center gap-1 text-primary" target="_blank" rel="noreferrer">
            <FileText className="size-4" />
            Résumé
          </a>
        </div>

        <section className="mt-16 border-t border-border/60 pt-12">
          <h2 className="font-display text-2xl font-semibold">About</h2>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{site.about.lede}</p>
          <p className="mt-4 text-lg font-medium">{site.about.headline}</p>
          {site.about.paragraphs.map((p) => (
            <p key={p.slice(0, 20)} className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {p}
            </p>
          ))}
          <h3 className="mt-10 font-display text-lg font-semibold">Experience</h3>
          <ul className="mt-4 space-y-6">
            {experience.map((job) => (
              <li key={job.company}>
                <p className="font-medium">
                  {job.role} · {job.company}
                </p>
                <p className="text-xs text-muted-foreground">
                  {job.place} · {job.period}
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {job.points.map((pt) => (
                    <li key={pt}>{pt}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <h3 className="mt-10 font-display text-lg font-semibold">Education</h3>
          <ul className="mt-3 space-y-3">
            {education.map((e) => (
              <li key={e.title} className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{e.title}</span> · {e.where} · {e.meta}
              </li>
            ))}
          </ul>
          <h3 className="mt-10 font-display text-lg font-semibold">Highlights</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {highlights.map((h) => (
              <li key={h} className="rounded-full border border-border/60 bg-card/50 px-3 py-1 font-mono text-[10px] text-muted-foreground">
                {h}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 border-t border-border/60 pt-12" id="work">
          <h2 className="font-display text-2xl font-semibold">Work</h2>
          <ul className="mt-6 space-y-8">
            {projects.map((p) => (
              <li key={p.title} className="rounded-2xl border border-border/50 bg-card/30 p-4">
                {p.media.type === 'video' ? (
                  <video className="mt-2 w-full rounded-xl object-cover" src={p.media.src} muted playsInline controls />
                ) : (
                  <img className="mt-2 w-full rounded-xl object-cover" src={p.media.src} alt={p.media.alt} />
                )}
                <p className="mt-3 font-display text-lg font-semibold">{p.title}</p>
                <p className="text-sm text-primary/90">{p.subtitle}</p>
                <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
                {p.links?.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-sm text-primary"
                  >
                    {l.label}
                  </a>
                ))}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 border-t border-border/60 pt-12">
          <h2 className="font-display text-2xl font-semibold">Skills</h2>
          {skillGroups.map((g) => (
            <div key={g.title} className="mt-8">
              <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{g.title}</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {g.items.map((item) => (
                  <span
                    key={item.name}
                    className="rounded-full border border-border/60 bg-card/40 px-3 py-1 text-xs"
                    title={item.productionHint}
                  >
                    {item.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <p className="mt-6 text-xs text-muted-foreground">{allSkillItems.length} tools total.</p>
        </section>

        <section className="mt-16 border-t border-border/60 pt-12" id="contact">
          <h2 className="font-display text-2xl font-semibold">Contact</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Short context, a concrete ask, and what &quot;done&quot; looks like. I read everything.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-4 flex items-center gap-2 text-lg font-medium text-primary"
          >
            <Mail className="size-5" />
            {site.email}
          </a>
          {done ? (
            <p className="mt-8 rounded-2xl border border-emerald-500/35 bg-emerald-500/10 p-4 text-sm text-emerald-100 light:text-emerald-950">
              Thanks - your note is in my inbox.
            </p>
          ) : (
            <form className="mt-8 space-y-4" onSubmit={onSubmit}>
              <div>
                <label className="text-xs text-muted-foreground" htmlFor="m_name">
                  Name
                </label>
                <input id="m_name" name="user_name" required className={cn(field, 'mt-1')} autoComplete="name" />
              </div>
              <div>
                <label className="text-xs text-muted-foreground" htmlFor="m_email">
                  Email
                </label>
                <input
                  id="m_email"
                  name="user_email"
                  type="email"
                  required
                  className={cn(field, 'mt-1')}
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground" htmlFor="m_msg">
                  Message
                </label>
                <textarea id="m_msg" name="message" required rows={4} className={cn(field, 'mt-1 resize-y')} />
              </div>
              {error && <p className="text-sm text-rose-400">{error}</p>}
              <motion.button
                type="submit"
                disabled={sending}
                className="w-full rounded-full bg-foreground py-3 text-sm font-medium text-background disabled:opacity-50"
                whileTap={{ scale: 0.98 }}
              >
                {sending ? 'Sending…' : 'Send message'}
              </motion.button>
            </form>
          )}
        </section>

        <footer className="mt-20 border-t border-border/60 pt-12">
          <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Next step</p>
          <p className="mt-3 font-display text-xl font-semibold">If the work resonates, we should talk.</p>
          <a href={`mailto:${site.email}`} className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
            {site.email}
            <ArrowUpRight className="size-4" />
          </a>
          <div className="mt-8 flex flex-wrap gap-4 font-mono text-[11px] uppercase tracking-wide text-muted-foreground">
            <a href={site.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            <a href={site.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={site.medium} target="_blank" rel="noreferrer">
              Medium
            </a>
            <a href={site.resume} target="_blank" rel="noreferrer">
              Résumé
            </a>
          </div>
          <p className="mt-8 text-xs text-muted-foreground">© {new Date().getFullYear()} {site.name}</p>
        </footer>
      </main>
    </div>
  )
}
