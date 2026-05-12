import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'
import { useTheme } from '@/context/ThemeContext'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => {
  const { c } = useTheme()
  return (
    <TabsPrimitive.List
      ref={ref}
      className={cn('inline-flex items-center gap-1 rounded-xl p-1', className)}
      style={{ background: c.card, border: `1px solid ${c.border}` }}
      {...props}
    />
  )
})
TabsList.displayName = TabsPrimitive.List.displayName

// TabsTrigger uses a wrapper to apply active styles via JS since
// Tailwind data-state classes don't work without the compiler
function TabsTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & {
  ref?: React.Ref<HTMLButtonElement>
}) {
  const { c } = useTheme()
  const ref = React.useRef<HTMLButtonElement>(null)
  const [isActive, setIsActive] = React.useState(false)

  // Watch data-state attribute changes
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new MutationObserver(() => {
      setIsActive(el.dataset.state === 'active')
    })
    obs.observe(el, { attributes: true, attributeFilter: ['data-state'] })
    setIsActive(el.dataset.state === 'active')
    return () => obs.disconnect()
  }, [])

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50',
        className
      )}
      style={isActive
        ? { background: c.accentSoft, color: c.accentText, fontWeight: 700, boxShadow: `0 2px 8px ${c.accentGlow}` }
        : { color: c.text4 }
      }
      {...props}
    >
      {children}
    </TabsPrimitive.Trigger>
  )
}
TabsTrigger.displayName = 'TabsTrigger'

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn('mt-4 focus-visible:outline-none', className)}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
