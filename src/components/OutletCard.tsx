import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MapPin, Phone, ChevronRight } from 'lucide-react'
import FallbackImage from '@/components/FallbackImage'
import { OUTLET_CATEGORIES } from '@/types'
import type { Outlet } from '@/types'

interface Props {
  outlet: Outlet
  index: number
}

function getCategoryMeta(categoryRaw: string) {
  if (!categoryRaw) return null
  const lower = categoryRaw.toLowerCase()
  return OUTLET_CATEGORIES.find(
    (c) => c.value !== 'semua' && (lower.includes(c.value) || c.label.toLowerCase().includes(lower))
  ) ?? null
}

export default function OutletCard({ outlet, index }: Props) {
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
          style={{ background: '#1c1917', border: '1px solid #292524' }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLDivElement
            el.style.border = '1px solid rgba(249,115,22,0.4)'
            el.style.boxShadow = '0 8px 32px rgba(249,115,22,0.10)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLDivElement
            el.style.border = '1px solid #292524'
            el.style.boxShadow = 'none'
          }}
        >
          {/* Image */}
          <div className="relative aspect-video overflow-hidden">
            <FallbackImage
              src={outlet.image}
              fallbacks={outlet.imageFallbacks}
              alt={outlet.name}
              className="w-full h-full"
              imgClassName="transition-transform duration-500 group-hover:scale-105"
            />

            {/* Bottom gradient */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: 'linear-gradient(to top, rgba(249,115,22,0.25) 0%, transparent 55%)' }}
            />

            {/* Category badge */}
            {catMeta && (
              <div className="absolute top-2.5 right-2.5">
                <div
                  className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    background: 'rgba(12,10,9,0.75)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#d6d3d1',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <span>{catMeta.emoji}</span>
                  <span>{catMeta.label}</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4 flex flex-col flex-1 gap-2.5">
            <h3
              className="font-black text-lg leading-tight line-clamp-1"
              style={{ fontFamily: 'Syne, sans-serif', color: '#fafaf9' }}
            >
              {outlet.name}
            </h3>

            <div className="flex items-start gap-1.5 text-sm" style={{ color: '#a8a29e' }}>
              <MapPin size={13} className="flex-shrink-0 mt-0.5" style={{ color: '#f97316' }} />
              <span className="line-clamp-1">{outlet.city || outlet.address || 'Calang, Aceh'}</span>
            </div>

            {outlet.address && outlet.city && (
              <p className="text-xs line-clamp-1" style={{ color: '#57534e' }}>
                {outlet.address}
              </p>
            )}

            {outlet.phone && (
              <div className="flex items-center gap-1.5 text-xs" style={{ color: '#78716c' }}>
                <Phone size={11} className="flex-shrink-0" />
                <span>{outlet.phone}</span>
              </div>
            )}

            <div
              className="mt-auto pt-3 flex items-center justify-between"
              style={{ borderTop: '1px solid #292524' }}
            >
              <span className="text-xs font-semibold" style={{ color: '#f97316' }}>
                Lihat Menu →
              </span>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:translate-x-1"
                style={{ background: 'rgba(249,115,22,0.12)', color: '#f97316' }}
              >
                <ChevronRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
