import { useState, useEffect } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  src: string
  fallbacks?: string[]
  alt: string
  className?: string
  imgClassName?: string
  placeholderIcon?: React.ReactNode
}

export default function FallbackImage({
  src,
  fallbacks = [],
  alt,
  className,
  imgClassName,
  placeholderIcon,
}: Props) {
  // Deduplicated list: primary + fallbacks
  const all = Array.from(new Set([src, ...fallbacks].filter(Boolean)))

  const [idx, setIdx] = useState(0)
  const [failed, setFailed] = useState(false)

  // Reset when src changes
  useEffect(() => {
    setIdx(0)
    setFailed(false)
  }, [src])

  function handleError() {
    if (idx + 1 < all.length) {
      setIdx((i) => i + 1)
    } else {
      setFailed(true)
    }
  }

  const current = all[idx]

  return (
    <div className={cn('relative overflow-hidden bg-[#1c1917]', className)}>
      {failed || !current ? (
        <div className="w-full h-full flex items-center justify-center">
          {placeholderIcon ?? <ImageOff size={28} className="text-[#57534e]" />}
        </div>
      ) : (
        <img
          key={current}
          src={current}
          alt={alt}
          onError={handleError}
          className={cn('w-full h-full object-cover', imgClassName)}
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      )}
    </div>
  )
}
