'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import type {
  NeighborhoodGeoJSON,
  CrimeStats,
  CrimeMetric,
  NeighborhoodData,
  DateRange,
} from '../data/types'
import { calculateCrimeStats, getNeighborhoodCrimeLevel } from '../utils/crime-stats'

/**
 * Configuration options for the crime stats hook
 */
export type UseCrimeStatsOptions = {
  /** Auto-refresh interval in milliseconds (0 = disabled) */
  refreshInterval?: number
  /** Enable automatic data refresh */
  autoRefresh?: boolean
  /** Filter neighborhoods by minimum data quality score */
  minDataQuality?: number
  /** Include only neighborhoods with sufficient data */
  requireSufficientData?: boolean
}

/**
 * Return type for the crime stats hook
 */
export type UseCrimeStatsReturn = {
  /** Computed crime statistics */
  stats: CrimeStats | null
  /** Filtered neighborhood data */
  neighborhoods: NeighborhoodData[]
  /** Loading state */
  isLoading: boolean
  /** Error state */
  error: Error | null
  /** Refresh data manually */
  refresh: () => Promise<void>
  /** Get crime level for a specific neighborhood and metric */
  getCrimeLevel: (neighborhood: NeighborhoodData, metric: CrimeMetric) => 'low' | 'medium' | 'high'
  /** Get top N safest neighborhoods */
  getSafestNeighborhoods: (n?: number) => NeighborhoodData[]
  /** Get top N most dangerous neighborhoods */
  getMostDangerousNeighborhoods: (n?: number) => NeighborhoodData[]
  /** Get neighborhoods sorted by a specific metric */
  getNeighborhoodsByMetric: (metric: CrimeMetric, ascending?: boolean) => NeighborhoodData[]
  /** Search neighborhoods by name */
  searchNeighborhoods: (query: string) => NeighborhoodData[]
}

/**
 * Custom hook for managing and analyzing crime statistics
 *
 * @param data - Raw GeoJSON crime data (can be null during loading)
 * @param options - Configuration options
 * @returns Crime statistics and utility functions
 *
 * @example
 * ```tsx
 * const { stats, neighborhoods, getCrimeLevel, getSafestNeighborhoods } = useCrimeStats(crimeData, {
 *   refreshInterval: 60000, // Refresh every minute
 *   minDataQuality: 0.7,
 * })
 * ```
 */
export function useCrimeStats(
  data: NeighborhoodGeoJSON | null,
  options?: UseCrimeStatsOptions
): UseCrimeStatsReturn {
  const {
    refreshInterval = 0,
    autoRefresh = false,
    minDataQuality = 0,
    requireSufficientData = false,
  } = options || {}

  const [isLoading, setIsLoading] = useState(!data)
  const [error, setError] = useState<Error | null>(null)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Filter neighborhoods based on data quality requirements
  const neighborhoods = useMemo(() => {
    if (!data) return []

    try {
      return data.features
        .map((feature) => feature.properties)
        .filter((neighborhood) => {
          if (requireSufficientData && !neighborhood.hasSufficientData) {
            return false
          }
          if (minDataQuality > 0 && neighborhood.dataQualityScore < minDataQuality) {
            return false
          }
          return true
        })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to process neighborhood data'))
      return []
    }
  }, [data, minDataQuality, requireSufficientData, refreshTrigger])

  // Calculate statistics
  const stats = useMemo(() => {
    if (!data) return null

    try {
      return calculateCrimeStats(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to calculate crime statistics'))
      return null
    }
  }, [data, refreshTrigger])

  // Get crime level for a neighborhood
  const getCrimeLevel = useCallback(
    (neighborhood: NeighborhoodData, metric: CrimeMetric) => {
      return getNeighborhoodCrimeLevel(neighborhood, metric)
    },
    []
  )

  // Get safest neighborhoods
  const getSafestNeighborhoods = useCallback(
    (n: number = 5): NeighborhoodData[] => {
      return [...neighborhoods]
        .sort((a, b) => {
          const totalA = a.violentCrime + a.carTheft + a.breakIns + a.pettyTheft
          const totalB = b.violentCrime + b.carTheft + b.breakIns + b.pettyTheft
          return totalA - totalB
        })
        .slice(0, n)
    },
    [neighborhoods]
  )

  // Get most dangerous neighborhoods
  const getMostDangerousNeighborhoods = useCallback(
    (n: number = 5): NeighborhoodData[] => {
      return [...neighborhoods]
        .sort((a, b) => {
          const totalA = a.violentCrime + a.carTheft + a.breakIns + a.pettyTheft
          const totalB = b.violentCrime + b.carTheft + b.breakIns + b.pettyTheft
          return totalB - totalA
        })
        .slice(0, n)
    },
    [neighborhoods]
  )

  // Get neighborhoods sorted by metric
  const getNeighborhoodsByMetric = useCallback(
    (metric: CrimeMetric, ascending: boolean = true): NeighborhoodData[] => {
      return [...neighborhoods].sort((a, b) => {
        const valueA = a[metric]
        const valueB = b[metric]
        return ascending ? valueA - valueB : valueB - valueA
      })
    },
    [neighborhoods]
  )

  // Search neighborhoods by name
  const searchNeighborhoods = useCallback(
    (query: string): NeighborhoodData[] => {
      if (!query.trim()) return neighborhoods

      const lowercaseQuery = query.toLowerCase().trim()
      return neighborhoods.filter((neighborhood) =>
        neighborhood.name.toLowerCase().includes(lowercaseQuery)
      )
    },
    [neighborhoods]
  )

  // Manual refresh function
  const refresh = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      // Trigger re-computation by incrementing trigger
      setRefreshTrigger((prev) => prev + 1)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to refresh data'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh || refreshInterval <= 0) return

    const intervalId = setInterval(() => {
      refresh()
    }, refreshInterval)

    return () => {
      clearInterval(intervalId)
    }
  }, [autoRefresh, refreshInterval, refresh])

  // Update loading state when data changes
  useEffect(() => {
    if (data) {
      setIsLoading(false)
    }
  }, [data])

  return {
    stats,
    neighborhoods,
    isLoading,
    error,
    refresh,
    getCrimeLevel,
    getSafestNeighborhoods,
    getMostDangerousNeighborhoods,
    getNeighborhoodsByMetric,
    searchNeighborhoods,
  }
}

/**
 * Hook for managing selected crime metric with filtering
 *
 * @param data - Crime data
 * @param initialMetric - Initial metric to display
 * @returns Selected metric state and filtered data
 */
export function useCrimeMetric(
  data: NeighborhoodGeoJSON | null,
  initialMetric: CrimeMetric = 'violentCrime'
) {
  const [selectedMetric, setSelectedMetric] = useState<CrimeMetric>(initialMetric)

  // Get neighborhoods sorted by selected metric
  const sortedNeighborhoods = useMemo(() => {
    if (!data) return []

    return [...data.features]
      .map((feature) => feature.properties)
      .sort((a, b) => b[selectedMetric] - a[selectedMetric])
  }, [data, selectedMetric])

  // Get metric statistics
  const metricStats = useMemo(() => {
    if (!data || sortedNeighborhoods.length === 0) {
      return {
        min: 0,
        max: 0,
        average: 0,
        median: 0,
        total: 0,
      }
    }

    const values = sortedNeighborhoods.map((n) => n[selectedMetric])
    const total = values.reduce((sum, val) => sum + val, 0)
    const sorted = [...values].sort((a, b) => a - b)
    const median =
      sorted.length % 2 === 0
        ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
        : sorted[Math.floor(sorted.length / 2)]

    return {
      min: Math.min(...values),
      max: Math.max(...values),
      average: total / values.length,
      median,
      total,
    }
  }, [data, selectedMetric, sortedNeighborhoods])

  return {
    selectedMetric,
    setSelectedMetric,
    sortedNeighborhoods,
    metricStats,
  }
}

/**
 * Hook for tracking crime trends over time
 *
 * @param data - Crime data
 * @param dateRange - Time range to analyze
 * @returns Trend analysis data
 */
export function useCrimeTrends(data: NeighborhoodGeoJSON | null, dateRange: DateRange = '1month') {
  const trends = useMemo(() => {
    if (!data) return null

    const neighborhoods = data.features.map((f) => f.properties)

    // Calculate overall trend indicators
    const trendCounts = {
      improving: 0,
      worsening: 0,
      stable: 0,
      insufficient_data: 0,
    }

    neighborhoods.forEach((n) => {
      trendCounts[n.trendIndicator]++
    })

    const totalWithData = neighborhoods.filter((n) => n.hasSufficientData).length
    const averageTrendConfidence =
      totalWithData > 0
        ? neighborhoods.reduce((sum, n) => sum + n.trendConfidence, 0) / totalWithData
        : 0

    return {
      trendCounts,
      totalNeighborhoods: neighborhoods.length,
      neighborhoodsWithData: totalWithData,
      averageTrendConfidence,
      dateRange,
    }
  }, [data, dateRange])

  return trends
}
