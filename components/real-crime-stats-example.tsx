// Example Component: Real Crime Statistics
// Demonstrates how to use real LAPD crime data in UI components

'use client'

import { useRealCrimeData } from '@/lib/hooks/use-real-crime-data'
import { DataAttribution, DataFreshnessIndicator } from './data-attribution'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export function RealCrimeStatsExample() {
  const { neighborhoods, metadata, loading, error, refetch, refresh } = useRealCrimeData({
    days: 365,
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
          <span className="text-gray-700 dark:text-gray-300">
            Loading real crime data from LAPD...
          </span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">
              Error Loading Crime Data
            </h3>
            <p className="text-sm text-red-800 dark:text-red-200 mb-4">{error}</p>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!metadata) {
    return null
  }

  // Calculate top 5 safest and most dangerous neighborhoods
  const sortedByTotal = [...neighborhoods].sort((a, b) => a.totalCrimes - b.totalCrimes)
  const safestFive = sortedByTotal.slice(0, 5)
  const mostDangerousFive = sortedByTotal.slice(-5).reverse()

  // Calculate totals
  const totals = neighborhoods.reduce(
    (acc, n) => ({
      violent: acc.violent + n.violentCrime,
      carTheft: acc.carTheft + n.carTheft,
      breakIns: acc.breakIns + n.breakIns,
      pettyTheft: acc.pettyTheft + n.pettyTheft,
      total: acc.total + n.totalCrimes,
    }),
    { violent: 0, carTheft: 0, breakIns: 0, pettyTheft: 0, total: 0 }
  )

  return (
    <div className="space-y-6">
      {/* Header with Data Freshness */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Real Crime Statistics
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Official data from LAPD Open Data Portal
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DataFreshnessIndicator lastUpdated={metadata.lastUpdated} />
          <button
            onClick={refresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Data Attribution */}
      <DataAttribution
        lastUpdated={metadata.lastUpdated}
        dataSource={metadata.dataSource}
        dateRange={metadata.dateRange}
        totalIncidents={metadata.totalIncidents}
      />

      {/* Key Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Violent Crime"
          value={totals.violent}
          color="red"
        />
        <StatCard
          title="Car Theft"
          value={totals.carTheft}
          color="orange"
        />
        <StatCard
          title="Break-ins"
          value={totals.breakIns}
          color="yellow"
        />
        <StatCard
          title="Petty Theft"
          value={totals.pettyTheft}
          color="blue"
        />
      </div>

      {/* Data Quality */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
          Data Quality
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-600 dark:text-gray-400">Total Incidents</div>
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {metadata.totalIncidents.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-gray-600 dark:text-gray-400">Mapped to Neighborhoods</div>
            <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {metadata.dataQuality.mappedIncidents.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-gray-600 dark:text-gray-400">Coverage</div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              {metadata.dataQuality.percentageMapped.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Safest */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
          5 Safest Neighborhoods
        </h3>
        <div className="space-y-2">
          {safestFive.map((n, idx) => (
            <div
              key={n.neighborhoodName}
              className="flex items-center justify-between bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {n.neighborhoodName}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {n.totalCrimes} incidents
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top 5 Most Dangerous */}
      <div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
          5 Highest Crime Neighborhoods
        </h3>
        <div className="space-y-2">
          {mostDangerousFive.map((n, idx) => (
            <div
              key={n.neighborhoodName}
              className="flex items-center justify-between bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">
                  {n.neighborhoodName}
                </span>
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {n.totalCrimes} incidents
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string
  value: number
  color: 'red' | 'orange' | 'yellow' | 'blue'
}) {
  const colorClasses = {
    red: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100',
    orange:
      'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-100',
    yellow:
      'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100',
    blue: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100',
  }

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="text-sm font-medium opacity-80 mb-1">{title}</div>
      <div className="text-2xl font-bold">{value.toLocaleString()}</div>
    </div>
  )
}
