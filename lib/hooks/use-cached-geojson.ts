'use client'

import { useState, useEffect } from 'react'

const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds

interface CacheItem<T> {
  data: T
  timestamp: number
}

/**
 * Custom hook for caching GeoJSON data in localStorage
 * Reduces network requests and improves performance
 */
export function useCachedGeoJSON<T>(key: string, fetchFn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to get from cache first
        const cached = getCachedData<T>(key)
        if (cached) {
          setData(cached)
          setLoading(false)
          return
        }

        // Fetch fresh data
        const freshData = await fetchFn()

        // Save to cache
        setCachedData(key, freshData)

        setData(freshData)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load data'))
        setLoading(false)
      }
    }

    loadData()
  }, [key])

  return { data, loading, error }
}

/**
 * Get cached data from localStorage
 */
function getCachedData<T>(key: string): T | null {
  if (typeof window === 'undefined') return null

  try {
    const cached = localStorage.getItem(key)
    if (!cached) return null

    const { data, timestamp }: CacheItem<T> = JSON.parse(cached)

    // Check if cache is still valid
    if (Date.now() - timestamp > CACHE_DURATION) {
      localStorage.removeItem(key)
      return null
    }

    return data
  } catch (error) {
    console.error('Error reading from cache:', error)
    return null
  }
}

/**
 * Save data to localStorage cache
 */
function setCachedData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return

  try {
    const cacheItem: CacheItem<T> = {
      data,
      timestamp: Date.now(),
    }
    localStorage.setItem(key, JSON.stringify(cacheItem))
  } catch (error) {
    console.error('Error saving to cache:', error)
    // localStorage might be full or disabled - continue without caching
  }
}

/**
 * Clear all cached GeoJSON data
 */
export function clearGeoJSONCache(): void {
  if (typeof window === 'undefined') return

  try {
    const keys = Object.keys(localStorage)
    keys.forEach((key) => {
      if (key.startsWith('geojson-')) {
        localStorage.removeItem(key)
      }
    })
  } catch (error) {
    console.error('Error clearing cache:', error)
  }
}
