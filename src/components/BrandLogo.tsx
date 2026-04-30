import { cn } from '@/lib/utils'

type Props = {
  className?: string
  imgClassName?: string
}

/** Monogram mark — inline SVG with `currentColor` (no img + invert halos). */
export function BrandLogo({ className, imgClassName }: Props) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 overflow-hidden rounded-xl border border-white/[0.12] bg-white/[0.06] p-1.5',
        'shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.06)]',
        'light:border-stone-300/35 light:bg-stone-100/85 light:shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.9)]',
        'transition duration-300 group-hover:border-cyan-400/30 group-hover:bg-white/[0.09] light:group-hover:border-cyan-700/25',
        className,
      )}
      aria-hidden
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-xl bg-[radial-gradient(circle_at_35%_15%,hsl(188_100%_58%_/_0.12),transparent_58%)] light:bg-[radial-gradient(circle_at_35%_15%,hsl(186_45%_42%_/_0.08),transparent_58%)]"
        aria-hidden
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 620.446 410.082"
        className={cn(
          'logo-mark relative z-[1] block h-9 w-9 shrink-0 text-white light:text-stone-900',
          imgClassName,
        )}
        fill="currentColor"
        stroke="none"
        aria-hidden
      >
        <path d="M376.7 34.8c20.2 24 16 54.3 17.2 83.2 28.7-27.8 55.6-58.6 84-87.1 2.7-2.8 5.5-4 9.4-4 36.6 1 74.1-1.3 110 .5-35.9 36.4-71.9 72.9-107.5 109.7-8.3 8.6-16.5 17.2-24.8 25.8-3.1 5.5-20.6 14.6-13.6 20.6 37.5 37.2 73.8 75.5 111 112.9 12.6 13 25.2 25.9 37.8 38.9 3.1 5.2 20.2 16.1 14.2 21.4-64.4 53.4-109.6 2.3-153.8-45.1-21.8-23.6-45.1-46.2-66.8-69.4-1.5 42.8.2 87.1-.3 130.5 0 4.6-1.4 6.5-6.2 6.4-12.8-.2-25.7.1-38.5-.2-33 .1-65.1-17.6-76.7-49.5-15.8-33-32.6-65.6-49-98.3-7.4-13.6-12.7-29.3-21.1-42-16.8 26.8-35.1 73.7-51.3 100.9-4.9-31.8-21.6-61.3-49.6-78.5-4.3-2.8-2.8-5.5-1.5-8C133.1 135.4 169 68.5 201.5 0c38.7 71.3 71.7 147.4 110.8 218 2.8-69.6-.5-140.3.1-210.3-.1-3.6.9-4.9 4.7-4.8 24.3.7 43.9 14 59.6 31.9m-316.5 241c55-23.1 94.8 56.5 41.6 85.4C42.9 390.3 0 302.5 60.2 275.7" />
      </svg>
    </span>
  )
}
