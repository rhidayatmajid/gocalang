import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

function MaximLogo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="18" fill="#FFD600" />
      <path d="M18 72 C18 72 18 38 18 36 C18 22 28 16 38 16 C44 16 49 20 50 25 C51 20 56 16 62 16 C72 16 82 22 82 36 C82 38 82 72 82 72 L70 72 C70 72 70 40 70 38 C70 32 66 28 62 28 C58 28 54 32 54 38 L54 72 L46 72 L46 38 C46 32 42 28 38 28 C34 28 30 32 30 38 C30 40 30 72 30 72 Z" fill="#D32F2F" />
      <ellipse cx="38" cy="36" rx="8" ry="10" fill="white" />
      <ellipse cx="62" cy="36" rx="8" ry="10" fill="white" />
    </svg>
  )
}

export default function Navbar() {
  const { isDark, toggle, c } = useTheme()

  return (
    <motion.header
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 w-full"
      style={{ background: c.navBg, backdropFilter: 'blur(14px)', borderBottom: `1px solid ${c.navBorder}` }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <MaximLogo size={38} />
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tight"
              style={{ fontFamily: 'Syne, sans-serif', color: c.accent, letterSpacing: '-0.02em' }}>
              maxim
            </span>
            <span className="text-[10px] font-semibold tracking-widest uppercase"
              style={{ color: c.red, letterSpacing: '0.15em' }}>
              calang foodie
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Location pill */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
            style={{ background: c.accentBg, border: `1px solid ${c.accentBorder}`, color: c.accent }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#4ade80' }} />
            Calang, Aceh
          </div>

          {/* Dark/Light toggle */}
          <motion.button
            onClick={toggle}
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.08 }}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
            style={{
              background: isDark ? c.raised : c.hover,
              border: `1px solid ${c.border}`,
              color: c.text3,
            }}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            <motion.div
              key={isDark ? 'moon' : 'sun'}
              initial={{ rotate: -30, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.25 }}
            >
              {isDark ? <Sun size={15} /> : <Moon size={15} />}
            </motion.div>
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}
