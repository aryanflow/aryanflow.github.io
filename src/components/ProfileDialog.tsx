import { useEffect, useState } from 'react'
import emailjs from '@emailjs/browser'
import { Mail, MessageSquare, User } from 'lucide-react'
import { site } from '@/data/site'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

const EMAILJS_KEY = 'seCKWFuPSTJAb1zqo'
const EMAILJS_SERVICE = 'aryankashyap_email'
const EMAILJS_TEMPLATE = 'aryankashyap_template'

export function ProfileDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  useEffect(() => {
    emailjs.init(EMAILJS_KEY)
  }, [])
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true)
    setError(null)
    const form = e.currentTarget
    try {
      await emailjs.sendForm(EMAILJS_SERVICE, EMAILJS_TEMPLATE, form, EMAILJS_KEY)
      setDone(true)
      form.reset()
      setTimeout(() => {
        setDone(false)
        onOpenChange(false)
      }, 2400)
    } catch {
      setError('Email is down for a moment. Please try again or use the address below.')
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          'flex max-h-[min(94vh,920px)] w-[calc(100vw-1.25rem)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl p-0 sm:w-[min(100vw-2rem,52rem)] md:w-[min(100vw-2.5rem,56rem)]',
          'lg:max-h-[min(90vh,860px)] lg:max-w-[min(96vw,64rem)]',
        )}
      >
        <DialogTitle className="sr-only">About and contact</DialogTitle>
        <DialogDescription className="sr-only">Biography and contact form for Aryan Kashyap</DialogDescription>

        <div className="grid max-h-[inherit] flex-1 overflow-hidden lg:grid-cols-[minmax(240px,300px)_1fr]">
          <aside className="relative hidden overflow-hidden lg:flex lg:flex-col lg:border-r lg:border-border/60 light:lg:border-stone-200/80">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-950/95 via-zinc-950 to-zinc-950 light:from-teal-900/25 light:via-amber-100/95 light:to-stone-50" />
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07] light:opacity-[0.12]"
              style={{
                backgroundImage: `linear-gradient(hsl(var(--foreground) / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.12) 1px, transparent 1px)`,
                backgroundSize: '20px 20px',
              }}
            />
            <div className="relative flex flex-1 flex-col justify-end p-8 pb-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-cyan-300/85 light:text-cyan-900">Say hello</p>
              <p className="mt-4 font-display text-2xl font-bold leading-[1.15] tracking-tight text-foreground md:text-[1.65rem]">
                Tell me what you are building. I will answer like a human, not a ticket bot.
              </p>
              <a
                href={`mailto:${site.email}`}
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-cyan-500/35 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-100 transition hover:border-cyan-400/50 hover:bg-cyan-500/15 light:border-cyan-800/30 light:bg-cyan-900/10 light:text-cyan-950 light:hover:bg-cyan-900/15"
              >
                <Mail className="h-4 w-4 shrink-0 opacity-90" />
                {site.email}
              </a>
            </div>
            <p className="relative z-[1] border-t border-white/10 px-8 py-5 text-xs leading-relaxed text-zinc-400 light:border-stone-200/70 light:text-stone-600">
              Prefer short context and a concrete ask. I read everything; spam and vague “pick your brain” intros get skipped.
            </p>
          </aside>

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain">
            <div className="border-b border-border/50 px-5 pb-4 pt-5 sm:px-8 sm:pt-7 light:border-stone-200/80 lg:hidden">
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-400/90 light:text-cyan-800">Say hello</p>
              <p className="mt-2 font-display text-lg font-semibold leading-snug text-foreground">About and contact</p>
            </div>

            <div className="flex-1 px-5 py-5 sm:px-8 sm:py-8 md:px-10 md:py-9">
              <Tabs defaultValue="about" className="flex w-full flex-col gap-0">
                <TabsList className="mb-6 grid h-auto w-full max-w-md grid-cols-2 gap-1 rounded-xl border border-border/60 bg-muted/30 p-1 light:border-stone-200/80 light:bg-stone-100/60">
                  <TabsTrigger value="about" className="gap-2 rounded-lg py-2.5 text-sm data-[state=active]:shadow-sm">
                    <User className="h-4 w-4 shrink-0" />
                    About
                  </TabsTrigger>
                  <TabsTrigger value="contact" className="gap-2 rounded-lg py-2.5 text-sm data-[state=active]:shadow-sm">
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    Contact
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="about" className="mt-0 space-y-5">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-cyan-400/90 light:text-cyan-800">{site.about.lede}</p>
                  {site.about.paragraphs.map((p) => (
                    <p key={p.slice(0, 24)} className="max-w-prose text-[15px] leading-relaxed text-muted-foreground md:text-base">
                      {p}
                    </p>
                  ))}
                </TabsContent>
                <TabsContent value="contact" className="mt-0">
                  <p className="mb-6 max-w-prose text-[15px] leading-relaxed text-muted-foreground">
                    What are you building, what is blocking you, and what does “done” look like? The more specific, the faster I can help.
                  </p>
                  {done ? (
                    <p className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-4 text-[15px] leading-relaxed text-emerald-100 light:border-emerald-800/35 light:bg-emerald-800/10 light:text-emerald-950">
                      Thanks! Your note is in my inbox. I will reply as soon as I can.
                    </p>
                  ) : (
                    <form className="mx-auto max-w-xl space-y-5" onSubmit={onSubmit}>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold tracking-wide text-muted-foreground" htmlFor="user_name">
                          Name
                        </label>
                        <input id="user_name" name="user_name" required className={inputClass} autoComplete="name" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold tracking-wide text-muted-foreground" htmlFor="user_email">
                          Email
                        </label>
                        <input
                          id="user_email"
                          name="user_email"
                          type="email"
                          required
                          className={inputClass}
                          autoComplete="email"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-semibold tracking-wide text-muted-foreground" htmlFor="message">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          placeholder="Stack, timeline, and what you need from me (build, review, pair, refer)…"
                          className={cn(inputClass, 'min-h-[168px] resize-y')}
                        />
                      </div>
                      {error && <p className="text-sm text-rose-300 light:text-rose-800">{error}</p>}
                      <div className="flex flex-col gap-4 border-t border-border/50 pt-5 sm:flex-row sm:items-center sm:justify-between light:border-stone-200/70">
                        <p className="text-xs text-muted-foreground">
                          Prefer direct email?{' '}
                          <a
                            className="font-medium text-cyan-300 underline-offset-2 hover:underline light:text-cyan-800"
                            href={`mailto:${site.email}`}
                          >
                            {site.email}
                          </a>
                        </p>
                        <Button type="submit" size="lg" className="w-full shrink-0 rounded-xl px-8 sm:w-auto" disabled={sending}>
                          {sending ? 'Sending…' : 'Send message'}
                        </Button>
                      </div>
                    </form>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const inputClass =
  'flex w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-[15px] text-foreground ring-offset-background placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background light:border-stone-300/90 light:bg-white/90 light:ring-offset-amber-50/90 light:focus-visible:ring-cyan-700/45'
