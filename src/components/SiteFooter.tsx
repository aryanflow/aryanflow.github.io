import { ArrowUpRight } from 'lucide-react'
import { BrandLogo } from '@/components/BrandLogo'
import { site } from '@/data/site'

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 px-5 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">Next step</p>
            <p className="mt-3 max-w-md font-display text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              If the work resonates, we should talk.
            </p>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:opacity-90"
              data-cursor-hover
            >
              {site.email}
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <div className="flex items-center gap-4">
            <BrandLogo className="p-2" imgClassName="h-10 w-10" />
            <div>
              <p className="font-display text-sm font-semibold">{site.name}</p>
              <p className="text-xs text-muted-foreground">© {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-border/40 pt-8 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          <a className="transition hover:text-foreground" href={site.github} target="_blank" rel="noreferrer" data-cursor-hover>
            GitHub
          </a>
          <a className="transition hover:text-foreground" href={site.linkedin} target="_blank" rel="noreferrer" data-cursor-hover>
            LinkedIn
          </a>
          <a className="transition hover:text-foreground" href={site.medium} target="_blank" rel="noreferrer" data-cursor-hover>
            Medium
          </a>
          <a className="transition hover:text-foreground" href={site.resume} target="_blank" rel="noreferrer" data-cursor-hover>
            Résumé
          </a>
        </div>
      </div>
    </footer>
  )
}
