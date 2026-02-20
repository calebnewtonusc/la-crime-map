'use client'

import { motion } from 'framer-motion'
import { Shield, Car, Home, ShoppingBag, Info } from 'lucide-react'
import { CrimeMetric } from '@/lib/data/types'
import { metricLabels, metricDescriptions } from '@/lib/utils/crime-stats'
import { useState } from 'react'

interface MetricSelectorProps {
  selectedMetric: CrimeMetric
  onChange: (metric: CrimeMetric) => void
  className?: string
}

const metricIcons: Record<CrimeMetric, React.ComponentType<{ className?: string }>> = {
  violentCrime: Shield,
  carTheft: Car,
  breakIns: Home,
  pettyTheft: ShoppingBag,
}

const metricColors: Record<CrimeMetric, {
  bg: string
  text: string
  selectedBorder: string
  selectedBg: string
  dot: string
}> = {
  violentCrime: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    selectedBorder: 'border-red-400 dark:border-red-500',
    selectedBg: 'bg-red-50/80 dark:bg-red-900/20',
    dot: 'bg-red-500',
  },
  carTheft: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    selectedBorder: 'border-blue-400 dark:border-blue-500',
    selectedBg: 'bg-blue-50/80 dark:bg-blue-900/20',
    dot: 'bg-blue-500',
  },
  breakIns: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-600 dark:text-amber-400',
    selectedBorder: 'border-amber-400 dark:border-amber-500',
    selectedBg: 'bg-amber-50/80 dark:bg-amber-900/20',
    dot: 'bg-amber-500',
  },
  pettyTheft: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
    selectedBorder: 'border-purple-400 dark:border-purple-500',
    selectedBg: 'bg-purple-50/80 dark:bg-purple-900/20',
    dot: 'bg-purple-500',
  },
}

const metrics: CrimeMetric[] = ['violentCrime', 'carTheft', 'breakIns', 'pettyTheft']

export function MetricSelector({ selectedMetric, onChange, className = '' }: MetricSelectorProps) {
  const [hoveredInfo, setHoveredInfo] = useState<CrimeMetric | null>(null)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm ${className}`}
      role="group"
      aria-label="Select crime type to display on map"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
          Crime Type
        </h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Selecting changes map coloring
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((metric, index) => {
          const Icon = metricIcons[metric]
          const colors = metricColors[metric]
          const isSelected = selectedMetric === metric

          return (
            <div key={metric} className="relative">
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.22, ease: 'easeOut' }}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange(metric)}
                className={`
                  w-full flex flex-col items-center gap-2.5 p-4 rounded-xl
                  border-2 transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
                  ${isSelected
                    ? `${colors.selectedBorder} ${colors.selectedBg} shadow-md`
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }
                `}
                aria-pressed={isSelected}
                aria-label={`${metricLabels[metric]}: ${metricDescriptions[metric]}`}
              >
                {/* Icon */}
                <motion.div
                  animate={{ scale: isSelected ? 1.08 : 1 }}
                  transition={{ duration: 0.18 }}
                  className={`p-2.5 rounded-xl transition-all ${
                    isSelected ? `${colors.bg} ${colors.text}` : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                  }`}
                  aria-hidden="true"
                >
                  <Icon className="w-5 h-5" />
                </motion.div>

                {/* Label */}
                <div className="text-center">
                  <p className={`text-sm font-bold leading-tight ${
                    isSelected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'
                  }`}>
                    {metricLabels[metric]}
                  </p>
                </div>

                {/* Selected indicator dot */}
                {isSelected && (
                  <motion.div
                    layoutId="metric-dot"
                    className={`w-1.5 h-1.5 rounded-full ${colors.dot}`}
                    aria-hidden="true"
                  />
                )}
              </motion.button>

              {/* Info tooltip button */}
              <button
                onMouseEnter={() => setHoveredInfo(metric)}
                onMouseLeave={() => setHoveredInfo(null)}
                onFocus={() => setHoveredInfo(metric)}
                onBlur={() => setHoveredInfo(null)}
                className="absolute top-2 right-2 p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                aria-label={`More info: ${metricDescriptions[metric]}`}
              >
                <Info className="w-3 h-3" aria-hidden="true" />
              </button>

              {/* Info tooltip popup */}
              {hoveredInfo === metric && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full mb-2 left-0 right-0 z-50 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg shadow-xl pointer-events-none"
                  role="tooltip"
                >
                  {metricDescriptions[metric]}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" aria-hidden="true" />
                </motion.div>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}
