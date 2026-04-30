import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const SELECTOR =
  'a[href], button, [data-cursor-hover], input, textarea, select, [role="button"], label[for]'

/** Pointer-shaped SVG cursor (hotspot at tip). */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const el = ref.current
    if (!el) return

    document.documentElement.classList.add('custom-cursor-on')

    const tipX = 3
    const tipY = 3

    const xTo = gsap.quickTo(el, 'x', { duration: 0.18, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.18, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX - tipX)
      yTo(e.clientY - tipY)
      const under = document.elementFromPoint(e.clientX, e.clientY)
      const over = !!(under && under.closest(SELECTOR))
      el.classList.toggle('cursor-pointer-svg--over', over)
    }

    const onDown = () => el.classList.add('cursor-pointer-svg--press')
    const onUp = () => el.classList.remove('cursor-pointer-svg--press')

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)

    return () => {
      document.documentElement.classList.remove('custom-cursor-on')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      gsap.set(el, { clearProps: 'transform' })
    }
  }, [])

  return (
    <div ref={ref} className="cursor-pointer-svg" aria-hidden>
      <svg
        className="cursor-pointer-svg__icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 3 L3 21 L9.5 13 L14.5 22.5 L18 20.5 L12.5 12.5 L21 10 L3 3Z"
          className="fill-foreground stroke-background"
          strokeWidth="1.15"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
