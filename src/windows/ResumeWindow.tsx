import { site } from '@/data/site'

export function ResumeWindow() {
  const src = encodeURI(site.resume)
  return (
    <div className="flex h-full min-h-[400px] flex-col bg-[#0c0c0e]">
      <iframe title="Résumé PDF" src={src} className="h-full min-h-[400px] w-full flex-1 border-0 bg-zinc-900" />
    </div>
  )
}
