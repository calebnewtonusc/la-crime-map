// Crime Data Aggregator
// Fetches and aggregates real LAPD crime data for all neighborhoods

import { fetchRecentCrimeData, fetchCrimeDataByDateRange } from './lapd-api'
import { aggregateLegacyCrimeByNeighborhood, updateDateRange } from './neighborhood-mapper'
import { NeighborhoodCrimeData } from './lapd-api-types'
import { NeighborhoodFeature, NeighborhoodGeoJSON } from '../data/types'

export interface AggregatedCrimeResponse {
  neighborhoods: NeighborhoodCrimeData[]
  metadata: {
    totalIncidents: number
    dateRange: {
      start: string
      end: string
    }
    lastUpdated: string
    dataSource: string
    neighborhoods: number
    dataQuality: {
      mappedIncidents: number
      unmappedIncidents: number
      percentageMapped: number
    }
  }
  error?: string
}

/**
 * Fetch and aggregate crime data for all neighborhoods
 * @param days Number of days to look back (default: 365 for 1 year)
 * @param neighborhoodGeoJSON The GeoJSON data with neighborhood boundaries
 */
export async function aggregateCrimeDataForNeighborhoods(
  neighborhoodGeoJSON: NeighborhoodGeoJSON,
  days: number = 365
): Promise<AggregatedCrimeResponse> {
  try {
    console.log(`Fetching crime data for last ${days} days...`)

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    // Fetch crime data from LAPD API
    const crimeResponse = await fetchRecentCrimeData(days)

    if (crimeResponse.error) {
      console.error('Error fetching crime data:', crimeResponse.error)
      return {
        neighborhoods: [],
        metadata: {
          totalIncidents: 0,
          dateRange: {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          },
          lastUpdated: new Date().toISOString(),
          dataSource: 'LAPD Open Data Portal',
          neighborhoods: 0,
          dataQuality: {
            mappedIncidents: 0,
            unmappedIncidents: 0,
            percentageMapped: 0,
          },
        },
        error: crimeResponse.error,
      }
    }

    console.log(`Received ${crimeResponse.data.length} crime incidents`)

    // Aggregate by neighborhood
    const aggregation = aggregateLegacyCrimeByNeighborhood(
      crimeResponse.data,
      neighborhoodGeoJSON.features
    )

    // Update date ranges
    updateDateRange(aggregation, startDate, endDate)

    // Convert to array
    const neighborhoodsArray = Array.from(aggregation.values())

    // Calculate data quality metrics
    const totalIncidents = crimeResponse.data.length
    const mappedIncidents = neighborhoodsArray.reduce((sum, n) => sum + n.incidentCount, 0)
    const unmappedIncidents = totalIncidents - mappedIncidents
    const percentageMapped = totalIncidents > 0 ? (mappedIncidents / totalIncidents) * 100 : 0

    return {
      neighborhoods: neighborhoodsArray,
      metadata: {
        totalIncidents,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        lastUpdated: new Date().toISOString(),
        dataSource: crimeResponse.source,
        neighborhoods: neighborhoodsArray.length,
        dataQuality: {
          mappedIncidents,
          unmappedIncidents,
          percentageMapped: Math.round(percentageMapped * 100) / 100,
        },
      },
    }
  } catch (error) {
    console.error('Error in aggregateCrimeDataForNeighborhoods:', error)
    return {
      neighborhoods: [],
      metadata: {
        totalIncidents: 0,
        dateRange: {
          start: new Date().toISOString(),
          end: new Date().toISOString(),
        },
        lastUpdated: new Date().toISOString(),
        dataSource: 'LAPD Open Data Portal',
        neighborhoods: 0,
        dataQuality: {
          mappedIncidents: 0,
          unmappedIncidents: 0,
          percentageMapped: 0,
        },
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Fetch crime data for a specific date range
 */
export async function aggregateCrimeDataByDateRange(
  neighborhoodGeoJSON: NeighborhoodGeoJSON,
  startDate: Date,
  endDate: Date
): Promise<AggregatedCrimeResponse> {
  try {
    console.log(`Fetching crime data from ${startDate.toISOString()} to ${endDate.toISOString()}...`)

    // Fetch crime data from LAPD API
    const crimeResponse = await fetchCrimeDataByDateRange(startDate, endDate)

    if (crimeResponse.error) {
      console.error('Error fetching crime data:', crimeResponse.error)
      return {
        neighborhoods: [],
        metadata: {
          totalIncidents: 0,
          dateRange: {
            start: startDate.toISOString(),
            end: endDate.toISOString(),
          },
          lastUpdated: new Date().toISOString(),
          dataSource: 'LAPD Open Data Portal',
          neighborhoods: 0,
          dataQuality: {
            mappedIncidents: 0,
            unmappedIncidents: 0,
            percentageMapped: 0,
          },
        },
        error: crimeResponse.error,
      }
    }

    console.log(`Received ${crimeResponse.data.length} crime incidents`)

    // Aggregate by neighborhood
    const aggregation = aggregateLegacyCrimeByNeighborhood(
      crimeResponse.data,
      neighborhoodGeoJSON.features
    )

    // Update date ranges
    updateDateRange(aggregation, startDate, endDate)

    // Convert to array
    const neighborhoodsArray = Array.from(aggregation.values())

    // Calculate data quality metrics
    const totalIncidents = crimeResponse.data.length
    const mappedIncidents = neighborhoodsArray.reduce((sum, n) => sum + n.incidentCount, 0)
    const unmappedIncidents = totalIncidents - mappedIncidents
    const percentageMapped = totalIncidents > 0 ? (mappedIncidents / totalIncidents) * 100 : 0

    return {
      neighborhoods: neighborhoodsArray,
      metadata: {
        totalIncidents,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        lastUpdated: new Date().toISOString(),
        dataSource: crimeResponse.source,
        neighborhoods: neighborhoodsArray.length,
        dataQuality: {
          mappedIncidents,
          unmappedIncidents,
          percentageMapped: Math.round(percentageMapped * 100) / 100,
        },
      },
    }
  } catch (error) {
    console.error('Error in aggregateCrimeDataByDateRange:', error)
    return {
      neighborhoods: [],
      metadata: {
        totalIncidents: 0,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
        lastUpdated: new Date().toISOString(),
        dataSource: 'LAPD Open Data Portal',
        neighborhoods: 0,
        dataQuality: {
          mappedIncidents: 0,
          unmappedIncidents: 0,
          percentageMapped: 0,
        },
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Get crime statistics summary
 */
export function getCrimeStatsSummary(neighborhoods: NeighborhoodCrimeData[]) {
  if (neighborhoods.length === 0) {
    return {
      safest: null,
      mostDangerous: null,
      averages: {
        violent: 0,
        carTheft: 0,
        breakIns: 0,
        pettyTheft: 0,
        total: 0,
      },
      totals: {
        violent: 0,
        carTheft: 0,
        breakIns: 0,
        pettyTheft: 0,
        total: 0,
      },
    }
  }

  // Find safest and most dangerous
  const sortedByTotal = [...neighborhoods].sort((a, b) => a.totalCrimes - b.totalCrimes)
  const safest = sortedByTotal[0]
  const mostDangerous = sortedByTotal[sortedByTotal.length - 1]

  // Calculate totals
  const totals = neighborhoods.reduce(
    (acc, n) => ({
      violent: acc.violent + n.violentCrime,
      carTheft: acc.carTheft + n.carTheft,
      breakIns: acc.breakIns + n.breakIns,
      pettyTheft: acc.pettyTheft + n.pettyTheft,
      total: acc.total + n.totalCrimes,
    }),
    { violent: 0, carTheft: 0, breakIns: 0, pettyTheft: 0, total: 0 }
  )

  // Calculate averages
  const count = neighborhoods.length
  const averages = {
    violent: Math.round((totals.violent / count) * 100) / 100,
    carTheft: Math.round((totals.carTheft / count) * 100) / 100,
    breakIns: Math.round((totals.breakIns / count) * 100) / 100,
    pettyTheft: Math.round((totals.pettyTheft / count) * 100) / 100,
    total: Math.round((totals.total / count) * 100) / 100,
  }

  return {
    safest: {
      name: safest.neighborhoodName,
      totalCrimes: safest.totalCrimes,
    },
    mostDangerous: {
      name: mostDangerous.neighborhoodName,
      totalCrimes: mostDangerous.totalCrimes,
    },
    averages,
    totals,
  }
}
