import { useCallback, useEffect, useRef, useState } from 'react'
import { projects, site, skillGroups } from '@/data/site'

const HELP = `Commands: help, about, work, skills, contact, clear, whoami, social, ls, cat skills, git log, sudo hire-me
Extras: uname, uptime, fortune, cowsay, env, rm -rf /, ping google`

export function TerminalWindow() {
  const [lines, setLines] = useState<{ type: 'o' | 'i'; text: string }[]>([
    { type: 'o', text: 'aryan-os shell - type help' },
  ])
  const [input, setInput] = useState('')
  const [hist, setHist] = useState<string[]>([])
  const [hi, setHi] = useState(0)
  const bottom = useRef<HTMLDivElement>(null)
  const busy = useRef(false)

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lines])

  const pushOut = useCallback(async (text: string, typed = false) => {
    if (!typed) {
      setLines((L) => [...L, { type: 'o', text }])
      return
    }
    busy.current = true
    setLines((L) => [...L, { type: 'o', text: '' }])
    for (let i = 0; i < text.length; i++) {
      const slice = text.slice(0, i + 1)
      await new Promise((r) => setTimeout(r, 5))
      setLines((L) => {
        const n = [...L]
        n[n.length - 1] = { type: 'o', text: slice }
        return n
      })
    }
    busy.current = false
  }, [])

  const run = useCallback(
    async (raw: string) => {
      const cmd = raw.trim().toLowerCase()
      setLines((L) => [...L, { type: 'i', text: `$ ${raw}` }])
      if (busy.current) return

      if (!cmd) return

      if (cmd === 'clear') {
        setLines([])
        return
      }
      if (cmd === 'help') {
        await pushOut(HELP)
        return
      }
      if (cmd === 'sudo hire-me' || cmd === 'sudo hire me') {
        await pushOut(
          `sudo: hire-me: Permission granted… for reading ${site.email}. No password stored on this shell.`,
          true,
        )
        return
      }
      if (cmd === 'git log') {
        await pushOut(
          `commit ${Date.now().toString(36)}\nAuthor: ${site.name} <${site.email}>\nDate: now\n\n    chore(portfolio): ship early, iterate loudly.\n`,
          true,
        )
        return
      }
      if (cmd === 'rm -rf /' || cmd === 'rm -rf life') {
        await pushOut(`rm: refusing to remove '/': Operation not permitted (try gratitude instead).`, true)
        return
      }
      if (cmd === 'ping google.com' || cmd === 'ping google') {
        await pushOut(`64 bytes from google.com: icmp_seq=0 ttl=56 time=0.9 ms — routes clear.`, true)
        return
      }
      if (cmd === 'ls' || cmd === 'ls projects') {
        await pushOut(projects.map((p) => `${p.title.replace(/\s+/g, '-').toLowerCase()}/`).join('  '), true)
        return
      }
      if (cmd === 'cat skills' || cmd === 'cat skills.txt') {
        await pushOut(
          skillGroups.map((g) => `${g.title}:\n${g.items.map((it) => `  • ${it.name}`).join('\n')}`).join('\n\n'),
          true,
        )
        return
      }
      if (cmd === 'about') {
        await pushOut([site.about.headline, ...site.about.paragraphs].join('\n\n'), true)
        return
      }
      if (cmd === 'work') {
        await pushOut(projects.map((p) => `• ${p.title} - ${p.subtitle}`).join('\n'), true)
        return
      }
      if (cmd === 'skills') {
        await pushOut(skillGroups.map((g) => `${g.title} (${g.items.length} items)`).join('\n'), true)
        return
      }
      if (cmd === 'contact') {
        await pushOut(site.email, true)
        return
      }
      if (cmd === 'uname' || cmd === 'uname -a') {
        await pushOut(`Darwin aryan-os 24.0.0 arm64 — portfolio shell (not a real kernel; aesthetics only).`, true)
        return
      }
      if (cmd === 'uptime') {
        await pushOut(
          `${Math.floor(performance.now() / 3600000)}:${String(Math.floor((performance.now() / 60000) % 60)).padStart(2, '0')} up (session), load: imagination/1.0`,
          true,
        )
        return
      }
      if (cmd === 'fortune') {
        await pushOut(
          [
            'Ship the portfolio. Touch grass between deploys.',
            'Your cursor is glowing — use that power responsibly.',
            'Recruiters skip cover letters; they remember motion design.',
          ][Math.floor(Math.random() * 3)],
          true,
        )
        return
      }
      if (cmd.startsWith('cowsay')) {
        const rest = (raw.replace(/^cowsay\s*/i, '').trim() || 'moo').slice(0, 72)
        await pushOut(` ${'_'.repeat(rest.length + 2)}\n< ${rest} >\n ${'-'.repeat(rest.length + 2)}\n        \\   ^__^\n         \\  (oo)\\_______\n            (__)\\       )\\/\\\n                ||----w |\n                ||     ||`, true)
        return
      }
      if (cmd === 'env' || cmd === 'printenv') {
        await pushOut(`USER=${site.name.replace(/\s+/g, '_')}\nSHELL=aryan-os\nPWD=/portfolio\nNODE_ENV=creative`, true)
        return
      }
      if (cmd === 'whoami') {
        await pushOut(`${site.name} - ${site.title}`, true)
        return
      }
      if (cmd === 'social') {
        await pushOut(`GitHub: ${site.github}\nLinkedIn: ${site.linkedin}\nMedium: ${site.medium}`, true)
        return
      }
      await pushOut(`command not found: ${raw.split(/\s+/)[0]}. Try help.`)
    },
    [pushOut],
  )

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const v = input
      setInput('')
      if (v.trim()) setHist((h) => [...h, v].slice(-40))
      setHi(0)
      void run(v)
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (hist.length === 0) return
      const next = Math.min(hist.length, hi + 1)
      setHi(next)
      setInput(hist[hist.length - next] ?? '')
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (hi <= 1) {
        setHi(0)
        setInput('')
        return
      }
      const next = hi - 1
      setHi(next)
      setInput(hist[hist.length - next] ?? '')
    }
  }

  return (
    <div className="flex h-full min-h-[320px] flex-col bg-[#0a0a0c] p-3 font-jetbrains text-[12px] text-emerald-100/90">
      <div className="min-h-0 flex-1 overflow-auto whitespace-pre-wrap leading-relaxed">
        {lines.map((l, i) => (
          <div key={`${i}-${l.text.slice(0, 12)}`} className={l.type === 'i' ? 'text-white/55' : ''}>
            {l.text}
          </div>
        ))}
        <div ref={bottom} />
      </div>
      <div className="mt-2 flex items-center gap-2 border-t border-white/10 pt-2">
        <span className="text-indigo-400">❯</span>
        <input
          className="min-w-0 flex-1 bg-transparent text-white/90 outline-none caret-indigo-400"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          aria-label="Terminal input"
        />
        <span className="ak-term-cursor inline-block h-4 w-2 shrink-0 bg-emerald-400/80" aria-hidden />
      </div>
    </div>
  )
}
