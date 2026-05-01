import { useEffect, useState } from 'react'

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`
}

/** Single source of truth for time on desktop — large, editorial, no boxed chrome */
export function DesktopClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const t = window.setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const h = pad(now.getHours())
  const m = pad(now.getMinutes())
  const s = pad(now.getSeconds())
  const dateLine = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div className="pointer-events-none fixed right-6 top-8 z-[35] select-none md:right-10" aria-hidden>
      <div className="text-right">
        <p className="font-jetbrains text-[clamp(2.5rem,6vw,3.75rem)] font-light leading-none tabular-nums tracking-[-0.04em] text-white drop-shadow-[0_2px_28px_rgba(0,0,0,0.45)]">
          <span className="text-white/[0.97]">{h}</span>
          <span className="mx-0.5 text-white/35">:</span>
          <span className="text-white/[0.97]">{m}</span>
          <span className="ml-1 inline-block min-w-[2.5ch] align-baseline font-inter text-[clamp(1rem,2.5vw,1.35rem)] font-medium tabular-nums text-white/40">
            {s}
          </span>
        </p>
        <p className="mt-2 font-inter text-[11px] font-medium uppercase tracking-[0.22em] text-white/38">{dateLine}</p>
      </div>
    </div>
  )
}
