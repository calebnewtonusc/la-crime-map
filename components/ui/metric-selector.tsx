'use client'

import { motion } from 'framer-motion'
import { Shield, Car, Home, ShoppingBag } from 'lucide-react'
import { CrimeMetric } from '@/lib/data/types'
import { metricLabels, metricDescriptions } from '@/lib/utils/crime-stats'

interface MetricSelectorProps {
  selectedMetric: CrimeMetric
  onChange: (metric: CrimeMetric) => void
}

const metricIcons: Record<CrimeMetric, any> = {
  violentCrime: Shield,
  carTheft: Car,
  breakIns: Home,
  pettyTheft: ShoppingBag,
}

const metrics: CrimeMetric[] = ['violentCrime', 'carTheft', 'breakIns', 'pettyTheft']

export function MetricSelector({ selectedMetric, onChange }: MetricSelectorProps) {
  return (
    <div className="bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary mb-4">
        Select Crime Type
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((metric, index) => {
          const Icon = metricIcons[metric]
          const isSelected = selectedMetric === metric

          return (
            <motion.button
              key={metric}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(metric)}
              className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-neon-cyan bg-neon-cyan/10 dark:bg-neon-cyan/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              aria-pressed={isSelected}
              aria-label={`${metricLabels[metric]} - ${metricDescriptions[metric]}`}
            >
              <div
                className={`p-2 rounded-lg ${
                  isSelected
                    ? 'bg-neon-cyan text-white'
                    : 'bg-gray-100 dark:bg-dark-bg-tertiary text-gray-600 dark:text-dark-text-secondary'
                }`}
              >
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div className="text-center">
                <p
                  className={`text-sm font-semibold ${
                    isSelected
                      ? 'text-gray-900 dark:text-dark-text-primary'
                      : 'text-gray-700 dark:text-dark-text-secondary'
                  }`}
                >
                  {metricLabels[metric]}
                </p>
                <p className="text-xs text-gray-500 dark:text-dark-text-tertiary mt-1 line-clamp-2">
                  {metricDescriptions[metric]}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
