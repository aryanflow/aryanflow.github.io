import { BatteryFull, Wifi } from 'lucide-react'
import { motion } from 'framer-motion'
import { BrandLogo } from '@/components/BrandLogo'
import { site } from '@/data/site'
import { SPRING_SNAPPY } from '@/os/springs'
import { useWindowManager } from '@/os/WindowManager'

export function MenuBar() {
  const { state } = useWindowManager()
  const active = state.activeTitle || 'Desktop'

  return (
    <motion.header
      className="fixed left-0 top-0 z-[200] flex h-7 w-full items-center justify-between border-b border-white/[0.05] bg-[rgba(9,9,11,0.85)] px-3 font-inter text-[12px] text-white/90 backdrop-blur-[20px]"
      initial={false}
      animate={{ y: 0, opacity: 1 }}
      transition={SPRING_SNAPPY}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5 font-medium">
        <BrandLogo bare imgClassName="h-[18px] w-[18px]" className="text-white/95" />
        <span className="truncate text-white/90">{site.name}</span>
        <span className="shrink-0 text-white/25">|</span>
        <span className="truncate text-white/55">{active}</span>
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-end gap-3 text-white/60">
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="hidden sm:inline text-white/55">Available</span>
        </span>
        <Wifi className="size-3.5 opacity-70" aria-hidden />
        <span className="flex items-center gap-1 tabular-nums">
          <BatteryFull className="size-3.5 opacity-70" aria-hidden />
          <span className="hidden sm:inline text-white/45">100%</span>
        </span>
      </div>
    </motion.header>
  )
}
