import { createContext, useContext, useEffect, useState } from 'react'

// ─── Color Maps ───────────────────────────────────────────────────────────────

export const DARK = {
  base:              '#0a0a0a',
  card:              '#161616',
  raised:            '#222222',
  hover:             '#2e2e2e',
  border:            '#383838',
  muted:             '#505050',
  text:              '#fafafa',
  text2:             '#d4d4d4',
  text3:             '#a3a3a3',
  text4:             '#737373',
  accent:            '#FFD600',
  accentDark:        '#F5C800',
  accentSoft:        '#FFE566',
  accentText:        '#0a0a0a',   // text ON yellow bg
  accentBg:          'rgba(255,214,0,0.10)',
  accentBorder:      'rgba(255,214,0,0.22)',
  accentGlow:        'rgba(255,214,0,0.30)',
  accentGlowLg:      'rgba(255,214,0,0.14)',
  red:               '#D32F2F',
  redBg:             'rgba(211,47,47,0.10)',
  redBorder:         'rgba(211,47,47,0.20)',
  navBg:             'rgba(10,10,10,0.96)',
  navBorder:         'rgba(255,214,0,0.12)',
  overlay:           'rgba(10,10,10,0.75)',
  overlayDeep:       'rgba(10,10,10,0.96)',
  cardHoverBorder:   'rgba(255,214,0,0.35)',
  cardHoverShadow:   '0 8px 32px rgba(255,214,0,0.10)',
  imgPlaceholder:    '#222222',
  imgPlaceholderIcon:'#505050',
  heroGlow:          'radial-gradient(ellipse at center, rgba(255,214,0,0.10) 0%, transparent 70%)',
  heroGlowRed:       'radial-gradient(ellipse at top right, rgba(211,47,47,0.06) 0%, transparent 60%)',
  inputBg:           '#161616',
  inputBorder:       '#383838',
  inputFocus:        '#FFD600',
  skeletonFrom:      '#222222',
  skeletonTo:        '#2e2e2e',
  waBtn:             '#25D366',
  waBtnShadow:       'rgba(37,211,102,0.4)',
}

export const LIGHT = {
  base:              '#FFFDF5',
  card:              '#FFFFFF',
  raised:            '#F5F2E8',
  hover:             '#EDE9DC',
  border:            '#E0DDD0',
  muted:             '#B8B5A8',
  text:              '#111111',
  text2:             '#333333',
  text3:             '#666666',
  text4:             '#999999',
  accent:            '#D4A800',   // darker yellow for contrast on white
  accentDark:        '#B89200',
  accentSoft:        '#FFD600',
  accentText:        '#111111',   // text ON yellow bg
  accentBg:          'rgba(212,168,0,0.10)',
  accentBorder:      'rgba(212,168,0,0.30)',
  accentGlow:        'rgba(212,168,0,0.30)',
  accentGlowLg:      'rgba(212,168,0,0.12)',
  red:               '#C62828',
  redBg:             'rgba(198,40,40,0.08)',
  redBorder:         'rgba(198,40,40,0.20)',
  navBg:             'rgba(255,253,245,0.97)',
  navBorder:         'rgba(212,168,0,0.20)',
  overlay:           'rgba(0,0,0,0.55)',
  overlayDeep:       'rgba(0,0,0,0.88)',
  cardHoverBorder:   'rgba(212,168,0,0.45)',
  cardHoverShadow:   '0 8px 28px rgba(212,168,0,0.14)',
  imgPlaceholder:    '#F5F2E8',
  imgPlaceholderIcon:'#B8B5A8',
  heroGlow:          'radial-gradient(ellipse at center, rgba(212,168,0,0.12) 0%, transparent 70%)',
  heroGlowRed:       'radial-gradient(ellipse at top right, rgba(198,40,40,0.05) 0%, transparent 60%)',
  inputBg:           '#FFFFFF',
  inputBorder:       '#E0DDD0',
  inputFocus:        '#D4A800',
  skeletonFrom:      '#F0EDE4',
  skeletonTo:        '#E8E5DC',
  waBtn:             '#25D366',
  waBtnShadow:       'rgba(37,211,102,0.35)',
}

export type ThemeColors = typeof DARK

// ─── Context ──────────────────────────────────────────────────────────────────

interface ThemeCtx {
  isDark: boolean
  toggle: () => void
  c: ThemeColors
}

const Ctx = createContext<ThemeCtx>({
  isDark: true,
  toggle: () => {},
  c: DARK,
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('maxim-theme')
    return saved ? saved === 'dark' : true // default dark
  })

  useEffect(() => {
    localStorage.setItem('maxim-theme', isDark ? 'dark' : 'light')
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
    // Smooth body bg transition
    document.body.style.background = isDark ? DARK.base : LIGHT.base
  }, [isDark])

  const toggle = () => setIsDark((d) => !d)
  const c = isDark ? DARK : LIGHT

  return <Ctx.Provider value={{ isDark, toggle, c }}>{children}</Ctx.Provider>
}

export const useTheme = () => useContext(Ctx)
