import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Menu, Moon, SunMedium, X } from 'lucide-react'
import { site } from '@/data/site'
import { BrandLogo } from '@/components/BrandLogo'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const THEME_KEY = 'ak-theme'

const links = [
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Work' },
  { href: '#skills', label: 'Skills' },
  { href: '#github', label: 'Code' },
  { href: '#arcade', label: 'Play' },
] as const

function readInitialLight(): boolean {
  try {
    return localStorage.getItem(THEME_KEY) === 'light'
  } catch {
    return false
  }
}

export function SiteNav({ onOpenProfile }: { onOpenProfile: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [light, setLight] = useState(readInitialLight)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  return (
    <motion.header
      initial={false}
      className={cn(
        'fixed left-0 right-0 top-0 z-40 transition-all duration-300',
        scrolled ? 'py-2' : 'py-3',
      )}
    >
      <div
        className={cn(
          'mx-auto max-w-6xl transition-all duration-300',
          scrolled &&
            'rounded-2xl border border-border/50 bg-background/80 shadow-lg shadow-black/20 backdrop-blur-2xl md:mx-4 light:border-stone-200/80 light:bg-amber-50/85 light:shadow-stone-400/25',
        )}
      >
        <div className="flex items-center justify-between gap-3 px-4 py-2.5 md:px-6">
          <a href="#top" className="group flex items-center gap-2.5">
            <BrandLogo className="transition group-hover:rotate-6 group-hover:scale-[1.03]" />
            <div className="hidden leading-none sm:block">
              <span className="font-display text-sm font-bold text-foreground">{site.name.split(' ')[0]}</span>
              <span className="block font-mono text-[9px] uppercase tracking-[0.15em] text-muted-foreground">Portfolio</span>
            </div>
          </a>
          <nav className="hidden items-center gap-0.5 rounded-full border border-border/50 bg-card/20 p-1 light:border-stone-200/70 light:bg-white/50 md:flex">
            <button
              type="button"
              onClick={onOpenProfile}
              className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground light:hover:bg-stone-100/90"
            >
              About
            </button>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-secondary hover:text-foreground light:hover:bg-stone-100/90"
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button type="button" variant="default" size="sm" className="rounded-full px-4" onClick={onOpenProfile}>
              Say hello
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-label={light ? 'Use dark mode' : 'Use paper mode'}
              onClick={toggleTheme}
            >
              {light ? <Moon className="h-5 w-5" /> : <SunMedium className="h-5 w-5" />}
            </Button>
            <a
              href={site.github}
              target="_blank"
              rel="noreferrer"
              className="rounded-full p-2.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground light:hover:bg-stone-200/70"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
              className="rounded-full p-2.5 text-muted-foreground transition hover:bg-secondary hover:text-foreground light:hover:bg-stone-200/70"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
          <div className="flex items-center gap-2 md:hidden">
            <Button type="button" size="sm" className="rounded-full" onClick={onOpenProfile}>
              Hello
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label={light ? 'Dark mode' : 'Paper mode'}
            >
              {light ? <Moon className="h-5 w-5" /> : <SunMedium className="h-5 w-5" />}
            </Button>
            <Button type="button" variant="ghost" size="icon" onClick={() => setOpen((v) => !v)} aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
        {open && (
          <div className="border-t border-border/60 bg-background/95 px-4 py-3 backdrop-blur-xl light:border-stone-200/80 light:bg-amber-50/95 md:hidden">
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                className="rounded-lg px-2 py-2.5 text-left text-sm"
                onClick={() => { onOpenProfile(); setOpen(false) }}
              >
                About
              </button>
              {links.map((l) => (
                <a key={l.href} href={l.href} className="rounded-lg px-2 py-2.5 text-sm" onClick={() => setOpen(false)}>
                  {l.label}
                </a>
              ))}
              <button
                type="button"
                className="rounded-lg px-2 py-2.5 text-left text-sm font-medium text-foreground"
                onClick={() => {
                  onOpenProfile()
                  setOpen(false)
                }}
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.header>
  )
}
