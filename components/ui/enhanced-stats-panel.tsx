'use client'

import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from 'recharts'
import { MapPin, BarChart3, Shield, AlertCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { CrimeStats, NeighborhoodGeoJSON, CrimeMetric } from '@/lib/data/types'
import { metricLabels } from '@/lib/utils/crime-stats'

interface EnhancedStatsPanelProps {
  stats: CrimeStats
  data: NeighborhoodGeoJSON
  selectedMetric: CrimeMetric
  className?: string
}

const COLORS = {
  violentCrime: '#dc2626',
  carTheft: '#3b82f6',
  breakIns: '#f59e0b',
  pettyTheft: '#8b5cf6',
}

const PIE_COLORS = ['#dc2626', '#3b82f6', '#f59e0b', '#8b5cf6']

// Custom tooltip for recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg px-3 py-2.5 text-xs">
        <p className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }} className="font-medium">
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function EnhancedStatsPanel({ stats, data, selectedMetric, className = '' }: EnhancedStatsPanelProps) {
  const neighborhoods = data.features.map(f => f.properties)

  // Distribution data for bar chart (top 15 by selected metric)
  const topNeighborhoods = [...neighborhoods]
    .sort((a, b) => b[selectedMetric] - a[selectedMetric])
    .slice(0, 15)
    .map(n => ({
      name: n.name.length > 12 ? n.name.slice(0, 12) + '…' : n.name,
      fullName: n.name,
      value: n[selectedMetric],
    }))

  // Crime type breakdown (pie chart)
  const crimeBreakdown = [
    { name: 'Violent Crime', value: stats.avgViolentCrime, color: PIE_COLORS[0] },
    { name: 'Car Theft', value: stats.avgCarTheft, color: PIE_COLORS[1] },
    { name: 'Break-ins', value: stats.avgBreakIns, color: PIE_COLORS[2] },
    { name: 'Petty Theft', value: stats.avgPettyTheft, color: PIE_COLORS[3] },
  ]

  const totalAvg = crimeBreakdown.reduce((s, c) => s + c.value, 0)

  // Risk distribution
  const low = neighborhoods.filter(n => n[selectedMetric] <= (selectedMetric === 'violentCrime' ? 5 : selectedMetric === 'carTheft' ? 7 : selectedMetric === 'breakIns' ? 9 : 13)).length
  const high = neighborhoods.filter(n => n[selectedMetric] > (selectedMetric === 'violentCrime' ? 8 : selectedMetric === 'carTheft' ? 11 : selectedMetric === 'breakIns' ? 14 : 19)).length
  const medium = neighborhoods.length - low - high

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Neighborhoods</span>
            <MapPin className="w-4 h-4 text-blue-500" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalNeighborhoods}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">tracked areas</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Total Incidents</span>
            <BarChart3 className="w-4 h-4 text-purple-500" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{stats.totalCrimes.toLocaleString()}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">all crime types</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Low Risk Areas</span>
            <Shield className="w-4 h-4 text-green-500" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{low}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{Math.round(low / neighborhoods.length * 100)}% of total</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">High Risk Areas</span>
            <AlertCircle className="w-4 h-4 text-red-500" aria-hidden="true" />
          </div>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{high}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{Math.round(high / neighborhoods.length * 100)}% of total</p>
        </motion.div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar chart: Top neighborhoods */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                Top 15 — {metricLabels[selectedMetric]}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Highest incident counts</p>
            </div>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[selectedMetric] }}
              aria-hidden="true"
            />
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topNeighborhoods} margin={{ top: 4, right: 8, left: -20, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" className="dark:opacity-20" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 9, fill: '#6b7280' }}
                angle={-45}
                textAnchor="end"
                interval={0}
                height={55}
              />
              <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" name={metricLabels[selectedMetric]} radius={[3, 3, 0, 0]}>
                {topNeighborhoods.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[selectedMetric]}
                    opacity={1 - index * 0.04}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie chart: Crime type breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="mb-4">
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">Crime Breakdown</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Average per neighborhood</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie
                data={crimeBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={72}
                paddingAngle={2}
                dataKey="value"
              >
                {crimeBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value ?? 0} avg`]}
                contentStyle={{ fontSize: '11px' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {crimeBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} aria-hidden="true" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="text-xs font-semibold text-gray-900 dark:text-gray-100">
                  {totalAvg > 0 ? Math.round(item.value / totalAvg * 100) : 0}%
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Risk distribution bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">Risk Distribution</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {metricLabels[selectedMetric]} across {neighborhoods.length} neighborhoods
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" aria-hidden="true" />
              <span className="text-gray-600 dark:text-gray-400">Low: {low}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" aria-hidden="true" />
              <span className="text-gray-600 dark:text-gray-400">Medium: {medium}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" aria-hidden="true" />
              <span className="text-gray-600 dark:text-gray-400">High: {high}</span>
            </div>
          </div>
        </div>
        <div className="flex h-5 rounded-full overflow-hidden gap-0.5" role="img" aria-label={`Risk distribution: ${low} low, ${medium} medium, ${high} high`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(low / neighborhoods.length) * 100}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="bg-green-500 h-full"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(medium / neighborhoods.length) * 100}%` }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="bg-amber-500 h-full"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(high / neighborhoods.length) * 100}%` }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="bg-red-500 h-full"
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Safer</span>
          <span>More Incidents</span>
        </div>
      </motion.div>

      {/* Safest / Most Dangerous prominently */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52 }}
          className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-green-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border-2 border-emerald-200 dark:border-emerald-700 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-emerald-500 rounded-xl shadow">
              <Shield className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Safest Neighborhood</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.safestNeighborhood}</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Lowest weighted crime score in LA</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.58 }}
          className="relative overflow-hidden bg-gradient-to-br from-red-50 to-rose-100 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-6 border-2 border-red-200 dark:border-red-700 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-red-500 rounded-xl shadow">
              <AlertCircle className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-red-700 dark:text-red-400">Highest Crime Area</p>
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{stats.mostDangerous}</p>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-300">Highest weighted crime score in LA</p>
        </motion.div>
      </div>
    </div>
  )
}
