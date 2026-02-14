'use client'

import { motion } from 'framer-motion'
import { Shield, Car, Home, ShoppingBag } from 'lucide-react'
import { CrimeMetric } from '@/lib/data/types'
import { metricLabels, metricDescriptions } from '@/lib/utils/crime-stats'

interface MetricSelectorProps {
  selectedMetric: CrimeMetric
  onChange: (metric: CrimeMetric) => void
  className?: string
}

const metricIcons: Record<CrimeMetric, any> = {
  violentCrime: Shield,
  carTheft: Car,
  breakIns: Home,
  pettyTheft: ShoppingBag,
}

const metricColors: Record<CrimeMetric, { bg: string; text: string; hover: string }> = {
  violentCrime: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    hover: 'hover:bg-red-100 dark:hover:bg-red-900/30'
  },
  carTheft: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30'
  },
  breakIns: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-600 dark:text-amber-400',
    hover: 'hover:bg-amber-100 dark:hover:bg-amber-900/30'
  },
  pettyTheft: {
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    text: 'text-purple-600 dark:text-purple-400',
    hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30'
  }
}

const metrics: CrimeMetric[] = ['violentCrime', 'carTheft', 'breakIns', 'pettyTheft']

export function MetricSelector({ selectedMetric, onChange, className = '' }: MetricSelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm ${className}`}
    >
      <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">
        Select Crime Type
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metricIcons[metric]
          const colors = metricColors[metric]
          const isSelected = selectedMetric === metric

          return (
            <motion.button
              key={metric}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.25, ease: 'easeOut' }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(metric)}
              className={`
                flex flex-col items-center gap-3 p-4 min-h-touch rounded-xl
                border-2 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2
                dark:focus:ring-offset-dark-bg-secondary
                ${
                  isSelected
                    ? `border-neon-cyan dark:border-la-sunset-purple bg-neon-cyan/10 dark:bg-la-sunset-purple/10 shadow-md focus:ring-neon-cyan dark:focus:ring-la-sunset-purple`
                    : `border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary/50 focus:ring-gray-300 dark:focus:ring-gray-600`
                }
              `}
              aria-pressed={isSelected}
              aria-label={`${metricLabels[metric]} - ${metricDescriptions[metric]}`}
            >
              <motion.div
                animate={{
                  scale: isSelected ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
                className={`
                  p-3 rounded-xl transition-all
                  ${
                    isSelected
                      ? `${colors.bg} ${colors.text}`
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }
                `}
              >
                <Icon className="w-6 h-6" aria-hidden="true" />
              </motion.div>
              <div className="text-center">
                <p
                  className={`text-base sm:text-sm font-bold mb-1 ${
                    isSelected
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {metricLabels[metric]}
                </p>
                <p className="text-sm sm:text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                  {metricDescriptions[metric]}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </motion.div>
  )
}
