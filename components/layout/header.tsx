'use client'

import { motion } from 'framer-motion'
import { Moon, Sun, Menu, X, MapPin } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState, useEffect } from 'react'

interface HeaderProps {
  onMobileMenuToggle?: () => void
  mobileMenuOpen?: boolean
}

export function Header({ onMobileMenuToggle, mobileMenuOpen }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-md sm:px-lg lg:px-xl">
        <div className="flex h-16 sm:h-18 items-center justify-between gap-lg">
          {/* Logo and Title */}
          <a href="/" className="flex items-center gap-sm hover:opacity-80 transition-opacity duration-200">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-la-sunset-orange to-la-sunset-pink rounded-button blur-sm opacity-50" />
              <div className="relative bg-gradient-to-br from-la-sunset-orange to-la-sunset-pink p-2.5 rounded-button shadow-card">
                <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                LA Crime Map
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400 hidden sm:block font-medium">
                Real-time crime statistics
              </p>
            </div>
          </a>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Navigation Links */}
            <nav className="flex items-center gap-2">
              <a
                href="/"
                className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                Map
              </a>
              <a
                href="/search"
                className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                Search
              </a>
              <a
                href="/recommendations"
                className="px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                Recommendations
              </a>
              <a
                href="/ai-demo"
                className="px-4 py-2 text-sm font-bold bg-gradient-to-r from-la-sunset-orange to-la-sunset-pink text-white! dark:text-white! rounded-lg hover:shadow-lg transition-all duration-200 shadow-md"
                style={{ color: 'white' }}
              >
                AI Features
              </a>
            </nav>

            {/* Theme Toggle */}
            {mounted && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="min-w-touch min-h-touch p-sm rounded-button bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center shadow-sm"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-la-sunset-gold" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-xxs">
            {mounted && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="min-w-touch min-h-touch p-sm rounded-button bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center shadow-sm"
                aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-la-sunset-gold" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </motion.button>
            )}
            {onMobileMenuToggle && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onMobileMenuToggle}
                className="min-w-touch min-h-touch p-sm rounded-button bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 flex items-center justify-center shadow-sm"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-100" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700 dark:text-gray-100" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
