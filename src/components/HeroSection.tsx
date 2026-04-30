import { useRef } from 'react'
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion'
import { ArrowDown, ArrowRight, FileText, Github, Linkedin, Mail, Sparkles } from 'lucide-react'
import { site } from '@/data/site'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function HeroSection({ onOpenProfile }: { onOpenProfile: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 100, damping: 20 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 100, damping: 20 })

  function onMove(e: React.MouseEvent<HTMLElement>) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  function onLeave() {
    mx.set(0)
    my.set(0)
  }

  return (
    <section
      id="top"
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative min-h-[min(100vh,920px)] overflow-hidden px-4 pb-20 pt-28 md:px-6 md:pb-28 md:pt-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_-20%,_hsl(188_100%_45%_/_0.14),_transparent_50%)] light:bg-[radial-gradient(ellipse_100%_80%_at_50%_-20%,_hsl(35_50%_88%_/_0.5),_transparent_55%)]" />
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex"
          >
            <Badge
              variant="primary"
              className="gap-1.5 border border-cyan-500/30 bg-cyan-500/10 py-1 pl-1 pr-3 text-xs font-medium shadow-lg shadow-cyan-500/5 light:border-cyan-800/20 light:bg-cyan-900/5 light:shadow-cyan-900/5"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-200 light:text-cyan-700" />
              Software · ML · Cloud
            </Badge>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 font-display text-[clamp(2.25rem,5vw,3.75rem)] font-extrabold leading-[1.02] tracking-tight"
          >
            <span className="text-gradient block">{site.tagline}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.55 }}
            className="mt-6 max-w-xl text-base leading-[1.75] text-muted-foreground md:text-lg"
          >
            Hi, I am <span className="font-semibold text-foreground">{site.name}</span>, a software and ML engineer who ships
            production APIs, automation, and analytics around solid models. At Aptos today. EasyInsights before that.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.5 }}
            className="mt-3 flex flex-wrap gap-3"
          >
            {[
              { href: site.github, label: 'GitHub', icon: Github },
              { href: site.linkedin, label: 'LinkedIn', icon: Linkedin },
              { href: `mailto:${site.email}`, label: 'Email', icon: Mail },
            ].map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target={label === 'Email' ? undefined : '_blank'}
                rel={label === 'Email' ? undefined : 'noreferrer'}
                className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/30 px-3 py-1.5 text-sm text-muted-foreground backdrop-blur-sm transition hover:border-cyan-500/40 hover:text-foreground light:border-stone-200/90 light:bg-white/60 light:hover:border-cyan-800/30"
              >
                <Icon className="h-4 w-4 text-cyan-400/80 light:text-cyan-800/90" />
                {label}
              </a>
            ))}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.5 }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg" className="group gap-2 rounded-full shadow-lg shadow-cyan-500/15">
              <a href="#projects">
                See projects
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full border-dashed">
              <a href={site.resume} target="_blank" rel="noreferrer">
                <FileText className="h-4 w-4" />
                Resume PDF
              </a>
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="rounded-full text-muted-foreground"
              onClick={onOpenProfile}
            >
              About me
            </Button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.45 }}
            className="mt-10 flex flex-wrap items-baseline gap-2 text-sm"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-orange-300/90 light:text-orange-700/90">Now</span>
            <span className="text-foreground/95">{site.role}</span>
          </motion.p>
        </div>

        <motion.div className="relative mx-auto w-full max-w-md lg:max-w-none" style={{ perspective: 1100 }}>
          <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: 'preserve-3d' }} className="relative">
            <div className="absolute -inset-12 rounded-[40%] bg-gradient-to-tr from-cyan-500/25 via-fuchsia-500/10 to-orange-500/25 blur-3xl light:from-cyan-600/10 light:via-amber-200/20 light:to-orange-200/20" />
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-zinc-900/95 via-zinc-950 to-black p-[1px] shadow-2xl shadow-black/50 light:border-amber-200/80 light:from-amber-50/90 light:via-stone-50/95 light:to-amber-100/30 light:shadow-amber-900/5">
              <div className="overflow-hidden rounded-[1.4rem] bg-gradient-to-br from-zinc-900/90 to-black light:from-amber-50/95 light:to-stone-100/80">
                <div className="bg-[radial-gradient(ellipse_90%_60%_at_20%_0%,_hsl(188_100%_40%_/_0.2),_transparent_50%),radial-gradient(ellipse_70%_50%_at_90%_100%,_hsl(20_100%_50%_/_0.12),_transparent_45%)] p-6 md:p-8 light:bg-[radial-gradient(ellipse_90%_60%_at_20%_0%,_hsl(186_40%_88%_/_0.5),_transparent_50%),radial-gradient(ellipse_70%_50%_at_90%_100%,_hsl(28_60%_90%_/_0.4),_transparent_45%)]">
                  <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-cyan-200/80 light:text-cyan-900/60">In production</p>
                  <p className="mt-2 font-display text-2xl font-bold leading-tight text-white md:text-3xl light:text-stone-900">Systems you can hand off</p>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400 light:text-stone-600">
                    High traffic retail APIs, cloud cost work, and ML shaped so deploys feel routine. Observability, careful migrations, and
                    guardrails that make teams brave about shipping.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-3.5 light:border-cyan-800/15 light:bg-cyan-900/5">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-cyan-200/60 light:text-cyan-900/50">Volume</p>
                      <p className="mt-1 font-display text-2xl font-bold text-cyan-200 light:text-cyan-900">300K+</p>
                      <p className="text-[11px] text-zinc-500 light:text-stone-500">API requests / month</p>
                    </div>
                    <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-3.5 light:border-orange-300/50 light:bg-orange-50/80">
                      <p className="font-mono text-[10px] uppercase tracking-wider text-orange-200/60 light:text-orange-900/50">Savings</p>
                      <p className="mt-1 font-display text-2xl font-bold text-orange-200 light:text-orange-900">$400</p>
                      <p className="text-[11px] text-zinc-500 light:text-stone-500">AWS / day (peak cut)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
      <motion.a
        href="#experience"
        className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 6, 0] }}
        transition={{ delay: 1, duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        aria-label="Scroll to experience"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest">Scroll</span>
        <span className="flex h-9 w-6 items-start justify-center rounded-full border-2 border-cyan-500/40 pt-1.5">
          <ArrowDown className="h-3.5 w-3.5 text-cyan-400/80" />
        </span>
      </motion.a>
    </section>
  )
}
