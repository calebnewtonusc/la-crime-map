'use client'

import { motion } from 'framer-motion'
import { MapPin, BarChart3, Shield, AlertCircle } from 'lucide-react'
import { MetricCard } from './metric-card'
import { CrimeStats } from '@/lib/data/types'

interface StatsDashboardProps {
  stats: CrimeStats
  className?: string
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
}

export function StatsDashboard({ stats, className = '' }: StatsDashboardProps) {
  const metrics = [
    {
      label: 'Total Neighborhoods',
      value: stats.totalNeighborhoods,
      icon: MapPin,
      delay: 0,
      tooltip: 'Total number of neighborhoods tracked in Los Angeles County'
    },
    {
      label: 'Total Incidents',
      value: stats.totalCrimes,
      icon: BarChart3,
      delay: 0.05,
      tooltip: 'Combined total of all crime incidents across all neighborhoods'
    },
    {
      label: 'Avg Violent Crime',
      value: stats.avgViolentCrime,
      icon: Shield,
      delay: 0.1,
      tooltip: 'Average number of violent crime incidents per neighborhood'
    },
    {
      label: 'Avg Car Theft',
      value: stats.avgCarTheft,
      icon: AlertCircle,
      delay: 0.15,
      tooltip: 'Average number of vehicle theft incidents per neighborhood'
    },
  ]

  return (
    <div className={`space-y-lg ${className}`}>
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md lg:gap-lg">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      {/* Neighborhood Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-md lg:gap-lg">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-card p-lg shadow-card hover:shadow-card-hover transition-shadow duration-200"
        >
          <div className="flex items-center gap-sm mb-md">
            <div className="bg-green-500 p-sm rounded-button shadow-sm">
              <Shield className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-heading-md font-bold text-gray-900 dark:text-dark-text-primary">
              Safest Neighborhood
            </h3>
          </div>
          <p className="text-display-sm font-bold text-green-700 dark:text-green-400 mb-xs">
            {stats.safestNeighborhood}
          </p>
          <p className="text-body-sm font-medium text-gray-600 dark:text-dark-text-tertiary">
            Lowest overall crime rate in Los Angeles
          </p>
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={cardVariants}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-200 dark:border-red-800 rounded-card p-lg shadow-card hover:shadow-card-hover transition-shadow duration-200"
        >
          <div className="flex items-center gap-sm mb-md">
            <div className="bg-red-500 p-sm rounded-button shadow-sm">
              <AlertCircle className="w-6 h-6 text-white" aria-hidden="true" />
            </div>
            <h3 className="text-heading-md font-bold text-gray-900 dark:text-dark-text-primary">
              Highest Crime Area
            </h3>
          </div>
          <p className="text-display-sm font-bold text-red-700 dark:text-red-400 mb-xs">
            {stats.mostDangerous}
          </p>
          <p className="text-body-sm font-medium text-gray-600 dark:text-dark-text-tertiary">
            Highest overall crime rate in Los Angeles
          </p>
        </motion.div>
      </div>
    </div>
  )
}
