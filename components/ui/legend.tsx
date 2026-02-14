'use client'

import { motion } from 'framer-motion'
import { Info } from 'lucide-react'
import { useState } from 'react'

interface LegendItem {
  level: 'low' | 'medium' | 'high'
  color: string
  label: string
  range: string
  description: string
}

const legendItems: LegendItem[] = [
  {
    level: 'low',
    color: 'bg-green-500',
    label: 'Low Crime',
    range: '0-5 incidents',
    description: 'Safest areas with minimal reported incidents'
  },
  {
    level: 'medium',
    color: 'bg-amber-500',
    label: 'Medium Crime',
    range: '6-12 incidents',
    description: 'Moderate crime levels requiring awareness'
  },
  {
    level: 'high',
    color: 'bg-red-500',
    label: 'High Crime',
    range: '13+ incidents',
    description: 'Higher crime rates requiring extra caution'
  }
]

interface LegendProps {
  className?: string
  showDetails?: boolean
}

export function Legend({ className = '', showDetails = false }: LegendProps) {
  const [isExpanded, setIsExpanded] = useState(showDetails)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden ${className}`}
      role="region"
      aria-label="Map legend"
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-dark-text-primary">
            Crime Level Legend
          </h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary transition-colors"
            aria-label={isExpanded ? 'Collapse legend details' : 'Expand legend details'}
            aria-expanded={isExpanded}
          >
            <Info className="w-4 h-4 text-gray-600 dark:text-dark-text-secondary" aria-hidden="true" />
          </motion.button>
        </div>
      </div>

      {/* Legend Items */}
      <div className="p-4 space-y-3">
        {legendItems.map((item, index) => (
          <motion.div
            key={item.level}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className="group"
          >
            <div className="flex items-center gap-3">
              {/* Color Indicator */}
              <motion.div
                whileHover={{ scale: 1.2, rotate: 5 }}
                className={`w-6 h-6 rounded-lg ${item.color} shadow-md flex-shrink-0`}
                aria-hidden="true"
              />

              {/* Label and Range */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-gray-900 dark:text-dark-text-primary">
                    {item.label}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-dark-text-tertiary">
                    {item.range}
                  </span>
                </div>

                {/* Expanded Description */}
                <motion.div
                  initial={false}
                  animate={{
                    height: isExpanded ? 'auto' : 0,
                    opacity: isExpanded ? 1 : 0
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs text-gray-600 dark:text-dark-text-secondary mt-1">
                    {item.description}
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Divider (except for last item) */}
            {index < legendItems.length - 1 && (
              <div className="mt-3 border-t border-gray-100 dark:border-gray-700/50" />
            )}
          </motion.div>
        ))}
      </div>

      {/* Footer Note */}
      <motion.div
        initial={false}
        animate={{
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
        className="overflow-hidden"
      >
        <div className="px-4 py-3 bg-gray-50 dark:bg-dark-bg-primary border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-dark-text-tertiary">
            Crime levels are calculated based on reported incidents per neighborhood.
            Data is updated regularly for accuracy.
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}
