import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'linear-gradient(180deg, rgba(12,10,9,0.98) 0%, rgba(12,10,9,0.92) 100%)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(68,64,60,0.5)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f97316, #ea580c)' }}
          >
            <Flame size={16} className="text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span
              className="text-lg font-black tracking-tight"
              style={{ fontFamily: 'Syne, sans-serif', color: '#fafaf9' }}
            >
              MAXIM
            </span>
            <span className="text-[10px] font-medium tracking-widest uppercase"
              style={{ color: '#f97316' }}>
              Calang Foodie
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <div
            className="hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(249,115,22,0.1)',
              border: '1px solid rgba(249,115,22,0.2)',
              color: '#fb923c',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Calang, Aceh
          </div>
        </div>
      </div>
    </motion.header>
  )
}
