'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Shield, AlertTriangle, ChevronDown, TrendingUp, TrendingDown } from 'lucide-react'
import { useState } from 'react'
import { NeighborhoodGeoJSON, CrimeMetric, NeighborhoodData } from '@/lib/data/types'
import { metricLabels } from '@/lib/utils/crime-stats'

interface TopNeighborhoodsProps {
  data: NeighborhoodGeoJSON
  selectedMetric: CrimeMetric
  onNeighborhoodSelect?: (neighborhood: NeighborhoodData) => void
  className?: string
}

export function TopNeighborhoods({ data, selectedMetric, onNeighborhoodSelect, className = '' }: TopNeighborhoodsProps) {
  const [activeView, setActiveView] = useState<'safest' | 'dangerous'>('safest')
  const [isExpanded, setIsExpanded] = useState(true)
  const count = 10

  const neighborhoods = data.features.map(f => f.properties)

  const sorted = [...neighborhoods].sort((a, b) => a[selectedMetric] - b[selectedMetric])
  const safest = sorted.slice(0, count)
  const mostDangerous = sorted.slice(-count).reverse()

  const displayList = activeView === 'safest' ? safest : mostDangerous

  const maxValue = Math.max(...displayList.map(n => n[selectedMetric]))
  const minValue = Math.min(...displayList.map(n => n[selectedMetric]))

  const getBarWidth = (value: number) => {
    if (maxValue === minValue) return 50
    return ((value - minValue) / (maxValue - minValue)) * 70 + 15
  }

  const getBarColor = (index: number) => {
    if (activeView === 'safest') {
      const colors = ['#10b981', '#22c55e', '#4ade80', '#86efac', '#bbf7d0']
      return colors[Math.floor(index / 2)] || '#d1fae5'
    } else {
      const colors = ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca']
      return colors[Math.floor(index / 2)] || '#fee2e2'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden ${className}`}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        aria-expanded={isExpanded}
        aria-label="Toggle top neighborhoods panel"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {activeView === 'safest'
            ? <Shield className="w-5 h-5 text-green-500" aria-hidden="true" />
            : <AlertTriangle className="w-5 h-5 text-red-500" aria-hidden="true" />
          }
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            Top 10 Neighborhoods
          </h3>
          <span className="text-xs text-gray-500 dark:text-gray-400">by {metricLabels[selectedMetric]}</span>
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-5 h-5 text-gray-400" aria-hidden="true" />
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {/* Toggle buttons */}
            <div className="flex gap-2 px-5 pt-4 pb-2">
              <button
                onClick={(e) => { e.stopPropagation(); setActiveView('safest') }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  activeView === 'safest'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-pressed={activeView === 'safest'}
              >
                <TrendingDown className="w-4 h-4" aria-hidden="true" />
                Safest
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setActiveView('dangerous') }}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-red-500 ${
                  activeView === 'dangerous'
                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                aria-pressed={activeView === 'dangerous'}
              >
                <TrendingUp className="w-4 h-4" aria-hidden="true" />
                Highest Crime
              </button>
            </div>

            {/* List */}
            <div className="px-4 pb-4 space-y-1.5 max-h-[420px] overflow-y-auto">
              {displayList.map((neighborhood, index) => {
                const value = neighborhood[selectedMetric]
                const barWidth = getBarWidth(value)
                const barColor = getBarColor(index)

                return (
                  <motion.button
                    key={neighborhood.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={(e) => { e.stopPropagation(); onNeighborhoodSelect?.(neighborhood) }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left group focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={`${neighborhood.name}: ${value} incidents`}
                  >
                    {/* Rank */}
                    <span className={`text-xs font-bold w-5 text-center flex-shrink-0 ${
                      index < 3
                        ? activeView === 'safest' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        : 'text-gray-400'
                    }`}>
                      {index + 1}
                    </span>

                    {/* Name and bar */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {neighborhood.name}
                        </span>
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100 ml-2 flex-shrink-0">
                          {value}
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${barWidth}%` }}
                          transition={{ duration: 0.5, delay: index * 0.03 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: barColor }}
                        />
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Click any neighborhood to highlight on map
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
