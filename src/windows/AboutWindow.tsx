import { useState } from 'react'
import { motion } from 'framer-motion'
import { site, experience, education, highlights } from '@/data/site'
import { GithubSection } from '@/components/GithubSection'
import { SPRING_SNAPPY } from '@/os/springs'
import { cn } from '@/lib/utils'

const files = [
  { id: 'readme', label: 'README.md' },
  { id: 'cv', label: 'experience.json' },
  { id: 'edu', label: 'education.json' },
  { id: 'extras', label: 'highlights.md' },
  { id: 'activity', label: 'github-activity' },
] as const

type FileId = (typeof files)[number]['id']

export function AboutWindow() {
  const [active, setActive] = useState<FileId>('readme')

  return (
    <div className="flex h-full min-h-[360px] font-inter text-[13px] text-white/88">
      <aside className="w-44 shrink-0 border-r border-white/[0.06] bg-white/[0.02] p-3 font-jetbrains text-[11px] text-white/55">
        <p className="mb-2 px-2 text-[10px] uppercase tracking-wider text-white/35">about/</p>
        <ul className="space-y-0.5">
          {files.map((f) => (
            <li key={f.id}>
              <button
                type="button"
                data-cursor="hover"
                className={cn(
                  'w-full rounded-lg px-2 py-1.5 text-left transition-colors',
                  active === f.id ? 'bg-white/[0.1] text-white' : 'hover:bg-white/[0.06]',
                )}
                onClick={() => setActive(f.id)}
              >
                {f.label}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <motion.div
        key={active}
        className="min-w-0 flex-1 overflow-auto p-6"
        initial={{ opacity: 0.4, x: 6 }}
        animate={{ opacity: 1, x: 0 }}
        transition={SPRING_SNAPPY}
      >
        {active === 'readme' && <Readme />}
        {active === 'cv' && <Cv />}
        {active === 'edu' && <Edu />}
        {active === 'extras' && <Extras />}
        {active === 'activity' && (
          <div className="text-white/80 [&_section]:px-0 [&_section]:py-4">
            <GithubSection />
          </div>
        )}
      </motion.div>
    </div>
  )
}

function Readme() {
  return (
    <article className="prose prose-invert max-w-none font-sans">
      <p className="font-mono text-[10px] uppercase tracking-widest text-indigo-300/80">{site.about.lede}</p>
      <h1 className="font-display text-2xl font-semibold tracking-tight text-white">{site.about.headline}</h1>
      {site.about.paragraphs.map((p) => (
        <p key={p.slice(0, 24)} className="mt-4 leading-relaxed text-white/75">
          {p}
        </p>
      ))}
    </article>
  )
}

function Cv() {
  return (
    <div className="space-y-8 font-jetbrains text-[12px]">
      {experience.map((job) => (
        <section key={job.company}>
          <h3 className="font-inter text-sm font-semibold text-white">
            {job.role} <span className="font-normal text-white/45">at</span> {job.company}
          </h3>
          <p className="text-white/45">
            {job.place} · {job.period}
          </p>
          <ul className="mt-2 list-disc space-y-1.5 pl-4 text-white/72">
            {job.points.map((pt) => (
              <li key={pt}>{pt}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

function Edu() {
  return (
    <ul className="space-y-4 font-jetbrains text-[12px]">
      {education.map((e) => (
        <li key={e.title} className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
          <p className="font-inter text-sm font-medium text-white">{e.title}</p>
          <p className="text-white/60">{e.where}</p>
          <p className="mt-1 text-white/45">{e.meta}</p>
        </li>
      ))}
    </ul>
  )
}

function Extras() {
  return (
    <ul className="list-none space-y-2 font-jetbrains text-[12px] text-white/75">
      {highlights.map((h) => (
        <li key={h} className="flex gap-2">
          <span className="text-indigo-400">*</span>
          <span>{h}</span>
        </li>
      ))}
    </ul>
  )
}
