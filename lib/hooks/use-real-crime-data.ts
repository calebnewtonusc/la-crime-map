// React Hook: Use Real Crime Data
// Fetches and manages real crime data from the API

import { useState, useEffect } from 'react'
import { NeighborhoodCrimeData } from '../services/lapd-api-types'

export interface RealCrimeDataState {
  neighborhoods: NeighborhoodCrimeData[]
  metadata: {
    totalIncidents: number
    dateRange: {
      start: string
      end: string
    }
    lastUpdated: string
    dataSource: string
    neighborhoods: number
    dataQuality: {
      mappedIncidents: number
      unmappedIncidents: number
      percentageMapped: number
    }
  } | null
  loading: boolean
  error: string | null
}

export interface UseRealCrimeDataOptions {
  days?: number
  startDate?: Date
  endDate?: Date
  autoFetch?: boolean
}

/**
 * Hook to fetch and manage real crime data
 */
export function useRealCrimeData(options: UseRealCrimeDataOptions = {}) {
  const { days = 365, startDate, endDate, autoFetch = true } = options

  const [state, setState] = useState<RealCrimeDataState>({
    neighborhoods: [],
    metadata: null,
    loading: false,
    error: null,
  })

  const fetchData = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      let url = '/api/crime-data?'

      if (startDate && endDate) {
        url += `startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      } else {
        url += `days=${days}`
      }

      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setState({
        neighborhoods: data.neighborhoods || [],
        metadata: data.metadata || null,
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error('Error fetching real crime data:', error)
      setState({
        neighborhoods: [],
        metadata: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  const refresh = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch('/api/crime-data/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ days }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setState({
        neighborhoods: data.neighborhoods || [],
        metadata: data.metadata || null,
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error('Error refreshing crime data:', error)
      setState({
        neighborhoods: [],
        metadata: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  }

  useEffect(() => {
    if (autoFetch) {
      fetchData()
    }
  }, [days, startDate, endDate, autoFetch])

  return {
    ...state,
    refetch: fetchData,
    refresh,
  }
}

/**
 * Get crime data for a specific neighborhood
 */
export function useNeighborhoodCrimeData(neighborhoodName: string, options: UseRealCrimeDataOptions = {}) {
  const { neighborhoods, metadata, loading, error, refetch, refresh } = useRealCrimeData(options)

  const neighborhoodData = neighborhoods.find(
    (n) => n.neighborhoodName.toLowerCase() === neighborhoodName.toLowerCase()
  )

  return {
    data: neighborhoodData || null,
    metadata,
    loading,
    error,
    refetch,
    refresh,
  }
}
