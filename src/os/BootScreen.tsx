import { motion } from 'framer-motion'
import { BrandLogo } from '@/components/BrandLogo'
import { SPRING_SNAPPY } from '@/os/springs'

type Props = { reducedMotion: boolean }

export function BootScreen({ reducedMotion }: Props) {
  if (reducedMotion) {
    return (
      <div className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-[#09090b] font-inter text-white">
        <BrandLogo bare imgClassName="h-10 w-10" className="opacity-95" />
        <p className="mt-4 font-mono text-[11px] text-white/40">aryan-os v2026.1</p>
      </div>
    )
  }

  return (
    <motion.div
      className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-[#09090b] font-inter text-white"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.35 } }}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={SPRING_SNAPPY}
        className="relative"
      >
        <div
          className="pointer-events-none absolute inset-[-28px] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.22),transparent_70%)]"
          aria-hidden
        />
        <BrandLogo
          bare
          imgClassName="h-11 w-11"
          className="relative drop-shadow-[0_0_36px_rgba(99,102,241,0.4)]"
        />
      </motion.div>
      <motion.div
        className="mt-8 h-0.5 w-[200px] overflow-hidden rounded-full bg-white/[0.08]"
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-300"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
      </motion.div>
      <motion.p
        className="mt-4 font-mono text-[11px] text-white/35"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        aryan-os v2026.1
      </motion.p>
    </motion.div>
  )
}
