'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, ChevronDown, CheckCircle } from 'lucide-react'
import { NeighborhoodGeoJSON, CrimeMetric } from '@/lib/data/types'
import { metricLabels } from '@/lib/utils/crime-stats'

interface ExportButtonProps {
  data: NeighborhoodGeoJSON
  selectedMetric: CrimeMetric
  dateLabel?: string
  className?: string
}

export function ExportButton({ data, selectedMetric, dateLabel = 'Q4 2024', className = '' }: ExportButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [exported, setExported] = useState(false)

  const downloadCSV = (mode: 'current' | 'all') => {
    const neighborhoods = data.features.map(f => f.properties)

    let headers: string[]
    let rows: string[][]

    if (mode === 'current') {
      headers = ['Neighborhood', metricLabels[selectedMetric], 'Safety Score', 'Risk Level', 'Data Quality', 'Last Updated']
      rows = neighborhoods.map(n => {
        const value = n[selectedMetric]
        const level = value <= 7 ? 'Low' : value <= 14 ? 'Medium' : 'High'
        return [
          n.name,
          String(value),
          n.safetyScore?.toFixed(1) ?? 'N/A',
          level,
          n.hasSufficientData ? 'High' : 'Low',
          n.lastUpdated ? new Date(n.lastUpdated).toLocaleDateString() : 'N/A',
        ]
      })
    } else {
      headers = [
        'Neighborhood',
        'Violent Crime',
        'Car Theft',
        'Break-ins',
        'Petty Theft',
        'Total Crimes',
        'Safety Score',
        'Trend',
        'Data Quality Score',
        'Has Sufficient Data',
        'Last Updated',
      ]
      rows = neighborhoods.map(n => {
        const total = n.violentCrime + n.carTheft + n.breakIns + n.pettyTheft
        return [
          n.name,
          String(n.violentCrime),
          String(n.carTheft),
          String(n.breakIns),
          String(n.pettyTheft),
          String(total),
          n.safetyScore?.toFixed(1) ?? 'N/A',
          n.trendIndicator ?? 'N/A',
          n.dataQualityScore?.toFixed(2) ?? 'N/A',
          n.hasSufficientData ? 'Yes' : 'No',
          n.lastUpdated ? new Date(n.lastUpdated).toLocaleDateString() : 'N/A',
        ]
      })
    }

    // Sort by the primary metric descending
    rows.sort((a, b) => {
      const aVal = parseFloat(a[mode === 'current' ? 1 : 1]) || 0
      const bVal = parseFloat(b[mode === 'current' ? 1 : 1]) || 0
      return bVal - aVal
    })

    const csvContent = [
      `# LA Crime Map Export - ${dateLabel}`,
      `# Generated: ${new Date().toLocaleString()}`,
      `# Source: LAPD Open Data Portal`,
      '',
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `la-crime-data-${mode === 'all' ? 'full' : selectedMetric}-${dateLabel.replace(/\s/g, '-')}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setIsOpen(false)
    setExported(true)
    setTimeout(() => setExported(false), 2500)
  }

  return (
    <div className={`relative ${className}`}>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 border-2 ${
          exported
            ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600 text-green-700 dark:text-green-300'
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
        aria-label="Export data as CSV"
        aria-expanded={isOpen}
      >
        {exported
          ? <CheckCircle className="w-4 h-4 text-green-500" aria-hidden="true" />
          : <Download className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" />
        }
        <span>{exported ? 'Downloaded!' : 'Export CSV'}</span>
        {!exported && (
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-gray-400" aria-hidden="true" />
          </motion.div>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 right-0 w-60 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            role="menu"
          >
            <div className="p-2 space-y-1">
              <button
                onClick={() => downloadCSV('current')}
                className="w-full flex items-start gap-3 px-3 py-3 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                role="menuitem"
              >
                <Download className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {metricLabels[selectedMetric]} Only
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Current metric with safety scores
                  </div>
                </div>
              </button>

              <button
                onClick={() => downloadCSV('all')}
                className="w-full flex items-start gap-3 px-3 py-3 rounded-lg text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                role="menuitem"
              >
                <Download className="w-4 h-4 text-purple-500 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Full Dataset
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    All crime types, trends, quality scores
                  </div>
                </div>
              </button>
            </div>

            <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {data.features.length} neighborhoods included
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  )
}
