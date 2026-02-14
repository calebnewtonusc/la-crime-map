'use client'

import { motion } from 'framer-motion'
import { LucideIcon, Info, TrendingUp, TrendingDown, Minus } from 'lucide-react'
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
  vsAverage?: string
  percentile?: number
  trafficLight?: 'green' | 'yellow' | 'red'
  tooltip?: string
  className?: string
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
  tooltip,
  className = ''
}: MetricCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={`bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-card p-lg shadow-card hover:shadow-card-hover transition-all duration-200 relative ${className}`}
    >
      <div className="flex items-start justify-between mb-md gap-sm">
        <div className="flex items-center gap-xs flex-1">
          <h3 className="text-body-sm text-gray-600 dark:text-dark-text-secondary font-semibold">
            {label}
          </h3>
          {tooltip && (
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              className="relative p-xxs rounded-button focus:outline-none focus:ring-2 focus:ring-la-sunset-orange dark:focus:ring-la-sunset-pink flex-shrink-0"
              aria-label={`Information about ${label}`}
            >
              <Info className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200" aria-hidden="true" />
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-sm w-64 p-sm bg-gray-900 dark:bg-gray-800 text-white text-body-xs rounded-button shadow-elevated z-50 pointer-events-none"
                >
                  {tooltip}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-px w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900 dark:border-t-gray-800" />
                </motion.div>
              )}
            </button>
          )}
        </div>
        <div className="bg-gradient-to-br from-la-sunset-orange/10 to-la-sunset-pink/10 dark:from-la-sunset-orange/20 dark:to-la-sunset-pink/20 p-sm rounded-button transition-colors duration-200 flex-shrink-0">
          <Icon className="w-6 h-6 text-la-sunset-orange" aria-hidden="true" />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-baseline gap-xs mb-sm">
          <p className="text-display-sm font-bold text-gray-900 dark:text-dark-text-primary tabular-nums">
            <AnimatedNumber value={value} ariaLabel={`${label}: ${value}`} />
          </p>
          <span className="text-body-xs text-gray-500 dark:text-gray-400 font-medium">per month</span>
        </div>

        {/* Contextual information */}
        <div className="space-y-xs mt-sm">
          {/* VS LA Average comparison */}
          {vsAverage && (
            <div className="flex items-center gap-xs">
              {trafficLight && <TrafficLight color={trafficLight} size="sm" animated={false} />}
              <span className="text-body-xs font-medium text-gray-600 dark:text-gray-400">
                {vsAverage}
              </span>
            </div>
          )}

          {/* Percentile ranking */}
          {percentile !== undefined && (
            <div className="flex items-center gap-xs">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-badge h-1.5">
                <div
                  style={{ width: `${percentile}%` }}
                  className={`h-1.5 rounded-badge transition-all duration-300 ${
                    percentile >= 70
                      ? 'bg-status-success'
                      : percentile >= 40
                      ? 'bg-status-warning'
                      : 'bg-status-error'
                  }`}
                />
              </div>
              <span className="text-body-xs text-gray-500 dark:text-gray-400 whitespace-nowrap font-medium">
                {percentile}%
              </span>
            </div>
          )}

          {/* Trend indicator */}
          {trend && trendValue && (
            <div
              className={`flex items-center gap-xs text-body-xs font-semibold ${
                trend === 'down'
                  ? 'text-status-success'
                  : trend === 'up'
                  ? 'text-status-error'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <TrendIcon className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
