import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, LayoutGrid, List, Lock, MoveUpRight } from 'lucide-react'
import { projects, type Project } from '@/data/site'
import { SPRING_SNAPPY } from '@/os/springs'
import { cn } from '@/lib/utils'

export function WorkWindow() {
  const [mode, setMode] = useState<'grid' | 'list'>('grid')
  const [detail, setDetail] = useState<Project | null>(null)

  return (
    <div className="flex h-full min-h-[360px] flex-col font-inter text-white">
      <div className="flex items-center justify-between border-b border-white/[0.06] px-4 py-2">
        <p className="text-[11px] text-white/45">~/Projects</p>
        <div className="flex gap-1 rounded-lg border border-white/[0.08] p-0.5">
          <button
            type="button"
            data-cursor="hover"
            aria-label="Grid view"
            className={cn('rounded-md p-1.5', mode === 'grid' ? 'bg-white/15' : 'text-white/50')}
            onClick={() => setMode('grid')}
          >
            <LayoutGrid className="size-4" />
          </button>
          <button
            type="button"
            data-cursor="hover"
            aria-label="List view"
            className={cn('rounded-md p-1.5', mode === 'list' ? 'bg-white/15' : 'text-white/50')}
            onClick={() => setMode('list')}
          >
            <List className="size-4" />
          </button>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-auto p-4">
        <AnimatePresence mode="wait">
          {detail ? (
            <motion.div
              key="detail"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={SPRING_SNAPPY}
            >
              <button
                type="button"
                data-cursor="hover"
                className="mb-3 text-[11px] text-indigo-300/90"
                onClick={() => setDetail(null)}
              >
                ← Back
              </button>
              <ProjectDetail p={detail} />
            </motion.div>
          ) : mode === 'grid' ? (
            <motion.ul
              key="grid"
              className="grid list-none grid-cols-1 gap-4 sm:grid-cols-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {projects.map((p) => (
                <li key={p.title}>
                  <ProjectThumb project={p} onOpen={() => setDetail(p)} />
                </li>
              ))}
            </motion.ul>
          ) : (
            <motion.ul key="list" className="space-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {projects.map((p) => (
                <li key={p.title}>
                  <button
                    type="button"
                    data-cursor="hover"
                    className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-left transition hover:border-indigo-500/25"
                    onClick={() => setDetail(p)}
                  >
                    <span className="font-medium">{p.title}</span>
                    <span className="text-[11px] text-white/45">{p.subtitle}</span>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ProjectThumb({ project, onOpen }: { project: Project; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      data-cursor="hover"
      className="group relative w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-white/[0.08] to-transparent text-left"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={SPRING_SNAPPY}
      onClick={onOpen}
    >
      {project.badge && (
        <span className="absolute right-2 top-2 z-10 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wide text-white/80">
          {project.badge}
        </span>
      )}
      {project.confidential && !project.badge && (
        <span className="absolute right-2 top-2 z-10 flex items-center gap-1 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 font-mono text-[9px] uppercase text-white/65">
          <Lock className="size-3" />
          Internal
        </span>
      )}
      <div className="h-36 overflow-hidden bg-zinc-900">
        {project.media.type === 'video' ? (
          <video className="h-full w-full object-cover" src={project.media.src} muted loop playsInline />
        ) : (
          <img className="h-full w-full object-cover" src={project.media.src} alt={project.media.alt} />
        )}
      </div>
      <div className="p-3">
        <p className="font-medium text-white">{project.title}</p>
        <p className="text-[11px] text-indigo-300/90">{project.subtitle}</p>
      </div>
    </motion.button>
  )
}

function ProjectDetail({ p }: { p: Project }) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
      <div className="overflow-hidden rounded-xl bg-zinc-900">
        {p.media.type === 'video' ? (
          <video className="max-h-64 w-full object-cover" src={p.media.src} controls muted playsInline />
        ) : (
          <img className="max-h-64 w-full object-cover" src={p.media.src} alt={p.media.alt} />
        )}
      </div>
      <h2 className="mt-4 font-display text-xl font-semibold">{p.title}</h2>
      <p className="text-sm text-indigo-300/90">{p.subtitle}</p>
      <p className="mt-3 text-sm leading-relaxed text-white/72">{p.description}</p>
      {p.links && p.links.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {p.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              data-cursor="hover"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-white/85 transition hover:border-indigo-400/40"
            >
              {l.label === 'github' ? <Github className="size-3.5" /> : <MoveUpRight className="size-3.5" />}
              {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
