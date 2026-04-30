import { useCallback, useEffect, useState } from 'react'
import { Github, Linkedin, Menu, Moon, SunMedium, X } from 'lucide-react'
import { site } from '@/data/site'
import { BrandLogo } from '@/components/BrandLogo'
import { useLenis } from '@/providers/SmoothScrollProvider'
import { cn } from '@/lib/utils'

const THEME_KEY = 'ak-theme'

const links = [
  { href: '#about', label: 'About' },
  { href: '#work', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#contact', label: 'Contact' },
] as const

function readInitialLight(): boolean {
  try {
    return localStorage.getItem(THEME_KEY) === 'light'
  } catch {
    return false
  }
}

export function SiteNav() {
  const { lenis } = useLenis()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [light, setLight] = useState(readInitialLight)

  useEffect(() => {
    const tick = () => {
      const y = lenis ? lenis.scroll : window.scrollY
      setScrolled(y > 36)
    }
    tick()
    if (lenis) {
      lenis.on('scroll', tick)
      return () => lenis.off('scroll', tick)
    }
    window.addEventListener('scroll', tick, { passive: true })
    return () => window.removeEventListener('scroll', tick)
  }, [lenis])

  useEffect(() => {
    document.documentElement.classList.toggle('light', light)
    try {
      localStorage.setItem(THEME_KEY, light ? 'light' : 'dark')
    } catch {
      // ignore
    }
  }, [light])

  const toggleTheme = useCallback(() => {
    setLight((v) => !v)
  }, [])

  const navTo = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      if (!href.startsWith('#')) return
      e.preventDefault()
      setOpen(false)
      if (lenis) lenis.scrollTo(href, { offset: -72 })
      else {
        const el = document.querySelector(href)
        el?.scrollIntoView({ behavior: 'smooth' })
      }
    },
    [lenis],
  )

  return (
    <header
      className={cn(
        'fixed left-0 right-0 top-0 z-40 transition-all duration-300',
        scrolled ? 'py-2' : 'py-3',
      )}
    >
      <div
        className={cn(
          'mx-auto max-w-6xl transition-all duration-300',
          scrolled &&
            'rounded-2xl border border-border/40 bg-background/75 shadow-[0_12px_40px_-20px_rgba(0,0,0,0.5)] backdrop-blur-2xl md:mx-6 light:border-stone-200/70 light:bg-[hsl(38_22%_96%_/0.88)] light:shadow-stone-300/25',
        )}
      >
        <div className="flex items-center justify-between gap-3 px-5 py-2.5 md:px-8">
          <a href="#top" className="group flex items-center gap-2.5" onClick={(e) => navTo(e, '#top')} data-cursor-hover>
            <BrandLogo className="transition group-hover:opacity-90" />
            <div className="hidden leading-none sm:block">
              <span className="font-display text-sm font-semibold tracking-tight text-foreground">{site.name.split(' ')[0]}</span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Engineer</span>
            </div>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => navTo(e, l.href)}
                className="rounded-full px-3 py-2 text-sm text-muted-foreground transition hover:bg-secondary/80 hover:text-foreground"
                data-cursor-hover
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <a
              href="#contact"
              onClick={(e) => navTo(e, '#contact')}
              className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
              data-cursor-hover
            >
              Let&apos;s talk
            </a>
            <button
              type="button"
              className="rounded-full p-2.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label={light ? 'Use dark mode' : 'Use light mode'}
              onClick={toggleTheme}
              data-cursor-hover
            >
              {light ? <Moon className="h-5 w-5" /> : <SunMedium className="h-5 w-5" />}
            </button>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full p-2.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label="GitHub"
              data-cursor-hover
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-full p-2.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
              aria-label="LinkedIn"
              data-cursor-hover
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <a
              href="#contact"
              onClick={(e) => navTo(e, '#contact')}
              className="rounded-full bg-foreground px-3 py-2 text-xs font-medium text-background"
              data-cursor-hover
            >
              Contact
            </a>
            <button type="button" className="rounded-full p-2" onClick={toggleTheme} aria-label="Theme" data-cursor-hover>
              {light ? <Moon className="h-5 w-5" /> : <SunMedium className="h-5 w-5" />}
            </button>
            <button type="button" className="rounded-full p-2" onClick={() => setOpen((v) => !v)} aria-label="Menu" data-cursor-hover>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="border-t border-border/50 bg-background/95 px-5 py-4 backdrop-blur-xl light:border-stone-200/70 light:bg-amber-50/95 md:hidden">
            <div className="flex flex-col gap-0.5">
              {links.map((l) => (
                <a key={l.href} href={l.href} className="rounded-lg px-2 py-2.5 text-sm" onClick={(e) => navTo(e, l.href)}>
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
