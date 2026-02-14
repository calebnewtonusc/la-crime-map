'use client'

import { motion } from 'framer-motion'
import { MapPin, BarChart3, Shield, AlertCircle, TrendingUp } from 'lucide-react'
import { CrimeStats } from '@/lib/data/types'

interface StatsDashboardProps {
  stats: CrimeStats
  className?: string
}

export function StatsDashboard({ stats, className = '' }: StatsDashboardProps) {
  return (
    <div className={`space-y-8 ${className}`}>
      {/* Key Stats Grid - Clean 2x2 layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Neighborhoods */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Neighborhoods</span>
            <MapPin className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{stats.totalNeighborhoods}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Areas tracked</p>
        </motion.div>

        {/* Total Incidents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Incidents</span>
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{stats.totalCrimes.toLocaleString()}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">Per month avg</p>
        </motion.div>

        {/* Avg Violent Crime with Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Avg Violent Crime</span>
            <Shield className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{stats.avgViolentCrime}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Per neighborhood • Median: {stats.medianViolentCrime}
          </p>
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Range: {stats.percentile25ViolentCrime}-{stats.percentile75ViolentCrime} (middle 50%)
            </p>
          </div>
        </motion.div>

        {/* Avg Car Theft with Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Avg Car Theft</span>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{stats.avgCarTheft}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Per neighborhood • Median: {stats.medianCarTheft}
          </p>
          <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Range: {stats.percentile25CarTheft}-{stats.percentile75CarTheft} (middle 50%)
            </p>
          </div>
        </motion.div>
      </div>

      {/* Neighborhood Highlights - Prominent cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Safest Neighborhood */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 border-2 border-emerald-200 dark:border-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center gap-4 mb-5">
              <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400 mb-1">Safest Area</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.safestNeighborhood}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">Lowest overall crime rate in Los Angeles</p>
          </div>
        </motion.div>

        {/* Highest Crime Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-br from-red-50 to-rose-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-8 border-2 border-red-200 dark:border-red-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center gap-4 mb-5">
              <div className="p-3 bg-red-500 rounded-xl shadow-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-red-700 dark:text-red-400 mb-1">Highest Crime Area</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.mostDangerous}</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">Highest overall crime rate in Los Angeles</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
