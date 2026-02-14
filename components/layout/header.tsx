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
      className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-dark-bg-primary/95 backdrop-blur-lg shadow-sm"
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
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-dark-text-primary tracking-tight">
                LA Crime Map
              </h1>
              <p className="text-xs text-gray-600 dark:text-dark-text-tertiary hidden sm:block font-medium">
                Real-time crime statistics
              </p>
            </div>
          </a>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-xs">
            {/* Navigation Links */}
            <nav className="flex items-center gap-xxs">
              <a
                href="/"
                className="px-md py-sm text-body-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-button transition-all duration-200"
              >
                Map
              </a>
              <a
                href="/search"
                className="px-md py-sm text-body-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-button transition-all duration-200"
              >
                Search
              </a>
              <a
                href="/recommendations"
                className="px-md py-sm text-body-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary rounded-button transition-all duration-200"
              >
                Recommendations
              </a>
              <a
                href="/ai-demo"
                className="px-md py-sm text-body-sm font-semibold bg-gradient-to-r from-la-sunset-orange to-la-sunset-pink text-white rounded-button hover:shadow-card-hover transition-all duration-200"
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
                className="min-w-touch min-h-touch p-sm rounded-button bg-gray-100 dark:bg-dark-bg-secondary hover:bg-gray-200 dark:hover:bg-dark-bg-tertiary transition-all duration-200 flex items-center justify-center shadow-sm"
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
                className="min-w-touch min-h-touch p-sm rounded-button bg-gray-100 dark:bg-dark-bg-secondary hover:bg-gray-200 dark:hover:bg-dark-bg-tertiary transition-all duration-200 flex items-center justify-center shadow-sm"
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
                className="min-w-touch min-h-touch p-sm rounded-button bg-gray-100 dark:bg-dark-bg-secondary hover:bg-gray-200 dark:hover:bg-dark-bg-tertiary transition-all duration-200 flex items-center justify-center shadow-sm"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-700 dark:text-dark-text-primary" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700 dark:text-dark-text-primary" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}
