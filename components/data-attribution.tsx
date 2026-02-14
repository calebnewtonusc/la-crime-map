// Data Attribution Component
// Shows data source and freshness information

'use client'

import { Info } from 'lucide-react'

interface DataAttributionProps {
  lastUpdated?: string | Date
  dataSource?: string
  dateRange?: {
    start: string | Date
    end: string | Date
  }
  totalIncidents?: number
  className?: string
  compact?: boolean
}

export function DataAttribution({
  lastUpdated,
  dataSource = 'LAPD Open Data Portal',
  dateRange,
  totalIncidents,
  className = '',
  compact = false,
}: DataAttributionProps) {
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return 'Unknown'
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (date: string | Date | undefined) => {
    if (!date) return 'Unknown'
    const d = typeof date === 'string' ? new Date(date) : date
    return d.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 ${className}`}>
        <Info className="w-3 h-3" />
        <span>
          Updated: {formatDateTime(lastUpdated)}
        </span>
      </div>
    )
  }

  return (
    <div className={`bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm">
            Data Source
          </h3>
          <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <p>
              <strong>Source:</strong> {dataSource}
            </p>
            {lastUpdated && (
              <p>
                <strong>Last Updated:</strong> {formatDateTime(lastUpdated)}
              </p>
            )}
            {dateRange && (
              <p>
                <strong>Data Period:</strong> {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
              </p>
            )}
            {totalIncidents !== undefined && (
              <p>
                <strong>Total Incidents:</strong> {totalIncidents.toLocaleString()}
              </p>
            )}
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300 mt-2">
            Crime data is sourced from official LAPD records via the{' '}
            <a
              href="https://data.lacity.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-600 dark:hover:text-blue-200"
            >
              LA Open Data Portal
            </a>
            . Neighborhood boundaries from{' '}
            <a
              href="http://maps.latimes.com/neighborhoods/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-600 dark:hover:text-blue-200"
            >
              LA Times Mapping LA
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}

export function DataFreshnessIndicator({
  lastUpdated,
  className = '',
}: {
  lastUpdated?: string | Date
  className?: string
}) {
  if (!lastUpdated) return null

  const date = typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated
  const now = new Date()
  const hoursAgo = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  let status: 'fresh' | 'moderate' | 'stale'
  let statusText: string
  let statusColor: string

  if (hoursAgo < 2) {
    status = 'fresh'
    statusText = 'Just updated'
    statusColor = 'text-green-600 dark:text-green-400'
  } else if (hoursAgo < 24) {
    status = 'moderate'
    statusText = `${hoursAgo}h ago`
    statusColor = 'text-yellow-600 dark:text-yellow-400'
  } else {
    const daysAgo = Math.floor(hoursAgo / 24)
    status = 'stale'
    statusText = `${daysAgo}d ago`
    statusColor = 'text-orange-600 dark:text-orange-400'
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-1.5">
        <div
          className={`w-2 h-2 rounded-full ${
            status === 'fresh'
              ? 'bg-green-500 animate-pulse'
              : status === 'moderate'
              ? 'bg-yellow-500'
              : 'bg-orange-500'
          }`}
        />
        <span className={`text-xs font-medium ${statusColor}`}>{statusText}</span>
      </div>
    </div>
  )
}
