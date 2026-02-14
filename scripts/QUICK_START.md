# Quick Start: Using Real LA Neighborhood Data

## What We Have Now

✅ **Real neighborhood boundaries for 114 LA neighborhoods** (967KB GeoJSON)
✅ **Converted data matching your app's format** with placeholder crime stats
✅ **Scripts ready to fetch real crime data** from LA Open Data Portal

## Files Downloaded

```
/public/data/
├── la-neighborhoods-real.geojson          # Original LA Times boundaries (114 neighborhoods)
└── la-neighborhoods-converted.geojson     # Converted to your app format (ready to use!)
```

## Option 1: Quick Integration (Use Placeholder Data)

Replace your current mock data with real boundaries:

```typescript
// lib/data/neighborhoods.ts
import { NeighborhoodGeoJSON } from './types'
import realData from '../../public/data/la-neighborhoods-converted.geojson'

export const laNeighborhoods: NeighborhoodGeoJSON = realData as NeighborhoodGeoJSON
```

**Pros:** Immediate, accurate boundaries for 114 neighborhoods
**Cons:** Crime data is placeholder (hash-based)

## Option 2: Full Integration (With Real Crime Data)

### Step 1: Fetch Real Crime Data

```bash
cd /Users/joelnewton/Desktop/2026-Code/la-crime-map
npx ts-node scripts/fetch-crime-data.ts
```

This will:
- Fetch the last 12 months of crime data from LA Open Data
- Map crimes to neighborhoods
- Generate `la-neighborhoods-with-crime-data.geojson`

### Step 2: Use the Data

```typescript
// lib/data/neighborhoods.ts
import { NeighborhoodGeoJSON } from './types'
import realData from '../../public/data/la-neighborhoods-with-crime-data.geojson'

export const laNeighborhoods: NeighborhoodGeoJSON = realData as NeighborhoodGeoJSON
```

**Pros:** 100% real data, accurate boundaries AND crime stats
**Cons:** Requires API call (one-time or scheduled)

## Option 3: Hybrid Approach (Recommended)

Use real boundaries with manually curated crime data:

```typescript
// lib/data/neighborhoods.ts
import { NeighborhoodGeoJSON } from './types'
import { createNeighborhoodData } from '../utils/neighborhood-initializer'
import realBoundaries from '../../public/data/la-neighborhoods-real.geojson'

export const laNeighborhoods: NeighborhoodGeoJSON = {
  type: 'FeatureCollection',
  features: realBoundaries.features.map((feature: any) => ({
    type: 'Feature',
    geometry: feature.geometry,
    properties: createNeighborhoodData({
      name: feature.properties.name,
      // Add your curated crime data here
      violentCrime: getCrimeDataFor(feature.properties.name, 'violent'),
      carTheft: getCrimeDataFor(feature.properties.name, 'carTheft'),
      breakIns: getCrimeDataFor(feature.properties.name, 'breakIns'),
      pettyTheft: getCrimeDataFor(feature.properties.name, 'pettyTheft'),
    })
  }))
}
```

## Verify the Data

Check what you have:

```bash
# Check file sizes
ls -lh public/data/*.geojson

# Count neighborhoods
python3 -c "import json; print(len(json.load(open('public/data/la-neighborhoods-real.geojson'))['features']))"

# List all neighborhoods
python3 -c "import json; data=json.load(open('public/data/la-neighborhoods-converted.geojson')); print('\\n'.join(sorted([f['properties']['name'] for f in data['features']])))"
```

## Key Differences from Mock Data

### Before (Mock Data)
- 35 neighborhoods
- Approximate boundaries
- Manually drawn rectangles/polygons

### After (Real Data)
- 114 neighborhoods
- Accurate boundaries from LA Times
- Official City of Los Angeles data
- Includes ALL major LA neighborhoods

## New Neighborhoods You Didn't Have Before

```
Arleta, Atwater Village, Beverly Crest, Boyle Heights, Canoga Park, Carthay,
Central-Alameda, Chatsworth, Chesterfield Square, Cheviot Hills, Chinatown,
Cypress Park, Del Rey, Eagle Rock, East Hollywood, El Sereno, Elysian Park,
Elysian Valley, Exposition Park, Fairfax, Florence, Glassell Park, Gramercy Park,
Granada Hills, Green Meadows, Hansen Dam, Harbor City, Harbor Gateway,
Harvard Heights, Harvard Park, Highland Park, Historic South-Central,
Hollywood Hills, Hollywood Hills West, Hyde Park, Jefferson Park, Lake Balboa,
Lake View Terrace, Larchmont, Leimert Park, Lincoln Heights, Manchester Square,
Mid-City, Mid-Wilshire, Mission Hills, Montecito Heights, Mount Washington,
North Hills, Northridge, Pacific Palisades, Pacoima, Panorama City,
Pico-Robertson, Pico-Union, Playa Vista, Playa del Rey, Porter Ranch,
Rancho Park, Reseda, Sawtelle, Sepulveda Basin, Shadow Hills, South Park,
Sun Valley, Sunland, Sylmar, Toluca Lake, Tujunga, University Park,
Valley Glen, Valley Village, Vermont Knolls, Vermont Square, Vermont Vista,
Vermont-Slauson, West Adams, West Hills, Westchester, Westlake, Wilmington,
Windsor Square, Winnetka, and more!
```

## Testing in Development

```bash
# Start your dev server
npm run dev

# Your map should now show all 114 real neighborhoods
# Open browser to http://localhost:3000
```

## Performance Considerations

The real GeoJSON is larger (967KB vs ~50KB for mock data):
- **Solution 1:** Use simplification (turf.simplify)
- **Solution 2:** Serve as compressed .geojson.gz
- **Solution 3:** Load dynamically with code splitting

## Need Help?

Check these files:
- `REAL_DATA_INTEGRATION.md` - Full documentation
- `scripts/convert-real-neighborhoods.ts` - Conversion script
- `scripts/fetch-crime-data.ts` - Crime data fetcher
