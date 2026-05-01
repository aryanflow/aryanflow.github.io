import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BootScreen } from '@/os/BootScreen'
import { LoginScreen } from '@/os/LoginScreen'
import { Desktop } from '@/os/Desktop'
import { MobileView } from '@/os/MobileView'
import { WindowManagerProvider } from '@/os/WindowManager'
import { ToastProvider } from '@/os/ToastStack'
import { CursorProvider, CustomCursor } from '@/os/CursorContext'
import { SPRING_SNAPPY } from '@/os/springs'

type Phase = 'booting' | 'login' | 'desktop'

function useViewportMobile() {
  const [m, setM] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const fn = () => setM(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return m
}

function useReducedMotion() {
  const [r, setR] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const fn = () => setR(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])
  return r
}

function initialPhase(): Phase {
  if (typeof window === 'undefined') return 'booting'
  if (window.matchMedia('(max-width: 767px)').matches) return 'desktop'
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'login'
  return 'booting'
}

export default function App() {
  const mobile = useViewportMobile()
  const reducedMotion = useReducedMotion()
  const [phase, setPhase] = useState<Phase>(initialPhase)

  useEffect(() => {
    if (mobile || reducedMotion) return
    const t = window.setTimeout(() => setPhase('login'), 1500)
    return () => clearTimeout(t)
  }, [mobile, reducedMotion])

  const cursorOn = !mobile && !reducedMotion

  if (mobile) {
    return <MobileView />
  }

  return (
    <WindowManagerProvider>
      <ToastProvider>
        <CursorProvider enabled={cursorOn}>
          <CustomCursor enabled={cursorOn} />
          <AnimatePresence mode="wait">
            {phase === 'booting' && <BootScreen key="boot" reducedMotion={reducedMotion} />}
          </AnimatePresence>

          {phase !== 'booting' && (
            <>
              <LoginScreen
                visible={phase === 'login'}
                reducedMotion={reducedMotion}
                onEnter={() => setPhase('desktop')}
              />
              {phase === 'desktop' && (
                <motion.div
                  key="desktop"
                  className="min-h-[100svh]"
                  initial={reducedMotion ? false : { opacity: 0 }}
                  animate={reducedMotion ? {} : { opacity: 1 }}
                  transition={SPRING_SNAPPY}
                >
                  <Desktop reducedMotion={reducedMotion} />
                </motion.div>
              )}
            </>
          )}
        </CursorProvider>
      </ToastProvider>
    </WindowManagerProvider>
  )
}
