import { useState } from 'react'
import { motion } from 'framer-motion'
import { skillGroups } from '@/data/site'
import { SPRING_SNAPPY } from '@/os/springs'
import { cn } from '@/lib/utils'

export function SkillsWindow() {
  const [tab, setTab] = useState(0)

  const g = skillGroups[tab]

  return (
    <div className="flex h-full min-h-[360px] flex-col overflow-hidden bg-[#0d1117] font-jetbrains text-[12px] text-white">
      <div className="flex gap-0 overflow-x-auto border-b border-white/[0.08] bg-[#161b22] px-1 pt-1">
        {skillGroups.map((group, i) => (
          <button
            key={group.title}
            type="button"
            data-cursor="hover"
            className={cn(
              'shrink-0 rounded-t-md px-3 py-2 text-[11px] transition',
              tab === i ? 'bg-[#0d1117] text-white' : 'text-white/50 hover:text-white/75',
            )}
            onClick={() => setTab(i)}
          >
            {group.title.replace(/[^a-z0-9]+/gi, '_').toLowerCase()}.ts
          </button>
        ))}
      </div>
      <motion.pre
        key={g.title}
        className="min-h-0 flex-1 overflow-auto p-4 leading-relaxed"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={SPRING_SNAPPY}
      >
        <code>
          <span className="text-[#ff7b72]">export const </span>
          <span className="text-[#ffa657]">{g.ghostWord.toLowerCase()}</span>
          <span className="text-white/80"> = </span>
          <span className="text-[#a5d6ff]">{'{'}</span>
          {'\n'}
          {g.items.map((item) => (
            <span key={item.name}>
              {'  '}
              <span className="text-[#79c0ff]">{JSON.stringify(item.name)}</span>
              <span className="text-white/80">: </span>
              <span className="text-[#7ee787]">{item.proficiency}</span>
              <span className="text-white/50">, </span>
              <span className="text-[#8b949e]">// {item.productionHint}</span>
              {'\n'}
            </span>
          ))}
          <span className="text-[#a5d6ff]">{'}'}</span>
          <span className="text-white/80"> satisfies SkillStack</span>
        </code>
      </motion.pre>
    </div>
  )
}
