import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-mono font-medium tracking-wide transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border bg-secondary/80 text-foreground',
        primary:
          'border-cyan-500/40 bg-cyan-500/10 text-cyan-300 light:border-cyan-800/25 light:bg-cyan-50 light:text-cyan-900',
        accent:
          'border-orange-500/40 bg-orange-500/10 text-orange-200 light:border-orange-200/60 light:bg-orange-50/90 light:text-orange-900',
        muted: 'border-transparent bg-muted text-muted-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
