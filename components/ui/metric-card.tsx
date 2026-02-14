'use client'

import { motion } from 'framer-motion'
import { LucideIcon, Info } from 'lucide-react'
import { AnimatedNumber } from './animated-number'
import { TrafficLight } from './safety-badge'
import { useState } from 'react'

interface MetricCardProps {
  label: string
  value: number
  icon: LucideIcon
  delay?: number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
  // New props for UX context
  vsAverage?: string // e.g., "20% safer than average"
  percentile?: number // e.g., 75 (safer than 75% of LA)
  trafficLight?: 'green' | 'yellow' | 'red'
  tooltip?: string // Contextual explanation of what the number means
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  delay = 0,
  trend,
  trendValue,
  vsAverage,
  percentile,
  trafficLight,
  tooltip
}: MetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div className="bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow relative">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary font-medium">
            {label}
          </p>
          {tooltip && (
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="relative"
              aria-label={`Information about ${label}`}
            >
              <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" />
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-lg z-20">
                  {tooltip}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-800" />
                </div>
              )}
            </button>
          )}
        </div>
        <div className="bg-la-sunset-orange/10 dark:bg-la-sunset-orange/20 p-3 rounded-lg">
          <Icon className="w-7 h-7 text-la-sunset-orange" />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-2">
          <p className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">
            <AnimatedNumber value={value} />
          </p>
          <span className="text-sm text-gray-500 dark:text-gray-400">per month</span>
        </div>

        {/* Contextual information */}
        <div className="space-y-1.5 mt-3">
          {/* VS LA Average comparison */}
          {vsAverage && (
            <div className="flex items-center gap-2">
              {trafficLight && <TrafficLight color={trafficLight} size="sm" animated={false} />}
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                {vsAverage}
              </span>
            </div>
          )}

          {/* Percentile ranking */}
          {percentile !== undefined && (
            <div className="flex items-center gap-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                <div
                  style={{ width: `${percentile}%` }}
                  className={`h-1.5 rounded-full transition-all ${
                    percentile >= 70
                      ? 'bg-green-500'
                      : percentile >= 40
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                />
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {percentile}%
              </span>
            </div>
          )}

          {/* Trend indicator */}
          {trend && trendValue && (
            <p
              className={`text-xs font-medium ${
                trend === 'down'
                  ? 'text-green-600 dark:text-green-400'
                  : trend === 'up'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              {trend === 'down' ? '↓' : trend === 'up' ? '↑' : '→'} {trendValue}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
