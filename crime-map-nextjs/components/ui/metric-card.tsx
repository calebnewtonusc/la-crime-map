'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { AnimatedNumber } from './animated-number'

interface MetricCardProps {
  label: string
  value: number
  icon: LucideIcon
  delay?: number
  trend?: 'up' | 'down' | 'neutral'
  trendValue?: string
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  delay = 0,
  trend,
  trendValue
}: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 dark:text-dark-text-secondary mb-2 font-medium">
            {label}
          </p>
          <p className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">
            <AnimatedNumber value={value} />
          </p>
          {trend && trendValue && (
            <p
              className={`text-xs mt-2 font-medium ${
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
        <div className="bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 dark:from-neon-cyan/20 dark:to-neon-purple/20 p-3 rounded-lg">
          <Icon className="w-7 h-7 text-neon-cyan dark:text-neon-purple" />
        </div>
      </div>
    </motion.div>
  )
}
