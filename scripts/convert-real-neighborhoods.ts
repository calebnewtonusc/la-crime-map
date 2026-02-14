/**
 * Script to convert LA Times neighborhood boundaries to our app format
 *
 * This script:
 * 1. Reads the real LA Times neighborhood GeoJSON from LA GeoHub
 * 2. Converts it to match our NeighborhoodGeoJSON type
 * 3. Initializes each neighborhood with placeholder crime data
 * 4. Outputs a properly formatted GeoJSON file
 *
 * Source: LA City GeoHub - LA Times Neighborhood Boundaries
 * https://geohub.lacity.org/datasets/d6c55385a0e749519f238b77135eafac_0
 */

import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Define the input/output types
interface LATimesProperties {
  OBJECTID: number
  name: string
}

interface LATimesFeature {
  type: 'Feature'
  properties: LATimesProperties
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][] | number[][][][]
  }
}

interface LATimesGeoJSON {
  type: 'FeatureCollection'
  features: LATimesFeature[]
}

interface NeighborhoodData {
  name: string
  violentCrime: number
  carTheft: number
  breakIns: number
  pettyTheft: number
  // Enhanced fields will be calculated by createNeighborhoodData
}

interface NeighborhoodFeature {
  type: 'Feature'
  properties: NeighborhoodData
  geometry: {
    type: 'Polygon' | 'MultiPolygon'
    coordinates: number[][][] | number[][][][]
  }
}

interface NeighborhoodGeoJSON {
  type: 'FeatureCollection'
  features: NeighborhoodFeature[]
}

/**
 * Generate placeholder crime data for a neighborhood
 * TODO: Replace with actual crime data from LA Open Data Portal
 */
function generatePlaceholderCrimeData(neighborhoodName: string): Omit<NeighborhoodData, 'name'> {
  // Use a simple hash of the neighborhood name to generate consistent random-ish data
  const hash = neighborhoodName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)

  // Generate values that are somewhat realistic but clearly marked as placeholders
  const seed = hash % 20

  return {
    violentCrime: Math.floor(seed * 0.5 + 2), // 2-12
    carTheft: Math.floor(seed * 0.6 + 4), // 4-16
    breakIns: Math.floor(seed * 0.7 + 5), // 5-19
    pettyTheft: Math.floor(seed * 0.9 + 8), // 8-26
  }
}

/**
 * Convert LA Times GeoJSON to our app format
 */
function convertToAppFormat(laTimesData: LATimesGeoJSON): NeighborhoodGeoJSON {
  const features: NeighborhoodFeature[] = laTimesData.features.map((feature) => {
    const name = feature.properties.name
    const crimeData = generatePlaceholderCrimeData(name)

    return {
      type: 'Feature',
      properties: {
        name,
        ...crimeData,
      },
      geometry: feature.geometry,
    }
  })

  return {
    type: 'FeatureCollection',
    features,
  }
}

/**
 * Main conversion function
 */
function main() {
  const inputPath = path.join(__dirname, '../public/data/la-neighborhoods-real.geojson')
  const outputPath = path.join(__dirname, '../public/data/la-neighborhoods-converted.geojson')

  console.log('Reading LA Times neighborhood data from:', inputPath)

  // Read the input file
  const rawData = fs.readFileSync(inputPath, 'utf-8')
  const laTimesData: LATimesGeoJSON = JSON.parse(rawData)

  console.log(`Found ${laTimesData.features.length} neighborhoods`)

  // Convert to our format
  const convertedData = convertToAppFormat(laTimesData)

  // Write output
  fs.writeFileSync(outputPath, JSON.stringify(convertedData, null, 2))

  console.log(`Successfully converted data to: ${outputPath}`)
  console.log('\nSample neighborhoods:')
  convertedData.features.slice(0, 5).forEach((feature) => {
    console.log(`  - ${feature.properties.name}`)
  })

  console.log('\nNOTE: Crime data is currently placeholder values.')
  console.log('Next step: Integrate real crime data from LA Open Data Portal')
  console.log('Crime data source: https://data.lacity.org/Public-Safety/Crime-Data-from-2020-to-Present/')
}

// Run the script
main()
