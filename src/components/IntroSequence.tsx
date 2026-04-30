import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export const INTRO_COMPLETE_EVENT = 'ak-intro-complete'

/** Intro runs as a dark-first beat even in light theme - intentional cinema slab. */
const INTRO_BG = 'hsl(220 14% 5%)'
const MONO_FG = 'hsl(40 12% 96%)'
const ACCENT = 'hsl(212 92% 58%)'

/** Wireframe AK paths (not stroked text), centered for viewBox origin ~top-left (42,22). */
const MONOGRAM_PATHS = [
  /* A left leg */
  'M 56 88 L 69 36',
  /* A right leg */
  'M 69 36 L 82 88',
  /* A crossbar */
  'M 58 62 L 80 62',
  /* K stem */
  'M 113 88 L 113 36',
  /* K upper diagonal */
  'M 113 58 L 143 34',
  /* K lower diagonal */
  'M 113 58 L 143 88',
] as const

export function IntroSequence() {
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const pathsWrap = useRef<SVGGElement>(null)
  const line = useRef<HTMLDivElement>(null)
  const bloom = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const wrap = root.current
    const stageEl = stage.current
    const lettersEl = pathsWrap.current
    const lineEl = line.current
    const bloomEl = bloom.current
    if (!wrap || !stageEl || !lettersEl || !lineEl || !bloomEl) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      wrap.style.display = 'none'
      window.__akIntroComplete = true
      window.dispatchEvent(new CustomEvent(INTRO_COMPLETE_EVENT))
      requestAnimationFrame(() => ScrollTrigger.refresh())
      return
    }

    const paths = [...lettersEl.querySelectorAll<SVGPathElement>('path.intro-letter-stroke')]
    paths.forEach((p) => {
      const len = p.getTotalLength()
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
    })

    gsap.set(stageEl, { opacity: 0, y: 18, scale: 0.94 })
    gsap.set(lineEl, {
      scaleX: 0,
      scaleY: 1,
      transformOrigin: '50% 50%',
      filter: 'blur(14px)',
      opacity: 0,
    })
    gsap.set(bloomEl, { opacity: 0, scale: 0.92 })

    const finishIntro = () => {
      wrap.style.pointerEvents = 'none'
      wrap.style.display = 'none'
      window.__akIntroComplete = true
      window.dispatchEvent(new CustomEvent(INTRO_COMPLETE_EVENT))
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

    tl.to(bloomEl, { opacity: 0.55, scale: 1, duration: 1.05, ease: 'power3.out' }, 0)
      .to(stageEl, { opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power3.out' }, 0)
      .to(
        paths,
        {
          strokeDashoffset: 0,
          duration: 1.12,
          stagger: 0.055,
          ease: 'power4.out',
        },
        0.06,
      )
      .to(paths, { stroke: ACCENT, duration: 0.22, ease: 'power2.out' }, 0.92)
      .to(paths, { stroke: MONO_FG, duration: 0.38, ease: 'power2.inOut' }, 1.06)
      .to(paths, { opacity: 0, duration: 0.42, ease: 'power3.in' }, 1.38)
      .to(
        lineEl,
        {
          opacity: 1,
          scaleX: 1,
          filter: 'blur(0px)',
          duration: 0.62,
          ease: 'power3.out',
        },
        1.28,
      )
      .to(
        lineEl,
        { scaleY: 0, transformOrigin: '50% 0%', duration: 0.42, ease: 'power4.in' },
        2.02,
      )
      .to(stageEl, { y: -10, opacity: 0, duration: 0.38, ease: 'power3.in' }, 2.05)
      .to(wrap, { opacity: 0, duration: 0.5, ease: 'power2.inOut', onComplete: finishIntro }, 2.18)

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <div
      ref={root}
      className="intro-sequence pointer-events-auto fixed inset-0 z-[200] flex flex-col items-center justify-center"
      style={{ backgroundColor: INTRO_BG }}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_38%,hsl(212_92%_58%_/_0.14)_0%,transparent_58%)] opacity-90"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_90%_at_50%_50%,transparent_42%,hsl(220_20%_2%_/_0.92)_100%)]"
        aria-hidden
      />
      <div
        ref={bloom}
        className="pointer-events-none absolute left-1/2 top-[42%] h-[min(52vw,380px)] w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(212_85%_55%_/_0.22)_0%,transparent_68%)] blur-3xl"
        aria-hidden
      />

      <div ref={stage} className="intro-monogram-stage relative z-[1] flex flex-col items-center overflow-visible">
        <div className="intro-monogram-svg-wrap mb-3 overflow-visible px-2 pb-2 pt-3 drop-shadow-[0_0_28px_hsl(212_90%_55%_/_0.12)]">
          <svg
            className="intro-monogram-svg block h-auto w-[clamp(168px,46vw,236px)] max-w-none overflow-visible"
            viewBox="38 18 126 82"
            overflow="visible"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <g
              ref={pathsWrap}
              fill="none"
              stroke={MONO_FG}
              strokeWidth={1.65}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {MONOGRAM_PATHS.map((d, i) => (
                <path key={i} className="intro-letter-stroke" d={d} />
              ))}
            </g>
          </svg>
        </div>

        <div
          ref={line}
          className="intro-sweep-line pointer-events-none relative h-[2px] w-[min(94vw,640px)] shrink-0 rounded-full bg-gradient-to-r from-transparent via-[hsl(var(--primary))] to-transparent opacity-0 shadow-[0_0_28px_hsl(var(--primary)_/_0.42),0_0_72px_hsl(var(--hero-glow)_/_0.22)]"
        />
      </div>
    </div>
  )
}
