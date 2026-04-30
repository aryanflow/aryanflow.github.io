import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { SiteNav } from '@/components/SiteNav'
import { ScrollProgress } from '@/components/ScrollProgress'
import { HeroSection } from '@/components/HeroSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { SkillsSection } from '@/components/SkillsSection'
import { GithubSection } from '@/components/GithubSection'
import { AsteroidArcade } from '@/components/AsteroidArcade'
import { SiteFooter } from '@/components/SiteFooter'
import { ProfileDialog } from '@/components/ProfileDialog'
import { Button } from '@/components/ui/button'

export default function App() {
  const [profileOpen, setProfileOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const t = requestAnimationFrame(() => setLoaded(true))
    return () => cancelAnimationFrame(t)
  }, [])

  return (
    <div className="relative min-h-screen">
      <ScrollProgress />
      <div className="noise" aria-hidden />
      <div className="aurora-blob aurora-1" aria-hidden />
      <div className="aurora-blob aurora-2" aria-hidden />
      <div className="aurora-blob aurora-3" aria-hidden />
      <div className="grid-bg" aria-hidden />
      <SiteNav onOpenProfile={() => setProfileOpen(true)} />
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
      <motion.main
        initial={false}
        animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 8 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >
        <HeroSection onOpenProfile={() => setProfileOpen(true)} />
        <div className="section-divider" />
        <ExperienceSection />
        <div className="section-divider" />
        <ProjectsSection />
        <div className="section-divider" />
        <SkillsSection />
        <div className="section-divider" />
        <GithubSection />
        <div className="section-divider" />
        <AsteroidArcade />
        <SiteFooter />
      </motion.main>
      <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-20 h-28 bg-gradient-to-t from-background via-background/80 to-transparent" />
      <div className="fixed bottom-6 right-4 z-30 md:bottom-8 md:right-8">
        <Button
          type="button"
          size="lg"
          className="group pointer-events-auto relative h-14 w-14 overflow-hidden rounded-2xl border border-cyan-500/20 bg-gradient-to-br from-cyan-500/25 to-orange-500/20 p-0 shadow-xl shadow-cyan-500/20 transition hover:scale-105 hover:shadow-cyan-500/30 light:border-cyan-800/25 light:from-cyan-100/80 light:to-orange-100/60 light:shadow-cyan-900/10 light:hover:shadow-amber-400/20"
          onClick={() => setProfileOpen(true)}
          aria-label="Open contact"
        >
          <span className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 transition group-hover:opacity-100" />
          <MessageCircle className="relative h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
