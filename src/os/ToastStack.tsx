import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, X } from 'lucide-react'

export type ToastPayload = {
  title: string
  body?: string
  variant?: 'info' | 'success' | 'warn'
}

type Toast = ToastPayload & { id: string }

type Ctx = {
  push: (t: ToastPayload) => void
  dismiss: (id: string) => void
}

const ToastCtx = createContext<Ctx | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [list, setList] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setList((x) => x.filter((t) => t.id !== id))
  }, [])

  const push = useCallback(
    (t: ToastPayload) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
      setList((x) => [...x.slice(-3), { ...t, id }])
      window.setTimeout(() => dismiss(id), 6200)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ push, dismiss }), [push, dismiss])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed right-4 top-10 z-[240] flex max-w-[min(92vw,340px)] flex-col gap-2 sm:right-5 sm:top-11"
        aria-live="polite"
      >
        <AnimatePresence mode="popLayout">
          {list.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.94, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, x: 28, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              className="pointer-events-auto flex gap-3 rounded-2xl border border-white/[0.12] bg-[#121218]/92 px-4 py-3 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.85)] backdrop-blur-xl"
            >
              <span
                className={
                  t.variant === 'success'
                    ? 'text-emerald-400'
                    : t.variant === 'warn'
                      ? 'text-amber-400'
                      : 'text-indigo-400'
                }
              >
                <Bell className="size-5 shrink-0" aria-hidden />
              </span>
              <div className="min-w-0 flex-1 font-inter text-[13px] leading-snug">
                <p className="font-medium text-white/95">{t.title}</p>
                {t.body && <p className="mt-0.5 text-white/55">{t.body}</p>}
              </div>
              <button
                type="button"
                data-cursor="hover"
                className="shrink-0 rounded-lg p-1 text-white/45 hover:bg-white/[0.08] hover:text-white/80"
                aria-label="Dismiss"
                onClick={() => dismiss(t.id)}
              >
                <X className="size-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const v = useContext(ToastCtx)
  if (!v) throw new Error('useToast outside ToastProvider')
  return v
}
