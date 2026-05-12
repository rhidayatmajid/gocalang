import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Phone, ChevronRight } from 'lucide-react'
import FallbackImage from '@/components/FallbackImage'
import { useTheme } from '@/context/ThemeContext'
import { OUTLET_CATEGORIES } from '@/types'
import type { Outlet } from '@/types'

interface Props { outlet: Outlet; index: number }

function getCategoryMeta(raw: string) {
  if (!raw) return null
  const lower = raw.toLowerCase()
  return OUTLET_CATEGORIES.find(
    (c) => c.value !== 'semua' && (lower.includes(c.value) || c.label.toLowerCase().includes(lower))
  ) ?? null
}

export default function OutletCard({ outlet, index }: Props) {
  const { c } = useTheme()
  const catMeta = getCategoryMeta(outlet.category)

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group"
    >
      <Link to={`/outlet/${outlet.id}`} className="block h-full">
        <div
          className="h-full rounded-2xl overflow-hidden flex flex-col transition-all duration-300"
          style={{ background: c.card, border: `1px solid ${c.border}` }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLDivElement
            el.style.border = `1px solid ${c.cardHoverBorder}`
            el.style.boxShadow = c.cardHoverShadow
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLDivElement
            el.style.border = `1px solid ${c.border}`
            el.style.boxShadow = 'none'
          }}
        >
          {/* Image */}
          <div className="relative aspect-video overflow-hidden" style={{ background: c.raised }}>
            <FallbackImage
              src={outlet.image}
              fallbacks={outlet.imageFallbacks}
              alt={outlet.name}
              className="w-full h-full"
              imgClassName="transition-transform duration-500 group-hover:scale-105"
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: `linear-gradient(to top, ${c.accentGlow} 0%, transparent 55%)` }}
            />
            {catMeta && (
              <div className="absolute top-2.5 right-2.5">
                <div
                  className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{ background: c.overlay, border: '1px solid rgba(255,255,255,0.1)', color: '#fafafa', backdropFilter: 'blur(6px)' }}
                >
                  <span>{catMeta.emoji}</span>
                  <span>{catMeta.label}</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1 gap-2.5">
            <h3 className="font-black text-lg leading-tight line-clamp-1"
              style={{ fontFamily: 'Syne, sans-serif', color: c.text }}>
              {outlet.name}
            </h3>
            <div className="flex items-start gap-1.5 text-sm" style={{ color: c.text3 }}>
              <MapPin size={13} className="flex-shrink-0 mt-0.5" style={{ color: c.accent }} />
              <span className="line-clamp-1">{outlet.city || outlet.address || 'Calang, Aceh'}</span>
            </div>
            {outlet.address && outlet.city && (
              <p className="text-xs line-clamp-1" style={{ color: c.text4 }}>{outlet.address}</p>
            )}
            {outlet.phone && (
              <div className="flex items-center gap-1.5 text-xs" style={{ color: c.muted }}>
                <Phone size={11} className="flex-shrink-0" />
                <span>{outlet.phone}</span>
              </div>
            )}
            <div className="mt-auto pt-3 flex items-center justify-between" style={{ borderTop: `1px solid ${c.border}` }}>
              <span className="text-xs font-semibold" style={{ color: c.accent }}>Lihat Menu →</span>
              <div className="w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1"
                style={{ background: c.accentBg, color: c.accent }}>
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
