# Migration Checklist: From Fake Data to Real Data

## Overview

This checklist helps you update existing components to use real LAPD crime data instead of fabricated placeholder data.

## Files Changed

### Core Data Files

- [x] `lib/data/neighborhoods.ts` - Now exports only boundaries, no crime data
- [x] Created `lib/services/` directory with all real data services
- [x] Created API routes: `/api/crime-data` and `/api/neighborhoods`
- [x] Created React hook: `useRealCrimeData()`
- [x] Created UI components: `DataAttribution` and `DataFreshnessIndicator`

## Migration Steps

### Step 1: Identify Components Using Fake Data

Search for these patterns in your codebase:

```bash
# Find files importing old neighborhoods data
grep -r "from.*neighborhoods" --include="*.tsx" --include="*.ts"

# Find files using crime properties directly
grep -r "violentCrime\|carTheft\|breakIns\|pettyTheft" --include="*.tsx" --include="*.ts"
```

### Step 2: Update Each Component

For each component using crime data, choose a migration path:

#### Option A: Convert to Client Component (Recommended for Interactive UI)

**Before:**
```typescript
import { laNeighborhoods } from '@/lib/data/neighborhoods'

function MyComponent() {
  const data = laNeighborhoods.features[0].properties
  return <div>Violent Crime: {data.violentCrime}</div>
}
```

**After:**
```typescript
'use client'
import { useRealCrimeData } from '@/lib/hooks/use-real-crime-data'

function MyComponent() {
  const { neighborhoods, loading } = useRealCrimeData({ days: 365 })

  if (loading) return <div>Loading...</div>

  const neighborhood = neighborhoods.find(n => n.neighborhoodName === 'Hollywood')
  return <div>Violent Crime: {neighborhood?.violentCrime ?? 0}</div>
}
```

#### Option B: Use API Route (For Server Components)

**Before:**
```typescript
import { laNeighborhoods } from '@/lib/data/neighborhoods'

function MyPage() {
  const data = laNeighborhoods.features
  return <div>Neighborhoods: {data.length}</div>
}
```

**After:**
```typescript
async function MyPage() {
  const response = await fetch('http://localhost:3000/api/neighborhoods?days=365')
  const { geojson, metadata } = await response.json()

  return (
    <div>
      <p>Neighborhoods: {geojson.features.length}</p>
      <p>Real data from: {metadata.dataSource}</p>
    </div>
  )
}
```

#### Option C: Use Direct Service (Advanced)

**Before:**
```typescript
import { laNeighborhoods } from '@/lib/data/neighborhoods'

async function getData() {
  return laNeighborhoods.features.map(f => f.properties)
}
```

**After:**
```typescript
import { aggregateCrimeDataForNeighborhoods } from '@/lib/services/crime-data-aggregator'
import { laNeighborhoods } from '@/lib/data/neighborhoods-real'

async function getData() {
  const result = await aggregateCrimeDataForNeighborhoods(
    { type: 'FeatureCollection', features: laNeighborhoods.features },
    365
  )
  return result.neighborhoods
}
```

### Step 3: Add Data Attribution

Every page showing crime data should include attribution:

```typescript
import { DataAttribution } from '@/components/data-attribution'

function MyPage() {
  const { metadata } = useRealCrimeData()

  return (
    <div>
      {/* Your crime data UI */}

      {/* Add this at the bottom */}
      <DataAttribution
        lastUpdated={metadata?.lastUpdated}
        dataSource={metadata?.dataSource}
        dateRange={metadata?.dateRange}
        totalIncidents={metadata?.totalIncidents}
      />
    </div>
  )
}
```

### Step 4: Add Loading States

Real data takes time to fetch, so add loading states:

```typescript
const { neighborhoods, loading, error } = useRealCrimeData()

if (loading) {
  return <div className="animate-pulse">Loading real crime data...</div>
}

if (error) {
  return <div className="text-red-600">Error: {error}</div>
}

// Render data
```

### Step 5: Update Tests

If you have tests using the old data structure:

**Before:**
```typescript
import { laNeighborhoods } from '@/lib/data/neighborhoods'

test('shows crime data', () => {
  const crimeCount = laNeighborhoods.features[0].properties.violentCrime
  expect(crimeCount).toBeDefined()
})
```

**After:**
```typescript
import { aggregateCrimeDataForNeighborhoods } from '@/lib/services/crime-data-aggregator'

test('shows crime data', async () => {
  const result = await aggregateCrimeDataForNeighborhoods(mockGeoJSON, 90)
  expect(result.neighborhoods[0].violentCrime).toBeGreaterThanOrEqual(0)
})
```

## Component-Specific Migrations

### Map Components

If you have a map component showing crime data:

```typescript
'use client'
import { useRealCrimeData } from '@/lib/hooks/use-real-crime-data'
import { MapContainer, GeoJSON } from 'react-leaflet'

function CrimeMap() {
  const { neighborhoods, loading } = useRealCrimeData({ days: 365 })

  if (loading) return <div>Loading map data...</div>

  // Convert neighborhoods to GeoJSON format
  const geoJSONData = {
    type: 'FeatureCollection' as const,
    features: neighborhoods.map(n => ({
      type: 'Feature' as const,
      properties: n,
      geometry: {
        type: 'Point' as const,
        coordinates: [0, 0], // You'll need actual coordinates
      },
    })),
  }

  return (
    <MapContainer>
      <GeoJSON data={geoJSONData} />
    </MapContainer>
  )
}
```

### Statistics Dashboard

```typescript
'use client'
import { useRealCrimeData } from '@/lib/hooks/use-real-crime-data'
import { DataAttribution } from '@/components/data-attribution'

function StatsDashboard() {
  const { neighborhoods, metadata, loading } = useRealCrimeData({ days: 365 })

  if (loading) return <div>Loading statistics...</div>

  const totals = neighborhoods.reduce(
    (acc, n) => ({
      violent: acc.violent + n.violentCrime,
      carTheft: acc.carTheft + n.carTheft,
      breakIns: acc.breakIns + n.breakIns,
      pettyTheft: acc.pettyTheft + n.pettyTheft,
    }),
    { violent: 0, carTheft: 0, breakIns: 0, pettyTheft: 0 }
  )

  return (
    <div>
      <h2>City-Wide Crime Statistics</h2>
      <div>Violent Crime: {totals.violent.toLocaleString()}</div>
      <div>Car Theft: {totals.carTheft.toLocaleString()}</div>
      <div>Break-ins: {totals.breakIns.toLocaleString()}</div>
      <div>Petty Theft: {totals.pettyTheft.toLocaleString()}</div>

      <DataAttribution
        lastUpdated={metadata?.lastUpdated}
        dataSource={metadata?.dataSource}
        totalIncidents={metadata?.totalIncidents}
        compact
      />
    </div>
  )
}
```

## Common Pitfalls

### 1. Forgetting to add 'use client'

Real data hooks MUST be used in client components:

```typescript
'use client' // Don't forget this!
import { useRealCrimeData } from '@/lib/hooks/use-real-crime-data'
```

### 2. Not handling loading/error states

Always handle these states:

```typescript
const { data, loading, error } = useRealCrimeData()

if (loading) return <LoadingSpinner />
if (error) return <ErrorMessage error={error} />
if (!data) return <NoData />

// Now safe to use data
```

### 3. Using old import paths

**Wrong:**
```typescript
import { laNeighborhoods } from '@/lib/data/neighborhoods'
const crimeData = laNeighborhoods.features[0].properties.violentCrime
```

**Right:**
```typescript
import { useRealCrimeData } from '@/lib/hooks/use-real-crime-data'
const { neighborhoods } = useRealCrimeData()
```

### 4. Not showing data attribution

**Required** - Add attribution to every page with crime data:

```typescript
<DataAttribution
  lastUpdated={metadata?.lastUpdated}
  dataSource={metadata?.dataSource}
/>
```

## Verification Checklist

After migration, verify:

- [ ] No imports from `@/lib/data/neighborhoods` (except for boundaries-only use cases)
- [ ] All crime data comes from API or `useRealCrimeData()`
- [ ] Loading states are shown while fetching data
- [ ] Error states are handled gracefully
- [ ] Data attribution is displayed on all relevant pages
- [ ] "Last Updated" timestamps are shown
- [ ] Tests are updated to use real data services
- [ ] No hard-coded crime numbers anywhere
- [ ] API endpoints return real data (test at `/api/crime-data`)

## Need Help?

1. See example component: `components/real-crime-stats-example.tsx`
2. Read full docs: `REAL_DATA_INTEGRATION_COMPLETE.md`
3. Check quick start: `REAL_DATA_QUICK_START.md`

## Testing Your Migration

```bash
# 1. Start dev server
npm run dev

# 2. Test API endpoints
curl http://localhost:3000/api/crime-data?days=90
curl http://localhost:3000/api/neighborhoods?days=90

# 3. Run test script
npx tsx scripts/test-real-data-integration.ts

# 4. Check your component in browser
# Look for "Last Updated" timestamps
# Verify data attribution is shown
# Check that numbers look realistic (not the old fake data)
```

## Success Criteria

Your migration is complete when:

1. All crime data comes from LAPD API
2. No hard-coded crime numbers exist
3. Data attribution is shown everywhere
4. Loading states work properly
5. Error handling is in place
6. Tests pass with real data
7. API endpoints return real data

**No more fake data anywhere!**
