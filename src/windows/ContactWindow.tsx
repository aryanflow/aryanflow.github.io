import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { site } from '@/data/site'
import { initEmailjs, sendContactForm } from '@/lib/emailjs'
import { SPRING_SNAPPY } from '@/os/springs'
import { cn } from '@/lib/utils'

const field =
  'w-full rounded-xl border border-white/[0.12] bg-white/[0.04] px-3 py-2.5 text-[13px] text-white placeholder:text-white/35 focus:border-indigo-400/40 focus:outline-none focus:ring-1 focus:ring-indigo-400/30'

export function ContactWindow() {
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
    <div className="flex h-full min-h-[360px] flex-col bg-[#101014] font-inter text-white">
      <div className="border-b border-white/[0.06] px-4 py-2">
        <p className="text-[11px] text-white/40">New message</p>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-5">
        <div className="mb-4 flex items-start gap-2 text-[13px]">
          <span className="w-10 shrink-0 text-right text-white/45">To:</span>
          <a
            href={`mailto:${site.email}`}
            className="flex flex-wrap items-center gap-2 text-indigo-300/90"
            data-cursor="hover"
          >
            <Mail className="size-4 opacity-70" />
            {site.email}
          </a>
        </div>
        <p className="mb-4 text-[12px] leading-relaxed text-white/55">
          Short context, a concrete ask, and what &quot;done&quot; looks like. I read everything.
        </p>
        <div className="mb-4 flex flex-wrap gap-3 text-[11px] uppercase tracking-wide text-white/45">
          <a href={site.github} target="_blank" rel="noreferrer" data-cursor="hover" className="hover:text-white">
            GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer" data-cursor="hover" className="hover:text-white">
            LinkedIn
          </a>
          <a href={site.medium} target="_blank" rel="noreferrer" data-cursor="hover" className="hover:text-white">
            Medium
          </a>
        </div>

        {done ? (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={SPRING_SNAPPY}
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-[13px] text-emerald-100"
          >
            Thanks - your note is in my inbox.
          </motion.p>
        ) : (
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="mb-1 block text-[11px] text-white/45" htmlFor="cw_name">
                Name
              </label>
              <input id="cw_name" name="user_name" required className={field} autoComplete="name" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-white/45" htmlFor="cw_email">
                Email
              </label>
              <input
                id="cw_email"
                name="user_email"
                type="email"
                required
                className={field}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] text-white/45" htmlFor="cw_msg">
                Message
              </label>
              <textarea
                id="cw_msg"
                name="message"
                required
                rows={5}
                placeholder="Stack, timeline, what you need…"
                className={cn(field, 'min-h-[120px] resize-y')}
              />
            </div>
            {error && <p className="text-sm text-rose-300">{error}</p>}
            <motion.button
              type="submit"
              disabled={sending}
              data-cursor="hover"
              className="rounded-full bg-white px-6 py-2.5 text-[13px] font-medium text-black transition enabled:hover:opacity-90 disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {sending ? 'Sending…' : 'Send message'}
            </motion.button>
          </form>
        )}
      </div>
    </div>
  )
}
