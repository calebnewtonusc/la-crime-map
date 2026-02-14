// API Route: Real Crime Data
// Serves aggregated crime data from LAPD Open Data Portal

import { NextRequest, NextResponse } from 'next/server'
import { aggregateCrimeDataForNeighborhoods, aggregateCrimeDataByDateRange } from '@/lib/services/crime-data-aggregator'
import { laNeighborhoods as rawNeighborhoods } from '@/lib/data/neighborhoods-real'

/**
 * GET /api/crime-data
 *
 * Query Parameters:
 * - days: Number of days to look back (default: 365)
 * - startDate: Start date (ISO string)
 * - endDate: End date (ISO string)
 *
 * Returns aggregated crime data for all neighborhoods
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const daysParam = searchParams.get('days')
    const startDateParam = searchParams.get('startDate')
    const endDateParam = searchParams.get('endDate')

    // Parse GeoJSON from raw neighborhoods
    const neighborhoodGeoJSON = {
      type: 'FeatureCollection' as const,
      features: rawNeighborhoods.features || [],
    }

    let result

    // Use date range if both dates provided
    if (startDateParam && endDateParam) {
      const startDate = new Date(startDateParam)
      const endDate = new Date(endDateParam)

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format' },
          { status: 400 }
        )
      }

      result = await aggregateCrimeDataByDateRange(
        neighborhoodGeoJSON,
        startDate,
        endDate
      )
    } else {
      // Use days parameter
      const days = daysParam ? parseInt(daysParam, 10) : 365

      if (isNaN(days) || days < 1 || days > 1825) {
        return NextResponse.json(
          { error: 'Days must be between 1 and 1825 (5 years)' },
          { status: 400 }
        )
      }

      result = await aggregateCrimeDataForNeighborhoods(neighborhoodGeoJSON, days)
    }

    // Return the aggregated data
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error) {
    console.error('Error in /api/crime-data:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/crime-data/refresh
 *
 * Force refresh the cache and return fresh data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { days = 365 } = body

    if (isNaN(days) || days < 1 || days > 1825) {
      return NextResponse.json(
        { error: 'Days must be between 1 and 1825 (5 years)' },
        { status: 400 }
      )
    }

    // Import and clear cache
    const { clearAPICache } = await import('@/lib/services/lapd-api')
    clearAPICache()

    const neighborhoodGeoJSON = {
      type: 'FeatureCollection' as const,
      features: rawNeighborhoods.features || [],
    }

    const result = await aggregateCrimeDataForNeighborhoods(neighborhoodGeoJSON, days)

    return NextResponse.json({
      ...result,
      refreshed: true,
    })
  } catch (error) {
    console.error('Error in /api/crime-data/refresh:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
