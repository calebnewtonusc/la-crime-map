// Initialize neighborhood data with default enhanced analytics values
import { NeighborhoodData, BasicNeighborhoodData } from '../data/types'

/**
 * Create a neighborhood data object with default enhanced values
 * This is used for initial/placeholder data before real API data is loaded
 */
export function createNeighborhoodData(basic: BasicNeighborhoodData): NeighborhoodData {
  return {
    name: basic.name,
    violentCrime: basic.violentCrime,
    carTheft: basic.carTheft,
    breakIns: basic.breakIns,
    pettyTheft: basic.pettyTheft,

    // Per capita rates - null until real data is loaded
    violentCrimePerCapita: null,
    carTheftPerCapita: null,
    breakInsPerCapita: null,
    pettyTheftPerCapita: null,
    totalCrimePerCapita: null,

    // Percentile rankings - null until calculated
    violentCrimePercentile: null,
    carTheftPercentile: null,
    breakInsPercentile: null,
    pettyTheftPercentile: null,
    overallSafetyPercentile: null,

    // Safety score - null until calculated
    safetyScore: null,

    // Trend indicators
    trendIndicator: 'insufficient_data',
    trendConfidence: 0,

    // Data quality metrics
    dataQualityScore: 50, // Default moderate quality
    hasSufficientData: false, // Will be updated when real data loads
    populationDataAvailable: false,
    lastUpdated: new Date(),

    // Comparison to county average - null until calculated
    vsCountyAverage: null,

    // Confidence intervals - null until calculated
    confidenceIntervals: null,
  }
}
