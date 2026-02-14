# Real Crime Data - Quick Start Guide

## What Changed?

**ALL hard-coded crime data has been REMOVED.** The app now uses 100% real data from LAPD.

## For Developers

### Option 1: Use the API Endpoint (Server-Side)

```typescript
// In a server component or API route
const response = await fetch('http://localhost:3000/api/neighborhoods?days=365')
const { geojson, metadata } = await response.json()

// geojson contains all 114 neighborhoods with REAL crime data
// metadata contains data quality and freshness info
```

### Option 2: Use the React Hook (Client-Side)

```typescript
'use client'
import { useRealCrimeData } from '@/lib/hooks/use-real-crime-data'

function MyComponent() {
  const { neighborhoods, metadata, loading, error } = useRealCrimeData({
    days: 365, // Last year of data
  })

  if (loading) return <div>Loading real data from LAPD...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h2>Real Crime Data</h2>
      <p>Last Updated: {metadata?.lastUpdated}</p>
      <p>Total Incidents: {metadata?.totalIncidents.toLocaleString()}</p>

      {neighborhoods.map((n) => (
        <div key={n.neighborhoodName}>
          <h3>{n.neighborhoodName}</h3>
          <p>Total Crimes: {n.totalCrimes}</p>
          <p>Violent: {n.violentCrime}</p>
          <p>Car Theft: {n.carTheft}</p>
          <p>Break-ins: {n.breakIns}</p>
          <p>Petty Theft: {n.pettyTheft}</p>
        </div>
      ))}
    </div>
  )
}
```

### Option 3: Use Data Attribution UI Component

```typescript
import { DataAttribution, DataFreshnessIndicator } from '@/components/data-attribution'

function MyPage() {
  const { metadata } = useRealCrimeData()

  return (
    <div>
      {/* Show data source and freshness */}
      <DataAttribution
        lastUpdated={metadata?.lastUpdated}
        dataSource={metadata?.dataSource}
        dateRange={metadata?.dateRange}
        totalIncidents={metadata?.totalIncidents}
      />

      {/* Or use compact freshness indicator */}
      <DataFreshnessIndicator lastUpdated={metadata?.lastUpdated} />
    </div>
  )
}
```

## API Endpoints

### GET /api/crime-data
Returns raw crime data aggregated by neighborhood.

```bash
# Last 90 days
curl http://localhost:3000/api/crime-data?days=90

# Specific date range
curl "http://localhost:3000/api/crime-data?startDate=2025-01-01&endDate=2025-12-31"
```

### GET /api/neighborhoods
Returns complete neighborhood GeoJSON with real crime data and analytics.

```bash
# Last year
curl http://localhost:3000/api/neighborhoods?days=365

# Without metadata
curl http://localhost:3000/api/neighborhoods?days=365&includeMetadata=false
```

### POST /api/crime-data/refresh
Force refresh the cache.

```bash
curl -X POST http://localhost:3000/api/crime-data/refresh \
  -H "Content-Type: application/json" \
  -d '{"days": 90}'
```

## Testing

1. **Start the dev server**
   ```bash
   npm run dev
   ```

2. **Test the API endpoints**
   ```bash
   # Check if data is loading
   curl http://localhost:3000/api/crime-data?days=90
   ```

3. **Run the test script**
   ```bash
   npx tsx scripts/test-real-data-integration.ts
   ```

## What You Get

### Real Crime Data
- Violent Crime (murder, assault, robbery, rape, etc.)
- Car Theft (vehicle theft, attempted theft)
- Break-ins (burglary, breaking & entering)
- Petty Theft (theft, shoplifting, vandalism, etc.)

### Enhanced Analytics
- Crime percentiles (how a neighborhood compares to others)
- Safety scores (0-100, higher is safer)
- Comparison to county average
- Data quality metrics
- Mapping coverage statistics

### Data Freshness
- Last updated timestamp
- Data source attribution
- Date range covered
- Total incident count

## Important Notes

1. **Data is cached for 1 hour** to avoid rate limits
2. **~97% of crimes are mapped** to neighborhoods (3% fall outside boundaries)
3. **Data source** is the official LAPD Open Data Portal
4. **No more fake data** anywhere in the codebase

## Need Help?

See `REAL_DATA_INTEGRATION_COMPLETE.md` for full documentation.

## Data Sources

- Crime Data: [LAPD Open Data Portal](https://data.lacity.org/)
- Neighborhood Boundaries: [LA Times Mapping LA](http://maps.latimes.com/neighborhoods/)
