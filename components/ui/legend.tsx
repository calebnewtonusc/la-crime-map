'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Info, Shield, AlertTriangle, ChevronDown, MapPin, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface LegendItem {
  level: 'low' | 'medium' | 'high'
  color: string
  gradient: string
  label: string
  range: string
  description: string
  icon: any
  examples: string[]
}

const legendItems: LegendItem[] = [
  {
    level: 'low',
    color: 'bg-green-500',
    gradient: 'from-green-400 to-green-600',
    label: 'Low Crime',
    range: '0-5 incidents',
    description: 'Safest areas with minimal reported incidents',
    icon: Shield,
    examples: ['Parks', 'Residential areas', 'Low traffic zones']
  },
  {
    level: 'medium',
    color: 'bg-amber-500',
    gradient: 'from-amber-400 to-amber-600',
    label: 'Medium Crime',
    range: '6-12 incidents',
    description: 'Moderate crime levels requiring awareness',
    icon: Info,
    examples: ['Mixed use areas', 'Shopping districts', 'Transit hubs']
  },
  {
    level: 'high',
    color: 'bg-red-500',
    gradient: 'from-red-400 to-red-600',
    label: 'High Crime',
    range: '13+ incidents',
    description: 'Higher crime rates requiring extra caution',
    icon: AlertTriangle,
    examples: ['High density areas', 'Downtown districts', 'Entertainment zones']
  }
]

interface LegendProps {
  className?: string
  showDetails?: boolean
}

export function Legend({ className = '', showDetails = false }: LegendProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={`
        bg-white dark:bg-dark-bg-secondary
        border-2 border-gray-200 dark:border-gray-700
        rounded-2xl shadow-2xl overflow-hidden
        backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95
        ${className}
      `}
      role="region"
      aria-label="Map legend"
    >
      {/* Header with LA-themed gradient */}
      <div className="relative px-5 py-4 bg-gradient-to-br from-la-sunset-purple/10 via-transparent to-neon-cyan/10 dark:from-la-sunset-purple/5 dark:via-transparent dark:to-neon-cyan/5 border-b-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-la-sunset-purple/20 dark:from-neon-cyan/10 dark:to-la-sunset-purple/10">
              <MapPin className="w-5 h-5 text-neon-cyan dark:text-neon-cyan" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-dark-text-primary">
                Crime Level Guide
              </h3>
              <p className="text-xs text-gray-600 dark:text-dark-text-tertiary">
                Los Angeles Neighborhoods
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className={`
              p-2 rounded-lg transition-all
              ${isExpanded
                ? 'bg-neon-cyan/10 text-neon-cyan'
                : 'hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary text-gray-600 dark:text-dark-text-secondary'
              }
            `}
            aria-label={isExpanded ? 'Collapse legend details' : 'Expand legend details'}
            aria-expanded={isExpanded}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronDown className="w-5 h-5" aria-hidden="true" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Legend Items */}
      <div className="p-5 space-y-3">
        {legendItems.map((item, index) => {
          const Icon = item.icon
          const isItemExpanded = expandedItem === item.level

          return (
            <motion.div
              key={item.level}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="group"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setExpandedItem(isItemExpanded ? null : item.level)}
                className={`
                  w-full flex items-center gap-3 p-3 rounded-xl
                  transition-all cursor-pointer
                  ${isItemExpanded
                    ? 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg-tertiary dark:to-dark-bg-primary shadow-lg'
                    : 'hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary'
                  }
                `}
              >
                {/* Color Indicator with Icon */}
                <motion.div
                  whileHover={{ rotate: 5 }}
                  className={`
                    relative w-12 h-12 rounded-xl shadow-lg flex-shrink-0
                    bg-gradient-to-br ${item.gradient}
                    flex items-center justify-center
                  `}
                  aria-hidden="true"
                >
                  <Icon className="w-6 h-6 text-white" />
                  <div className="absolute inset-0 rounded-xl bg-white/20" />
                </motion.div>

                {/* Label and Range */}
                <div className="flex-1 text-left">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-sm font-bold text-gray-900 dark:text-dark-text-primary">
                      {item.label}
                    </span>
                    <span className={`
                      text-xs font-semibold px-2 py-0.5 rounded-full
                      ${item.level === 'low' ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400' :
                        item.level === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                        'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'}
                    `}>
                      {item.range}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-dark-text-secondary">
                    {item.description}
                  </p>
                </div>

                {/* Expand Indicator */}
                <motion.div
                  animate={{ rotate: isItemExpanded ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </motion.div>
              </motion.button>

              {/* Expanded Content */}
              <AnimatePresence>
                {isItemExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 ml-[60px] p-3 rounded-lg bg-gray-50 dark:bg-dark-bg-primary border border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-semibold text-gray-700 dark:text-dark-text-secondary mb-2">
                        Common in:
                      </p>
                      <div className="space-y-1">
                        {item.examples.map((example, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-dark-text-tertiary">
                            <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                            {example}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider (except for last item) */}
              {index < legendItems.length - 1 && (
                <div className="mt-3 border-t border-gray-200 dark:border-gray-700/50" />
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Footer Note with Expanded Info */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 bg-gradient-to-br from-gray-50 to-white dark:from-dark-bg-primary dark:to-dark-bg-secondary border-t-2 border-gray-200 dark:border-gray-700">
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 text-neon-cyan mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-dark-text-primary mb-1">
                      How We Calculate Crime Levels
                    </p>
                    <p className="text-xs text-gray-600 dark:text-dark-text-tertiary leading-relaxed">
                      Crime levels are calculated based on reported incidents per neighborhood,
                      normalized by area and population density. Data is sourced from LAPD and
                      updated regularly for accuracy.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-la-sunset-purple mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-gray-900 dark:text-dark-text-primary mb-1">
                      Understanding the Data
                    </p>
                    <p className="text-xs text-gray-600 dark:text-dark-text-tertiary leading-relaxed">
                      Click any neighborhood on the map to see detailed crime statistics,
                      trends, and historical data. Colors indicate relative safety levels
                      compared to LA County averages.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
