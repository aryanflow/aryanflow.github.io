import { Component, type ErrorInfo, type ReactNode, useEffect, useState } from 'react'
import ReactFluidAnimation from '@usertive/react-fluid-animation'

/** Restrained indigo fluid - high dissipation, low curl */
const calmFluidConfig = {
  textureDownsample: 1,
  densityDissipation: 0.992,
  velocityDissipation: 0.994,
  pressureDissipation: 0.88,
  pressureIterations: 14,
  curl: 12,
  splatRadius: 0.0028,
  colorsPool: ['#312e81', '#4338ca', '#6366f1'],
}

type FluidApi = { addRandomSplats: (count: number) => void }

/** Visual fallback if WebGL fails or is unavailable (same mood, zero GPU). */
export function StaticAtmosphere() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ width: '100vw', height: '100vh', minHeight: '100dvh' }}
      aria-hidden
    >
      <div className="absolute inset-0 bg-[#06060a]" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_110%_90%_at_50%_45%,rgba(67,56,202,0.14),transparent_55%),radial-gradient(ellipse_70%_55%_at_12%_88%,rgba(99,102,241,0.1),transparent_52%),radial-gradient(ellipse_70%_55%_at_88%_88%,rgba(79,70,229,0.11),transparent_52%),radial-gradient(ellipse_90%_50%_at_50%_8%,rgba(99,102,241,0.08),transparent_50%)]"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_70%_at_50%_100%,rgba(6,6,10,0.5),transparent_58%)]" />
    </div>
  )
}

class FluidErrorBoundary extends Component<{ children: ReactNode }, { err: boolean }> {
  state = { err: false }

  static getDerivedStateFromError() {
    return { err: true }
  }

  componentDidCatch(e: Error, info: ErrorInfo) {
    console.warn('[FluidBackdrop] Falling back to static atmosphere:', e.message, info.componentStack)
  }

  render() {
    if (this.state.err) return <StaticAtmosphere />
    return this.props.children
  }
}

function hasWebGL(): boolean {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/**
 * Full-viewport WebGL fluid (pointer-events none).
 * Defers mount until after layout + resize so canvas is never 0×0.
 */
export function FluidBackdrop() {
  const [api, setApi] = useState<FluidApi | null>(null)
  const [layoutReady, setLayoutReady] = useState(false)

  useEffect(() => {
    const id = requestAnimationFrame(() => setLayoutReady(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    if (!layoutReady || !api) return
    let iv: ReturnType<typeof setInterval> | undefined
    const tick = () => {
      try {
        api.addRandomSplats(1)
      } catch {
        /* ignore */
      }
    }
    const arm = () => {
      if (iv != null) return
      iv = window.setInterval(tick, 16000)
    }
    const disarm = () => {
      if (iv != null) {
        clearInterval(iv)
        iv = undefined
      }
    }
    const onVis = () => {
      if (document.visibilityState === 'hidden') disarm()
      else arm()
    }
    arm()
    document.addEventListener('visibilitychange', onVis)
    return () => {
      disarm()
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [layoutReady, api])

  /** react-sizeme + first paint: force a resize so canvas picks up non-zero dimensions */
  useEffect(() => {
    if (!layoutReady) return
    const fire = () => window.dispatchEvent(new Event('resize'))
    const t0 = window.setTimeout(fire, 0)
    const t1 = window.setTimeout(fire, 120)
    const t2 = window.setTimeout(fire, 400)
    return () => {
      clearTimeout(t0)
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [layoutReady])

  if (!hasWebGL()) {
    return <StaticAtmosphere />
  }

  if (!layoutReady) {
    return <StaticAtmosphere />
  }

  return (
    <FluidErrorBoundary>
      <div
        className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
        style={{ width: '100vw', height: '100vh', minHeight: '100dvh' }}
        aria-hidden
      >
        {/* Explicit box so react-sizeme / clientWidth are never 0 */}
        <div className="h-full min-h-[100dvh] w-full">
          <ReactFluidAnimation
            style={{
              width: '100%',
              height: '100%',
              minHeight: '100%',
              opacity: 0.38,
            }}
            config={calmFluidConfig}
            animationRef={(a: FluidApi) => {
              setApi(a)
            }}
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_110%_75%_at_50%_95%,rgba(6,6,10,0.48),transparent_60%),radial-gradient(ellipse_80%_45%_at_30%_20%,rgba(99,102,241,0.06),transparent_55%)]" />
      </div>
    </FluidErrorBoundary>
  )
}
