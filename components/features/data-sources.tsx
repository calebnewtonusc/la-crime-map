'use client'

import { motion } from 'framer-motion'
import { Database, Clock, RefreshCw, AlertCircle, ExternalLink, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'

interface DataSourcesProps {
  className?: string
  compact?: boolean
}

export function DataSources({ className = '', compact = false }: DataSourcesProps) {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [nextUpdate, setNextUpdate] = useState<Date>(new Date())

  useEffect(() => {
    // Simulate last update time (in production, fetch from API)
    const now = new Date()
    const last = new Date(now.getTime() - 2 * 60 * 60 * 1000) // 2 hours ago
    const next = new Date(now.getTime() + 22 * 60 * 60 * 1000) // 22 hours from now

    setLastUpdated(last)
    setNextUpdate(next)
  }, [])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date)
  }

  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else {
      return 'Less than an hour ago'
    }
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`flex flex-wrap items-center gap-4 text-xs text-gray-600 dark:text-dark-text-tertiary ${className}`}
      >
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Updated {formatRelativeTime(lastUpdated)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5" />
          <span>Source: LAPD Open Data</span>
        </div>
        <div className="flex items-center gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Updates daily</span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden ${className}`}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 p-6">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Data Sources</h3>
            <p className="text-blue-100 text-sm mt-0.5">Where our data comes from</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">

        {/* Primary Source */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-dark-text-primary flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            Primary Data Source
          </h4>
          <a
            href="https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:border-blue-300 dark:hover:border-blue-700 transition-colors group"
          >
            <div className="flex-shrink-0">
              <img
                src="https://data.lacity.org/api/assets/4F29C3B0-0E48-4B67-B8B9-09185EF4BDDF"
                alt="LA Police Department"
                className="w-12 h-12 rounded object-contain bg-white p-1"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-blue-900 dark:text-blue-100 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                LA Police Department Open Data Portal
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                Crime Data from 2020 to Present
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          </a>
        </div>

        {/* Update Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Last Updated</span>
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">
              {formatRelativeTime(lastUpdated)}
            </div>
            <div className="text-xs text-gray-600 dark:text-dark-text-tertiary mt-1">
              {formatDate(lastUpdated)}
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-dark-bg-tertiary rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-dark-text-secondary">Update Frequency</span>
            </div>
            <div className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">
              Every 24 hours
            </div>
            <div className="text-xs text-gray-600 dark:text-dark-text-tertiary mt-1">
              Next: {formatDate(nextUpdate)}
            </div>
          </div>
        </div>

        {/* Data Processing Pipeline */}
        <div className="space-y-3">
          <h4 className="font-semibold text-gray-900 dark:text-dark-text-primary">
            Data Processing Pipeline
          </h4>
          <div className="space-y-2">
            <ProcessStep number={1} title="Data Collection" description="Crime reports from LAPD Open Data API" />
            <ProcessStep number={2} title="Validation" description="Quality checks and data cleaning" />
            <ProcessStep number={3} title="Geocoding" description="Location mapping to neighborhoods" />
            <ProcessStep number={4} title="Aggregation" description="Statistical analysis and scoring" />
            <ProcessStep number={5} title="Visualization" description="Real-time map updates" />
          </div>
        </div>

        {/* Methodology Link */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <a
            href="#methodology"
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center gap-1"
          >
            View detailed methodology
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h5 className="font-semibold text-amber-900 dark:text-amber-100 text-sm">
                Data Accuracy Disclaimer
              </h5>
              <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                This visualization uses official LAPD data but presents simplified metrics for educational purposes.
                Crime statistics are complex and influenced by many factors including reporting rates, population density,
                and socioeconomic conditions. Always consult official sources and local authorities for comprehensive safety information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

interface ProcessStepProps {
  number: number
  title: string
  description: string
}

function ProcessStep({ number, title, description }: ProcessStepProps) {
  return (
    <div className="flex items-start gap-3 p-3 bg-white dark:bg-dark-bg-primary border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex-shrink-0 w-6 h-6 bg-blue-600 dark:bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
        {number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 dark:text-dark-text-primary text-sm">
          {title}
        </div>
        <div className="text-xs text-gray-600 dark:text-dark-text-tertiary mt-0.5">
          {description}
        </div>
      </div>
    </div>
  )
}
