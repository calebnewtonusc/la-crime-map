# Neighborhood Coordinates Reference

This document provides sample coordinates for verification of geographic accuracy.

## Sample Neighborhoods with Center Points

| Neighborhood | Approx Center Lat/Lon | Coverage Area | Notes |
|--------------|----------------------|---------------|-------|
| **Downtown LA** | 34.048°N, 118.252°W | Central Business District | Includes Financial District, Arts District |
| **Beverly Hills** | 34.075°N, 118.397°W | Westside wealthy area | Between West LA and Hollywood |
| **Santa Monica** | 34.025°N, 118.495°W | Pacific Coast | Western terminus of Route 66 |
| **Long Beach** | 33.775°N, 118.180°W | South Bay port city | Major harbor and urban area |
| **Pasadena** | 34.147°N, 118.142°W | San Gabriel Valley | Northeast of downtown LA |
| **Compton** | 33.895°N, 118.212°W | South LA | Historic South Central area |
| **Hollywood** | 34.102°N, 118.327°W | Entertainment district | Hollywood Sign area |
| **Burbank** | 34.190°N, 118.315°W | Media City | Major film/TV studios |
| **Glendale** | 34.152°N, 118.255°W | San Fernando Valley | Northeast valley city |
| **Culver City** | 34.020°N, 118.387°W | Westside | Sony Pictures, major studios |

## Polygon Boundary Structure

Each neighborhood uses GeoJSON Polygon format:
```json
{
  "type": "Polygon",
  "coordinates": [[
    [longitude, latitude],  // Point 1
    [longitude, latitude],  // Point 2
    ...
    [longitude, latitude]   // Point N (closes polygon)
  ]]
}
```

### Example: Downtown LA Polygon
```javascript
coordinates: [[
  [-118.270, 34.048],  // Northwest corner
  [-118.270, 34.060],  // Northeast corner
  [-118.245, 34.060],  // Far northeast
  [-118.235, 34.048],  // East side
  [-118.235, 34.035],  // Southeast corner
  [-118.260, 34.035],  // Southwest corner
  [-118.270, 34.048]   // Back to start
]]
```

## Validation Checklist

- [x] All coordinates use [longitude, latitude] format (GeoJSON standard)
- [x] All polygons are closed (first point = last point)
- [x] Longitude values are negative (Western Hemisphere)
- [x] Latitude range: 33.74° to 34.22° N (valid for LA County)
- [x] Longitude range: -118.54° to -118.01° W (valid for LA County)
- [x] No overlapping major boundaries
- [x] Polygons form simple, non-self-intersecting shapes

## Crime Data Mapping

The LA City Open Data API uses area names that may differ from neighborhood names:
- "Central" → corresponds to Downtown LA
- "77th Street" → corresponds to South LA
- "Pacific" → corresponds to Venice/Marina del Rey area
- "Wilshire" → corresponds to Koreatown/West LA
- "Hollywood" → exact match
- "West LA" → exact match

The crime service (`crimeDataService.ts`) handles this mapping automatically.

## Geographic Notes

1. **San Fernando Valley**: Separated from LA Basin by Santa Monica Mountains
2. **Westside**: Generally west of I-405 and north of I-10
3. **South LA**: Historically south of Downtown to ~105 Freeway
4. **South Bay**: Coastal areas south of LAX
5. **East LA/SGV**: East of LA River and I-710

## Accuracy Level

- Coordinates are approximations based on common boundaries
- Suitable for visualization and general analysis
- For legal/official use, consult LA County GIS official boundaries
- Real crime data from LAPD uses police district boundaries which may differ

---

**Data Source**: Approximate boundaries based on common geographic understanding
**Coordinate System**: WGS84 (EPSG:4326)
**Format**: GeoJSON
**Precision**: ~0.001° (~100 meters)
