import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

// Note: variant colors use CSS-compatible values
// Dynamic theme colors are handled per-variant with data-theme overrides in index.css
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default:
          'bg-[#FFD600] text-[#0a0a0a] hover:bg-[#FFE566] active:scale-[0.97] shadow-lg font-bold',
        ghost:
          'hover:bg-[rgba(255,255,255,0.06)] text-[#a3a3a3] hover:text-white',
        outline:
          'border border-[#383838] text-[#d4d4d4] hover:border-[#FFD600] hover:text-white',
        destructive:
          'bg-[#D32F2F] text-white hover:bg-[#B71C1C]',
        secondary:
          'bg-[#222222] text-[#d4d4d4] hover:bg-[#2e2e2e] hover:text-white',
        link:
          'text-[#FFD600] underline-offset-4 hover:underline p-0 h-auto',
        whatsapp:
          'bg-[#25D366] text-white hover:bg-[#128C7E] active:scale-[0.97] shadow-lg shadow-green-900/30',
      },
      size: {
        default:  'h-10 px-4 py-2',
        sm:       'h-8 px-3 text-xs',
        lg:       'h-12 px-6 text-base',
        xl:       'h-14 px-8 text-base',
        icon:     'h-10 w-10',
        'icon-sm':'h-8 w-8',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
