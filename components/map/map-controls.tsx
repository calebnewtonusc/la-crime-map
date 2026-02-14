'use client'

import { motion } from 'framer-motion'
import { Compass, Maximize2, Minimize2, Layers, Info, Navigation } from 'lucide-react'
import { useState } from 'react'
import { useTheme } from 'next-themes'

interface MapControlsProps {
  onRecenter?: () => void
  onToggleFullscreen?: () => void
  isFullscreen?: boolean
  className?: string
}

export function MapControls({
  onRecenter,
  onToggleFullscreen,
  isFullscreen = false,
  className = ''
}: MapControlsProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const [showTooltip, setShowTooltip] = useState<string | null>(null)

  const controls = [
    {
      id: 'recenter',
      icon: Compass,
      label: 'Recenter Map',
      action: onRecenter,
      shortcut: 'R'
    },
    {
      id: 'fullscreen',
      icon: isFullscreen ? Minimize2 : Maximize2,
      label: isFullscreen ? 'Exit Fullscreen' : 'Fullscreen',
      action: onToggleFullscreen,
      shortcut: 'F'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className={`flex flex-col gap-2 ${className}`}
    >
      {controls.map((control) => {
        const Icon = control.icon
        return (
          <div key={control.id} className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={control.action}
              onMouseEnter={() => setShowTooltip(control.id)}
              onMouseLeave={() => setShowTooltip(null)}
              className={`
                w-10 h-10 rounded-lg shadow-lg backdrop-blur-md
                flex items-center justify-center
                transition-all
                ${isDark
                  ? 'bg-dark-bg-secondary/90 text-dark-text-primary hover:bg-dark-bg-tertiary border border-gray-700'
                  : 'bg-white/90 text-gray-900 hover:bg-gray-50 border border-gray-200'
                }
              `}
              aria-label={control.label}
            >
              <Icon className="w-5 h-5" />
            </motion.button>

            {/* Tooltip */}
            {showTooltip === control.id && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`
                  absolute left-full ml-2 top-1/2 -translate-y-1/2
                  px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap
                  text-xs font-medium
                  ${isDark
                    ? 'bg-dark-bg-secondary text-dark-text-primary border border-gray-700'
                    : 'bg-white text-gray-900 border border-gray-200'
                  }
                `}
              >
                <span>{control.label}</span>
                <span className="ml-2 opacity-60">({control.shortcut})</span>
              </motion.div>
            )}
          </div>
        )
      })}
    </motion.div>
  )
}

interface MapLegendToggleProps {
  isOpen: boolean
  onToggle: () => void
  className?: string
}

export function MapLegendToggle({ isOpen, onToggle, className = '' }: MapLegendToggleProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onToggle}
      className={`
        px-4 py-2.5 rounded-xl shadow-lg backdrop-blur-md
        flex items-center gap-2
        font-medium text-sm transition-all
        ${isOpen
          ? isDark
            ? 'bg-neon-cyan/20 text-neon-cyan border-2 border-neon-cyan/40'
            : 'bg-blue-500 text-white border-2 border-blue-600'
          : isDark
            ? 'bg-dark-bg-secondary/90 text-dark-text-primary hover:bg-dark-bg-tertiary border-2 border-gray-700'
            : 'bg-white/90 text-gray-900 hover:bg-gray-50 border-2 border-gray-200'
        }
        ${className}
      `}
      aria-label={isOpen ? 'Hide legend' : 'Show legend'}
      aria-pressed={isOpen}
    >
      <Layers className="w-4 h-4" />
      <span>{isOpen ? 'Hide' : 'Show'} Legend</span>
    </motion.button>
  )
}

interface MapGuideProps {
  onClose: () => void
}

export function MapGuide({ onClose }: MapGuideProps) {
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const tips = [
    {
      icon: Navigation,
      title: 'Pan & Zoom',
      description: 'Click and drag to move around. Use scroll wheel or pinch to zoom.'
    },
    {
      icon: Layers,
      title: 'View Details',
      description: 'Click any neighborhood to see detailed crime statistics and trends.'
    },
    {
      icon: Compass,
      title: 'Navigate',
      description: 'Use the zoom controls or press R to recenter the map to Los Angeles.'
    },
    {
      icon: Info,
      title: 'Color Guide',
      description: 'Green areas are safer, red areas have higher crime rates. Check the legend for details.'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className={`
        max-w-md rounded-2xl shadow-2xl border-2 overflow-hidden
        ${isDark
          ? 'bg-dark-bg-secondary border-gray-700'
          : 'bg-white border-gray-200'
        }
      `}
    >
      {/* Header */}
      <div className={`
        px-5 py-4 border-b-2
        bg-gradient-to-r from-neon-cyan/10 to-la-sunset-purple/10
        ${isDark ? 'border-gray-700' : 'border-gray-200'}
      `}>
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-bold ${isDark ? 'text-dark-text-primary' : 'text-gray-900'}`}>
            Map Guide
          </h3>
          <button
            onClick={onClose}
            className={`
              text-sm font-medium px-3 py-1 rounded-lg transition-colors
              ${isDark
                ? 'text-dark-text-secondary hover:bg-dark-bg-tertiary'
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            Got it
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="p-5 space-y-4">
        {tips.map((tip, index) => {
          const Icon = tip.icon
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-3"
            >
              <div className={`
                w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                bg-gradient-to-br from-neon-cyan/20 to-la-sunset-purple/20
              `}>
                <Icon className="w-5 h-5 text-neon-cyan" />
              </div>
              <div className="flex-1">
                <h4 className={`font-semibold mb-1 ${isDark ? 'text-dark-text-primary' : 'text-gray-900'}`}>
                  {tip.title}
                </h4>
                <p className={`text-sm ${isDark ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
                  {tip.description}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
