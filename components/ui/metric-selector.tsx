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
    <div className="bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary mb-6">
        Select Crime Type
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => {
          const Icon = metricIcons[metric]
          const isSelected = selectedMetric === metric

          return (
            <button
              key={metric}
              onClick={() => onChange(metric)}
              className={`flex flex-col items-center gap-3 p-4 min-h-touch rounded-lg border-2 transition-all ${
                isSelected
                  ? 'border-la-sunset-orange bg-la-sunset-orange/10 dark:bg-la-sunset-orange/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
              aria-pressed={isSelected}
              aria-label={`${metricLabels[metric]} - ${metricDescriptions[metric]}`}
            >
              <div
                className={`p-3 rounded-lg ${
                  isSelected
                    ? 'bg-la-sunset-orange text-white'
                    : 'bg-gray-100 dark:bg-dark-bg-tertiary text-gray-600 dark:text-dark-text-secondary'
                }`}
              >
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <div className="text-center">
                <p
                  className={`text-base sm:text-sm font-semibold ${
                    isSelected
                      ? 'text-gray-900 dark:text-dark-text-primary'
                      : 'text-gray-700 dark:text-dark-text-secondary'
                  }`}
                >
                  {metricLabels[metric]}
                </p>
                <p className="text-sm sm:text-xs text-gray-500 dark:text-dark-text-tertiary mt-1 line-clamp-2">
                  {metricDescriptions[metric]}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
