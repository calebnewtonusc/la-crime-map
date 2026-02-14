# Custom React Hooks

Production-ready React hooks for the LA Crime Map application, following Next.js 16 and React 19 best practices.

## Overview

This directory contains three main hook modules:

1. **useLocalStorage** - Type-safe localStorage with SSR support and cross-tab sync
2. **useCrimeStats** - Crime data management and analysis utilities
3. **useMediaQuery** - Responsive breakpoints and media query detection

## Installation

Import hooks from the main export:

```tsx
import { useLocalStorage, useCrimeStats, useMediaQuery } from '@/lib/hooks'
```

Or import specific hooks:

```tsx
import { useLocalStorage } from '@/lib/hooks/useLocalStorage'
```

## Hooks Documentation

### useLocalStorage

Type-safe localStorage persistence with automatic JSON serialization and cross-tab synchronization.

#### Basic Usage

```tsx
import { useLocalStorage } from '@/lib/hooks'

function MyComponent() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')

  return (
    <button onClick={() => setTheme('dark')}>
      Current theme: {theme}
    </button>
  )
}
```

#### Advanced Usage

```tsx
interface UserPreferences {
  selectedMetric: CrimeMetric
  showHeatmap: boolean
  notifications: boolean
}

function Settings() {
  const [prefs, setPrefs] = useLocalStorage<UserPreferences>('user-prefs', {
    selectedMetric: 'violentCrime',
    showHeatmap: true,
    notifications: false,
  })

  const updateMetric = (metric: CrimeMetric) => {
    setPrefs(prev => ({ ...prev, selectedMetric: metric }))
  }

  return <div>{/* Your UI */}</div>
}
```

#### With Custom Serialization

```tsx
const [data, setData] = useLocalStorage('complex-data', initialValue, {
  serializer: (value) => btoa(JSON.stringify(value)), // Base64 encode
  deserializer: (value) => JSON.parse(atob(value)),   // Base64 decode
  syncTabs: true, // Sync across tabs (default: true)
})
```

#### useDebouncedLocalStorage

For frequently changing values (e.g., search inputs, form fields):

```tsx
import { useDebouncedLocalStorage } from '@/lib/hooks'

function SearchBar() {
  const [searchQuery, setSearchQuery] = useDebouncedLocalStorage(
    'search-query',
    '',
    500 // 500ms debounce
  )

  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search neighborhoods..."
    />
  )
}
```

#### API Reference

```tsx
useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: {
    serializer?: (value: T) => string
    deserializer?: (value: string) => T
    initializeOnServer?: boolean
    syncTabs?: boolean
  }
): [T, SetValue<T>, () => void]
```

**Returns:** `[storedValue, setValue, removeValue]`

**Features:**
- SSR-safe (won't crash during server rendering)
- Automatic JSON serialization/deserialization
- Cross-tab synchronization
- Type-safe with TypeScript generics
- Custom serializers for complex data types
- Error handling with console warnings

---

### useCrimeStats

Comprehensive hook for managing and analyzing crime statistics with filtering, sorting, and search capabilities.

#### Basic Usage

```tsx
import { useCrimeStats } from '@/lib/hooks'

function Dashboard({ crimeData }: { crimeData: NeighborhoodGeoJSON }) {
  const {
    stats,
    neighborhoods,
    isLoading,
    error,
    getSafestNeighborhoods,
  } = useCrimeStats(crimeData)

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      <h2>Total Crimes: {stats?.totalCrimes}</h2>
      <h3>Safest Neighborhoods:</h3>
      <ul>
        {getSafestNeighborhoods(5).map(n => (
          <li key={n.name}>{n.name}</li>
        ))}
      </ul>
    </div>
  )
}
```

#### With Data Quality Filtering

```tsx
const { neighborhoods } = useCrimeStats(crimeData, {
  minDataQuality: 0.7,        // Only include neighborhoods with 70%+ data quality
  requireSufficientData: true, // Only include neighborhoods with sufficient data
  autoRefresh: true,          // Enable auto-refresh
  refreshInterval: 60000,     // Refresh every 60 seconds
})
```

#### Search and Filtering

```tsx
function NeighborhoodSearch() {
  const {
    neighborhoods,
    searchNeighborhoods,
    getNeighborhoodsByMetric,
  } = useCrimeStats(crimeData)

  const [query, setQuery] = useState('')
  const results = searchNeighborhoods(query)

  // Get neighborhoods sorted by violent crime (descending)
  const sortedByViolentCrime = getNeighborhoodsByMetric('violentCrime', false)

  return <div>{/* Your search UI */}</div>
}
```

#### Crime Level Detection

```tsx
function NeighborhoodCard({ neighborhood }: { neighborhood: NeighborhoodData }) {
  const { getCrimeLevel } = useCrimeStats(crimeData)

  const violentCrimeLevel = getCrimeLevel(neighborhood, 'violentCrime')
  // Returns: 'low' | 'medium' | 'high'

  return (
    <div className={`border-l-4 border-${violentCrimeLevel}-500`}>
      <h3>{neighborhood.name}</h3>
      <p>Crime Level: {violentCrimeLevel}</p>
    </div>
  )
}
```

#### API Reference

```tsx
useCrimeStats(
  data: NeighborhoodGeoJSON | null,
  options?: {
    refreshInterval?: number
    autoRefresh?: boolean
    minDataQuality?: number
    requireSufficientData?: boolean
  }
): {
  stats: CrimeStats | null
  neighborhoods: NeighborhoodData[]
  isLoading: boolean
  error: Error | null
  refresh: () => Promise<void>
  getCrimeLevel: (neighborhood, metric) => 'low' | 'medium' | 'high'
  getSafestNeighborhoods: (n?: number) => NeighborhoodData[]
  getMostDangerousNeighborhoods: (n?: number) => NeighborhoodData[]
  getNeighborhoodsByMetric: (metric, ascending?) => NeighborhoodData[]
  searchNeighborhoods: (query: string) => NeighborhoodData[]
}
```

#### useCrimeMetric

Manage selected crime metric with automatic sorting and statistics:

```tsx
import { useCrimeMetric } from '@/lib/hooks'

function MetricSelector() {
  const {
    selectedMetric,
    setSelectedMetric,
    sortedNeighborhoods,
    metricStats,
  } = useCrimeMetric(crimeData, 'violentCrime')

  return (
    <div>
      <select
        value={selectedMetric}
        onChange={(e) => setSelectedMetric(e.target.value as CrimeMetric)}
      >
        <option value="violentCrime">Violent Crime</option>
        <option value="carTheft">Car Theft</option>
        <option value="breakIns">Break-ins</option>
        <option value="pettyTheft">Petty Theft</option>
      </select>

      <div>
        <p>Average: {metricStats.average.toFixed(1)}</p>
        <p>Median: {metricStats.median}</p>
        <p>Range: {metricStats.min} - {metricStats.max}</p>
      </div>
    </div>
  )
}
```

#### useCrimeTrends

Analyze crime trends over time:

```tsx
import { useCrimeTrends } from '@/lib/hooks'

function TrendAnalysis() {
  const trends = useCrimeTrends(crimeData, '1month')

  if (!trends) return null

  return (
    <div>
      <h3>Crime Trends (Past Month)</h3>
      <p>Improving: {trends.trendCounts.improving}</p>
      <p>Worsening: {trends.trendCounts.worsening}</p>
      <p>Stable: {trends.trendCounts.stable}</p>
      <p>Average Confidence: {(trends.averageTrendConfidence * 100).toFixed(1)}%</p>
    </div>
  )
}
```

---

### useMediaQuery

Responsive design hooks with SSR support for breakpoints and media query detection.

#### Basic Media Query

```tsx
import { useMediaQuery } from '@/lib/hooks'

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 640px)')
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)')
  const isLandscape = useMediaQuery('(orientation: landscape)')

  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  )
}
```

#### Tailwind Breakpoints

```tsx
import { useBreakpoint } from '@/lib/hooks'

function Layout() {
  const isMd = useBreakpoint('md') // >= 768px
  const isLg = useBreakpoint('lg') // >= 1024px
  const is2XL = useBreakpoint('2xl') // >= 1536px

  return (
    <div className={isLg ? 'grid-cols-3' : 'grid-cols-1'}>
      {/* Your content */}
    </div>
  )
}
```

#### useResponsive (Comprehensive)

```tsx
import { useResponsive } from '@/lib/hooks'

function App() {
  const {
    breakpoint,     // 'sm' | 'md' | 'lg' | 'xl' | '2xl' | null
    isMobile,       // < md (< 768px)
    isTablet,       // >= md and < lg
    isDesktop,      // >= lg
    width,          // Viewport width
    height,         // Viewport height
    isPortrait,     // Portrait orientation
    isLandscape,    // Landscape orientation
  } = useResponsive()

  return (
    <div>
      <p>Current breakpoint: {breakpoint}</p>
      <p>Viewport: {width}x{height}</p>
      {isMobile && <MobileNav />}
      {isDesktop && <DesktopNav />}
    </div>
  )
}
```

#### Device Type Detection

```tsx
import { useDeviceType } from '@/lib/hooks'

function TouchOptimized() {
  const {
    isTouch,           // Touch-capable device
    isMouse,           // Mouse/pointer device
    isMobilePhone,     // Mobile phone (touch + small screen)
    isTabletDevice,    // Tablet (touch + medium screen)
    isDesktopDevice,   // Desktop (mouse + large screen)
  } = useDeviceType()

  return (
    <button className={isTouch ? 'p-4' : 'p-2'}>
      {isTouch ? 'Tap me' : 'Click me'}
    </button>
  )
}
```

#### Accessibility Preferences

```tsx
import {
  usePrefersReducedMotion,
  usePrefersDarkMode,
  usePrefersHighContrast,
} from '@/lib/hooks'

function AccessibleComponent() {
  const reducedMotion = usePrefersReducedMotion()
  const darkMode = usePrefersDarkMode()
  const highContrast = usePrefersHighContrast()

  return (
    <div
      className={darkMode ? 'dark' : 'light'}
      style={{
        transition: reducedMotion ? 'none' : 'all 0.3s',
        border: highContrast ? '2px solid' : '1px solid',
      }}
    >
      {/* Content */}
    </div>
  )
}
```

#### Custom Breakpoints

```tsx
import { useCustomBreakpoint } from '@/lib/hooks'

function CustomResponsive() {
  // Between 900px and 1200px
  const isInRange = useCustomBreakpoint(900, 1200)

  // At least 1440px
  const isWideScreen = useCustomBreakpoint(1440)

  // At most 480px
  const isTiny = useCustomBreakpoint(undefined, 480)

  return <div>{/* Your content */}</div>
}
```

#### API Reference

```tsx
// Basic media query
useMediaQuery(
  query: string,
  options?: {
    defaultValue?: boolean
    initializeWithValue?: boolean
  }
): boolean

// Tailwind breakpoint
useBreakpoint(
  breakpoint: 'sm' | 'md' | 'lg' | 'xl' | '2xl',
  options?: UseMediaQueryOptions
): boolean

// Comprehensive responsive info
useResponsive(options?: UseMediaQueryOptions): {
  breakpoint: Breakpoint | null
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isSmall: boolean
  is2XL: boolean
  width: number
  height: number
  isPortrait: boolean
  isLandscape: boolean
}

// Device type detection
useDeviceType(): {
  isTouch: boolean
  isMouse: boolean
  isMobilePhone: boolean
  isTabletDevice: boolean
  isDesktopDevice: boolean
}

// Accessibility
usePrefersReducedMotion(): boolean
usePrefersDarkMode(): boolean
usePrefersHighContrast(): boolean

// Custom breakpoint
useCustomBreakpoint(minWidth?: number, maxWidth?: number): boolean
```

**Available Breakpoints:**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

---

## Best Practices

### 1. Use with Server Components

These hooks are marked with `'use client'` and must be used in Client Components:

```tsx
// ✅ Good
'use client'
import { useLocalStorage } from '@/lib/hooks'

export default function ClientComponent() {
  const [value, setValue] = useLocalStorage('key', 'default')
  return <div>{value}</div>
}
```

```tsx
// ❌ Bad - Server Component
import { useLocalStorage } from '@/lib/hooks'

export default function ServerComponent() {
  const [value, setValue] = useLocalStorage('key', 'default') // ERROR
  return <div>{value}</div>
}
```

### 2. SSR Considerations

All hooks are SSR-safe and won't crash during server rendering:

```tsx
const isMobile = useMediaQuery('(max-width: 640px)', {
  defaultValue: false, // Return this during SSR
})

const [theme, setTheme] = useLocalStorage('theme', 'light', {
  initializeOnServer: false, // Don't read localStorage during SSR
})
```

### 3. Performance Optimization

Use memoization for expensive operations:

```tsx
const { neighborhoods } = useCrimeStats(crimeData)

// ✅ Good - Memoized
const topFive = useMemo(
  () => neighborhoods.slice(0, 5),
  [neighborhoods]
)

// ❌ Bad - Recreated on every render
const topFive = neighborhoods.slice(0, 5)
```

### 4. Error Handling

Always handle potential errors:

```tsx
const { stats, error, isLoading } = useCrimeStats(crimeData)

if (isLoading) return <Spinner />
if (error) return <ErrorBoundary error={error} />
if (!stats) return <EmptyState />

return <Dashboard stats={stats} />
```

### 5. Type Safety

Use TypeScript generics for type safety:

```tsx
interface UserSettings {
  metric: CrimeMetric
  theme: 'light' | 'dark'
  zoom: number
}

const [settings, setSettings] = useLocalStorage<UserSettings>(
  'settings',
  { metric: 'violentCrime', theme: 'light', zoom: 10 }
)

// TypeScript will enforce type safety
setSettings({ metric: 'invalid' }) // ❌ Error
setSettings({ metric: 'carTheft', theme: 'dark', zoom: 12 }) // ✅ OK
```

## Testing

Example test setup with React Testing Library:

```tsx
import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '@/lib/hooks'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should persist value to localStorage', () => {
    const { result } = renderHook(() =>
      useLocalStorage('test-key', 'initial')
    )

    act(() => {
      result.current[1]('updated')
    })

    expect(localStorage.getItem('test-key')).toBe('"updated"')
    expect(result.current[0]).toBe('updated')
  })
})
```

## Contributing

When adding new hooks:

1. Use TypeScript with proper type definitions
2. Add `'use client'` directive for client-only hooks
3. Ensure SSR safety (no window/document access during initial render)
4. Include comprehensive JSDoc comments
5. Export types and utilities
6. Update the main index.ts export
7. Add usage examples to this README

## License

Part of the LA Crime Map project.
