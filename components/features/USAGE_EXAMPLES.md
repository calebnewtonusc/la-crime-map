# Address Search - Usage Examples

Complete examples showing how to integrate the address search feature into your LA Crime Map application.

## Table of Contents

1. [Basic Search](#basic-search)
2. [Search with Results Display](#search-with-results-display)
3. [Search with Map Integration](#search-with-map-integration)
4. [Complete Search Page](#complete-search-page)
5. [Advanced: Custom Styling](#advanced-custom-styling)
6. [Advanced: Search Analytics](#advanced-search-analytics)

---

## Basic Search

Minimal implementation with just the search bar:

```tsx
import { AddressSearch } from '@/components/features/address-search'

export default function BasicSearchExample() {
  return (
    <div className="container mx-auto py-8">
      <AddressSearch />
    </div>
  )
}
```

---

## Search with Results Display

Display search results with detailed crime statistics:

```tsx
'use client'

import { useState } from 'react'
import { AddressSearch, AddressSearchResult } from '@/components/features'
import type { AddressSearchResultData } from '@/components/features'

export default function SearchWithResults() {
  const [result, setResult] = useState<AddressSearchResultData | null>(null)

  return (
    <div className="container mx-auto py-8">
      <AddressSearch
        onLocationFound={(searchResult) => {
          setResult(searchResult)
          console.log('Found neighborhood:', searchResult.neighborhoodName)
        }}
      />

      {result && (
        <div className="mt-8">
          <AddressSearchResult result={result} />
        </div>
      )}
    </div>
  )
}
```

---

## Search with Map Integration

Integrate search with the interactive map:

```tsx
'use client'

import { SearchWithMap } from '@/components/features'

export default function SearchMapPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary py-8">
      <SearchWithMap defaultMetric="violentCrime" />
    </div>
  )
}
```

---

## Complete Search Page

Full-featured search page with layout and error handling:

```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/main-layout'
import { AddressSearch } from '@/components/features/address-search'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import type { AddressSearchResultData } from '@/components/features'

export default function CompleteSearchPage() {
  const [location, setLocation] = useState<AddressSearchResultData | null>(null)

  return (
    <ErrorBoundary>
      <MainLayout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100
                     dark:from-dark-bg-primary dark:to-dark-bg-secondary py-12"
        >
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12 px-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-cyan to-blue-500
                           bg-clip-text text-transparent mb-4">
                Find Your Neighborhood
              </h1>
              <p className="text-xl text-gray-600 dark:text-dark-text-secondary max-w-3xl mx-auto">
                Search any Los Angeles address to discover crime statistics, safety ratings,
                and detailed neighborhood information
              </p>
            </div>

            {/* Search Component */}
            <AddressSearch
              onLocationFound={(result) => {
                setLocation(result)

                // Optional: Analytics tracking
                if (typeof window !== 'undefined' && (window as any).gtag) {
                  (window as any).gtag('event', 'address_search', {
                    neighborhood: result.neighborhoodName,
                    has_data: result.neighborhood !== null
                  })
                }

                // Optional: Scroll to results
                setTimeout(() => {
                  window.scrollTo({
                    top: 600,
                    behavior: 'smooth'
                  })
                }, 100)
              }}
            />

            {/* Additional Information */}
            <div className="mt-16 px-4">
              <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoCard
                  title="How It Works"
                  description="Enter your address, and we'll identify your neighborhood and show you detailed crime statistics compared to LA County averages."
                />
                <InfoCard
                  title="Data Privacy"
                  description="Your searches are stored locally on your device only. We don't collect or share your address information."
                />
              </div>
            </div>
          </div>
        </motion.div>
      </MainLayout>
    </ErrorBoundary>
  )
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white dark:bg-dark-bg-secondary border border-gray-200
                    dark:border-gray-700 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-dark-text-secondary text-sm">
        {description}
      </p>
    </div>
  )
}
```

---

## Advanced: Custom Styling

Customize the appearance of the search component:

```tsx
'use client'

import { AddressSearch } from '@/components/features/address-search'

export default function CustomStyledSearch() {
  return (
    <div className="container mx-auto py-16">
      <div className="max-w-5xl mx-auto">
        {/* Custom header */}
        <div className="text-center mb-8">
          <h1 className="text-6xl font-black text-gray-900 dark:text-white mb-3">
            LA Crime Search
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-400">
            Know before you go
          </p>
        </div>

        {/* Search with custom className */}
        <AddressSearch
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8"
          onLocationFound={(result) => {
            console.log('Custom handler:', result)
          }}
        />

        {/* Custom footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Data updated daily from LAPD sources
          </p>
        </div>
      </div>
    </div>
  )
}
```

---

## Advanced: Search Analytics

Track search behavior and popular neighborhoods:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { AddressSearch } from '@/components/features/address-search'
import type { AddressSearchResultData } from '@/components/features'

interface SearchAnalytics {
  totalSearches: number
  popularNeighborhoods: { [key: string]: number }
  lastSearchTime: number
}

export default function SearchWithAnalytics() {
  const [analytics, setAnalytics] = useState<SearchAnalytics>({
    totalSearches: 0,
    popularNeighborhoods: {},
    lastSearchTime: 0
  })

  // Load analytics from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('search-analytics')
    if (stored) {
      setAnalytics(JSON.parse(stored))
    }
  }, [])

  const handleSearch = (result: AddressSearchResultData) => {
    const newAnalytics: SearchAnalytics = {
      totalSearches: analytics.totalSearches + 1,
      popularNeighborhoods: {
        ...analytics.popularNeighborhoods,
        [result.neighborhoodName]: (analytics.popularNeighborhoods[result.neighborhoodName] || 0) + 1
      },
      lastSearchTime: Date.now()
    }

    setAnalytics(newAnalytics)
    localStorage.setItem('search-analytics', JSON.stringify(newAnalytics))

    // Send to your analytics service
    trackEvent('address_search', {
      neighborhood: result.neighborhoodName,
      has_crime_data: result.neighborhood !== null,
      safety_score: result.neighborhood?.safetyScore || null
    })
  }

  // Get top 5 searched neighborhoods
  const topNeighborhoods = Object.entries(analytics.popularNeighborhoods)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="container mx-auto py-8">
      <AddressSearch onLocationFound={handleSearch} />

      {/* Analytics Dashboard */}
      <div className="mt-12 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">Search Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <div className="text-4xl font-bold text-neon-cyan mb-2">
              {analytics.totalSearches}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Searches
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
            <h3 className="font-semibold mb-3">Popular Neighborhoods</h3>
            <div className="space-y-2">
              {topNeighborhoods.map(([name, count]) => (
                <div key={name} className="flex justify-between text-sm">
                  <span className="text-gray-700 dark:text-gray-300">{name}</span>
                  <span className="font-medium text-neon-cyan">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Example analytics tracking function
function trackEvent(eventName: string, properties: any) {
  // Google Analytics
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, properties)
  }

  // Or your custom analytics
  console.log('Analytics Event:', eventName, properties)
}
```

---

## Tips and Best Practices

### 1. Error Handling

Always wrap the search component in an ErrorBoundary:

```tsx
import { ErrorBoundary } from '@/components/ui/error-boundary'

<ErrorBoundary>
  <AddressSearch />
</ErrorBoundary>
```

### 2. Loading States

The component handles its own loading states, but you can add page-level loading:

```tsx
import { Suspense } from 'react'
import { LoadingSkeleton } from '@/components/ui/loading-skeleton'

<Suspense fallback={<LoadingSkeleton />}>
  <AddressSearch />
</Suspense>
```

### 3. Mobile Optimization

The component is already mobile-optimized, but ensure your page layout is responsive:

```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8">
  <AddressSearch />
</div>
```

### 4. Accessibility

The component includes proper ARIA labels. Ensure your page structure is accessible:

```tsx
<main role="main" aria-label="Address search">
  <h1>Search Your Neighborhood</h1>
  <AddressSearch />
</main>
```

### 5. SEO

Add proper meta tags for search pages:

```tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search Your Address - LA Crime Map',
  description: 'Find crime statistics and safety information for any Los Angeles address',
  keywords: ['LA crime', 'neighborhood safety', 'crime statistics', 'Los Angeles']
}
```

---

## Troubleshooting

### Search not working?

1. Check network tab for API errors
2. Ensure OpenStreetMap is accessible
3. Verify localStorage is enabled
4. Check console for JavaScript errors

### No neighborhood found?

1. Address might be outside LA County
2. Try being more specific (include street number)
3. Check coordinates are within bounds

### Styling issues?

1. Ensure Tailwind CSS is properly configured
2. Check dark mode is working (`next-themes`)
3. Verify Framer Motion is installed

---

## Next Steps

- Integrate with map highlighting
- Add share functionality
- Export neighborhood reports
- Implement favorites/bookmarks
- Add push notifications for crime alerts
