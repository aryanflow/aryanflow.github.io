import { useEffect, useMemo, useState } from 'react'

const USER = 'aryankashyap7'

type Stats = { repos: number; followers: number; stars: number }

export type ContributionCell = {
  level: number
  label: string
  /** 0 = Sunday … 6 = Saturday */
  dow: number
  weekIdx: number
}

/** Deterministic PRNG so contribution grid is stable across remounts (e.g. React Strict Mode). */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function useGitHubActivity() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const u = await fetch(`https://api.github.com/users/${USER}`)
        if (!u.ok) throw new Error('u')
        const userData = (await u.json()) as { public_repos: number; followers: number }
        const reposR = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100`)
        let stars = 0
        if (reposR.ok) {
          const repos = (await reposR.json()) as { stargazers_count: number }[]
          stars = repos.reduce((a, r) => a + r.stargazers_count, 0)
        }
        if (!cancelled) setStats({ repos: userData.public_repos, followers: userData.followers, stars })
      } catch {
        if (!cancelled) {
          setError(true)
          setStats({ repos: 25, followers: 120, stars: 85 })
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return { stats, error, username: USER }
}

const DOW_WEIGHT = [0.38, 0.82, 0.98, 1.05, 1.02, 0.78, 0.4] as const

/** GitHub-shaped generative heatmap (illustrative, not API data). Stable across mounts. */
export function useContributionGrid(): ContributionCell[][] {
  return useMemo(() => {
    const rand = mulberry32(0x9e3779b9)
    const weeks = 48
    const out: ContributionCell[][] = []
    const today = new Date()
    for (let w = 0; w < weeks; w++) {
      const col: ContributionCell[] = []
      for (let d = 0; d < 7; d++) {
        const daysAgo = (weeks - w - 1) * 7 + (6 - d)
        const date = new Date(today)
        date.setDate(date.getDate() - daysAgo)
        const wave = 0.45 + 0.55 * Math.sin(w * 0.22 + d * 0.35 + 0.8)
        const streak = daysAgo < 21 ? 0.12 + (21 - daysAgo) / 210 : 0
        const noise = rand() * 0.55
        const intensity = noise * wave * DOW_WEIGHT[d] + streak
        let level = 0
        if (intensity > 0.32) level = 1
        if (intensity > 0.48) level = 2
        if (intensity > 0.62) level = 3
        if (intensity > 0.78) level = 4
        if (daysAgo < 4 && rand() > 0.35) level = Math.max(level, 2)
        col.push({
          level: Math.min(4, level),
          label: date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
          dow: d,
          weekIdx: w,
        })
      }
      out.push(col)
    }
    return out
  }, [])
}
