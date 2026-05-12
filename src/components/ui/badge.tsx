import * as React from 'react'
import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

function Badge({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { c } = useTheme()
  return (
    <div
      className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors', className)}
      style={{ background: c.accentBg, border: `1px solid ${c.accentBorder}`, color: c.accent }}
      {...props}
    />
  )
}

export { Badge }
