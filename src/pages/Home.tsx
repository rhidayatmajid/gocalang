import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Store, AlertCircle, RefreshCw, Utensils, ChevronLeft, ChevronRight } from 'lucide-react'
import Navbar from '@/components/Navbar'
import OutletCard from '@/components/OutletCard'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchOutlets } from '@/services/googleSheets'
import { OUTLET_CATEGORIES } from '@/types'
import type { Outlet } from '@/types'

// ─── Outlet Skeleton ──────────────────────────────────────────────────────────
function OutletSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid #292524', background: '#1c1917' }}>
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <div className="pt-3"><Skeleton className="h-4 w-1/4" /></div>
      </div>
    </div>
  )
}

// ─── Category Scroll Bar ──────────────────────────────────────────────────────
interface CategoryBarProps {
  active: string
  onChange: (val: string) => void
  counts: Record<string, number>
}

function CategoryBar({ active, onChange, counts }: CategoryBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'right' ? 160 : -160, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative flex items-center gap-2">
      {/* Left arrow */}
      <button
        onClick={() => scroll('left')}
        className="hidden sm:flex flex-shrink-0 w-8 h-8 items-center justify-center rounded-full transition-colors"
        style={{ background: '#1c1917', border: '1px solid #292524', color: '#78716c' }}
      >
        <ChevronLeft size={14} />
      </button>

      {/* Scrollable chips */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scroll-smooth pb-1"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {OUTLET_CATEGORIES.map((cat) => {
          const isActive = active === cat.value
          const count = counts[cat.value] ?? 0
          if (cat.value !== 'semua' && count === 0) return null
          return (
            <motion.button
              key={cat.value}
              onClick={() => onChange(cat.value)}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer select-none"
              style={
                isActive
                  ? {
                      background: '#f97316',
                      color: '#fff',
                      boxShadow: '0 4px 14px rgba(249,115,22,0.35)',
                    }
                  : {
                      background: '#1c1917',
                      border: '1px solid #292524',
                      color: '#a8a29e',
                    }
              }
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              {cat.value !== 'semua' && (
                <span
                  className="text-xs px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.25)' : 'rgba(68,64,60,0.6)',
                    color: isActive ? '#fff' : '#78716c',
                  }}
                >
                  {count}
                </span>
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Right arrow */}
      <button
        onClick={() => scroll('right')}
        className="hidden sm:flex flex-shrink-0 w-8 h-8 items-center justify-center rounded-full transition-colors"
        style={{ background: '#1c1917', border: '1px solid #292524', color: '#78716c' }}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  )
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  const [outlets, setOutlets] = useState<Outlet[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('semua')

  async function loadOutlets() {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchOutlets()
      setOutlets(data)
    } catch (err) {
      console.error(err)
      setError('Gagal memuat data outlet. Periksa koneksi internet dan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadOutlets() }, [])

  // Category counts: map outlet.category to our chip values (fuzzy match)
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { semua: outlets.length }
    OUTLET_CATEGORIES.slice(1).forEach((cat) => {
      counts[cat.value] = outlets.filter((o) =>
        o.category?.toLowerCase().includes(cat.value) ||
        cat.label.toLowerCase().includes(o.category?.toLowerCase())
      ).length
    })
    return counts
  }, [outlets])

  // Filtered list
  const filtered = useMemo(() => {
    let list = outlets

    // Category filter
    if (activeCategory !== 'semua') {
      const cat = OUTLET_CATEGORIES.find((c) => c.value === activeCategory)
      list = list.filter((o) =>
        o.category?.toLowerCase().includes(activeCategory) ||
        (cat && cat.label.toLowerCase().includes(o.category?.toLowerCase()))
      )
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.city.toLowerCase().includes(q) ||
          o.address.toLowerCase().includes(q) ||
          o.category?.toLowerCase().includes(q)
      )
    }

    return list
  }, [outlets, activeCategory, search])

  return (
    <div className="min-h-dvh" style={{ background: '#0c0a09' }}>
      <Navbar />

      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden py-14 px-4">
        {/* Radial glow */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[320px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at center, rgba(249,115,22,0.13) 0%, transparent 70%)' }}
        />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div
              className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full mb-5"
              style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)', color: '#fb923c' }}
            >
              <Utensils size={12} />
              Direktori Kuliner Calang
            </div>

            <h1
              className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-4"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              Temukan <span className="text-gradient">Outlet</span>
              <br />
              Favoritmu
            </h1>
            <p className="text-base sm:text-lg max-w-xl mx-auto mb-8" style={{ color: '#78716c' }}>
              Semua outlet terbaik di Calang, Aceh dalam satu tempat.
              Pesan langsung via WhatsApp.
            </p>

            {/* Search */}
            <div className="max-w-lg mx-auto relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#57534e' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama outlet atau lokasi..."
                className="w-full pl-11 pr-4 h-12 rounded-xl text-sm outline-none transition-all duration-200"
                style={{ background: '#1c1917', border: '1px solid #44403c', color: '#fafaf9', caretColor: '#f97316' }}
                onFocus={(e) => (e.target.style.borderColor = '#f97316')}
                onBlur={(e) => (e.target.style.borderColor = '#44403c')}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Main Content ─── */}
      <main className="max-w-6xl mx-auto px-4 pb-20">

        {/* Category Filter Bar */}
        {!loading && !error && outlets.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <CategoryBar
              active={activeCategory}
              onChange={(val) => { setActiveCategory(val); setSearch('') }}
              counts={categoryCounts}
            />
          </motion.div>
        )}

        {/* Stats */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 mb-5 text-sm"
            style={{ color: '#57534e' }}
          >
            <Store size={13} />
            <span>
              {filtered.length > 0
                ? `${filtered.length} outlet ditemukan`
                : activeCategory !== 'semua' || search
                ? 'Tidak ada outlet yang cocok'
                : 'Belum ada outlet tersedia'}
            </span>
          </motion.div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => <OutletSkeleton key={i} />)}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4 text-center"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              <AlertCircle size={28} style={{ color: '#ef4444' }} />
            </div>
            <div>
              <p className="font-semibold mb-1" style={{ color: '#fafaf9' }}>Terjadi Kesalahan</p>
              <p className="text-sm" style={{ color: '#78716c' }}>{error}</p>
            </div>
            <button
              onClick={loadOutlets}
              className="flex items-center gap-2 text-sm px-4 py-2 rounded-lg"
              style={{ background: '#292524', color: '#d6d3d1' }}
            >
              <RefreshCw size={14} /> Coba Lagi
            </button>
          </motion.div>
        )}

        {/* Outlet Grid */}
        <AnimatePresence mode="wait">
          {!loading && !error && filtered.length > 0 && (
            <motion.div
              key={activeCategory + search}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {filtered.map((outlet, i) => (
                <OutletCard key={outlet.id} outlet={outlet} index={i} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!loading && !error && filtered.length === 0 && (outlets.length > 0) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-3 text-center"
          >
            <span className="text-5xl">🔍</span>
            <p className="font-semibold" style={{ color: '#fafaf9' }}>
              {search ? 'Outlet tidak ditemukan' : 'Belum ada outlet di kategori ini'}
            </p>
            <p className="text-sm" style={{ color: '#57534e' }}>
              {search ? 'Coba kata kunci lain' : 'Coba kategori lain'}
            </p>
            <button
              onClick={() => { setSearch(''); setActiveCategory('semua') }}
              className="text-sm mt-1"
              style={{ color: '#f97316' }}
            >
              Reset filter
            </button>
          </motion.div>
        )}
      </main>
    </div>
  )
}
