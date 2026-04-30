import { useCallback, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, Github, Sparkles } from 'lucide-react'
import { useContributionGrid, useGitHubActivity, type ContributionCell } from '@/hooks/useGitHubActivity'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const

const levelClass: Record<number, string> = {
  0: 'bg-[hsl(215_25%_14%)] border-[hsl(215_20%_20%)] light:bg-[hsl(140_12%_92%)] light:border-[hsl(140_10%_82%)]',
  1: 'bg-[hsl(142_45%_28%_/_0.55)] border-[hsl(142_40%_35%_/_0.5)] light:bg-[hsl(142_45%_42%_/_0.45)] light:border-[hsl(142_35%_38%_/_0.55)]',
  2: 'bg-[hsl(142_50%_36%_/_0.75)] border-[hsl(142_45%_42%_/_0.55)] light:bg-[hsl(142_48%_40%_/_0.65)] light:border-[hsl(142_40%_34%_/_0.6)]',
  3: 'bg-[hsl(142_55%_42%)] border-[hsl(142_50%_48%_/_0.65)] light:bg-[hsl(142_52%_36%)] light:border-[hsl(142_45%_30%_/_0.55)]',
  4: 'bg-[hsl(142_58%_48%)] border-[hsl(142_55%_55%)] shadow-[0_0_12px_hsl(142_60%_45%_/_0.35)] light:bg-[hsl(142_55%_32%)] light:border-[hsl(142_45%_26%)] light:shadow-[0_0_8px_hsl(142_40%_30%_/_0.2)]',
}

function Stat({ v }: { v: number | undefined }) {
  if (v === undefined) return <span className="text-muted-foreground">…</span>
  return <span>{v}</span>
}

function intensityLabel(level: number) {
  if (level <= 0) return 'Quiet day'
  if (level === 1) return 'Light rhythm'
  if (level === 2) return 'Steady focus'
  if (level === 3) return 'Heavy push'
  return 'Peak flow'
}

export function GithubSection() {
  const { stats, username } = useGitHubActivity()
  const weeks = useContributionGrid()
  const totals = useMemo(() => {
    let sum = 0
    for (const w of weeks) for (const d of w) sum += d.level
    return sum
  }, [weeks])

  const [hover, setHover] = useState<{ cell: ContributionCell; x: number; y: number } | null>(null)
  const boardRef = useRef<HTMLDivElement>(null)

  const onCellEnter = useCallback((cell: ContributionCell, e: React.MouseEvent<HTMLButtonElement> | React.FocusEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    setHover({
      cell,
      x: r.left + r.width / 2,
      y: r.top,
    })
  }, [])

  const onBoardLeave = useCallback(() => {
    setHover(null)
  }, [])

  return (
    <section id="github" className="scroll-mt-28 px-4 py-16 md:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-cyan-400/90">Public signal</p>
          <h2 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight tracking-tight">GitHub in the open</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Live counts from the API. The heatmap is a generative rhythm inspired by contribution graphs: hover cells for the day, scroll sideways for
            the year.
          </p>
        </div>
        <div className="mt-16 grid gap-6 lg:grid-cols-[minmax(0,300px)_1fr]">
          <motion.a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noreferrer"
            whileHover={{ y: -3 }}
            className="block h-full"
          >
            <Card className="h-full overflow-hidden border-border/50 bg-gradient-to-b from-zinc-900/95 to-zinc-950/95 p-0 shadow-xl light:from-amber-50/95 light:to-stone-100/80 light:shadow-stone-300/30">
              <div className="relative p-6">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/8 via-transparent to-orange-500/8 light:from-cyan-600/5 light:to-amber-200/20" />
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative">
                    <img
                      src={`https://github.com/${username}.png`}
                      alt={username}
                      className="h-28 w-28 rounded-2xl border-2 border-cyan-500/40 shadow-xl shadow-cyan-500/15 light:border-cyan-700/30 light:shadow-stone-400/20"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-zinc-900 bg-emerald-500 light:border-white" />
                  </div>
                  <p className="mt-4 font-display text-lg font-bold text-foreground">Aryan Kashyap</p>
                  <p className="text-sm text-cyan-300/90 light:text-cyan-800">@{username}</p>
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200 light:border-emerald-200/50 light:bg-emerald-100/50 light:text-emerald-900">
                    <Activity className="h-3.5 w-3.5" />
                    Up for the right problem
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-5 text-center text-sm light:border-stone-200/80">
                  <div>
                    <p className="font-display text-lg font-bold text-foreground">
                      <Stat v={stats?.repos} />
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 light:text-stone-500">Repos</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-foreground">
                      <Stat v={stats?.followers} />
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 light:text-stone-500">Followers</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold text-foreground">
                      <Stat v={stats?.stars} />
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 light:text-stone-500">Stars</p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.a>
          <Card
            ref={boardRef}
            className="relative border-border/50 p-4 shadow-xl md:p-6"
            onMouseLeave={onBoardLeave}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 font-display text-sm font-semibold md:text-base">
                  <Github className="h-4 w-4 shrink-0 text-cyan-400 light:text-cyan-800" />
                  Activity heatmap
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-orange-400/80" />
                  Hover a square · illustrative index · sum <span className="font-mono text-foreground/90">{totals}</span>
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span>Less</span>
                {[0, 1, 2, 3, 4].map((i) => (
                  <span key={i} className={cn('h-3 w-3 rounded-sm border', levelClass[i])} />
                ))}
                <span>More</span>
              </div>
            </div>

            <div className="mt-5 flex gap-2 md:gap-3">
              <div className="flex shrink-0 flex-col gap-[3px] py-0.5 pr-0.5 md:gap-1">
                {DOW.map((d) => (
                  <span
                    key={d}
                    className="flex h-[11px] items-center text-[10px] font-mono uppercase leading-none text-muted-foreground/80 md:h-[13px] md:text-[11px]"
                  >
                    {d.slice(0, 1)}
                  </span>
                ))}
              </div>
              <div
                className="min-w-0 flex-1 overflow-x-auto rounded-xl border border-border/40 bg-black/20 px-2 py-2 light:border-stone-200/60 light:bg-stone-100/40"
                style={{ scrollbarGutter: 'stable' }}
              >
                <div className="flex gap-[3px] pb-1 md:gap-1">
                  {weeks.map((col, wi) => (
                    <div key={wi} className="flex flex-col gap-[3px] md:gap-1">
                      {col.map((cell, di) => (
                        <motion.button
                          key={`${wi}-${di}`}
                          type="button"
                          initial={false}
                          whileHover={{ scale: 1.35, zIndex: 5 }}
                          whileTap={{ scale: 0.92 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                          className={cn(
                            'h-[11px] w-[11px] rounded-[2px] border md:h-[13px] md:w-[13px] md:rounded-[3px]',
                            'outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:ring-offset-1 focus-visible:ring-offset-background',
                            levelClass[cell.level],
                          )}
                          aria-label={`${cell.label}, ${intensityLabel(cell.level)}`}
                          onMouseEnter={(e) => onCellEnter(cell, e)}
                          onFocus={(e) => onCellEnter(cell, e)}
                          onBlur={() => setHover(null)}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-muted-foreground">
              Older weeks on the left, recent on the right. Pattern is seeded for consistency, not pulled from GitHub’s private graph API.
            </p>

            <AnimatePresence>
              {hover && (
                <motion.div
                  role="tooltip"
                  initial={{ opacity: 0, y: 6, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none fixed z-[60] w-[min(calc(100vw-2rem),220px)] -translate-x-1/2 -translate-y-full rounded-xl border border-border/70 bg-card/95 px-3 py-2.5 text-left text-xs shadow-xl backdrop-blur-md light:border-stone-200/90 light:bg-amber-50/95"
                  style={{ left: hover.x, top: hover.y - 8 }}
                >
                  <p className="font-mono text-[10px] uppercase tracking-wider text-cyan-400/90 light:text-cyan-800">{hover.cell.label}</p>
                  <p className="mt-1 font-display text-sm font-semibold text-foreground">{intensityLabel(hover.cell.level)}</p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">Rhythm index {hover.cell.level} of 4 · stylised</p>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </section>
  )
}
