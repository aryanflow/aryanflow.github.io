import type { Transition } from 'framer-motion'

export const SPRING_SNAPPY = { type: 'spring', stiffness: 400, damping: 30, mass: 0.8 } as const
export const SPRING_BOUNCY = { type: 'spring', stiffness: 300, damping: 20, mass: 1.0 } as const
export const SPRING_SLOW = { type: 'spring', stiffness: 100, damping: 20, mass: 1.2 } as const
export const SPRING_DOCK = { type: 'spring', stiffness: 400, damping: 28 } as const

/** Window drag release snap */
export const SPRING_DRAG_END = { type: 'spring', stiffness: 300, damping: 30, mass: 0.8 } as const

/** Window open/close presence (AnimatePresence default) */
export const SPRING_WINDOW_PRESENCE: Transition = {
  type: 'spring',
  stiffness: 380,
  damping: 28,
  mass: 0.85,
}

/** Window open: lively overshoot */
export const SPRING_WINDOW_ENTRANCE: Transition = {
  type: 'spring',
  stiffness: 520,
  damping: 18,
  mass: 0.62,
}

/** Genie-style minimize timing */
export const GENIE_MINIMIZE = { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }
