import { memo, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import * as Icons from 'lucide-react'
import type { WindowId } from '@/os/windowIds'
import type { ManagedWindow } from '@/os/WindowManager'
import { useWindowManager } from '@/os/WindowManager'
import { playDockPop } from '@/os/uiSounds'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  user: Icons.User,
  folder: Icons.FolderOpen,
  code: Icons.Code2,
  mail: Icons.Mail,
  'file-text': Icons.FileText,
  terminal: Icons.Terminal,
}

export function Dock() {
  const { state, openWindow, restoreWindow, focusWindow, setDockTarget } = useWindowManager()
  const mouseX = useMotionValue(Infinity)
  const mouseY = useMotionValue(Infinity)

  return (
    <div
      className="fixed bottom-4 left-1/2 z-[180] flex -translate-x-1/2 justify-center"
      style={{ width: 'max-content', maxWidth: 'min(100vw - 1.5rem, 560px)' }}
    >
      <motion.nav
        className="flex w-max items-end rounded-[20px] border border-white/[0.12] bg-white/[0.08] px-5 py-2.5 shadow-2xl backdrop-blur-[40px] saturate-150"
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 34, mass: 0.85 }}
        onMouseMove={(e) => {
          mouseX.set(e.clientX)
          mouseY.set(e.clientY)
        }}
        onMouseLeave={() => {
          mouseX.set(Infinity)
          mouseY.set(Infinity)
        }}
        aria-label="Application dock"
      >
        <div className="flex items-end gap-2">
          {state.windows.map((w) => (
            <DockIcon
              key={w.id}
              win={w}
              mouseX={mouseX}
              mouseY={mouseY}
              setDockTarget={setDockTarget}
              onActivate={() => {
                playDockPop()
                if (w.isOpen && w.isMinimized) restoreWindow(w.id)
                else if (w.isOpen) focusWindow(w.id)
                else openWindow(w.id)
              }}
            />
          ))}
        </div>
      </motion.nav>
    </div>
  )
}

const DockIcon = memo(function DockIcon({
  win,
  mouseX,
  mouseY,
  setDockTarget,
  onActivate,
}: {
  win: ManagedWindow
  mouseX: ReturnType<typeof useMotionValue<number>>
  mouseY: ReturnType<typeof useMotionValue<number>>
  setDockTarget: (id: WindowId, rect: { x: number; y: number; width: number; height: number } | null) => void
  onActivate: () => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [hovered, setHovered] = useState(false)
  const distance = useTransform([mouseX, mouseY], ([mx, my]) => {
    if (mx === Infinity || !ref.current) return 1000
    const r = ref.current.getBoundingClientRect()
    const cx = r.left + r.width / 2
    const cy = r.top + r.height / 2
    return Math.hypot((mx as number) - cx, (my as number) - cy)
  })
  const scale = useTransform(distance, [0, 80], [1.55, 1])
  const lift = useTransform(distance, [0, 80], [-16, 0])
  const tilt = useTransform(distance, [0, 80], [-7, 0])
  const scaleSpring = useSpring(scale, { stiffness: 400, damping: 28 })
  const liftSpring = useSpring(lift, { stiffness: 380, damping: 26 })
  const tiltSpring = useSpring(tilt, { stiffness: 380, damping: 26 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const push = () => {
      const r = el.getBoundingClientRect()
      setDockTarget(win.id, { x: r.left, y: r.top, width: r.width, height: r.height })
    }
    const ro = new ResizeObserver(push)
    ro.observe(el)
    push()
    window.addEventListener('resize', push)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', push)
      setDockTarget(win.id, null)
    }
  }, [setDockTarget, win.id])

  const Icon = iconMap[win.icon] ?? Icons.AppWindow
  const open = win.isOpen && !win.isMinimized
  const minimized = win.isMinimized

  return (
    <div className="relative flex flex-col items-center pb-1">
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="pointer-events-none absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/85 px-2.5 py-1 font-inter text-[11px] text-white/90 shadow-lg backdrop-blur-md"
          >
            {win.title}
          </motion.span>
        )}
      </AnimatePresence>
      <motion.button
        ref={ref}
        type="button"
        aria-label={`${win.title}${open ? ', open' : ''}${minimized ? ', minimized' : ''}`}
        data-cursor="hover"
        style={{ scale: scaleSpring, y: liftSpring, rotate: tiltSpring }}
        className="relative flex size-12 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.06] text-white/85 shadow-inner transition-colors hover:bg-white/[0.1]"
        onClick={onActivate}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Icon className="size-6" />
      </motion.button>
      {open && <span className="absolute -bottom-0.5 h-[3px] w-[3px] rounded-full bg-white/60" aria-hidden />}
      {minimized && (
        <span className="absolute -bottom-0.5 h-[3px] w-[3px] animate-pulse rounded-full bg-amber-400/80" aria-hidden />
      )}
    </div>
  )
})
