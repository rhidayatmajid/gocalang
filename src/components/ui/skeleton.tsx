import { useTheme } from '@/context/ThemeContext'
import { cn } from '@/lib/utils'

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { c } = useTheme()
  return (
    <div
      className={cn('rounded-lg', className)}
      style={{
        background: `linear-gradient(90deg, ${c.skeletonFrom} 25%, ${c.skeletonTo} 50%, ${c.skeletonFrom} 75%)`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.8s infinite',
      }}
      {...props}
    />
  )
}

export { Skeleton }
