import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Bomb, Play, RotateCcw, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type Aster = { x: number; y: number; vx: number; vy: number; r: number; rot: number; vr: number }
type Pickup = { x: number; y: number; kind: 'bomb' | 'speed'; r: number; ph: number }

const LS_KEY = 'ak-arcade-best-v1'
const BASE_ACC = 175
const BASE_FRIC = 0.94
const BASE_MAX_SP = 118
const MOVE_MUL = 0.19
const SPEED_FRAMES = 420
const PICKUP_SPAWN = 130
const MAX_PICKUPS = 2

function readBest(): number {
  try {
    return Number(localStorage.getItem(LS_KEY) || 0)
  } catch {
    return 0
  }
}

function writeBest(n: number) {
  try {
    localStorage.setItem(LS_KEY, String(n))
  } catch {
    /* ignore */
  }
}

export function AsteroidArcade() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [uiScore, setUiScore] = useState(0)
  const [best, setBest] = useState(readBest)
  const [running, setRunning] = useState(false)
  const [over, setOver] = useState(false)
  const runningRef = useRef(false)
  const capsLockRef = useRef(false)
  const [hud, setHud] = useState({ bombs: 0, speedSec: 0, hack: false })

  useEffect(() => {
    runningRef.current = running
  }, [running])

  const gref = useRef({
    w: 300,
    h: 300,
    px: 150,
    py: 150,
    pvx: 0,
    pvy: 0,
    keys: new Set<string>(),
    asters: [] as Aster[],
    pickups: [] as Pickup[],
    tick: 0,
    score: 0,
    raf: 0,
    bombCharges: 0,
    speedFrames: 0,
    bombFlash: 0,
    bombRequest: false,
    nextPickup: 80,
  })

  const reset = useCallback(() => {
    const s = gref.current
    s.px = s.w / 2
    s.py = s.h / 2
    s.pvx = 0
    s.pvy = 0
    s.keys.clear()
    s.asters = []
    s.pickups = []
    s.tick = 0
    s.score = 0
    s.bombCharges = 0
    s.speedFrames = 0
    s.bombFlash = 0
    s.bombRequest = false
    s.nextPickup = 90
    setUiScore(0)
    setOver(false)
    setHud({ bombs: 0, speedSec: 0, hack: capsLockRef.current })
  }, [])

  const tryBomb = useCallback(() => {
    const s = gref.current
    const hack = capsLockRef.current
    if (hack) {
      s.asters = []
      s.bombFlash = 14
      return true
    }
    if (s.bombCharges > 0) {
      s.bombCharges -= 1
      s.asters = []
      s.bombFlash = 14
      setHud((h) => ({ ...h, bombs: s.bombCharges }))
      return true
    }
    return false
  }, [])

  const stopLoop = () => {
    cancelAnimationFrame(gref.current.raf)
    gref.current.raf = 0
  }

  const tickFrame = useCallback(() => {
    const c = canvasRef.current
    const s = gref.current
    if (!c) return
    const ctx = c.getContext('2d')
    if (!ctx) return

    const hack = capsLockRef.current
    const speedOn = s.speedFrames > 0
    if (speedOn) s.speedFrames -= 1
    const spdMul = speedOn ? 1.5 : 1
    const acc = BASE_ACC * spdMul * (hack ? 1.08 : 1)
    const fric = BASE_FRIC
    const maxSp = BASE_MAX_SP * spdMul * (hack ? 1.12 : 1)

    if (s.keys.has('ArrowUp') || s.keys.has('w') || s.keys.has('W')) s.pvy -= acc * 0.016
    if (s.keys.has('ArrowDown') || s.keys.has('s') || s.keys.has('S')) s.pvy += acc * 0.016
    if (s.keys.has('ArrowLeft') || s.keys.has('a') || s.keys.has('A')) s.pvx -= acc * 0.016
    if (s.keys.has('ArrowRight') || s.keys.has('d') || s.keys.has('D')) s.pvx += acc * 0.016
    s.pvx *= fric
    s.pvy *= fric
    const sp = Math.hypot(s.pvx, s.pvy)
    if (sp > maxSp) {
      s.pvx = (s.pvx / sp) * maxSp
      s.pvy = (s.pvy / sp) * maxSp
    }
    s.px += s.pvx * MOVE_MUL
    s.py += s.pvy * MOVE_MUL
    s.px = Math.max(10, Math.min(s.w - 10, s.px))
    s.py = Math.max(10, Math.min(s.h - 10, s.py))

    s.tick += 1

    if (s.bombRequest) {
      s.bombRequest = false
      tryBomb()
    }

    const spawnMod = hack ? 58 : 36
    if (s.tick % spawnMod === 0) {
      const side = (Math.random() * 4) | 0
      let x = 0
      let y = 0
      let vx = 0
      let vy = 0
      const r = 10 + Math.random() * 16
      const base = (hack ? 58 : 70) + s.score * 0.018
      if (side === 0) {
        x = Math.random() * s.w
        y = -r
        vy = base * (0.45 + Math.random() * 0.35)
        vx = (Math.random() - 0.5) * 72
      } else if (side === 1) {
        x = s.w + r
        y = Math.random() * s.h
        vx = -base * (0.45 + Math.random() * 0.35)
        vy = (Math.random() - 0.5) * 72
      } else if (side === 2) {
        x = Math.random() * s.w
        y = s.h + r
        vy = -base * (0.45 + Math.random() * 0.35)
        vx = (Math.random() - 0.5) * 72
      } else {
        x = -r
        y = Math.random() * s.h
        vx = base * (0.45 + Math.random() * 0.35)
        vy = (Math.random() - 0.5) * 72
      }
      s.asters.push({ x, y, vx, vy, r, rot: 0, vr: (Math.random() - 0.5) * 2.2 })
    }

    s.nextPickup -= 1
    if (s.nextPickup <= 0 && s.pickups.length < MAX_PICKUPS) {
      s.nextPickup = PICKUP_SPAWN + Math.floor(Math.random() * 70)
      const kind: Pickup['kind'] = Math.random() < 0.42 ? 'bomb' : 'speed'
      let px = 40 + Math.random() * (s.w - 80)
      let py = 40 + Math.random() * (s.h - 80)
      if (Math.hypot(px - s.px, py - s.py) < 72) {
        px = s.w - px
        py = s.h - py
      }
      s.pickups.push({ x: px, y: py, kind, r: 11, ph: Math.random() * Math.PI * 2 })
    }

    for (const p of s.pickups) p.ph += 0.07

    for (let i = s.pickups.length - 1; i >= 0; i--) {
      const p = s.pickups[i]
      if (Math.hypot(p.x - s.px, p.y - s.py) < p.r + 14) {
        if (p.kind === 'bomb') {
          s.bombCharges = Math.min(3, s.bombCharges + 1)
        } else {
          s.speedFrames = Math.max(s.speedFrames, SPEED_FRAMES)
        }
        s.pickups.splice(i, 1)
        setHud({ bombs: s.bombCharges, speedSec: Math.ceil(s.speedFrames / 60), hack: capsLockRef.current })
      }
    }

    for (const a of s.asters) {
      a.x += a.vx * 0.016
      a.y += a.vy * 0.016
      a.rot += a.vr * 0.016
    }
    s.asters = s.asters.filter((a) => a.x > -60 && a.x < s.w + 60 && a.y > -60 && a.y < s.h + 60)

    if (!hack) {
      for (const a of s.asters) {
        if (Math.hypot(a.x - s.px, a.y - s.py) < a.r * 0.75 + 8) {
          const finalScore = Math.floor(s.score)
          setUiScore(finalScore)
          setRunning(false)
          setOver(true)
          setBest((b) => {
            const n = Math.max(b, finalScore)
            writeBest(n)
            return n
          })
          return
        }
      }
    }

    s.score += hack ? 0.72 : 0.52
    if (s.tick % 14 === 0) setUiScore(Math.floor(s.score))
    if (s.tick % 18 === 0) {
      setHud({
        bombs: s.bombCharges,
        speedSec: Math.ceil(s.speedFrames / 60),
        hack: capsLockRef.current,
      })
    }

    const g = ctx.createLinearGradient(0, 0, 0, s.h)
    g.addColorStop(0, 'hsl(220 30% 8%)')
    g.addColorStop(1, 'hsl(220 30% 4%)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, s.w, s.h)

    if (hack) {
      ctx.fillStyle = 'rgba(0, 220, 120, 0.055)'
      ctx.fillRect(0, 0, s.w, s.h)
    }

    for (let i = 0; i < 50; i++) {
      ctx.fillStyle = `rgba(255,255,255,${0.05 + (i % 6) * 0.02})`
      ctx.fillRect((i * 83) % s.w, (i * 47 + s.tick) % s.h, 1, 1)
    }

    for (const p of s.pickups) {
      ctx.save()
      ctx.translate(p.x, p.y)
      const pulse = 1 + Math.sin(p.ph) * 0.12
      ctx.scale(pulse, pulse)
      if (p.kind === 'bomb') {
        ctx.fillStyle = 'hsl(16 90% 52%)'
        ctx.beginPath()
        ctx.arc(0, 0, p.r * 0.55, 0, Math.PI * 2)
        ctx.fill()
        ctx.strokeStyle = 'hsl(40 100% 70%)'
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.strokeStyle = 'rgba(255,255,255,0.85)'
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(-4, -4)
        ctx.lineTo(4, 4)
        ctx.moveTo(4, -4)
        ctx.lineTo(-4, 4)
        ctx.stroke()
      } else {
        ctx.rotate(Math.PI / 4)
        ctx.fillStyle = 'hsl(48 100% 55%)'
        ctx.fillRect(-p.r * 0.45, -p.r * 0.45, p.r * 0.9, p.r * 0.9)
        ctx.strokeStyle = 'hsl(187 80% 45%)'
        ctx.lineWidth = 2
        ctx.strokeRect(-p.r * 0.45, -p.r * 0.45, p.r * 0.9, p.r * 0.9)
      }
      ctx.restore()
    }

    for (const a of s.asters) {
      ctx.save()
      ctx.translate(a.x, a.y)
      ctx.rotate(a.rot)
      ctx.fillStyle = 'hsl(220 10% 32%)'
      ctx.beginPath()
      for (let k = 0; k < 6; k++) {
        const ang = (k / 6) * Math.PI * 2
        const rr = a.r * (0.7 + (k % 2) * 0.1)
        const px = Math.cos(ang) * rr
        const py = Math.sin(ang) * rr
        if (k === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = 'hsl(187 60% 45% / 0.5)'
      ctx.stroke()
      ctx.restore()
    }

    ctx.save()
    ctx.translate(s.px, s.py)
    ctx.rotate(Math.atan2(s.pvy, s.pvx) + Math.PI / 2)
    if (hack) {
      ctx.shadowColor = 'hsl(142 100% 50%)'
      ctx.shadowBlur = 18
    } else if (speedOn) {
      ctx.shadowColor = 'hsl(48 100% 55%)'
      ctx.shadowBlur = 14
    }
    ctx.fillStyle = hack ? 'hsl(142 85% 55%)' : speedOn ? 'hsl(48 95% 58%)' : 'hsl(187 100% 55%)'
    ctx.beginPath()
    ctx.moveTo(0, -10)
    ctx.lineTo(7, 8)
    ctx.lineTo(0, 4)
    ctx.lineTo(-7, 8)
    ctx.closePath()
    ctx.fill()
    ctx.restore()

    if (s.bombFlash > 0) {
      const a = (s.bombFlash / 14) * 0.35
      ctx.fillStyle = `rgba(255, 255, 255, ${a})`
      ctx.fillRect(0, 0, s.w, s.h)
      s.bombFlash -= 1
    }

    s.raf = requestAnimationFrame(tickFrame)
  }, [tryBomb])

  useEffect(() => {
    const navKeys = new Set([
      'ArrowUp',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'w',
      'a',
      's',
      'd',
      'W',
      'A',
      'S',
      'D',
    ])
    const syncCaps = (e: KeyboardEvent) => {
      try {
        if (e.getModifierState) capsLockRef.current = e.getModifierState('CapsLock')
      } catch {
        /* ignore */
      }
    }
    const onKey = (e: KeyboardEvent) => {
      syncCaps(e)
      if ((e.key === 'b' || e.key === 'B') && runningRef.current) {
        e.preventDefault()
        gref.current.bombRequest = true
        return
      }
      if (!navKeys.has(e.key)) return
      if (!runningRef.current) return
      gref.current.keys.add(e.key)
      e.preventDefault()
    }
    const offKey = (e: KeyboardEvent) => {
      syncCaps(e)
      gref.current.keys.delete(e.key)
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', offKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', offKey)
    }
  }, [])

  const resize = useCallback(() => {
    const el = wrapRef.current
    const c = canvasRef.current
    if (!el || !c) return
    const w = el.clientWidth
    const h = Math.min(420, Math.max(260, Math.floor(w * 0.55)))
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    c.width = w * dpr
    c.height = h * dpr
    c.style.width = `${w}px`
    c.style.height = `${h}px`
    const ctx = c.getContext('2d')
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    const s = gref.current
    s.w = w
    s.h = h
    if (!running) {
      s.px = w / 2
      s.py = h / 2
    }
  }, [running])

  useEffect(() => {
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [resize])

  useEffect(() => {
    if (running) {
      stopLoop()
      gref.current.raf = requestAnimationFrame(tickFrame)
    } else {
      stopLoop()
    }
    return () => stopLoop()
  }, [running, tickFrame])

  function start() {
    stopLoop()
    reset()
    setRunning(true)
  }

  const canBomb = hud.hack || hud.bombs > 0

  return (
    <section id="arcade" className="scroll-mt-28 px-4 py-20 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-400/90">Interlude</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">Asteroid drift</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Smoother thrust, drifting rocks, and pickups: orange bomb charges (press B to detonate), yellow speed surge. Turn on Caps Lock before you
              launch for a playful hack mode: ghost ship, slower spawns, infinite clears.
            </p>
            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
              <li>· Move: WASD or arrows (gentler than before)</li>
              <li>· Bomb: grab orange pickups, then B to wipe the field (free while hack mode is on)</li>
              <li>· Speed: yellow diamond gives a timed boost</li>
              <li>· Caps Lock: hack mode (no hull damage, matrix tint, endless bombs)</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button type="button" onClick={start} className="gap-2 rounded-full" disabled={running && !over}>
                <Play className="h-4 w-4" />
                {running && !over ? 'In flight' : 'Launch'}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="gap-2 rounded-full"
                onClick={() => {
                  stopLoop()
                  reset()
                  setRunning(false)
                }}
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
            <p className="mt-4 font-mono text-xs text-muted-foreground">
              Score <span className="text-foreground">{Math.floor(uiScore)}</span> · Best{' '}
              <span className="text-orange-300 light:text-orange-800">{Math.floor(best)}</span>
            </p>
          </div>
          <motion.div ref={wrapRef} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <Card className="relative overflow-hidden border-border/60 p-0">
              {hud.hack && running && !over && (
                <div className="absolute left-2 top-2 z-10 rounded-md border border-emerald-500/50 bg-emerald-950/80 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-emerald-200 backdrop-blur-sm light:border-emerald-700/40 light:bg-emerald-100/90 light:text-emerald-900">
                  Hack mode
                </div>
              )}
              <canvas ref={canvasRef} className="block w-full touch-none" />
              {running && !over && (
                <div className="absolute bottom-2 left-2 right-2 z-10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-2 font-mono text-[10px] text-muted-foreground md:text-[11px]">
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/85 px-2 py-1 backdrop-blur light:border-stone-200/80 light:bg-amber-50/90">
                      <Bomb className="h-3 w-3 text-orange-400" />
                      {hud.bombs} · B
                    </span>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full border px-2 py-1 backdrop-blur',
                        hud.speedSec > 0
                          ? 'border-amber-500/40 bg-amber-950/70 text-amber-100 light:border-amber-600/40 light:bg-amber-100/90 light:text-amber-950'
                          : 'border-border/60 bg-background/85 text-muted-foreground light:border-stone-200/80 light:bg-amber-50/90',
                      )}
                    >
                      <Zap className="h-3 w-3 shrink-0 text-yellow-400" />
                      {hud.speedSec > 0 ? `${hud.speedSec}s boost` : 'Speed'}
                    </span>
                  </div>
                  {canBomb && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      className="h-8 rounded-full px-3 text-xs"
                      onClick={() => {
                        gref.current.bombRequest = true
                      }}
                    >
                      <Bomb className="mr-1 h-3.5 w-3.5" />
                      Bomb
                    </Button>
                  )}
                </div>
              )}
              {over && (
                <div className="border-t border-border bg-background/80 px-4 py-3 text-sm text-muted-foreground backdrop-blur light:border-stone-200/80 light:bg-amber-50/90">
                  Impact. Press Launch for another run.
                </div>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
