import { cn } from '@/lib/utils'

type Props = {
  className?: string
  imgClassName?: string
}

/** Monogram mark: white strokes on dark, inverted ink on paper, with halo so it never vanishes. */
export function BrandLogo({ className, imgClassName }: Props) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 rounded-2xl border border-white/20 bg-gradient-to-br from-white/[0.14] via-white/[0.04] to-transparent p-2',
        'shadow-[0_0_0_1px_hsl(188_100%_50%_/_0.12),0_12px_40px_-12px_hsl(230_40%_4%_/_0.85)]',
        'ring-1 ring-cyan-400/25 ring-offset-2 ring-offset-background/80',
        'light:border-stone-400/50 light:from-stone-100 light:via-amber-50/90 light:to-white light:shadow-[0_8px_30px_-10px_hsl(32_20%_45%_/_0.2)] light:ring-cyan-800/20 light:ring-offset-amber-50/90',
        'transition duration-300 group-hover:border-cyan-400/40 group-hover:shadow-[0_0_24px_hsl(188_100%_50%_/_0.2)] light:group-hover:border-cyan-700/35',
        className,
      )}
      aria-hidden
    >
      <span className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,hsl(188_100%_60%_/_0.15),transparent_55%)] light:bg-[radial-gradient(circle_at_30%_20%,hsl(186_50%_45%_/_0.12),transparent_55%)]" />
      <img
        src="/assets/logo.svg"
        alt=""
        className={cn('logo-mark relative z-[1] object-contain h-9 w-9', imgClassName)}
      />
    </span>
  )
}
