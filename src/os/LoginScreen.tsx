import { AnimatePresence, motion } from 'framer-motion'
import { BrandLogo } from '@/components/BrandLogo'
import { site } from '@/data/site'
import { useClock } from '@/hooks/useClock'
import { SPRING_SNAPPY, SPRING_SLOW } from '@/os/springs'

type Props = {
  visible: boolean
  onEnter: () => void
  reducedMotion: boolean
}

/** Login: still atmosphere, no extra canvas loop - fluid runs on desktop after enter */
export function LoginScreen({ visible, onEnter, reducedMotion }: Props) {
  const clock = useClock(1000)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[400] flex items-center justify-center overflow-hidden bg-[#09090b]"
          initial={{ opacity: 1 }}
          exit={
            reducedMotion
              ? { opacity: 0, transition: { duration: 0.25 } }
              : { opacity: 0, scale: 1.02, transition: { duration: 0.4, ease: [0.32, 0, 0.08, 1] } }
          }
        >
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(99,102,241,0.14),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_80%,rgba(67,56,202,0.06),transparent_60%)]"
            aria-hidden
          />

          <motion.div
            className="relative z-10 mx-4 max-w-[420px] rounded-[24px] border border-white/[0.08] bg-white/[0.04] p-12 font-inter shadow-2xl backdrop-blur-[40px] saturate-150"
            initial={reducedMotion ? false : { opacity: 0, y: 12 }}
            animate={reducedMotion ? {} : { opacity: 1, y: 0 }}
            transition={SPRING_SLOW}
          >
            <div className="flex flex-col items-center text-center">
            <div className="relative flex flex-col items-center">
              <div
                className="pointer-events-none absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.22),transparent_68%)] opacity-90"
                aria-hidden
              />
              <BrandLogo
                bare
                imgClassName="h-[52px] w-[52px]"
                className="relative drop-shadow-[0_4px_32px_rgba(99,102,241,0.28)]"
              />
            </div>
              <h1 className="mt-5 font-playfair text-xl font-medium tracking-tight text-white">{site.name}</h1>
              <p className="mt-2 max-w-xs font-jetbrains text-xs text-white/45">{site.role}</p>
              <p className="mt-6 font-jetbrains text-[32px] leading-none tabular-nums tracking-tight text-white/90">
                {clock}
              </p>

              <motion.button
                type="button"
                className="mt-8 rounded-full border border-white/15 bg-white/[0.08] px-8 py-3 text-sm font-medium text-white/90 transition-colors hover:bg-white/12"
                whileHover={reducedMotion ? {} : { scale: 0.985 }}
                whileTap={reducedMotion ? {} : { scale: 0.97 }}
                transition={SPRING_SNAPPY}
                onClick={onEnter}
              >
                Press to enter →
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
