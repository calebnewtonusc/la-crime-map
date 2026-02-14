import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      /* ==========================================
         DESIGN SYSTEM: COLOR PALETTE
         ========================================== */
      colors: {
        // Base colors
        background: "var(--background)",
        foreground: "var(--foreground)",

        // LA Night Sky theme
        'la-night': {
          dark: '#0a0e1a',
          base: '#131827',
          tertiary: '#1e293b',
        },

        // LA Sunset palette (primary brand colors)
        'la-sunset': {
          orange: '#FF6B35',
          pink: '#FF2E97',
          purple: '#9D4EDD',
          gold: '#FFB020',
        },

        // Accent colors
        'neon-cyan': '#00D9FF',
        'neon-purple': '#B24BF3',

        // Semantic surface colors (dark mode)
        'dark-bg': {
          primary: '#0a0e1a',
          secondary: '#131827',
          tertiary: '#1e293b',
        },

        // Semantic text colors (dark mode)
        'dark-text': {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
          tertiary: '#94a3b8',
        },

        // Status colors (consistent light/dark)
        status: {
          success: '#10b981',
          warning: '#f59e0b',
          error: '#ef4444',
          info: '#3b82f6',
        },
      },

      /* ==========================================
         DESIGN SYSTEM: TYPOGRAPHY
         ========================================== */
      fontSize: {
        // Display sizes
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],

        // Heading sizes
        'heading-xl': ['1.75rem', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-lg': ['1.5rem', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-md': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-sm': ['1.125rem', { lineHeight: '1.4', fontWeight: '600' }],

        // Body sizes
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-md': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-xs': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],

        // Special text
        'caption': ['0.75rem', { lineHeight: '1.4', fontWeight: '500' }],
        'overline': ['0.75rem', { lineHeight: '1.4', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }],
      },

      /* ==========================================
         DESIGN SYSTEM: SPACING SCALE
         ========================================== */
      spacing: {
        // Micro spacing
        'xxs': '0.25rem',  // 4px
        'xs': '0.5rem',     // 8px
        'sm': '0.75rem',    // 12px

        // Standard spacing
        'md': '1rem',       // 16px
        'lg': '1.5rem',     // 24px
        'xl': '2rem',       // 32px
        '2xl': '2.5rem',    // 40px
        '3xl': '3rem',      // 48px
        '4xl': '4rem',      // 64px
        '5xl': '5rem',      // 80px
        '6xl': '6rem',      // 96px

        // Mobile touch target
        'touch': '2.75rem', // 44px - minimum touch target size
      },

      /* ==========================================
         DESIGN SYSTEM: BORDER RADIUS
         ========================================== */
      borderRadius: {
        'card': '0.75rem',    // 12px
        'button': '0.5rem',    // 8px
        'input': '0.5rem',     // 8px
        'badge': '9999px',     // full circle
        'modal': '1rem',       // 16px
      },

      /* ==========================================
         DESIGN SYSTEM: BOX SHADOWS
         ========================================== */
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'elevated': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        'modal': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      },

      /* ==========================================
         DESIGN SYSTEM: ANIMATIONS
         ========================================== */
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },

      /* ==========================================
         DESIGN SYSTEM: TRANSITIONS
         ========================================== */
      transitionDuration: {
        'fast': '150ms',
        'base': '200ms',
        'slow': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },

      /* ==========================================
         DESIGN SYSTEM: ACCESSIBILITY
         ========================================== */
      minHeight: {
        'touch': '44px',
      },
      minWidth: {
        'touch': '44px',
      },
    },
  },
  plugins: [],
};

export default config;
