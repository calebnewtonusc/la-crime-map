// API Route: Enhanced Neighborhoods with Real Crime Data
// Serves neighborhood GeoJSON with real crime statistics

import { NextRequest, NextResponse } from 'next/server'
import { aggregateCrimeDataForNeighborhoods } from '@/lib/services/crime-data-aggregator'
import { processNeighborhoodData } from '@/lib/services/neighborhood-data-updater'
import { laNeighborhoods as rawNeighborhoods } from '@/lib/data/neighborhoods-real'

/**
 * GET /api/neighborhoods
 *
 * Query Parameters:
 * - days: Number of days to look back for crime data (default: 365)
 * - includeMetadata: Include additional metadata (default: true)
 *
 * Returns complete neighborhood GeoJSON with real crime data and enhanced analytics
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const daysParam = searchParams.get('days')
    const includeMetadataParam = searchParams.get('includeMetadata')

    const days = daysParam ? parseInt(daysParam, 10) : 365
    const includeMetadata = includeMetadataParam !== 'false'

    if (isNaN(days) || days < 1 || days > 1825) {
      return NextResponse.json(
        { error: 'Days must be between 1 and 1825 (5 years)' },
        { status: 400 }
      )
    }

    // Parse GeoJSON from raw neighborhoods
    const neighborhoodGeoJSON = {
      type: 'FeatureCollection' as const,
      features: rawNeighborhoods.features || [],
    }

    // Fetch real crime data
    const crimeDataResult = await aggregateCrimeDataForNeighborhoods(neighborhoodGeoJSON, days)

    if (crimeDataResult.error) {
      console.error('Error fetching crime data:', crimeDataResult.error)
      // Return original data with error flag
      return NextResponse.json(
        {
          geojson: neighborhoodGeoJSON,
          metadata: {
            ...crimeDataResult.metadata,
            error: crimeDataResult.error,
            dataStatus: 'error',
          },
        },
        { status: 200 } // Still return 200 with original data
      )
    }

    // Process neighborhoods with real data
    const processedNeighborhoods = processNeighborhoodData(
      neighborhoodGeoJSON,
      crimeDataResult.neighborhoods
    )

    const response: any = {
      geojson: processedNeighborhoods,
    }

    if (includeMetadata) {
      response.metadata = {
        ...crimeDataResult.metadata,
        dataStatus: 'success',
        neighborhoods: processedNeighborhoods.features.length,
      }
    }

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    })
  } catch (error) {
    console.error('Error in /api/neighborhoods:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
