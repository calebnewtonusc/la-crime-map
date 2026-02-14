# Hook Usage Examples

Complete examples showing how to use the custom hooks in real-world scenarios.

## Complete Dashboard Example

```tsx
'use client'

import { useState } from 'react'
import {
  useLocalStorage,
  useCrimeStats,
  useResponsive,
  type CrimeMetric,
} from '@/lib/hooks'
import type { NeighborhoodGeoJSON } from '@/lib/data/types'

interface UserPreferences {
  selectedMetric: CrimeMetric
  showHeatmap: boolean
  darkMode: boolean
}

export default function CrimeDashboard({
  crimeData,
}: {
  crimeData: NeighborhoodGeoJSON
}) {
  // Persist user preferences
  const [preferences, setPreferences] = useLocalStorage<UserPreferences>(
    'crime-dashboard-prefs',
    {
      selectedMetric: 'violentCrime',
      showHeatmap: true,
      darkMode: false,
    }
  )

  // Get responsive breakpoints
  const { isMobile, isTablet, isDesktop, width } = useResponsive()

  // Manage crime statistics
  const {
    stats,
    neighborhoods,
    isLoading,
    error,
    getSafestNeighborhoods,
    getMostDangerousNeighborhoods,
    searchNeighborhoods,
  } = useCrimeStats(crimeData, {
    minDataQuality: 0.7,
    requireSufficientData: true,
  })

  const [searchQuery, setSearchQuery] = useState('')
  const filteredNeighborhoods = searchNeighborhoods(searchQuery)

  // Update selected metric
  const handleMetricChange = (metric: CrimeMetric) => {
    setPreferences((prev) => ({ ...prev, selectedMetric: metric }))
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorDisplay error={error} />
  }

  return (
    <div className={preferences.darkMode ? 'dark' : 'light'}>
      {/* Header - responsive layout */}
      <header className="p-4">
        <h1 className={isMobile ? 'text-2xl' : 'text-4xl'}>
          LA Crime Dashboard
        </h1>

        {/* Metric selector */}
        <MetricSelector
          selected={preferences.selectedMetric}
          onChange={handleMetricChange}
        />

        {/* Search - full width on mobile */}
        <div className={isMobile ? 'w-full' : 'w-96'}>
          <input
            type="search"
            placeholder="Search neighborhoods..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </header>

      {/* Stats overview - responsive grid */}
      <div
        className={`grid gap-4 p-4 ${
          isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-2' : 'grid-cols-4'
        }`}
      >
        <StatCard
          title="Total Neighborhoods"
          value={stats?.totalNeighborhoods || 0}
        />
        <StatCard title="Total Crimes" value={stats?.totalCrimes || 0} />
        <StatCard
          title="Safest"
          value={stats?.safestNeighborhood || 'N/A'}
        />
        <StatCard
          title="Most Dangerous"
          value={stats?.mostDangerous || 'N/A'}
        />
      </div>

      {/* Main content - different layouts by device */}
      <div className="p-4">
        {isMobile ? (
          // Mobile: Stacked layout
          <MobileLayout
            neighborhoods={filteredNeighborhoods}
            metric={preferences.selectedMetric}
          />
        ) : isTablet ? (
          // Tablet: 2-column layout
          <TabletLayout
            neighborhoods={filteredNeighborhoods}
            metric={preferences.selectedMetric}
            safest={getSafestNeighborhoods(5)}
            dangerous={getMostDangerousNeighborhoods(5)}
          />
        ) : (
          // Desktop: 3-column layout with sidebar
          <DesktopLayout
            neighborhoods={filteredNeighborhoods}
            metric={preferences.selectedMetric}
            safest={getSafestNeighborhoods(10)}
            dangerous={getMostDangerousNeighborhoods(10)}
            showHeatmap={preferences.showHeatmap}
          />
        )}
      </div>

      {/* Settings panel */}
      <SettingsPanel
        preferences={preferences}
        onUpdate={setPreferences}
        viewportWidth={width}
      />
    </div>
  )
}
```

## Persistence with Auto-Save Form

```tsx
'use client'

import { useDebouncedLocalStorage } from '@/lib/hooks'

export default function FilterForm() {
  const [filters, setFilters] = useDebouncedLocalStorage(
    'crime-filters',
    {
      minSafetyScore: 0,
      maxCrimeRate: 100,
      neighborhoods: [] as string[],
      dateRange: '1month' as const,
    },
    1000 // Save 1 second after user stops typing
  )

  return (
    <form className="space-y-4">
      <div>
        <label>Minimum Safety Score</label>
        <input
          type="range"
          min="0"
          max="100"
          value={filters.minSafetyScore}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              minSafetyScore: Number(e.target.value),
            }))
          }
        />
        <span>{filters.minSafetyScore}</span>
      </div>

      <div>
        <label>Maximum Crime Rate</label>
        <input
          type="range"
          min="0"
          max="100"
          value={filters.maxCrimeRate}
          onChange={(e) =>
            setFilters((prev) => ({
              ...prev,
              maxCrimeRate: Number(e.target.value),
            }))
          }
        />
        <span>{filters.maxCrimeRate}</span>
      </div>

      <button
        type="button"
        onClick={() =>
          setFilters({
            minSafetyScore: 0,
            maxCrimeRate: 100,
            neighborhoods: [],
            dateRange: '1month',
          })
        }
      >
        Reset Filters
      </button>
    </form>
  )
}
```

## Responsive Map with Touch Optimization

```tsx
'use client'

import { useResponsive, useDeviceType, usePrefersReducedMotion } from '@/lib/hooks'
import dynamic from 'next/dynamic'

// Dynamically import map component (client-side only)
const MapComponent = dynamic(() => import('./map-component'), { ssr: false })

export default function CrimeMap() {
  const { isMobile, width, height } = useResponsive()
  const { isTouch, isMobilePhone } = useDeviceType()
  const reducedMotion = usePrefersReducedMotion()

  return (
    <div className="relative">
      <MapComponent
        // Adjust map controls based on device
        zoomControl={!isMobilePhone}
        touchZoom={isTouch}
        scrollWheelZoom={!isTouch}
        doubleClickZoom={true}
        // Disable animations for reduced motion preference
        animate={!reducedMotion}
        // Adjust map size
        style={{
          width: width,
          height: isMobile ? height * 0.6 : height * 0.8,
        }}
        // Larger touch targets on mobile
        markerSize={isTouch ? 'large' : 'medium'}
      />

      {/* Mobile-specific controls */}
      {isMobilePhone && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white rounded-lg shadow-lg p-4">
            <button className="w-full py-3 text-lg">
              View Neighborhood Details
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

## Crime Statistics with Real-time Updates

```tsx
'use client'

import { useCrimeStats, useCrimeTrends } from '@/lib/hooks'
import { useEffect } from 'react'

export default function LiveStats({ data }: { data: NeighborhoodGeoJSON }) {
  const {
    stats,
    neighborhoods,
    refresh,
    getNeighborhoodsByMetric,
  } = useCrimeStats(data, {
    autoRefresh: true,
    refreshInterval: 60000, // Refresh every minute
    minDataQuality: 0.8,
  })

  const trends = useCrimeTrends(data, '1month')

  // Manual refresh on user action
  const handleRefresh = async () => {
    await refresh()
    // Show notification
    toast.success('Data refreshed!')
  }

  // Get top performers
  const safestByViolentCrime = getNeighborhoodsByMetric('violentCrime', true).slice(0, 5)
  const worstByCarTheft = getNeighborhoodsByMetric('carTheft', false).slice(0, 5)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2>Live Crime Statistics</h2>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Refresh Now
        </button>
      </div>

      {/* Overall stats */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <h3>Total Crimes</h3>
          <p className="text-3xl font-bold">{stats?.totalCrimes}</p>
        </div>
        <div>
          <h3>Neighborhoods</h3>
          <p className="text-3xl font-bold">{neighborhoods.length}</p>
        </div>
        <div>
          <h3>Avg Violent Crime</h3>
          <p className="text-3xl font-bold">{stats?.avgViolentCrime}</p>
        </div>
      </div>

      {/* Trend analysis */}
      {trends && (
        <div className="bg-gray-100 p-4 rounded-lg">
          <h3>Trends (Past Month)</h3>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-green-600">
              ↑ Improving: {trends.trendCounts.improving}
            </div>
            <div className="text-red-600">
              ↓ Worsening: {trends.trendCounts.worsening}
            </div>
            <div className="text-gray-600">
              → Stable: {trends.trendCounts.stable}
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Average confidence: {(trends.averageTrendConfidence * 100).toFixed(1)}%
          </p>
        </div>
      )}

      {/* Top/Bottom lists */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h3>Safest (Violent Crime)</h3>
          <ul className="space-y-2">
            {safestByViolentCrime.map((n) => (
              <li key={n.name} className="flex justify-between">
                <span>{n.name}</span>
                <span className="text-green-600">{n.violentCrime}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Highest Car Theft</h3>
          <ul className="space-y-2">
            {worstByCarTheft.map((n) => (
              <li key={n.name} className="flex justify-between">
                <span>{n.name}</span>
                <span className="text-red-600">{n.carTheft}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
```

## Theme Switcher with System Preference

```tsx
'use client'

import { useLocalStorage, usePrefersDarkMode } from '@/lib/hooks'
import { useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemPrefersDark = usePrefersDarkMode()
  const [theme, setTheme] = useLocalStorage<Theme>('theme', 'system')

  // Determine effective theme
  const effectiveTheme = theme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : theme

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(effectiveTheme)
  }, [effectiveTheme])

  return (
    <div className={effectiveTheme}>
      {/* Theme switcher */}
      <div className="fixed top-4 right-4 z-50">
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as Theme)}
          className="px-4 py-2 border rounded-lg"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>

      {children}
    </div>
  )
}
```

## Accessible Neighborhood Comparison

```tsx
'use client'

import {
  useCrimeStats,
  usePrefersReducedMotion,
  usePrefersHighContrast,
} from '@/lib/hooks'

export default function NeighborhoodComparison({
  data,
  neighborhoodA,
  neighborhoodB,
}: {
  data: NeighborhoodGeoJSON
  neighborhoodA: string
  neighborhoodB: string
}) {
  const { neighborhoods, getCrimeLevel } = useCrimeStats(data)
  const reducedMotion = usePrefersReducedMotion()
  const highContrast = usePrefersHighContrast()

  const nA = neighborhoods.find((n) => n.name === neighborhoodA)
  const nB = neighborhoods.find((n) => n.name === neighborhoodB)

  if (!nA || !nB) return null

  const metrics: CrimeMetric[] = ['violentCrime', 'carTheft', 'breakIns', 'pettyTheft']

  return (
    <div className="grid grid-cols-2 gap-4">
      {metrics.map((metric) => {
        const levelA = getCrimeLevel(nA, metric)
        const levelB = getCrimeLevel(nB, metric)

        return (
          <div
            key={metric}
            className={`p-4 rounded-lg ${
              highContrast ? 'border-2 border-black' : 'border'
            }`}
            style={{
              transition: reducedMotion ? 'none' : 'all 0.3s ease',
            }}
          >
            <h3 className="font-bold mb-2">{metric}</h3>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">{neighborhoodA}</p>
                <p className={`text-lg font-bold text-${levelA}-600`}>
                  {nA[metric]}
                </p>
              </div>

              <div className="text-2xl">
                {nA[metric] < nB[metric] ? '✓' : '✗'}
              </div>

              <div>
                <p className="text-sm text-gray-600">{neighborhoodB}</p>
                <p className={`text-lg font-bold text-${levelB}-600`}>
                  {nB[metric]}
                </p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

## Combined Hook Pattern

```tsx
'use client'

import { useLocalStorage, useCrimeStats, useResponsive } from '@/lib/hooks'
import { useMemo } from 'react'

// Custom composite hook
function useDashboardState(data: NeighborhoodGeoJSON) {
  // Persistent state
  const [preferences, setPreferences] = useLocalStorage('dashboard-state', {
    metric: 'violentCrime' as CrimeMetric,
    sortOrder: 'desc' as 'asc' | 'desc',
    pageSize: 10,
  })

  // Responsive state
  const { isMobile, isDesktop } = useResponsive()

  // Crime data
  const {
    neighborhoods,
    getNeighborhoodsByMetric,
    getCrimeLevel,
  } = useCrimeStats(data)

  // Derived state
  const sortedNeighborhoods = useMemo(() => {
    const sorted = getNeighborhoodsByMetric(
      preferences.metric,
      preferences.sortOrder === 'asc'
    )
    return sorted.slice(0, preferences.pageSize)
  }, [preferences.metric, preferences.sortOrder, preferences.pageSize, getNeighborhoodsByMetric])

  return {
    preferences,
    setPreferences,
    isMobile,
    isDesktop,
    neighborhoods: sortedNeighborhoods,
    getCrimeLevel,
  }
}

// Use the composite hook
export default function Dashboard({ data }: { data: NeighborhoodGeoJSON }) {
  const {
    preferences,
    setPreferences,
    isMobile,
    neighborhoods,
    getCrimeLevel,
  } = useDashboardState(data)

  return (
    <div>
      {/* Controls */}
      <div className={isMobile ? 'space-y-2' : 'flex space-x-4'}>
        <select
          value={preferences.metric}
          onChange={(e) =>
            setPreferences((p) => ({ ...p, metric: e.target.value as CrimeMetric }))
          }
        >
          <option value="violentCrime">Violent Crime</option>
          <option value="carTheft">Car Theft</option>
        </select>

        <select
          value={preferences.pageSize}
          onChange={(e) =>
            setPreferences((p) => ({ ...p, pageSize: Number(e.target.value) }))
          }
        >
          <option value={10}>10 per page</option>
          <option value={25}>25 per page</option>
          <option value={50}>50 per page</option>
        </select>
      </div>

      {/* List */}
      <div className="mt-4 space-y-2">
        {neighborhoods.map((n) => (
          <div key={n.name} className="p-4 border rounded">
            <h3>{n.name}</h3>
            <p>Level: {getCrimeLevel(n, preferences.metric)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Performance Tip: Memoization

```tsx
'use client'

import { useCrimeStats } from '@/lib/hooks'
import { useMemo, useCallback } from 'react'

export default function OptimizedList({ data }: { data: NeighborhoodGeoJSON }) {
  const { neighborhoods } = useCrimeStats(data)

  // Memoize expensive computations
  const sortedByTotal = useMemo(() => {
    return neighborhoods
      .map((n) => ({
        ...n,
        total: n.violentCrime + n.carTheft + n.breakIns + n.pettyTheft,
      }))
      .sort((a, b) => b.total - a.total)
  }, [neighborhoods])

  // Memoize callbacks
  const handleClick = useCallback((name: string) => {
    console.log('Clicked:', name)
  }, [])

  return (
    <div>
      {sortedByTotal.map((n) => (
        <div key={n.name} onClick={() => handleClick(n.name)}>
          {n.name}: {n.total} total crimes
        </div>
      ))}
    </div>
  )
}
```
