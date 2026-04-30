import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider'
import { IntroSequence } from '@/components/IntroSequence'
import { ScrollProgress } from '@/components/ScrollProgress'
import { SiteNav } from '@/components/SiteNav'
import { HeroSection } from '@/components/HeroSection'
import { AboutSection } from '@/components/AboutSection'
import { ProjectsSection } from '@/components/ProjectsSection'
import { SkillsSection } from '@/components/SkillsSection'
import { ContactSection } from '@/components/ContactSection'
import { SiteFooter } from '@/components/SiteFooter'

export default function App() {
  return (
    <SmoothScrollProvider>
      <IntroSequence />
      <div className="relative min-h-screen">
        <ScrollProgress />
        <div className="noise" aria-hidden />
        <div className="ambient-grid" aria-hidden />
        <SiteNav />
        <main className="relative z-10">
          <HeroSection />
          <div className="section-rule mx-auto max-w-5xl" />
          <AboutSection />
          <div className="section-rule mx-auto max-w-5xl" />
          <ProjectsSection />
          <div className="section-rule mx-auto max-w-5xl" />
          <SkillsSection />
          <div className="section-rule mx-auto max-w-5xl" />
          <ContactSection />
          <SiteFooter />
        </main>
      </div>
    </SmoothScrollProvider>
  )
}
