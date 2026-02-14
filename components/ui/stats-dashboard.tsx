'use client'

import { motion } from 'framer-motion'
import { MapPin, BarChart3, TrendingDown, TrendingUp } from 'lucide-react'
import { MetricCard } from './metric-card'
import { CrimeStats } from '@/lib/data/types'

interface StatsDashboardProps {
  stats: CrimeStats
}

export function StatsDashboard({ stats }: StatsDashboardProps) {
  const metrics = [
    {
      label: 'Total Neighborhoods',
      value: stats.totalNeighborhoods,
      icon: MapPin,
      delay: 0,
    },
    {
      label: 'Total Incidents',
      value: stats.totalCrimes,
      icon: BarChart3,
      delay: 0.1,
    },
    {
      label: 'Avg Violent Crime',
      value: stats.avgViolentCrime,
      icon: TrendingUp,
      delay: 0.2,
    },
    {
      label: 'Avg Car Theft',
      value: stats.avgCarTheft,
      icon: TrendingDown,
      delay: 0.3,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      {/* Neighborhood Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-green-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-green-500 p-2 rounded-lg">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">
              Safest Area
            </h3>
          </div>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">
            {stats.safestNeighborhood}
          </p>
          <p className="text-sm text-gray-600 dark:text-dark-text-tertiary mt-1">
            Lowest overall crime rate
          </p>
        </div>

        <div className="bg-red-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-red-500 p-2 rounded-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">
              Highest Crime Area
            </h3>
          </div>
          <p className="text-2xl font-bold text-red-700 dark:text-red-400">
            {stats.mostDangerous}
          </p>
          <p className="text-sm text-gray-600 dark:text-dark-text-tertiary mt-1">
            Highest overall crime rate
          </p>
        </div>
      </div>
    </div>
  )
}
