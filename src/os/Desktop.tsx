import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import * as Icons from 'lucide-react'
import type { WindowId } from '@/os/windowIds'
import { useWindowManager } from '@/os/WindowManager'
import { getWindowDefinitions } from '@/os/windowDefaults'
import { Window } from '@/os/Window'
import { Dock } from '@/os/Dock'
import { MenuBar } from '@/os/MenuBar'
import { FluidBackdrop } from '@/os/FluidBackdrop'
import { DesktopClock } from '@/os/DesktopClock'
import { useToast } from '@/os/ToastStack'
import { setSoundEnabled } from '@/os/uiSounds'

const AboutWindow = lazy(() => import('@/windows/AboutWindow').then((m) => ({ default: m.AboutWindow })))
const WorkWindow = lazy(() => import('@/windows/WorkWindow').then((m) => ({ default: m.WorkWindow })))
const SkillsWindow = lazy(() => import('@/windows/SkillsWindow').then((m) => ({ default: m.SkillsWindow })))
const ContactWindow = lazy(() => import('@/windows/ContactWindow').then((m) => ({ default: m.ContactWindow })))
const ResumeWindow = lazy(() => import('@/windows/ResumeWindow').then((m) => ({ default: m.ResumeWindow })))
const TerminalWindow = lazy(() => import('@/windows/TerminalWindow').then((m) => ({ default: m.TerminalWindow })))

const windowMap: Record<WindowId, ComponentType> = {
  about: AboutWindow,
  work: WorkWindow,
  skills: SkillsWindow,
  contact: ContactWindow,
  resume: ResumeWindow,
  terminal: TerminalWindow,
}

const desktopIcons: { id: WindowId; label: string; icon: ComponentType<{ className?: string }> }[] = [
  { id: 'about', label: 'About', icon: Icons.User },
  { id: 'work', label: 'Work', icon: Icons.FolderOpen },
  { id: 'skills', label: 'Skills', icon: Icons.Code2 },
  { id: 'contact', label: 'Contact', icon: Icons.Mail },
  { id: 'resume', label: 'Résumé', icon: Icons.FileText },
  { id: 'terminal', label: 'Terminal', icon: Icons.Terminal },
]

/** Tiny offsets so the grid stays visually centered but not sterile */
function stickyNoteOffset(i: number) {
  const a = i * 2.17 + 0.51
  const b = i * 1.41 + 0.93
  return {
    x: Math.round(Math.sin(a) * 5),
    y: Math.round(Math.cos(b) * 4),
    rotate: Math.sin(a + b) * 1.2,
  }
}

function soundMuted(): boolean {
  try {
    return localStorage.getItem('ak-ui-sound') === '0'
  } catch {
    return false
  }
}

type Props = { reducedMotion: boolean }

export function Desktop({ reducedMotion }: Props) {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const { state, openWindow, syncDefinitions } = useWindowManager()
  const { push } = useToast()
  const [menu, setMenu] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const onResize = () => {
      syncDefinitions(getWindowDefinitions({ width: window.innerWidth, height: window.innerHeight }))
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [syncDefinitions])

  useEffect(() => {
    if (!menu) return
    const close = () => setMenu(null)
    const t = window.setTimeout(() => {
      window.addEventListener('click', close)
    }, 10)
    return () => {
      clearTimeout(t)
      window.removeEventListener('click', close)
    }
  }, [menu])

  useEffect(() => {
    const t = window.setTimeout(() => {
      push({
        title: 'Welcome to aryan-os',
        body: 'Double-click vibes: icons open windows. Right-click the desktop for more.',
        variant: 'info',
      })
    }, 900)
    return () => clearTimeout(t)
  }, [push])

  useEffect(() => {
    const t = window.setTimeout(() => {
      push({
        title: 'Battery low',
        body: 'Just kidding — this site runs on curiosity. Plug in your ambition instead.',
        variant: 'warn',
      })
    }, 48000)
    return () => clearTimeout(t)
  }, [push])

  const toggleTheme = useCallback(() => {
    const root = document.documentElement
    root.classList.toggle('light')
    try {
      localStorage.setItem('ak-theme', root.classList.contains('light') ? 'light' : 'dark')
    } catch {
      /* ignore */
    }
  }, [])

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-[#06060a] font-inter text-white"
      onContextMenu={(e) => {
        e.preventDefault()
        setMenu({ x: e.clientX, y: e.clientY })
      }}
    >
      {!reducedMotion && <FluidBackdrop />}
      <div className="noise pointer-events-none absolute inset-0 z-[2]" aria-hidden />

      {!reducedMotion && <DesktopClock />}

      <div className="pointer-events-none fixed inset-x-0 top-7 bottom-[104px] z-[3] flex items-center justify-center px-4">
        <div className="pointer-events-auto grid max-w-[min(100%,580px)] grid-cols-3 grid-rows-2 place-items-center gap-x-8 gap-y-9 sm:gap-x-12 sm:gap-y-10 md:gap-x-14">
          {desktopIcons.map((ic, i) => {
            const off = stickyNoteOffset(i)
            return (
              <motion.button
                key={ic.id}
                type="button"
                data-cursor="hover"
                className="group flex w-full max-w-[5.75rem] flex-col items-center gap-2 rounded-2xl border border-transparent bg-transparent px-1.5 py-2 text-center outline-none transition-[transform,box-shadow] duration-300 hover:border-white/[0.08] hover:bg-white/[0.03]"
                style={{
                  transform: `translate(${off.x}px, ${off.y}px) rotate(${off.rotate}deg)`,
                }}
                initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
                whileHover={
                  reducedMotion
                    ? {}
                    : {
                        y: off.y - 5,
                        scale: 1.045,
                        rotate: off.rotate,
                        transition: { type: 'spring', stiffness: 420, damping: 22 },
                      }
                }
                whileTap={reducedMotion ? {} : { scale: 0.96 }}
                onClick={() => {
                  openWindow(ic.id)
                }}
              >
                <span className="flex size-[64px] items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.06] shadow-[0_12px_40px_-18px_rgba(0,0,0,0.85)] backdrop-blur-sm transition-[border-color,box-shadow,background-color] duration-300 group-hover:border-white/[0.16] group-hover:bg-white/[0.09] group-hover:shadow-[0_20px_50px_-20px_rgba(99,102,241,0.25)]">
                  <ic.icon className="size-[28px] text-white/90 transition-transform duration-300 group-hover:scale-110" />
                </span>
                <span className="w-full min-w-0 max-w-[6.5rem] text-center font-inter text-[12px] font-medium leading-snug tracking-wide text-white/75">
                  {ic.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-[500] min-w-[220px] overflow-hidden rounded-xl border border-white/12 bg-[#121218]/95 py-1 font-inter text-sm shadow-2xl backdrop-blur-xl"
            style={{ left: menu.x, top: menu.y }}
            onClick={(e) => e.stopPropagation()}
            role="menu"
          >
            <MenuItem
              onClick={() => {
                openWindow('about')
                setMenu(null)
              }}
            >
              About this portfolio
            </MenuItem>
            <MenuItem
              onClick={() => {
                openWindow('contact')
                setMenu(null)
              }}
            >
              Contact Aryan
            </MenuItem>
            <MenuItem
              onClick={() => {
                toggleTheme()
                setMenu(null)
              }}
            >
              Change theme
            </MenuItem>
            <MenuItem
              onClick={() => {
                openWindow('terminal')
                setMenu(null)
              }}
            >
              Open Terminal
            </MenuItem>
            <MenuItem
              onClick={() => {
                setSoundEnabled(soundMuted())
                setMenu(null)
              }}
            >
              {soundMuted() ? 'Enable UI sounds' : 'Mute UI sounds'}
            </MenuItem>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={constraintsRef} className="pointer-events-none fixed left-0 right-0 top-7 bottom-[104px] z-[40]">
        {state.windows
          .filter((w) => w.isOpen && !w.isMinimized)
          .map((w) => {
            const Cmp = windowMap[w.id]
            return (
              <Window key={w.id} win={w} constraintsRef={constraintsRef}>
                <Suspense fallback={<WindowFallback title={w.title} />}>
                  <Cmp />
                </Suspense>
              </Window>
            )
          })}
      </div>

      <MenuBar />
      <Dock />
    </div>
  )
}

function MenuItem({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      role="menuitem"
      data-cursor="hover"
      className="w-full px-4 py-2.5 text-left text-white/85 transition hover:bg-white/[0.08]"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function WindowFallback({ title }: { title: string }) {
  return (
    <div className="flex h-48 items-center justify-center font-mono text-sm text-white/40">
      Loading {title}…
    </div>
  )
}
