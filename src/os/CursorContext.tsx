import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export type CursorMode = 'default' | 'hover' | 'text' | 'drag'

type Ctx = {
  mode: CursorMode
  setMode: (m: CursorMode) => void
}

const CursorCtx = createContext<Ctx | null>(null)

export function CursorProvider({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const [mode, setMode] = useState<CursorMode>('default')

  useEffect(() => {
    if (!enabled) return
    document.documentElement.classList.add('ak-cursor-none')
    return () => document.documentElement.classList.remove('ak-cursor-none')
  }, [enabled])

  const value = useMemo(() => ({ mode, setMode }), [mode])

  return <CursorCtx.Provider value={value}>{children}</CursorCtx.Provider>
}

export function useCursor() {
  const v = useContext(CursorCtx)
  if (!v) throw new Error('useCursor outside provider')
  return v
}

function resolveMode(target: Element | null): CursorMode {
  let cur: Element | null = target
  while (cur && cur !== document.documentElement) {
    const dc = cur.getAttribute('data-cursor')
    if (dc === 'hover' || dc === 'text' || dc === 'drag') return dc
    if (cur.hasAttribute('data-cursor-hover')) return 'hover'
    if (cur instanceof HTMLInputElement || cur instanceof HTMLTextAreaElement) return 'text'
    cur = cur.parentElement
  }
  return 'default'
}

export function CustomCursor({ enabled }: { enabled: boolean }) {
  const { mode, setMode } = useCursor()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 150, damping: 20 })
  const sy = useSpring(my, { stiffness: 150, damping: 20 })

  useEffect(() => {
    if (!enabled) return
    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX)
      my.set(e.clientY)
      setMode(resolveMode(e.target as Element))
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [enabled, mx, my, setMode])

  if (!enabled) return null

  const ringSize = mode === 'hover' ? 48 : mode === 'drag' ? 56 : 36
  const lineLike = mode === 'text'

  const glowScale = mode === 'hover' ? 2.4 : mode === 'drag' ? 2.8 : 1.9

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9997]"
        style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="rounded-full bg-[radial-gradient(circle,hsl(212_90%_62%/0.35)_0%,transparent_72%)] blur-md"
          animate={{ scale: glowScale, opacity: mode === 'default' ? 0.35 : 0.55 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
          style={{ width: ringSize + 28, height: ringSize + 28, marginLeft: -(ringSize + 28) / 2, marginTop: -(ringSize + 28) / 2 }}
        />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference"
        style={{ x: mx, y: my, translateX: '-50%', translateY: '-50%' }}
      >
        <div className="size-1.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.65)]" />
      </motion.div>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-white/50"
        style={{
          x: sx,
          y: sy,
          translateX: '-50%',
          translateY: '-50%',
          width: ringSize,
          height: lineLike ? 2 : ringSize,
          borderRadius: lineLike ? 1 : 9999,
          scaleX: lineLike ? 2.2 : 1,
          borderStyle: mode === 'drag' ? 'dashed' : 'solid',
          backgroundColor: mode === 'hover' ? 'rgba(255,255,255,0.07)' : 'transparent',
          borderColor:
            mode === 'drag' ? 'rgba(255,255,255,0.55)' : mode === 'hover' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.5)',
          boxShadow:
            mode === 'hover'
              ? '0 0 22px rgba(255,255,255,0.12)'
              : mode === 'drag'
                ? '0 0 18px rgba(255,255,255,0.15)'
                : '0 0 14px rgba(255,255,255,0.06)',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
      />
    </>
  )
}
