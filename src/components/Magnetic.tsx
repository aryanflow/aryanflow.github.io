import { useRef } from 'react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'

type MagneticProps = {
  children: React.ReactNode
  className?: string
  strength?: number
}

export function Magnetic({ children, className, strength = 0.32 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  function move(e: React.MouseEvent) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - (r.left + r.width / 2)
    const y = e.clientY - (r.top + r.height / 2)
    gsap.to(el, {
      x: x * strength,
      y: y * strength,
      duration: 0.35,
      ease: 'power2.out',
    })
  }

  function leave() {
    const el = ref.current
    if (!el) return
    gsap.to(el, { x: 0, y: 0, duration: 0.65, ease: 'elastic.out(1, 0.45)' })
  }

  return (
    <div
      ref={ref}
      className={cn('will-change-transform', className)}
      onMouseMove={move}
      onMouseLeave={leave}
      data-cursor-hover
    >
      {children}
    </div>
  )
}
