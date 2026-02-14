# Real LA Neighborhood Data Integration

This document describes how we integrated **real, accurate Los Angeles neighborhood boundary data** into the LA Crime Map application.

## Data Sources

### 1. Neighborhood Boundaries
**Source:** LA City GeoHub - LA Times Neighborhood Boundaries
**URL:** https://geohub.lacity.org/datasets/d6c55385a0e749519f238b77135eafac_0
**Direct Download:** https://hub.arcgis.com/api/download/v1/items/d6c55385a0e749519f238b77135eafac/geojson?redirect=true&layers=0

- **Coverage:** 114 neighborhoods within the City of Los Angeles
- **Format:** GeoJSON (Polygon and MultiPolygon geometries)
- **Coordinate System:** WGS84 (EPSG:4326)
- **Data Quality:** Official boundaries from LA Times "Mapping LA" project
- **Last Updated:** October 7, 2016

### 2. Crime Data (Future Integration)
**Source:** LA City Open Data Portal - Crime Data from 2020 to Present
**URL:** https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/2nrs-mtv8
**API Endpoint:** https://data.lacity.org/resource/2nrs-mtv8.json

- **Format:** JSON via Socrata API
- **Update Frequency:** Daily
- **Records:** 2M+ crime incidents
- **Documentation:** https://dev.socrata.com/foundry/data.lacity.org/2nrs-mtv8

## Downloaded Files

### 1. Original Data
**File:** `/public/data/la-neighborhoods-real.geojson`
**Size:** 967KB
**Features:** 114 neighborhoods
**Content:** Raw LA Times neighborhood boundaries with basic properties (OBJECTID, name)

### 2. Converted Data
**File:** `/public/data/la-neighborhoods-converted.geojson`
**Features:** 114 neighborhoods
**Content:** Neighborhood boundaries converted to match our app's data structure with placeholder crime data

### 3. Crime Data Integration (To Be Generated)
**File:** `/public/data/la-neighborhoods-with-crime-data.geojson`
**Content:** Neighborhoods with real crime statistics from LA Open Data

## Complete List of Neighborhoods (114 total)

```
Adams-Normandie, Arleta, Arlington Heights, Atwater Village, Baldwin Hills/Crenshaw,
Bel-Air, Beverly Crest, Beverly Grove, Beverlywood, Boyle Heights, Brentwood,
Broadway-Manchester, Canoga Park, Carthay, Central-Alameda, Century City, Chatsworth,
Chatsworth Reservoir, Chesterfield Square, Cheviot Hills, Chinatown, Cypress Park,
Del Rey, Downtown, Eagle Rock, East Hollywood, Echo Park, El Sereno, Elysian Park,
Elysian Valley, Encino, Exposition Park, Fairfax, Florence, Glassell Park,
Gramercy Park, Granada Hills, Green Meadows, Griffith Park, Hancock Park, Hansen Dam,
Harbor City, Harbor Gateway, Harvard Heights, Harvard Park, Highland Park,
Historic South-Central, Hollywood, Hollywood Hills, Hollywood Hills West, Hyde Park,
Jefferson Park, Koreatown, Lake Balboa, Lake View Terrace, Larchmont, Leimert Park,
Lincoln Heights, Los Feliz, Manchester Square, Mar Vista, Mid-City, Mid-Wilshire,
Mission Hills, Montecito Heights, Mount Washington, North Hills, North Hollywood,
Northridge, Pacific Palisades, Pacoima, Palms, Panorama City, Pico-Robertson,
Pico-Union, Playa Vista, Playa del Rey, Porter Ranch, Rancho Park, Reseda,
San Pedro, Sawtelle, Sepulveda Basin, Shadow Hills, Sherman Oaks, Silver Lake,
South Park, Studio City, Sun Valley, Sunland, Sylmar, Tarzana, Toluca Lake, Tujunga,
University Park, Valley Glen, Valley Village, Van Nuys, Venice, Vermont Knolls,
Vermont Square, Vermont Vista, Vermont-Slauson, Watts, West Adams, West Hills,
West Los Angeles, Westchester, Westlake, Westwood, Wilmington, Windsor Square,
Winnetka, Woodland Hills
```

## Scripts

### 1. Download Script
```bash
# Download real neighborhood boundaries from LA GeoHub
curl -L -s "https://hub.arcgis.com/api/download/v1/items/d6c55385a0e749519f238b77135eafac/geojson?redirect=true&layers=0" \
  -o public/data/la-neighborhoods-real.geojson
```

### 2. Convert Script
**File:** `/scripts/convert-real-neighborhoods.ts`

Converts LA Times GeoJSON to our app format:
- Extracts neighborhood names
- Adds placeholder crime data fields
- Maintains original geometry
- Outputs to `la-neighborhoods-converted.geojson`

**Run:**
```bash
npx ts-node scripts/convert-real-neighborhoods.ts
```

### 3. Crime Data Fetch Script
**File:** `/scripts/fetch-crime-data.ts`

Fetches real crime data and integrates it:
- Fetches last 12 months of crime data from LA Open Data API
- Maps crimes to neighborhoods using area names
- Categorizes crimes into our 4 types (violent, carTheft, breakIns, pettyTheft)
- Updates GeoJSON with real statistics

**Run:**
```bash
# Optional: Set API token for higher rate limits
export LA_OPEN_DATA_TOKEN="your_token_here"

# Run the script
npx ts-node scripts/fetch-crime-data.ts
```

## Integration Steps

### Step 1: Download Real Boundaries ✅ COMPLETE
```bash
curl -L -s "https://hub.arcgis.com/api/download/v1/items/d6c55385a0e749519f238b77135eafac/geojson?redirect=true&layers=0" \
  -o /Users/joelnewton/Desktop/2026-Code/la-crime-map/public/data/la-neighborhoods-real.geojson
```

**Result:** 114 neighborhoods with accurate boundaries (967KB)

### Step 2: Convert to App Format ✅ COMPLETE
```bash
npx ts-node scripts/convert-real-neighborhoods.ts
```

**Result:** GeoJSON with placeholder crime data matching our NeighborhoodData interface

### Step 3: Fetch Real Crime Data (TODO)
```bash
npx ts-node scripts/fetch-crime-data.ts
```

**Result:** GeoJSON with real crime statistics from LA Open Data

### Step 4: Update App to Use Real Data (TODO)
```typescript
// In lib/data/neighborhoods.ts
import realNeighborhoods from '../../public/data/la-neighborhoods-with-crime-data.geojson'

export const laNeighborhoods: NeighborhoodGeoJSON = realNeighborhoods
```

## Data Structure

### Original LA Times Format
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "OBJECTID": 1,
        "name": "Adams-Normandie"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[lon, lat], ...]]
      }
    }
  ]
}
```

### Our App Format
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Adams-Normandie",
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

## Crime Type Mapping

Our app uses 4 crime categories. Here's how LA Open Data crime types map to them:

### Violent Crime
- Assault with Deadly Weapon
- Battery
- Robbery
- Criminal Homicide
- Manslaughter
- Rape
- Sex Offenses

### Car Theft
- Vehicle - Stolen
- Vehicle - Attempt Stolen

### Break-Ins
- Burglary
- Burglary from Vehicle

### Petty Theft
- Theft
- Shoplifting
- Pickpocket
- Purse Snatching

## Next Steps

1. **Implement Point-in-Polygon Matching**
   - Install turf.js: `npm install @turf/turf`
   - Use `turf.booleanPointInPolygon()` for accurate crime-to-neighborhood mapping
   - Current implementation uses simple area name matching

2. **Set Up Automated Updates**
   - Create a cron job to fetch crime data daily
   - Regenerate GeoJSON with updated statistics
   - Deploy updated data automatically

3. **Add Data Quality Indicators**
   - Show data freshness timestamps
   - Indicate confidence levels for crime statistics
   - Display data source attribution

4. **Enhance Visualizations**
   - Use real boundaries in the map component
   - Add neighborhood labels and hover effects
   - Implement crime density heatmaps

## API Rate Limits

**LA Open Data Portal:**
- Without token: 1,000 requests/day
- With app token: Higher limits (register at https://data.lacity.org/profile/app_tokens)

## References

- [LA City GeoHub](https://geohub.lacity.org/)
- [LA Open Data Portal](https://data.lacity.org/)
- [LA Times Mapping LA Project](https://geohub.lacity.org/datasets/la-times-neighborhood-boundaries)
- [Crime Data API Documentation](https://dev.socrata.com/foundry/data.lacity.org/2nrs-mtv8)
- [Socrata API Documentation](https://dev.socrata.com/)

## License & Attribution

**Neighborhood Boundaries:**
- Source: LA Times "Mapping LA" project
- Available through: City of Los Angeles GeoHub
- License: Public domain / Open Data

**Crime Data:**
- Source: Los Angeles Police Department
- Available through: LA City Open Data Portal
- License: Public domain / Open Data

**Attribution:**
Please include: "Neighborhood boundaries from LA Times Mapping LA. Crime data from LAPD via LA Open Data Portal."
