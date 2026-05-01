import { useEffect, useState } from 'react'

const fmt = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
})

/** e.g. "Fri, May 1, 14:32:05" — spec asked Fri May 1  14:32:05; we strip commas for closer match */
export function useClock(tickMs = 1000): string {
  const [s, setS] = useState(() => formatClock())
  useEffect(() => {
    const id = window.setInterval(() => setS(formatClock()), tickMs)
    return () => window.clearInterval(id)
  }, [tickMs])
  return s
}

function formatClock(): string {
  const d = new Date()
  const parts = fmt.formatToParts(d)
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)?.value ?? ''
  const weekday = get('weekday')
  const month = get('month')
  const day = get('day')
  const hour = get('hour')
  const minute = get('minute')
  const second = get('second')
  return `${weekday} ${month} ${day}  ${hour}:${minute}:${second}`
}
