import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-[0.98] light:shadow-md light:shadow-cyan-800/20',
        secondary:
          'bg-secondary text-secondary-foreground border border-border hover:bg-muted light:border-stone-200/80 light:bg-stone-100/80',
        outline:
          'border border-border bg-background/50 backdrop-blur-sm hover:border-primary/50 hover:bg-secondary/50 light:border-stone-300/90 light:bg-white/50 light:hover:bg-stone-100/90',
        ghost: 'hover:bg-secondary/80 light:hover:bg-stone-200/60',
        accent: 'bg-accent text-accent-foreground shadow-lg shadow-orange-500/20 hover:brightness-110 light:shadow-md light:shadow-orange-800/15',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 rounded-full px-4 text-xs',
        lg: 'h-12 rounded-full px-8 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
