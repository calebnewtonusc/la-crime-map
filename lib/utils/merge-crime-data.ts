// Utility: Merge Real Crime Data with GeoJSON Boundaries
// Combines API data with neighborhood boundaries for map visualization

import { NeighborhoodCrimeData } from '../services/lapd-api-types'
import { NeighborhoodGeoJSON, NeighborhoodData } from '../data/types'

/**
 * Merge real crime data from API with GeoJSON neighborhood boundaries
 * @param crimeData - Real crime data from LAPD API
 * @param geoJSON - Neighborhood boundary data
 * @returns GeoJSON with crime data merged into properties
 */
export function mergeCrimeDataWithBoundaries(
  crimeData: NeighborhoodCrimeData[],
  geoJSON: NeighborhoodGeoJSON
): NeighborhoodGeoJSON {
  // Create a map of neighborhood names to crime data for fast lookup
  const crimeDataMap = new Map<string, NeighborhoodCrimeData>()
  crimeData.forEach((data) => {
    crimeDataMap.set(data.neighborhoodName.toLowerCase(), data)
  })

  // Merge crime data into GeoJSON features
  const updatedFeatures = geoJSON.features.map((feature) => {
    const neighborhoodName = feature.properties.name
    const crime = crimeDataMap.get(neighborhoodName.toLowerCase())

    if (!crime) {
      // No data for this neighborhood - keep existing static data
      console.warn(`No crime data found for neighborhood: ${neighborhoodName}`)
      return feature
    }

    // Merge crime data into properties
    const updatedProperties: NeighborhoodData = {
      ...feature.properties,
      violentCrime: crime.violentCrime,
      carTheft: crime.carTheft,
      breakIns: crime.breakIns,
      pettyTheft: crime.pettyTheft,
      lastUpdated: crime.lastUpdated,
      // Keep existing enhanced data if available, otherwise use defaults
      trendIndicator: feature.properties.trendIndicator || 'insufficient_data',
      dataQualityScore: 1.0, // Real data is high quality
      hasSufficientData: crime.incidentCount >= 50,
    }

    return {
      ...feature,
      properties: updatedProperties,
    }
  })

  return {
    ...geoJSON,
    features: updatedFeatures,
  }
}

/**
 * Calculate if data is stale (older than 48 hours)
 */
export function isDataStale(lastUpdated: string | Date): boolean {
  const updated = new Date(lastUpdated)
  const now = new Date()
  const hoursDiff = (now.getTime() - updated.getTime()) / (1000 * 60 * 60)
  return hoursDiff > 48
}

/**
 * Format last updated timestamp for display
 */
export function formatLastUpdated(lastUpdated: string | Date): string {
  const updated = new Date(lastUpdated)
  const now = new Date()
  const diffMs = now.getTime() - updated.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffHours < 1) {
    return 'Updated less than 1 hour ago'
  } else if (diffHours < 24) {
    return `Updated ${diffHours} hour${diffHours === 1 ? '' : 's'} ago`
  } else if (diffDays < 7) {
    return `Updated ${diffDays} day${diffDays === 1 ? '' : 's'} ago`
  } else {
    return `Updated on ${updated.toLocaleDateString()}`
  }
}
