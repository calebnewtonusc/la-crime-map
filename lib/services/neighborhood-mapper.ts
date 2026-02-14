// Neighborhood Mapping Service
// Maps crime incidents to LA Times neighborhoods using lat/lon coordinates

import { LAPDCrimeIncident, NIBRSOffense, NeighborhoodCrimeData } from './lapd-api-types'
import { categorizeLegacyCrime, categorizeNIBRSCrime } from './crime-category-mappings'
import { NeighborhoodFeature } from '../data/types'

/**
 * Check if a point (lat, lon) is inside a polygon using ray casting algorithm
 */
function pointInPolygon(lat: number, lon: number, polygon: number[][][]): boolean {
  // Handle MultiPolygon by checking first polygon
  const coords = polygon[0]
  let inside = false

  for (let i = 0, j = coords.length - 1; i < coords.length; j = i++) {
    const xi = coords[i][0]
    const yi = coords[i][1]
    const xj = coords[j][0]
    const yj = coords[j][1]

    const intersect = yi > lat !== yj > lat && lon < ((xj - xi) * (lat - yi)) / (yj - yi) + xi

    if (intersect) inside = !inside
  }

  return inside
}

/**
 * Find which neighborhood a crime incident belongs to based on coordinates
 */
export function findNeighborhoodByCoordinates(
  lat: number,
  lon: number,
  neighborhoods: NeighborhoodFeature[]
): NeighborhoodFeature | null {
  for (const neighborhood of neighborhoods) {
    if (neighborhood.geometry.type === 'Polygon') {
      if (pointInPolygon(lat, lon, neighborhood.geometry.coordinates)) {
        return neighborhood
      }
    }
  }
  return null
}

/**
 * Aggregate legacy crime incidents by neighborhood
 */
export function aggregateLegacyCrimeByNeighborhood(
  incidents: LAPDCrimeIncident[],
  neighborhoods: NeighborhoodFeature[]
): Map<string, NeighborhoodCrimeData> {
  const aggregation = new Map<string, NeighborhoodCrimeData>()

  // Initialize all neighborhoods with zero counts
  neighborhoods.forEach((neighborhood) => {
    aggregation.set(neighborhood.properties.name, {
      neighborhoodName: neighborhood.properties.name,
      violentCrime: 0,
      carTheft: 0,
      breakIns: 0,
      pettyTheft: 0,
      totalCrimes: 0,
      lastUpdated: new Date(),
      dataSource: 'legacy',
      dateRange: {
        start: new Date(),
        end: new Date(),
      },
      incidentCount: 0,
    })
  })

  let mappedCount = 0
  let unmappedCount = 0
  let invalidCoordinates = 0

  // Process each incident
  incidents.forEach((incident) => {
    // Parse coordinates
    const lat = parseFloat(incident.lat)
    const lon = parseFloat(incident.lon)

    // Skip invalid coordinates
    if (isNaN(lat) || isNaN(lon) || lat === 0 || lon === 0) {
      invalidCoordinates++
      return
    }

    // Find which neighborhood this incident belongs to
    const neighborhood = findNeighborhoodByCoordinates(lat, lon, neighborhoods)

    if (!neighborhood) {
      unmappedCount++
      return
    }

    // Categorize the crime
    const category = categorizeLegacyCrime(incident.crm_cd, incident.crm_cd_desc)

    if (!category) {
      // Unknown crime type, still count as total
      const data = aggregation.get(neighborhood.properties.name)!
      data.totalCrimes++
      data.incidentCount++
      return
    }

    // Update the counts
    const data = aggregation.get(neighborhood.properties.name)!
    data.incidentCount++
    data.totalCrimes++

    switch (category) {
      case 'violent':
        data.violentCrime++
        break
      case 'car_theft':
        data.carTheft++
        break
      case 'break_in':
        data.breakIns++
        break
      case 'petty_theft':
        data.pettyTheft++
        break
    }

    mappedCount++
  })

  console.log(`Crime mapping stats:`)
  console.log(`  Total incidents: ${incidents.length}`)
  console.log(`  Mapped to neighborhoods: ${mappedCount}`)
  console.log(`  Unmapped (outside boundaries): ${unmappedCount}`)
  console.log(`  Invalid coordinates: ${invalidCoordinates}`)

  return aggregation
}

/**
 * Aggregate NIBRS crime offenses by neighborhood
 */
export function aggregateNIBRSCrimeByNeighborhood(
  offenses: NIBRSOffense[],
  neighborhoods: NeighborhoodFeature[]
): Map<string, NeighborhoodCrimeData> {
  const aggregation = new Map<string, NeighborhoodCrimeData>()

  // Initialize all neighborhoods with zero counts
  neighborhoods.forEach((neighborhood) => {
    aggregation.set(neighborhood.properties.name, {
      neighborhoodName: neighborhood.properties.name,
      violentCrime: 0,
      carTheft: 0,
      breakIns: 0,
      pettyTheft: 0,
      totalCrimes: 0,
      lastUpdated: new Date(),
      dataSource: 'nibrs',
      dateRange: {
        start: new Date(),
        end: new Date(),
      },
      incidentCount: 0,
    })
  })

  let mappedCount = 0
  let unmappedCount = 0
  let invalidCoordinates = 0

  // Process each offense
  offenses.forEach((offense) => {
    // Parse coordinates
    const lat = parseFloat(offense.location_latitude || '0')
    const lon = parseFloat(offense.location_longitude || '0')

    // Skip invalid coordinates
    if (isNaN(lat) || isNaN(lon) || lat === 0 || lon === 0) {
      invalidCoordinates++
      return
    }

    // Find which neighborhood this offense belongs to
    const neighborhood = findNeighborhoodByCoordinates(lat, lon, neighborhoods)

    if (!neighborhood) {
      unmappedCount++
      return
    }

    // Categorize the crime
    const category = categorizeNIBRSCrime(offense.offense_description)

    if (!category) {
      // Unknown crime type, still count as total
      const data = aggregation.get(neighborhood.properties.name)!
      data.totalCrimes++
      data.incidentCount++
      return
    }

    // Update the counts
    const data = aggregation.get(neighborhood.properties.name)!
    data.incidentCount++
    data.totalCrimes++

    switch (category) {
      case 'violent':
        data.violentCrime++
        break
      case 'car_theft':
        data.carTheft++
        break
      case 'break_in':
        data.breakIns++
        break
      case 'petty_theft':
        data.pettyTheft++
        break
    }

    mappedCount++
  })

  console.log(`NIBRS crime mapping stats:`)
  console.log(`  Total offenses: ${offenses.length}`)
  console.log(`  Mapped to neighborhoods: ${mappedCount}`)
  console.log(`  Unmapped (outside boundaries): ${unmappedCount}`)
  console.log(`  Invalid coordinates: ${invalidCoordinates}`)

  return aggregation
}

/**
 * Update date range for aggregated data
 */
export function updateDateRange(
  aggregation: Map<string, NeighborhoodCrimeData>,
  startDate: Date,
  endDate: Date
): void {
  aggregation.forEach((data) => {
    data.dateRange = {
      start: startDate,
      end: endDate,
    }
  })
}

/**
 * Merge multiple aggregations (e.g., combining legacy and NIBRS data)
 */
export function mergeAggregations(
  aggregations: Map<string, NeighborhoodCrimeData>[]
): Map<string, NeighborhoodCrimeData> {
  const merged = new Map<string, NeighborhoodCrimeData>()

  // Get all unique neighborhood names
  const allNeighborhoods = new Set<string>()
  aggregations.forEach((agg) => {
    agg.forEach((_, name) => allNeighborhoods.add(name))
  })

  // Merge data for each neighborhood
  allNeighborhoods.forEach((name) => {
    const combined: NeighborhoodCrimeData = {
      neighborhoodName: name,
      violentCrime: 0,
      carTheft: 0,
      breakIns: 0,
      pettyTheft: 0,
      totalCrimes: 0,
      lastUpdated: new Date(),
      dataSource: 'combined',
      dateRange: {
        start: new Date(),
        end: new Date(),
      },
      incidentCount: 0,
    }

    // Sum up all sources
    aggregations.forEach((agg) => {
      const data = agg.get(name)
      if (data) {
        combined.violentCrime += data.violentCrime
        combined.carTheft += data.carTheft
        combined.breakIns += data.breakIns
        combined.pettyTheft += data.pettyTheft
        combined.totalCrimes += data.totalCrimes
        combined.incidentCount += data.incidentCount

        // Use earliest start date and latest end date
        if (data.dateRange.start < combined.dateRange.start) {
          combined.dateRange.start = data.dateRange.start
        }
        if (data.dateRange.end > combined.dateRange.end) {
          combined.dateRange.end = data.dateRange.end
        }
      }
    })

    merged.set(name, combined)
  })

  return merged
}

/**
 * Convert aggregation map to array sorted by total crimes
 */
export function aggregationToSortedArray(
  aggregation: Map<string, NeighborhoodCrimeData>
): NeighborhoodCrimeData[] {
  return Array.from(aggregation.values()).sort((a, b) => b.totalCrimes - a.totalCrimes)
}
