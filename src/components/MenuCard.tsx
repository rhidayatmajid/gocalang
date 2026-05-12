import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react'
import FallbackImage from '@/components/FallbackImage'
import { useTheme } from '@/context/ThemeContext'
import { formatPrice, buildWhatsAppUrl, buildImageFallbacks } from '@/services/googleSheets'
import type { MenuItem, Outlet } from '@/types'

interface Props { item: MenuItem; outlet: Outlet; index: number }

export default function MenuCard({ item, outlet, index }: Props) {
  const { c } = useTheme()
  const [activeIdx, setActiveIdx] = useState(0)
  useEffect(() => setActiveIdx(0), [item.id])

  const images = [...new Set(item.images.filter(Boolean))]
  const hasMultiple = images.length > 1
  const hasMenuImages = images.length > 0

  const outletSrc = outlet.menuGalleryImages?.[0]?.src ?? outlet.galleryImages?.[0]?.src ?? outlet.image
  const outletFallbacks = outlet.menuGalleryImages?.[0]?.fallbacks ?? outlet.galleryImages?.[0]?.fallbacks ?? outlet.imageFallbacks
  const currentSrc = hasMenuImages ? images[activeIdx] : outletSrc
  const currentFallbacks = hasMenuImages ? buildImageFallbacks(currentSrc) : outletFallbacks

  function prev(e: React.MouseEvent) { e.stopPropagation(); setActiveIdx((i) => (i - 1 + images.length) % images.length) }
  function next(e: React.MouseEvent) { e.stopPropagation(); setActiveIdx((i) => (i + 1) % images.length) }

  function handleOrder() {
    const text = `• ${item.name} — ${item.price > 0 ? formatPrice(item.price) : 'Harga: hubungi outlet'}`
    window.open(buildWhatsAppUrl(outlet.waNumber, outlet.name, text), '_blank', 'noopener,noreferrer')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.5), ease: 'easeOut' }}
      whileHover={{ y: -3 }}
      className="group rounded-2xl overflow-hidden flex flex-col"
      style={{ background: c.card, border: `1px solid ${c.border}`, transition: 'border 0.2s, box-shadow 0.2s' }}
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
      <div className="relative aspect-[4/3] flex-shrink-0 overflow-hidden" style={{ background: c.raised }}>
        <FallbackImage
          key={currentSrc}
          src={currentSrc}
          fallbacks={currentFallbacks}
          alt={item.name}
          className="w-full h-full"
          imgClassName={`transition-transform duration-500 group-hover:scale-105${!hasMenuImages ? ' blur-[2px] brightness-75 scale-110' : ''}`}
        />
        {!hasMenuImages && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 pointer-events-none">
            <span className="text-3xl">🍽️</span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: c.overlay, color: c.text3 }}>Foto segera hadir</span>
          </div>
        )}
        {hasMultiple && (
          <>
            <button onClick={prev} aria-label="Sebelumnya"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              style={{ background: c.overlay, color: '#fafafa' }}>
              <ChevronLeft size={14} />
            </button>
            <button onClick={next} aria-label="Berikutnya"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
              style={{ background: c.overlay, color: '#fafafa' }}>
              <ChevronRight size={14} />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <button key={i} onClick={(e) => { e.stopPropagation(); setActiveIdx(i) }}
                  className="rounded-full transition-all duration-200"
                  style={{ width: i === activeIdx ? 16 : 6, height: 6, background: i === activeIdx ? c.accent : 'rgba(250,250,249,0.5)' }} />
              ))}
            </div>
            <div className="absolute top-2 right-2 text-[10px] font-medium px-1.5 py-0.5 rounded-full"
              style={{ background: c.overlay, color: c.text3 }}>
              {activeIdx + 1}/{images.length}
            </div>
          </>
        )}
        <div className="absolute top-2 left-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ background: c.accentBg, border: `1px solid ${c.accentBorder}`, color: c.accent }}>
            {item.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h4 className="font-bold text-base leading-snug line-clamp-2"
          style={{ fontFamily: 'Syne, sans-serif', color: c.text }}>
          {item.name}
        </h4>
        {item.description && (
          <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: c.text4 }}>{item.description}</p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2" style={{ borderTop: `1px solid ${c.border}` }}>
          <span className="font-black text-lg" style={{ fontFamily: 'Syne, sans-serif', color: c.accent }}>
            {item.price > 0 ? formatPrice(item.price) : 'Hubungi kami'}
          </span>
          {outlet.waNumber && (
            <button onClick={handleOrder}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
              style={{ background: c.waBtn, color: 'white', boxShadow: `0 4px 12px ${c.waBtnShadow}` }}
              title="Pesan via WhatsApp">
              <ShoppingCart size={14} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
