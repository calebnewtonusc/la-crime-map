// LA Neighborhood GeoJSON data with REAL boundaries
// Source: LA Times Mapping LA Project via LA City GeoHub
// 114 official neighborhoods with accurate geographic boundaries
// Crime data: placeholder values (to be replaced with real LAPD data)

import { NeighborhoodGeoJSON, BasicNeighborhoodData } from './types'
import { createNeighborhoodData } from '../utils/neighborhood-initializer'
import { laNeighborhoods as rawNeighborhoods } from './neighborhoods-real'

/**
 * Enhance raw GeoJSON data with full NeighborhoodData fields
 * This adds the enhanced analytics fields (percentiles, safety scores, etc.)
 * that are required by the NeighborhoodData type
 */
function enhanceNeighborhoodGeoJSON(raw: any): NeighborhoodGeoJSON {
  return {
    type: 'FeatureCollection',
    features: raw.features.map((feature: any) => ({
      type: 'Feature' as const,
      properties: createNeighborhoodData({
        name: feature.properties.name,
        violentCrime: feature.properties.violentCrime,
        carTheft: feature.properties.carTheft,
        breakIns: feature.properties.breakIns,
        pettyTheft: feature.properties.pettyTheft,
      } as BasicNeighborhoodData),
      geometry: feature.geometry,
    })),
  }
}

// Export enhanced neighborhood data with all required fields
export const laNeighborhoods: NeighborhoodGeoJSON = enhanceNeighborhoodGeoJSON(rawNeighborhoods)
