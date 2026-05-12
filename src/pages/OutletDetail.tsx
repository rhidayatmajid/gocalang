import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, MapPin, Phone, MessageCircle, Building2,
  Search, AlertCircle, RefreshCw, ExternalLink, Copy, Check, Images,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import MenuCard from '@/components/MenuCard'
import FallbackImage from '@/components/FallbackImage'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { useTheme } from '@/context/ThemeContext'
import {
  fetchOutlets, fetchMenuItems, buildWhatsAppUrl, getMenuSheetFoundName,
} from '@/services/googleSheets'
import type { Outlet, MenuItem } from '@/types'

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function MenuSkeleton() {
  const { c } = useTheme()
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${c.border}`, background: c.card }}>
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <div className="pt-3 flex items-center justify-between">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// ─── Bank Info ─────────────────────────────────────────────────────────────────
function BankInfoChip({ info }: { info: string }) {
  const { c } = useTheme()
  const [copied, setCopied] = useState(false)
  if (!info) return null
  function handleCopy() {
    navigator.clipboard.writeText(info).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }
  return (
    <div className="flex items-start gap-3 rounded-xl p-4"
      style={{ background: c.accentBg, border: `1px solid ${c.accentBorder}` }}>
      <div className="w-9 h-9 rounded-lg flex-shrink-0 flex items-center justify-center mt-0.5"
        style={{ background: c.accentBg, color: c.accent }}>
        <Building2 size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium mb-0.5" style={{ color: c.text4 }}>Rekening Bank</p>
        <p className="text-sm font-semibold leading-relaxed" style={{ color: c.text2 }}>{info}</p>
      </div>
      <button onClick={handleCopy}
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all"
        style={{ background: copied ? 'rgba(74,222,128,0.15)' : c.raised, color: copied ? '#4ade80' : c.text4 }}
        title="Salin">
        {copied ? <Check size={13} /> : <Copy size={13} />}
      </button>
    </div>
  )
}

// ─── Gallery ──────────────────────────────────────────────────────────────────
interface GalleryImage { src: string; fallbacks: string[] }

function OutletGallery({ images, outletName, title }: { images: GalleryImage[]; outletName: string; title?: string }) {
  const { c } = useTheme()
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <section className="max-w-6xl mx-auto px-4 pb-8">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: c.accentBg, color: c.accent }}>
          <Images size={15} />
        </div>
        <h2 className="text-lg font-black" style={{ fontFamily: 'Syne, sans-serif', color: c.text }}>
          {title ?? 'Menu Kami'}
        </h2>
        <span className="text-sm" style={{ color: c.text4 }}>({images.length} foto)</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((img, i) => (
          <motion.button key={i} onClick={() => setLightbox(i)}
            className="relative group rounded-xl overflow-hidden aspect-square cursor-zoom-in"
            style={{ background: c.raised, border: `1px solid ${c.border}` }}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <FallbackImage src={img.src} fallbacks={img.fallbacks} alt={`${outletName} foto ${i + 1}`}
              className="w-full h-full" imgClassName="object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
              style={{ background: c.accentGlow }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: c.overlay, color: '#fafafa' }}>
                <Images size={14} />
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div key="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center"
            style={{ background: c.overlayDeep, padding: '60px 48px 48px' }}
            onClick={() => setLightbox(null)}>
            <button onClick={() => setLightbox(null)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold z-10"
              style={{ background: 'rgba(68,64,60,0.9)', color: '#fafafa' }}>✕</button>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-sm px-3 py-1 rounded-full z-10"
              style={{ background: 'rgba(68,64,60,0.8)', color: '#d4d4d4' }}>
              {lightbox + 1} / {images.length}
            </div>
            <motion.div key={lightbox}
              initial={{ scale: 0.88, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.88, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              className="relative flex items-center justify-center w-full h-full"
              onClick={(e) => e.stopPropagation()}>
              <img key={images[lightbox].src} src={images[lightbox].src}
                alt={`${outletName} foto ${lightbox + 1}`}
                className="rounded-xl"
                style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }}
                onError={(e) => {
                  const fb = images[lightbox].fallbacks
                  const el = e.currentTarget
                  const next = fb.find((u) => u !== el.src)
                  if (next) el.src = next
                }} />
            </motion.div>
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setLightbox((l) => ((l ?? 0) - 1 + images.length) % images.length) }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-xl"
                  style={{ background: 'rgba(68,64,60,0.85)', color: '#fafafa' }}>‹</button>
                <button onClick={(e) => { e.stopPropagation(); setLightbox((l) => ((l ?? 0) + 1) % images.length) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center text-xl"
                  style={{ background: 'rgba(68,64,60,0.85)', color: '#fafafa' }}>›</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ─── OutletDetail ─────────────────────────────────────────────────────────────
export default function OutletDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { c } = useTheme()

  const [outlet, setOutlet] = useState<Outlet | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loadingOutlet, setLoadingOutlet] = useState(true)
  const [loadingMenu, setLoadingMenu] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [menuError, setMenuError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('semua')

  async function loadData() {
    if (!id) return
    setLoadingOutlet(true); setLoadingMenu(true); setError(null); setMenuError(null)
    try {
      const outlets = await fetchOutlets()
      const found = outlets.find((o) => o.id === id)
      if (!found) throw new Error('Outlet tidak ditemukan')
      setOutlet(found)
      setLoadingOutlet(false)

      try {
        const allItems = await fetchMenuItems()
        const normalizedId = id.trim().toLowerCase()
        const matched = allItems.filter((i) => i.outletId.trim().toLowerCase() === normalizedId)
        setMenuItems(matched)
        console.log(`[Menu] "${getMenuSheetFoundName()}" → ${matched.length}/${allItems.length} for outletId="${id}"`)
      } catch (menuErr) {
        setMenuError(menuErr instanceof Error ? menuErr.message : 'Gagal memuat menu')
        setMenuItems([])
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data')
    } finally {
      setLoadingOutlet(false); setLoadingMenu(false)
    }
  }

  useEffect(() => { loadData(); window.scrollTo({ top: 0, behavior: 'instant' }) }, [id])

  const categories = useMemo(() => {
    const cats = Array.from(new Set(menuItems.map((i) => i.category).filter(Boolean)))
    return cats.length > 1 ? ['semua', ...cats] : cats
  }, [menuItems])

  useEffect(() => {
    if (categories.length > 0 && !categories.includes(activeTab)) setActiveTab(categories[0])
  }, [categories])

  const filtered = useMemo(() => {
    let items = menuItems
    if (activeTab !== 'semua' && categories.includes('semua')) items = items.filter((i) => i.category === activeTab)
    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter((i) => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q) || i.category.toLowerCase().includes(q))
    }
    return items
  }, [menuItems, activeTab, search, categories])

  if (!loadingOutlet && error) {
    return (
      <div className="min-h-dvh" style={{ background: c.base }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 gap-4 text-center px-4">
          <AlertCircle size={40} style={{ color: c.red }} />
          <p className="font-semibold text-lg" style={{ fontFamily: 'Syne', color: c.text }}>{error}</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate(-1)}><ArrowLeft size={14} /> Kembali</Button>
            <Button onClick={loadData}><RefreshCw size={14} /> Coba Lagi</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh" style={{ background: c.base, transition: 'background 0.3s' }}>
      <Navbar />

      {/* Hero */}
      <section className="relative">
        <div className="relative h-56 sm:h-72 md:h-80 overflow-hidden" style={{ background: c.raised }}>
          {loadingOutlet ? <Skeleton className="w-full h-full rounded-none" />
            : outlet?.image ? (
              <FallbackImage src={outlet.image} fallbacks={outlet.imageFallbacks} alt={outlet?.name ?? ''}
                className="w-full h-full" imgClassName="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-6xl opacity-20">🍽️</span>
              </div>
            )
          }
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, ${c.overlay.replace('0.75','0.2')} 0%, ${c.overlay} 100%)` }} />
          <button onClick={() => navigate(-1)}
            className="absolute top-4 left-4 flex items-center gap-2 text-sm px-3 py-2 rounded-xl transition-all hover:scale-105"
            style={{ background: c.overlay, border: `1px solid ${c.border}`, color: '#d4d4d4', backdropFilter: 'blur(10px)' }}>
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">Kembali</span>
          </button>
        </div>

        {/* Info Card */}
        <div className="max-w-6xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
            className="-mt-14 relative z-10 rounded-2xl p-5 sm:p-6"
            style={{ background: c.card, border: `1px solid ${c.border}` }}>
            {loadingOutlet ? (
              <div className="space-y-3">
                <Skeleton className="h-8 w-2/3" /><Skeleton className="h-4 w-1/2" />
                <div className="flex gap-3 pt-2"><Skeleton className="h-10 w-28" /><Skeleton className="h-10 w-28" /></div>
              </div>
            ) : outlet ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="space-y-2 flex-1 min-w-0">
                    <h1 className="text-2xl sm:text-3xl font-black leading-tight"
                      style={{ fontFamily: 'Syne, sans-serif', color: c.text }}>{outlet.name}</h1>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                      {(outlet.city || outlet.address) && (
                        <div className="flex items-center gap-1.5 text-sm" style={{ color: c.text3 }}>
                          <MapPin size={13} style={{ color: c.accent }} />
                          <span>{outlet.city || outlet.address}</span>
                        </div>
                      )}
                      {outlet.phone && (
                        <div className="flex items-center gap-1.5 text-sm" style={{ color: c.text3 }}>
                          <Phone size={13} style={{ color: c.accent }} />
                          <span>{outlet.phone}</span>
                        </div>
                      )}
                    </div>
                    {outlet.address && outlet.city && (
                      <p className="text-sm" style={{ color: c.text4 }}>{outlet.address}</p>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 flex-shrink-0">
                    {outlet.mapsUrl && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={outlet.mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                          <MapPin size={13} /> Maps <ExternalLink size={10} />
                        </a>
                      </Button>
                    )}
                    {outlet.waNumber && (
                      <Button variant="whatsapp" size="sm"
                        onClick={() => window.open(buildWhatsAppUrl(outlet.waNumber, outlet.name), '_blank', 'noopener,noreferrer')}>
                        <MessageCircle size={13} /> WhatsApp
                      </Button>
                    )}
                  </div>
                </div>
                {outlet.bankInfo && <div className="mt-4"><BankInfoChip info={outlet.bankInfo} /></div>}
              </>
            ) : null}
          </motion.div>
        </div>
      </section>

      {/* Menu Kami Gallery */}
      {!loadingOutlet && outlet && outlet.menuGalleryImages && outlet.menuGalleryImages.length > 0 && (
        <div className="max-w-6xl mx-auto px-4 pt-8">
          <OutletGallery images={outlet.menuGalleryImages} outletName={outlet.name} title="Menu Kami" />
        </div>
      )}

      {/* Menu Section */}
      <section className="max-w-6xl mx-auto px-4 py-8 pb-28">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <h2 className="text-xl font-black" style={{ fontFamily: 'Syne, sans-serif', color: c.text }}>
            Menu
            {!loadingMenu && (
              <span className="ml-2 text-sm font-normal" style={{ color: c.text4 }}>
                ({filtered.length} item)
              </span>
            )}
          </h2>
          {!loadingMenu && menuItems.length > 0 && (
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: c.muted }} />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari menu..."
                className="pl-9 pr-4 h-9 w-full sm:w-56 rounded-xl text-sm outline-none transition-all"
                style={{ background: c.inputBg, border: `1px solid ${c.inputBorder}`, color: c.text, caretColor: c.accent }}
                onFocus={(e) => (e.target.style.borderColor = c.inputFocus)}
                onBlur={(e) => (e.target.style.borderColor = c.inputBorder)} />
            </div>
          )}
        </div>

        {/* Menu error */}
        {!loadingMenu && menuError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <AlertCircle size={32} style={{ color: c.accent }} />
            <p className="font-semibold" style={{ fontFamily: 'Syne', color: c.text }}>Gagal Memuat Menu</p>
            <p className="text-xs max-w-sm leading-relaxed" style={{ color: c.text4 }}>{menuError}</p>
            <Button variant="secondary" size="sm" onClick={loadData}><RefreshCw size={13} /> Coba Lagi</Button>
          </motion.div>
        )}

        {/* Loading */}
        {loadingMenu && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <MenuSkeleton key={i} />)}
          </div>
        )}

        {/* Tabs + Grid */}
        {!loadingMenu && outlet && menuItems.length > 0 && (
          <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSearch('') }}>
            {categories.length > 2 && (
              <div className="overflow-x-auto pb-2 mb-1" style={{ scrollbarWidth: 'none' }}>
                <TabsList className="flex-nowrap w-max">
                  {categories.map((cat) => {
                    const count = cat === 'semua' ? menuItems.length : menuItems.filter((i) => i.category === cat).length
                    return (
                      <TabsTrigger key={cat} value={cat} className="capitalize gap-1.5">
                        {cat === 'semua' ? 'Semua' : cat}
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full"
                          style={{ background: activeTab === cat ? 'rgba(0,0,0,0.15)' : c.raised }}>
                          {count}
                        </span>
                      </TabsTrigger>
                    )
                  })}
                </TabsList>
              </div>
            )}
            {categories.map((cat) => (
              <TabsContent key={cat} value={cat}>
                <AnimatePresence mode="wait">
                  {filtered.length > 0 ? (
                    <motion.div key={cat + search}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {filtered.map((item, i) => <MenuCard key={item.id} item={item} outlet={outlet} index={i} />)}
                    </motion.div>
                  ) : (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                      <span className="text-4xl">🍽️</span>
                      <p className="font-semibold" style={{ color: c.text }}>
                        {search ? 'Menu tidak ditemukan' : 'Tidak ada menu di kategori ini'}
                      </p>
                      {search && (
                        <button onClick={() => setSearch('')} className="text-sm font-bold" style={{ color: c.accent }}>
                          Reset pencarian
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* No menu */}
        {!loadingMenu && outlet && menuItems.length === 0 && !menuError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <span className="text-5xl">🍽️</span>
            <p className="font-semibold text-lg" style={{ fontFamily: 'Syne', color: c.text }}>Belum ada menu</p>
            <p className="text-sm max-w-xs" style={{ color: c.text4 }}>
              Menu outlet ini belum tersedia. Hubungi langsung melalui WhatsApp.
            </p>
            {outlet.waNumber && (
              <Button variant="whatsapp" className="mt-2"
                onClick={() => window.open(buildWhatsAppUrl(outlet.waNumber, outlet.name), '_blank', 'noopener,noreferrer')}>
                <MessageCircle size={15} /> Tanya Menu via WhatsApp
              </Button>
            )}
          </motion.div>
        )}
      </section>

      {/* Floating WA */}
      {outlet?.waNumber && !loadingOutlet && (
        <motion.a
          href={buildWhatsAppUrl(outlet.waNumber, outlet.name)}
          target="_blank" rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full font-semibold text-sm"
          style={{ background: c.waBtn, color: 'white', boxShadow: `0 8px 28px ${c.waBtnShadow}` }}
          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 220, damping: 18 }}
          whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.95 }}>
          <MessageCircle size={18} />
          <span className="hidden sm:inline">Hubungi Outlet</span>
        </motion.a>
      )}
    </div>
  )
}
