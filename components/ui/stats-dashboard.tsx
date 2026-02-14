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
          className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Neighborhoods</span>
            <MapPin className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalNeighborhoods}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Areas tracked</p>
        </motion.div>

        {/* Total Incidents */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Incidents</span>
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCrimes.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Per month avg</p>
        </motion.div>

        {/* Avg Violent Crime */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Violent Crime</span>
            <Shield className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.avgViolentCrime}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Per neighborhood</p>
        </motion.div>

        {/* Avg Car Theft */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-dark-bg-secondary rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Car Theft</span>
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.avgCarTheft}</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Per neighborhood</p>
        </motion.div>
      </div>

      {/* Neighborhood Highlights - Prominent cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Safest Neighborhood */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-900/20 rounded-2xl p-8 border-2 border-emerald-200 dark:border-emerald-800/50 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-500 rounded-xl shadow-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Safest Area</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.safestNeighborhood}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Lowest overall crime rate in Los Angeles</p>
          </div>
        </motion.div>

        {/* Highest Crime Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="relative overflow-hidden bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950/30 dark:to-rose-900/20 rounded-2xl p-8 border-2 border-red-200 dark:border-red-800/50 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full -mr-16 -mt-16" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500 rounded-xl shadow-lg">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Highest Crime Area</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.mostDangerous}</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Highest overall crime rate in Los Angeles</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
