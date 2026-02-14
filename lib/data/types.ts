// Crime data types for LA Crime Map

export type CrimeMetric = 'violentCrime' | 'carTheft' | 'breakIns' | 'pettyTheft'

export type DateRange = '1week' | '1month' | '3months' | '1year'

export type TrendIndicator = 'improving' | 'worsening' | 'stable' | 'insufficient_data'

export interface BasicNeighborhoodData {
  name: string
  violentCrime: number
  carTheft: number
  breakIns: number
  pettyTheft: number
}

export interface EnhancedCrimeData {
  violentCrime: number
  carTheft: number
  breakIns: number
  pettyTheft: number
  violentCrimePerCapita: number | null
  carTheftPerCapita: number | null
  breakInsPerCapita: number | null
  pettyTheftPerCapita: number | null
  totalCrimePerCapita: number | null
  violentCrimePercentile: number | null
  carTheftPercentile: number | null
  breakInsPercentile: number | null
  pettyTheftPercentile: number | null
  overallSafetyPercentile: number | null
  safetyScore: number | null
  trendIndicator: TrendIndicator
  trendConfidence: number
  dataQualityScore: number
  hasSufficientData: boolean
  populationDataAvailable: boolean
  lastUpdated: Date
  vsCountyAverage: number | null
  confidenceIntervals: {
    violentCrime: [number, number]
    carTheft: [number, number]
    breakIns: [number, number]
    pettyTheft: [number, number]
  } | null
}

export interface NeighborhoodData extends EnhancedCrimeData {
  name: string
}

export interface NeighborhoodFeature {
  type: 'Feature'
  properties: NeighborhoodData
  geometry: {
    type: 'Polygon'
    coordinates: number[][][]
  }
}

export interface NeighborhoodGeoJSON {
  type: 'FeatureCollection'
  features: NeighborhoodFeature[]
}

export interface CrimeStats {
  totalNeighborhoods: number
  totalCrimes: number
  avgViolentCrime: number
  avgCarTheft: number
  avgBreakIns: number
  avgPettyTheft: number
  safestNeighborhood: string
  mostDangerous: string
  // Percentiles for comparative context
  medianViolentCrime: number
  medianCarTheft: number
  medianBreakIns: number
  medianPettyTheft: number
  percentile25ViolentCrime: number
  percentile75ViolentCrime: number
  percentile25CarTheft: number
  percentile75CarTheft: number
}
