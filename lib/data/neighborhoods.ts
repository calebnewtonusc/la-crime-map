// LA Neighborhood GeoJSON data with REAL boundaries and REAL crime data
// Boundaries Source: LA Times Mapping LA Project via LA City GeoHub
// Crime Data Source: LAPD Open Data Portal (data.lacity.org)
// 114 official neighborhoods with accurate geographic boundaries
// Crime statistics: REAL DATA from official LAPD records

import { NeighborhoodGeoJSON } from './types'
import { laNeighborhoods as rawNeighborhoods } from './neighborhoods-real'

/**
 * DEPRECATED: This file now exports raw neighborhood boundaries only.
 *
 * For REAL crime data, use one of these approaches:
 *
 * 1. Use the API endpoint: GET /api/neighborhoods
 *    - Returns neighborhoods with real-time crime data from LAPD
 *    - Automatically aggregates and calculates statistics
 *    - Includes data freshness and quality metrics
 *
 * 2. Use the React hook: useRealCrimeData()
 *    - Fetches and manages real crime data
 *    - Provides loading states and error handling
 *    - Auto-refreshes data
 *
 * 3. For build-time data: Use the aggregation service directly
 *    - See lib/services/crime-data-aggregator.ts
 *
 * The old approach of using hard-coded placeholder data has been
 * COMPLETELY REPLACED with real LAPD data integration.
 */

// Export raw neighborhoods (boundaries only, no crime data)
// Crime data should be fetched from /api/neighborhoods or via useRealCrimeData()
export const laNeighborhoods: NeighborhoodGeoJSON = {
  type: 'FeatureCollection',
  features: rawNeighborhoods.features || [],
}

// NOTICE: The hard-coded crime statistics that were here have been REMOVED.
// All crime data now comes from real LAPD sources via the API.
// See /api/neighborhoods and /api/crime-data for real data endpoints.
