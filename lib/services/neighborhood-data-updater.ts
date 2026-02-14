// Neighborhood Data Updater
// Updates neighborhood GeoJSON with real crime data and enhanced analytics

import { NeighborhoodGeoJSON, NeighborhoodData, NeighborhoodFeature } from '../data/types'
import { NeighborhoodCrimeData } from './lapd-api-types'
import { createNeighborhoodData } from '../utils/neighborhood-initializer'

/**
 * Update neighborhood GeoJSON with real crime data
 */
export function updateNeighborhoodsWithRealData(
  originalGeoJSON: NeighborhoodGeoJSON,
  crimeData: NeighborhoodCrimeData[]
): NeighborhoodGeoJSON {
  // Create a map for quick lookup
  const crimeDataMap = new Map<string, NeighborhoodCrimeData>()
  crimeData.forEach((data) => {
    crimeDataMap.set(data.neighborhoodName.toLowerCase(), data)
  })

  // Update each neighborhood feature
  const updatedFeatures = originalGeoJSON.features.map((feature) => {
    const neighborhoodName = feature.properties.name.toLowerCase()
    const realData = crimeDataMap.get(neighborhoodName)

    if (realData) {
      // Update with real data
      const updatedProperties = createNeighborhoodData({
        name: feature.properties.name,
        violentCrime: realData.violentCrime,
        carTheft: realData.carTheft,
        breakIns: realData.breakIns,
        pettyTheft: realData.pettyTheft,
      })

      // Add metadata from real data
      updatedProperties.lastUpdated = realData.lastUpdated
      updatedProperties.hasSufficientData = realData.incidentCount > 0

      return {
        ...feature,
        properties: updatedProperties,
      }
    }

    // Keep original data if no real data available
    return feature
  })

  return {
    type: 'FeatureCollection',
    features: updatedFeatures,
  }
}

/**
 * Calculate enhanced analytics for all neighborhoods
 */
export function calculateEnhancedAnalytics(neighborhoods: NeighborhoodGeoJSON): NeighborhoodGeoJSON {
  const features = neighborhoods.features

  // Calculate percentiles for each crime type
  const violentCrimes = features.map((f) => f.properties.violentCrime).sort((a, b) => a - b)
  const carThefts = features.map((f) => f.properties.carTheft).sort((a, b) => a - b)
  const breakIns = features.map((f) => f.properties.breakIns).sort((a, b) => a - b)
  const pettyThefts = features.map((f) => f.properties.pettyTheft).sort((a, b) => a - b)
  const totalCrimes = features.map(
    (f) => f.properties.violentCrime + f.properties.carTheft + f.properties.breakIns + f.properties.pettyTheft
  ).sort((a, b) => a - b)

  const calculatePercentile = (value: number, sortedArray: number[]): number => {
    const index = sortedArray.indexOf(value)
    return (index / (sortedArray.length - 1)) * 100
  }

  // Calculate overall averages for county comparison
  const avgViolent = violentCrimes.reduce((a, b) => a + b, 0) / violentCrimes.length
  const avgCarTheft = carThefts.reduce((a, b) => a + b, 0) / carThefts.length
  const avgBreakIns = breakIns.reduce((a, b) => a + b, 0) / breakIns.length
  const avgPettyTheft = pettyThefts.reduce((a, b) => a + b, 0) / pettyThefts.length
  const avgTotal = totalCrimes.reduce((a, b) => a + b, 0) / totalCrimes.length

  // Update each feature with enhanced analytics
  const enhancedFeatures = features.map((feature) => {
    const props = feature.properties
    const total = props.violentCrime + props.carTheft + props.breakIns + props.pettyTheft

    // Calculate percentiles (lower is better/safer)
    const violentCrimePercentile = calculatePercentile(props.violentCrime, violentCrimes)
    const carTheftPercentile = calculatePercentile(props.carTheft, carThefts)
    const breakInsPercentile = calculatePercentile(props.breakIns, breakIns)
    const pettyTheftPercentile = calculatePercentile(props.pettyTheft, pettyThefts)
    const totalPercentile = calculatePercentile(total, totalCrimes)

    // Overall safety percentile (inverted - higher is safer)
    const overallSafetyPercentile = 100 - totalPercentile

    // Safety score (0-100, higher is safer)
    const safetyScore = Math.round(overallSafetyPercentile)

    // Calculate vs county average (negative means below average/safer)
    const vsCountyAverage = total > 0 ? ((total - avgTotal) / avgTotal) * 100 : null

    // Determine trend (would need historical data, using placeholder for now)
    const trendIndicator = 'insufficient_data' as const
    const trendConfidence = 0

    // Data quality score based on crime counts
    const dataQualityScore = total > 0 ? 100 : 50

    const updatedProperties: NeighborhoodData = {
      ...props,
      violentCrimePercentile: Math.round(violentCrimePercentile * 100) / 100,
      carTheftPercentile: Math.round(carTheftPercentile * 100) / 100,
      breakInsPercentile: Math.round(breakInsPercentile * 100) / 100,
      pettyTheftPercentile: Math.round(pettyTheftPercentile * 100) / 100,
      overallSafetyPercentile: Math.round(overallSafetyPercentile * 100) / 100,
      safetyScore,
      trendIndicator,
      trendConfidence,
      dataQualityScore,
      hasSufficientData: total > 0,
      vsCountyAverage: vsCountyAverage !== null ? Math.round(vsCountyAverage * 100) / 100 : null,
    }

    return {
      ...feature,
      properties: updatedProperties,
    }
  })

  return {
    type: 'FeatureCollection',
    features: enhancedFeatures,
  }
}

/**
 * Full pipeline: update with real data and calculate analytics
 */
export function processNeighborhoodData(
  originalGeoJSON: NeighborhoodGeoJSON,
  crimeData: NeighborhoodCrimeData[]
): NeighborhoodGeoJSON {
  // Step 1: Update with real crime data
  const updatedWithRealData = updateNeighborhoodsWithRealData(originalGeoJSON, crimeData)

  // Step 2: Calculate enhanced analytics
  const fullyProcessed = calculateEnhancedAnalytics(updatedWithRealData)

  return fullyProcessed
}
