import { memo, useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, animate, motion, useDragControls, useMotionValue } from 'framer-motion'
import { Minus, Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ManagedWindow } from '@/os/WindowManager'
import { useWindowManager } from '@/os/WindowManager'
import {
  GENIE_MINIMIZE,
  SPRING_DRAG_END,
  SPRING_WINDOW_ENTRANCE,
  SPRING_WINDOW_PRESENCE,
} from '@/os/springs'
import { playWindowClose, playWindowOpen, playWhoosh } from '@/os/uiSounds'

const MENUBAR = 28
const DOCK_H = 88

type Props = {
  win: ManagedWindow
  constraintsRef: React.RefObject<HTMLElement | null>
  children: ReactNode
}

export const Window = memo(function Window({ win, constraintsRef, children }: Props) {
  const { closeWindow, minimizeWindow, toggleMaximize, focusWindow, updatePosition, updateSize, state } =
    useWindowManager()
  const dragControls = useDragControls()
  const x = useMotionValue(win.position.x)
  const y = useMotionValue(win.position.y)
  const rotate = useMotionValue(0)
  const scaleX = useMotionValue(1)
  const scaleY = useMotionValue(1)
  const skewX = useMotionValue(0)
  const shellRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState(() => ({ width: win.size.width, height: win.size.height }))
  const [isDragging, setIsDragging] = useState(false)
  const sizeRef = useRef(size)
  sizeRef.current = size

  useEffect(() => {
    playWindowOpen()
  }, [])

  useEffect(() => {
    if (win.isMaximized) {
      x.set(0)
      y.set(0)
    } else {
      x.set(win.position.x)
      y.set(win.position.y)
      setSize({ width: win.size.width, height: win.size.height })
    }
    scaleX.set(1)
    scaleY.set(1)
    skewX.set(0)
  }, [win.isMaximized, win.position.x, win.position.y, win.size.width, win.size.height, scaleX, scaleY, skewX, x, y])

  const onFocusShell = useCallback(() => {
    if (!win.isFocused) focusWindow(win.id)
  }, [focusWindow, win.id, win.isFocused])

  const snapEdges = useCallback(() => {
    const vw = window.innerWidth
    const vh = window.innerHeight
    const w = win.isMaximized ? vw : sizeRef.current.width
    const h = win.isMaximized ? vh - MENUBAR - DOCK_H : sizeRef.current.height
    let nx = x.get()
    let ny = y.get()
    const edge = 10
    if (nx < edge) nx = edge
    if (ny < MENUBAR + edge) ny = MENUBAR + edge
    if (nx + w > vw - edge) nx = Math.max(edge, vw - w - edge)
    if (ny + h > vh - DOCK_H - edge) ny = Math.max(MENUBAR + edge, vh - DOCK_H - h - edge)
    animate(x, nx, SPRING_DRAG_END)
    animate(y, ny, SPRING_DRAG_END)
    updatePosition(win.id, { x: nx, y: ny })
  }, [win.id, win.isMaximized, updatePosition, x, y])

  const onDragEnd = useCallback(() => {
    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      animate(rotate, 0, SPRING_DRAG_END)
    } else {
      void animate(rotate, [0, -2.6, 2.6, -1.3, 0], { duration: 0.55, ease: [0.22, 1, 0.36, 1] })
    }
    if (!win.isMaximized) {
      snapEdges()
      updatePosition(win.id, { x: x.get(), y: y.get() })
    }
  }, [rotate, snapEdges, updatePosition, win.id, win.isMaximized, x, y])

  const handleMinimize = useCallback(async () => {
    const prefersReduced =
      typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      minimizeWindow(win.id)
      return
    }
    playWhoosh()
    const dock = state.dockTargets[win.id]
    const el = shellRef.current
    if (!dock || !el) {
      minimizeWindow(win.id)
      return
    }
    const box = el.getBoundingClientRect()
    const curCx = box.left + box.width / 2
    const curCy = box.top + box.height / 2
    const tgtCx = dock.x + dock.width / 2
    const tgtCy = dock.y + dock.height / 2
    const nextX = x.get() + (tgtCx - curCx)
    const nextY = y.get() + (tgtCy - curCy)
    await Promise.all([
      animate(x, nextX, GENIE_MINIMIZE),
      animate(y, nextY, GENIE_MINIMIZE),
      animate(scaleX, [1, 0.58, 0.18, 0.03], {
        duration: GENIE_MINIMIZE.duration,
        times: [0, 0.28, 0.62, 1],
        ease: GENIE_MINIMIZE.ease,
      }),
      animate(scaleY, [1, 1.1, 0.42, 0.07], {
        duration: GENIE_MINIMIZE.duration,
        times: [0, 0.28, 0.62, 1],
        ease: GENIE_MINIMIZE.ease,
      }),
      animate(skewX, [0, 5, -2, 0], {
        duration: GENIE_MINIMIZE.duration,
        times: [0, 0.35, 0.72, 1],
        ease: GENIE_MINIMIZE.ease,
      }),
    ])
    minimizeWindow(win.id)
  }, [minimizeWindow, scaleX, scaleY, skewX, state.dockTargets, win.id, x, y])

  const maxed = win.isMaximized
  const mw = typeof window !== 'undefined' ? window.innerWidth : 1200
  const mh = typeof window !== 'undefined' ? window.innerHeight : 800
  const maxW = mw
  const maxH = mh - MENUBAR - DOCK_H

  if (win.isMinimized) return null

  return (
    <AnimatePresence mode="popLayout">
      {win.isOpen && (
        <motion.div
          ref={shellRef}
          key={win.id}
          data-cursor={isDragging ? 'drag' : undefined}
          className={cn(
            'pointer-events-auto fixed flex flex-col overflow-hidden rounded-xl shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)] will-change-transform backdrop-blur-2xl',
            win.isFocused
              ? 'border border-white/[0.14] ring-1 ring-white/[0.06]'
              : 'border border-white/[0.06] opacity-[0.94] ring-1 ring-black/20',
          )}
          style={{
            width: maxed ? maxW : size.width,
            height: maxed ? maxH : size.height,
            left: maxed ? 0 : undefined,
            top: maxed ? MENUBAR : undefined,
            x,
            y,
            rotateZ: maxed ? 0 : rotate,
            scaleX,
            scaleY,
            skewX,
            transformOrigin: '50% 100%',
            zIndex: win.zIndex,
          }}
          initial={{ opacity: 0, y: 34, filter: 'blur(14px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 16, filter: 'blur(10px)' }}
          transition={{
            opacity: SPRING_WINDOW_ENTRANCE,
            y: SPRING_WINDOW_ENTRANCE,
            filter: SPRING_WINDOW_PRESENCE,
          }}
          onPointerDown={onFocusShell}
          drag={!maxed}
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0.1}
          dragConstraints={constraintsRef}
          onDragStart={() => setIsDragging(true)}
          onDrag={(e, info) => {
            if (maxed) return
            rotate.set(Math.max(-1.5, Math.min(1.5, info.velocity.x * 0.025)))
          }}
          onDragEnd={() => {
            setIsDragging(false)
            onDragEnd()
          }}
        >
          <div
            className="flex h-10 shrink-0 cursor-default items-center border-b border-white/[0.06] bg-white/[0.04] pl-4 pr-3 font-inter select-none"
            aria-label={win.title}
            onPointerDown={(e) => {
              onFocusShell()
              if (!maxed) dragControls.start(e)
            }}
          >
            <div className="flex gap-2">
              <Traffic
                color="bg-[#ff5f57]"
                icon={<X className="size-2 text-black/55 opacity-0 transition-opacity group-hover:opacity-100" />}
                onClick={() => {
                  playWindowClose()
                  closeWindow(win.id)
                }}
                label="Close"
              />
              <Traffic
                color="bg-[#febc2e]"
                icon={
                  <Minus className="size-2 text-black/55 opacity-0 transition-opacity group-hover:opacity-100" />
                }
                onClick={handleMinimize}
                label="Minimize"
              />
              <Traffic
                color="bg-[#28c840]"
                icon={
                  <Plus className="size-2.5 text-black/55 opacity-0 transition-opacity group-hover:opacity-100" />
                }
                onClick={() => toggleMaximize(win.id)}
                label="Zoom"
              />
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-auto bg-[#0c0c0e]/95 light:bg-stone-50/95">{children}</div>
          {!maxed && (
            <button
              type="button"
              aria-label="Resize window"
              className="absolute bottom-0 right-0 z-10 size-3 cursor-se-resize opacity-40 hover:opacity-80"
              data-cursor="drag"
              onPointerDown={(e) => {
                e.stopPropagation()
                const startX = e.clientX
                const startY = e.clientY
                const startW = sizeRef.current.width
                const startH = sizeRef.current.height
                const onMove = (ev: PointerEvent) => {
                  const dw = ev.clientX - startX
                  const dh = ev.clientY - startY
                  const nw = Math.max(win.minSize.width, startW + dw)
                  const nh = Math.max(win.minSize.height, startH + dh)
                  const next = { width: nw, height: nh }
                  sizeRef.current = next
                  setSize(next)
                }
                const onUp = () => {
                  updateSize(win.id, sizeRef.current)
                  window.removeEventListener('pointermove', onMove)
                }
                window.addEventListener('pointermove', onMove)
                window.addEventListener('pointerup', onUp, { once: true })
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
})

function Traffic({
  color,
  icon,
  onClick,
  label,
}: {
  color: string
  icon: ReactNode
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      aria-label={label}
      data-cursor="hover"
      className={cn(
        'group flex size-3 items-center justify-center rounded-full border border-black/10',
        color,
      )}
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
    >
      {icon}
    </button>
  )
}
