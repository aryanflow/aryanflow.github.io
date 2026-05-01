/** Nano UI chirps via Web Audio — no asset files. Respects mute + reduced motion. */

const KEY = 'ak-ui-sound'

export function isSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false
  try {
    if (localStorage.getItem(KEY) === '0') return false
  } catch {
    /* ignore */
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  return true
}

export function setSoundEnabled(on: boolean) {
  try {
    localStorage.setItem(KEY, on ? '1' : '0')
  } catch {
    /* ignore */
  }
}

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!isSoundEnabled()) return null
  if (!ctx || ctx.state === 'closed') {
    ctx = new AudioContext()
  }
  if (ctx.state === 'suspended') {
    void ctx.resume()
  }
  return ctx
}

function beep(freq: number, dur: number, vol = 0.04, type: OscillatorType = 'sine') {
  const c = getCtx()
  if (!c) return
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = type
  o.frequency.value = freq
  g.gain.value = vol
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + dur)
  o.connect(g)
  g.connect(c.destination)
  o.start()
  o.stop(c.currentTime + dur)
}

export function playTap() {
  beep(880, 0.05, 0.035)
}

export function playDockPop() {
  beep(523, 0.06, 0.045)
  window.setTimeout(() => beep(784, 0.07, 0.03), 45)
}

export function playWindowOpen() {
  beep(440, 0.08, 0.04)
  window.setTimeout(() => beep(660, 0.1, 0.035), 60)
}

export function playWindowClose() {
  beep(660, 0.06, 0.03)
  window.setTimeout(() => beep(330, 0.12, 0.025), 50)
}

export function playWhoosh() {
  const c = getCtx()
  if (!c) return
  const o = c.createOscillator()
  const g = c.createGain()
  o.type = 'triangle'
  o.frequency.setValueAtTime(320, c.currentTime)
  o.frequency.exponentialRampToValueAtTime(120, c.currentTime + 0.18)
  g.gain.value = 0.02
  g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.2)
  o.connect(g)
  g.connect(c.destination)
  o.start()
  o.stop(c.currentTime + 0.22)
}
