import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Mail } from 'lucide-react'
import { site } from '@/data/site'
import { initEmailjs, sendContactForm } from '@/lib/emailjs'
import { Magnetic } from '@/components/Magnetic'
import { cn } from '@/lib/utils'

const inputClass =
  'box-border min-w-0 w-full rounded-2xl border border-border/80 bg-card/40 px-4 py-3.5 text-[15px] text-foreground placeholder:text-muted-foreground/50 backdrop-blur-sm transition focus:outline-none focus:ring-2 focus:ring-primary/35 focus:ring-offset-2 focus:ring-offset-background light:border-stone-300/80 light:bg-white/90 light:ring-offset-amber-50/90'

export function ContactSection() {
  const root = useRef<HTMLElement>(null)
  const panel = useRef<HTMLDivElement>(null)
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    initEmailjs()
  }, [])

  useLayoutEffect(() => {
    const el = root.current
    if (!el || !panel.current) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const ctx = gsap.context(() => {
      if (reduce) return
      gsap.from(panel.current, {
        y: 48,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none reverse' },
      })
    }, el)
    return () => ctx.revert()
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
    <section id="contact" ref={root} className="scroll-mt-28 w-full min-w-0 px-5 py-24 md:px-10 md:py-32">
      <div className="mx-auto box-border w-full min-w-0 max-w-5xl">
        <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-muted-foreground">Contact</p>
        <h2 className="mt-4 max-w-xl font-display text-[clamp(1.75rem,4vw,2.5rem)] font-semibold leading-tight tracking-[-0.02em]">
          Say hello.
        </h2>
        <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
          Short context, a concrete ask, and what “done” looks like. I read everything.
        </p>

        <div
          ref={panel}
          className="mt-12 grid w-full min-w-0 max-w-full gap-10 box-border lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16"
        >
          <div className="box-border flex min-w-0 w-full max-w-full flex-col justify-between gap-8 rounded-3xl border border-border/60 bg-card/25 p-8 backdrop-blur-md md:p-10">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Direct</p>
              <a
                href={`mailto:${site.email}`}
                className="mt-4 flex min-w-0 max-w-full flex-wrap items-center gap-2 font-display text-xl font-medium tracking-tight transition hover:text-primary md:text-2xl"
                data-cursor-hover
              >
                <Mail className="h-5 w-5 shrink-0 opacity-70" />
                <span className="min-w-0 break-words">{site.email}</span>
              </a>
            </div>
            <Magnetic strength={0.2}>
              <a
                href={site.resume}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit rounded-full border border-border px-5 py-2.5 text-sm font-medium transition hover:border-primary/50"
                data-cursor-hover
              >
                Download résumé
              </a>
            </Magnetic>
          </div>

          <div
            className="box-border min-w-0 w-full max-w-full rounded-3xl border border-border/60 bg-card/20 p-6 backdrop-blur-md md:p-8"
            data-lenis-prevent
          >
            {done ? (
              <p className="rounded-2xl border border-emerald-500/35 bg-emerald-500/10 px-5 py-6 text-[15px] leading-relaxed text-emerald-100 light:border-emerald-800/30 light:bg-emerald-800/10 light:text-emerald-950">
                Thanks - your note is in my inbox.
              </p>
            ) : (
              <form className="min-w-0 space-y-5" onSubmit={onSubmit}>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="contact_name">
                    Name
                  </label>
                  <input id="contact_name" name="user_name" required className={inputClass} autoComplete="name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="contact_email">
                    Email
                  </label>
                  <input
                    id="contact_email"
                    name="user_email"
                    type="email"
                    required
                    className={inputClass}
                    autoComplete="email"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground" htmlFor="contact_message">
                    Message
                  </label>
                  <textarea
                    id="contact_message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Stack, timeline, what you need…"
                    className={cn(inputClass, 'min-h-[140px] resize-y')}
                  />
                </div>
                {error && <p className="text-sm text-rose-300 light:text-rose-800">{error}</p>}
                <Magnetic strength={0.18}>
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full rounded-full bg-foreground py-3.5 text-sm font-medium text-background transition enabled:hover:opacity-90 disabled:opacity-50 md:w-auto md:px-10"
                    data-cursor-hover
                  >
                    {sending ? 'Sending…' : 'Send message'}
                  </button>
                </Magnetic>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
