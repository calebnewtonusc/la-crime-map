'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, BarChart3, Settings, Info } from 'lucide-react'
import { usePathname } from 'next/navigation'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

const navItems = [
  { icon: MapPin, label: 'Map View', href: '/', description: 'Interactive crime map' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics', description: 'Data visualizations' },
  { icon: Info, label: 'About', href: '/about', description: 'Learn more' },
  { icon: Settings, label: 'Settings', href: '/settings', description: 'Preferences' },
]

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            aria-hidden="true"
          />

          {/* Slide-out Drawer */}
          <motion.nav
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-16 bottom-0 w-64 bg-white dark:bg-dark-bg-primary border-l border-gray-200 dark:border-gray-800 z-50 md:hidden overflow-y-auto"
            aria-label="Mobile navigation"
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary mb-4">
                Navigation
              </h2>
              <ul className="space-y-2" role="list">
                {navItems.map((item, index) => {
                  const isActive = pathname === item.href
                  return (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <a
                        href={item.href}
                        onClick={onClose}
                        className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-neon-cyan/10 text-neon-cyan dark:bg-neon-cyan/20'
                            : 'hover:bg-gray-100 dark:hover:bg-dark-bg-secondary text-gray-700 dark:text-dark-text-secondary'
                        }`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <item.icon
                          className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                            isActive ? 'text-neon-cyan' : ''
                          }`}
                          aria-hidden="true"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-gray-500 dark:text-dark-text-tertiary mt-0.5">
                            {item.description}
                          </div>
                        </div>
                      </a>
                    </motion.li>
                  )
                })}
              </ul>
            </div>
          </motion.nav>
        </>
      )}
    </AnimatePresence>
  )
}
