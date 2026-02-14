/**
 * Script to fetch real crime data from LA Open Data Portal
 *
 * This script:
 * 1. Fetches crime data from the LA City Open Data Portal
 * 2. Aggregates crime counts by neighborhood
 * 3. Maps crime types to our categories (violent, carTheft, breakIns, pettyTheft)
 * 4. Updates the neighborhood GeoJSON with real crime statistics
 *
 * Data Source: LA City Open Data - Crime Data from 2020 to Present
 * API: https://data.lacity.org/resource/2nrs-mtv8.json
 * Documentation: https://dev.socrata.com/foundry/data.lacity.org/2nrs-mtv8
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// LA Open Data API configuration
const API_BASE_URL = 'https://data.lacity.org/resource/2nrs-mtv8.json'
const APP_TOKEN = process.env.LA_OPEN_DATA_TOKEN // Optional but recommended

/**
 * Crime type mapping from LA Open Data to our categories
 */
const CRIME_TYPE_MAPPING = {
  violentCrime: [
    'ASSAULT WITH DEADLY WEAPON',
    'BATTERY',
    'ROBBERY',
    'CRIMINAL HOMICIDE',
    'MANSLAUGHTER',
    'RAPE',
    'SEX OFFENSES',
  ],
  carTheft: [
    'VEHICLE - STOLEN',
    'VEHICLE - ATTEMPT STOLEN',
  ],
  breakIns: [
    'BURGLARY',
    'BURGLARY FROM VEHICLE',
  ],
  pettyTheft: [
    'THEFT',
    'SHOPLIFTING',
    'PICKPOCKET',
    'PURSE SNATCHING',
  ],
}

interface CrimeRecord {
  'dr_no': string
  'date_rptd': string
  'date_occ': string
  'area_name': string
  'crm_cd_desc': string
  'location': string
  'lat': string
  'lon': string
}

interface NeighborhoodCrimeStats {
  violentCrime: number
  carTheft: number
  breakIns: number
  pettyTheft: number
}

/**
 * Categorize a crime description into our crime types
 */
function categorizeCrime(crimeDescription: string): keyof NeighborhoodCrimeStats | null {
  const upperDesc = crimeDescription.toUpperCase()

  for (const [category, patterns] of Object.entries(CRIME_TYPE_MAPPING)) {
    if (patterns.some(pattern => upperDesc.includes(pattern))) {
      return category as keyof NeighborhoodCrimeStats
    }
  }

  return null
}

/**
 * Fetch crime data from LA Open Data Portal
 */
async function fetchCrimeData(limit: number = 50000): Promise<CrimeRecord[]> {
  console.log(`Fetching crime data from LA Open Data Portal (limit: ${limit})...`)

  // Calculate date from 1 year ago
  const oneYearAgo = new Date()
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
  const dateFilter = oneYearAgo.toISOString().split('T')[0]

  const params = new URLSearchParams({
    '$limit': limit.toString(),
    '$where': `date_occ >= '${dateFilter}'`,
    '$order': 'date_occ DESC',
  })

  if (APP_TOKEN) {
    params.append('$$app_token', APP_TOKEN)
  }

  const url = `${API_BASE_URL}?${params.toString()}`

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const data = await response.json()
    console.log(`Fetched ${data.length} crime records`)
    return data
  } catch (error) {
    console.error('Error fetching crime data:', error)
    throw error
  }
}

/**
 * Map crime records to neighborhoods using point-in-polygon
 */
function mapCrimesToNeighborhoods(
  crimes: CrimeRecord[],
  neighborhoodsGeoJSON: any
): Map<string, NeighborhoodCrimeStats> {
  console.log('Mapping crimes to neighborhoods...')

  const neighborhoodStats = new Map<string, NeighborhoodCrimeStats>()

  // Initialize stats for all neighborhoods
  for (const feature of neighborhoodsGeoJSON.features) {
    neighborhoodStats.set(feature.properties.name, {
      violentCrime: 0,
      carTheft: 0,
      breakIns: 0,
      pettyTheft: 0,
    })
  }

  // For now, we'll use a simple area-based mapping
  // TODO: Implement proper point-in-polygon check using turf.js
  for (const crime of crimes) {
    const category = categorizeCrime(crime.crm_cd_desc)
    if (!category) continue

    // Use the area_name from the crime data as a simple mapping
    // This is approximate but works for initial integration
    const areaName = crime.area_name

    // Try to find matching neighborhood
    for (const feature of neighborhoodsGeoJSON.features) {
      const neighborhoodName = feature.properties.name

      // Simple name matching (can be improved with fuzzy matching)
      if (
        areaName.toLowerCase().includes(neighborhoodName.toLowerCase()) ||
        neighborhoodName.toLowerCase().includes(areaName.toLowerCase())
      ) {
        const stats = neighborhoodStats.get(neighborhoodName)
        if (stats) {
          stats[category]++
        }
        break
      }
    }
  }

  return neighborhoodStats
}

/**
 * Update neighborhood GeoJSON with crime statistics
 */
function updateNeighborhoodsWithCrimeData(
  neighborhoodsGeoJSON: any,
  crimeStats: Map<string, NeighborhoodCrimeStats>
): any {
  console.log('Updating neighborhood data with crime statistics...')

  return {
    ...neighborhoodsGeoJSON,
    features: neighborhoodsGeoJSON.features.map((feature: any) => {
      const stats = crimeStats.get(feature.properties.name)
      if (stats) {
        return {
          ...feature,
          properties: {
            ...feature.properties,
            ...stats,
          },
        }
      }
      return feature
    }),
  }
}

/**
 * Main function
 */
async function main() {
  try {
    const inputPath = path.join(__dirname, '../public/data/la-neighborhoods-converted.geojson')
    const outputPath = path.join(__dirname, '../public/data/la-neighborhoods-with-crime-data.geojson')

    // Load neighborhood data
    console.log('Loading neighborhood data from:', inputPath)
    const neighborhoodsData = JSON.parse(fs.readFileSync(inputPath, 'utf-8'))

    // Fetch crime data
    const crimeData = await fetchCrimeData()

    // Map crimes to neighborhoods
    const crimeStats = mapCrimesToNeighborhoods(crimeData, neighborhoodsData)

    // Update neighborhoods with crime data
    const updatedData = updateNeighborhoodsWithCrimeData(neighborhoodsData, crimeStats)

    // Save updated data
    fs.writeFileSync(outputPath, JSON.stringify(updatedData, null, 2))

    console.log(`\nSuccessfully saved crime data to: ${outputPath}`)
    console.log('\nSample statistics:')

    // Show top 5 neighborhoods by total crime
    const statsArray = Array.from(crimeStats.entries()).map(([name, stats]) => ({
      name,
      total: stats.violentCrime + stats.carTheft + stats.breakIns + stats.pettyTheft,
      ...stats,
    }))

    statsArray.sort((a, b) => b.total - a.total)

    console.log('\nTop 5 neighborhoods by total crime:')
    statsArray.slice(0, 5).forEach((stat, i) => {
      console.log(`${i + 1}. ${stat.name}: ${stat.total} total crimes`)
      console.log(`   Violent: ${stat.violentCrime}, Car Theft: ${stat.carTheft}, Break-ins: ${stat.breakIns}, Petty Theft: ${stat.pettyTheft}`)
    })

    console.log('\nNOTE: This uses simplified area name matching.')
    console.log('For more accurate results, implement point-in-polygon checking with turf.js')

  } catch (error) {
    console.error('Error:', error)
    process.exit(1)
  }
}

// Run the script
main()
