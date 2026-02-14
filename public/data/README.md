# LA Crime Map - Data Files

This directory contains real Los Angeles neighborhood boundary data and crime statistics.

## Files

### la-neighborhoods-real.geojson
**Size:** 967 KB
**Neighborhoods:** 114
**Source:** LA City GeoHub - LA Times Neighborhood Boundaries
**URL:** https://geohub.lacity.org/datasets/d6c55385a0e749519f238b77135eafac_0

**Description:**
- Original, unmodified LA Times neighborhood boundaries
- Official data from the City of Los Angeles
- Properties: `OBJECTID`, `name`
- Geometry: Polygon and MultiPolygon (WGS84)

**Use this if:** You want the raw, original data

### la-neighborhoods-converted.geojson
**Size:** ~2 MB
**Neighborhoods:** 114
**Format:** Matches NeighborhoodGeoJSON type

**Description:**
- Converted from LA Times format to match our app's data structure
- Includes crime data fields: `violentCrime`, `carTheft`, `breakIns`, `pettyTheft`
- Currently uses placeholder crime statistics (hash-based)
- Ready to drop into the app immediately

**Use this if:** You want to quickly integrate real boundaries into the app

**Structure:**
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Downtown",
        "violentCrime": 10,
        "carTheft": 13,
        "breakIns": 16,
        "pettyTheft": 23
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[lon, lat], ...]]
      }
    }
  ]
}
```

### la-neighborhoods-with-crime-data.geojson
**Status:** To be generated
**Generate with:** `npx ts-node scripts/fetch-crime-data.ts`

**Description:**
- Same format as converted file
- Includes REAL crime statistics from LA Open Data Portal
- Crime data from last 12 months
- Maps actual LAPD crime incidents to neighborhoods

**Use this if:** You want real, live crime data

## Data Sources

### Neighborhood Boundaries
- **Source:** LA Times "Mapping LA" Project
- **Publisher:** City of Los Angeles GeoHub
- **License:** Public Domain / Open Data
- **Last Updated:** October 7, 2016
- **Accuracy:** Official city boundaries

### Crime Data (Future)
- **Source:** Los Angeles Police Department
- **Publisher:** LA City Open Data Portal
- **API:** https://data.lacity.org/resource/2nrs-mtv8.json
- **License:** Public Domain / Open Data
- **Update Frequency:** Daily

## All 114 Neighborhoods

Adams-Normandie, Arleta, Arlington Heights, Atwater Village, Baldwin Hills/Crenshaw, Bel-Air, Beverly Crest, Beverly Grove, Beverlywood, Boyle Heights, Brentwood, Broadway-Manchester, Canoga Park, Carthay, Central-Alameda, Century City, Chatsworth, Chatsworth Reservoir, Chesterfield Square, Cheviot Hills, Chinatown, Cypress Park, Del Rey, Downtown, Eagle Rock, East Hollywood, Echo Park, El Sereno, Elysian Park, Elysian Valley, Encino, Exposition Park, Fairfax, Florence, Glassell Park, Gramercy Park, Granada Hills, Green Meadows, Griffith Park, Hancock Park, Hansen Dam, Harbor City, Harbor Gateway, Harvard Heights, Harvard Park, Highland Park, Historic South-Central, Hollywood, Hollywood Hills, Hollywood Hills West, Hyde Park, Jefferson Park, Koreatown, Lake Balboa, Lake View Terrace, Larchmont, Leimert Park, Lincoln Heights, Los Feliz, Manchester Square, Mar Vista, Mid-City, Mid-Wilshire, Mission Hills, Montecito Heights, Mount Washington, North Hills, North Hollywood, Northridge, Pacific Palisades, Pacoima, Palms, Panorama City, Pico-Robertson, Pico-Union, Playa Vista, Playa del Rey, Porter Ranch, Rancho Park, Reseda, San Pedro, Sawtelle, Sepulveda Basin, Shadow Hills, Sherman Oaks, Silver Lake, South Park, Studio City, Sun Valley, Sunland, Sylmar, Tarzana, Toluca Lake, Tujunga, University Park, Valley Glen, Valley Village, Van Nuys, Venice, Vermont Knolls, Vermont Square, Vermont Vista, Vermont-Slauson, Watts, West Adams, West Hills, West Los Angeles, Westchester, Westlake, Westwood, Wilmington, Windsor Square, Winnetka, Woodland Hills

## Usage in App

### Quick Integration
```typescript
// lib/data/neighborhoods.ts
import realData from '../../public/data/la-neighborhoods-converted.geojson'

export const laNeighborhoods: NeighborhoodGeoJSON = realData as NeighborhoodGeoJSON
```

### With Real Crime Data
```typescript
// lib/data/neighborhoods.ts
import realData from '../../public/data/la-neighborhoods-with-crime-data.geojson'

export const laNeighborhoods: NeighborhoodGeoJSON = realData as NeighborhoodGeoJSON
```

## Scripts

See `/scripts/` directory for:
- `convert-real-neighborhoods.ts` - Convert LA Times format to app format
- `fetch-crime-data.ts` - Fetch real crime data from LA Open Data
- `integrate-real-data.sh` - Interactive integration helper

## Documentation

See project root for:
- `DATA_INTEGRATION_SUMMARY.md` - Quick overview
- `REAL_DATA_INTEGRATION.md` - Complete guide
- `scripts/QUICK_START.md` - Quick start guide

## Attribution

When using this data in production, please include:

```
Neighborhood boundaries from LA Times Mapping LA.
Crime data from LAPD via LA Open Data Portal.
```

## License

All data is in the public domain / open data.

## Questions?

See the main documentation files in the project root.
