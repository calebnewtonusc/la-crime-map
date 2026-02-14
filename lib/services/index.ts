// Real Crime Data Services - Export Index
// Central export point for all real data services

// API Services
export {
  fetchLAPDCrimeData,
  calculateNeighborhoodStats,
  getAvailableAreas,
  CACHE_DURATION,
} from './lapd-api'

// Types
export type {
  LAPDCrimeIncident,
  NIBRSOffense,
  NIBRSVictim,
  NeighborhoodCrimeData,
  LAPDAPIQueryParams,
  LAPDAPIResponse,
  CrimeCategory,
  CrimeTimeSeries,
} from './lapd-api-types'

// Crime Category Mappings
export {
  LEGACY_CRIME_MAPPINGS,
  NIBRS_CRIME_MAPPINGS,
  categorizeLegacyCrime,
  categorizeNIBRSCrime,
} from './crime-category-mappings'

// Neighborhood Mapping
export {
  findNeighborhoodByCoordinates,
  aggregateLegacyCrimeByNeighborhood,
  aggregateNIBRSCrimeByNeighborhood,
  updateDateRange,
  mergeAggregations,
  aggregationToSortedArray,
} from './neighborhood-mapper'

// Data Aggregation
export {
  aggregateCrimeDataForNeighborhoods,
  aggregateCrimeDataByDateRange,
  getCrimeStatsSummary,
} from './crime-data-aggregator'

export type { AggregatedCrimeResponse } from './crime-data-aggregator'

// Neighborhood Data Updater
export {
  updateNeighborhoodsWithRealData,
  calculateEnhancedAnalytics,
  processNeighborhoodData,
} from './neighborhood-data-updater'
