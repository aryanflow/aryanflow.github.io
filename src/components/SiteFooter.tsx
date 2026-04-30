import { ArrowUpRight } from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'
import { site } from '@/data/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-border/80 px-4 py-20 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">Thanks for scrolling</p>
            <p className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">Let us build something sharp.</p>
            <a
              href={`mailto:${site.email}`}
              className="mt-3 inline-flex items-center gap-2 text-cyan-400/90 transition hover:text-cyan-300"
            >
              {site.email}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="flex items-center gap-3">
            <BrandLogo className="p-2.5" imgClassName="h-11 w-11" />
            <div>
              <p className="font-display font-semibold">{site.name}</p>
              <p className="text-sm text-muted-foreground">© {new Date().getFullYear()}. Crafted to be read, not skimmed.</p>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-border/50 pt-8 text-sm text-muted-foreground md:justify-start">
          <a className="inline-flex items-center gap-1 transition hover:text-foreground" href={site.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a className="inline-flex items-center gap-1 transition hover:text-foreground" href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a className="inline-flex items-center gap-1 transition hover:text-foreground" href={site.medium} target="_blank" rel="noreferrer">
            Medium
          </a>
          <a className="inline-flex items-center gap-1 transition hover:text-foreground" href={site.resume} target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
      </div>
    </footer>
  )
}
