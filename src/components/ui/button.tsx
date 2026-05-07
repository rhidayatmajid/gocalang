import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none',
  {
    variants: {
      variant: {
        default:
          'bg-[#f97316] text-white hover:bg-[#ea580c] active:scale-[0.97] shadow-lg shadow-orange-900/30',
        ghost:
          'text-[#a8a29e] hover:bg-[#292524] hover:text-white',
        outline:
          'border border-[#44403c] text-[#d6d3d1] hover:bg-[#292524] hover:border-[#f97316] hover:text-white',
        destructive:
          'bg-red-600 text-white hover:bg-red-700',
        secondary:
          'bg-[#292524] text-[#d6d3d1] hover:bg-[#3a3330] hover:text-white',
        link:
          'text-[#f97316] underline-offset-4 hover:underline p-0 h-auto',
        whatsapp:
          'bg-[#25D366] text-white hover:bg-[#128C7E] active:scale-[0.97] shadow-lg shadow-green-900/30',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-base',
        icon: 'h-10 w-10',
        'icon-sm': 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
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
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
