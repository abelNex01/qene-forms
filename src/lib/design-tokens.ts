// Design Tokens - Studio-quality design system
// Inspired by re-do.studio aesthetic

export const colors = {
  // Core palette - Dark theme with warm accents
  background: {
    primary: '#0a0a0a',
    secondary: '#111111',
    tertiary: '#1a1a1a',
    elevated: '#222222',
  },
  foreground: {
    primary: '#f5f0e8',
    secondary: '#a8a29e',
    tertiary: '#78716c',
    muted: '#57534e',
  },
  accent: {
    primary: '#e8e4dc',
    secondary: '#d4d0c8',
    highlight: '#ffffff',
  },
  semantic: {
    success: '#22c55e',
    warning: '#eab308',
    error: '#ef4444',
    info: '#3b82f6',
  },
  border: {
    subtle: 'rgba(255, 255, 255, 0.06)',
    default: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.15)',
  },
} as const;

export const typography = {
  fonts: {
    display: "'Instrument Sans', 'Inter', system-ui, sans-serif",
    heading: "'Instrument Sans', 'Inter', system-ui, sans-serif",
    body: "'Inter', system-ui, sans-serif",
    mono: "'JetBrains Mono', 'SF Mono', monospace",
  },
  sizes: {
    // Fluid typography scale
    display: 'clamp(3.5rem, 8vw, 8rem)',
    h1: 'clamp(2.5rem, 5vw, 4.5rem)',
    h2: 'clamp(2rem, 4vw, 3rem)',
    h3: 'clamp(1.5rem, 3vw, 2rem)',
    h4: 'clamp(1.25rem, 2vw, 1.5rem)',
    body: '1rem',
    small: '0.875rem',
    caption: '0.75rem',
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.1,
    snug: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  },
} as const;

export const spacing = {
  // 4px base unit, geometric scale
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  32: '8rem',     // 128px
  40: '10rem',    // 160px
  48: '12rem',    // 192px
  section: 'clamp(4rem, 10vw, 8rem)',
  container: 'clamp(1rem, 5vw, 3rem)',
} as const;

export const animation = {
  duration: {
    instant: 0.1,
    fast: 0.2,
    normal: 0.4,
    slow: 0.6,
    slower: 0.8,
    slowest: 1.2,
  },
  easing: {
    // Custom cubic-bezier curves for premium feel
    smooth: [0.25, 0.1, 0.25, 1],
    smoothOut: [0, 0, 0.25, 1],
    smoothIn: [0.25, 0, 1, 1],
    bounce: [0.68, -0.55, 0.265, 1.55],
    expo: [0.16, 1, 0.3, 1],
    power3: [0.645, 0.045, 0.355, 1],
  },
  // CSS easing strings
  css: {
    smooth: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
    smoothOut: 'cubic-bezier(0, 0, 0.25, 1)',
    expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
    power3: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  },
} as const;

export const layers = {
  base: 0,
  content: 10,
  overlay: 20,
  dropdown: 30,
  sticky: 40,
  modal: 50,
  toast: 60,
  tooltip: 70,
} as const;

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Framer Motion variants
export const motionVariants = {
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6, ease: animation.easing.smooth }
    },
  },
  fadeUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: animation.easing.expo }
    },
  },
  fadeUpStagger: {
    hidden: { opacity: 0, y: 40 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: animation.easing.expo,
      },
    }),
  },
  scaleIn: {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: animation.easing.smooth }
    },
  },
  slideInLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: animation.easing.expo }
    },
  },
  slideInRight: {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: animation.easing.expo }
    },
  },
} as const;

export default {
  colors,
  typography,
  spacing,
  animation,
  layers,
  breakpoints,
  motionVariants,
};
