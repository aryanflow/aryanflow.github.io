import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const SELECTOR =
  'a[href], button, [data-cursor-hover], input, textarea, select, [role="button"], label[for]'

export function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const ring = ringRef.current
    const dot = dotRef.current
    if (!ring || !dot) return

    document.documentElement.classList.add('custom-cursor-on')

    const pos = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }

    gsap.set([ring, dot], { xPercent: -50, yPercent: -50 })

    const ringX = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3.out' })
    const dotX = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX
      target.y = e.clientY
      dotX(e.clientX)
      dotY(e.clientY)
      const under = document.elementFromPoint(e.clientX, e.clientY)
      const over = !!(under && under.closest(SELECTOR))
      ring.classList.toggle('cursor-ring--hover', over)
      dot.classList.toggle('cursor-dot--hover', over)
    }

    let rafId = 0
    const loop = () => {
      pos.x += (target.x - pos.x) * 0.16
      pos.y += (target.y - pos.y) * 0.16
      ringX(pos.x)
      ringY(pos.y)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    const onDown = () => ring.classList.add('cursor-ring--press')
    const onUp = () => ring.classList.remove('cursor-ring--press')
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      cancelAnimationFrame(rafId)
      document.documentElement.classList.remove('custom-cursor-on')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      gsap.set([ring, dot], { clearProps: 'transform' })
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  )
}
