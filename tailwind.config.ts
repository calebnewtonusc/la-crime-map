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
      colors: {
        // Light mode
        background: "var(--background)",
        foreground: "var(--foreground)",

        // LA-themed color palette
        'la-night': {
          dark: '#0a0e1a',
          base: '#131827',
        },
        'la-sunset': {
          orange: '#FF6B35',
          pink: '#FF2E97',
          purple: '#9D4EDD',
        },
        // Dark mode colors
        'dark-bg': {
          primary: '#0a0e1a',
          secondary: '#131827',
          tertiary: '#1e293b',
        },
        'dark-text': {
          primary: '#f8fafc',
          secondary: '#cbd5e1',
          tertiary: '#94a3b8',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      spacing: {
        'xs': '8px',
        'sm': '12px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        'touch': '44px', // Minimum touch target size for mobile
      },
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
