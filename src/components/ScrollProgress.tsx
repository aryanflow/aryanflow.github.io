import { useEffect, useState } from 'react'
import { useLenis } from '@/providers/SmoothScrollProvider'

export function ScrollProgress() {
  const { scrollProgress } = useLenis()
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
    const fn = () => setReduce(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  if (reduce) return null

  return (
    <div
      className="scroll-progress"
      style={{ transform: `scaleX(${scrollProgress})` }}
      aria-hidden
    />
  )
}
