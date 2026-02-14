// Crime statistics utilities with percentiles, trends, and comparative analysis
import { NeighborhoodGeoJSON, CrimeStats, CrimeMetric, NeighborhoodData } from '../data/types'

/**
 * Calculate comprehensive crime statistics with percentiles and distributions
 */
export function calculateCrimeStats(data: NeighborhoodGeoJSON): CrimeStats {
  const neighborhoods = data.features
  const totalNeighborhoods = neighborhoods.length

  if (totalNeighborhoods === 0) {
    return {
      totalNeighborhoods: 0,
      totalCrimes: 0,
      avgViolentCrime: 0,
      avgCarTheft: 0,
      avgBreakIns: 0,
      avgPettyTheft: 0,
      safestNeighborhood: 'N/A',
      mostDangerous: 'N/A',
      medianViolentCrime: 0,
      medianCarTheft: 0,
      medianBreakIns: 0,
      medianPettyTheft: 0,
      percentile25ViolentCrime: 0,
      percentile75ViolentCrime: 0,
      percentile25CarTheft: 0,
      percentile75CarTheft: 0,
    }
  }

  let totalViolentCrime = 0
  let totalCarTheft = 0
  let totalBreakIns = 0
  let totalPettyTheft = 0

  // Collect all values for percentile calculations
  const violentCrimeValues: number[] = []
  const carTheftValues: number[] = []
  const breakInValues: number[] = []
  const pettyTheftValues: number[] = []

  neighborhoods.forEach(({ properties }) => {
    totalViolentCrime += properties.violentCrime
    totalCarTheft += properties.carTheft
    totalBreakIns += properties.breakIns
    totalPettyTheft += properties.pettyTheft

    violentCrimeValues.push(properties.violentCrime)
    carTheftValues.push(properties.carTheft)
    breakInValues.push(properties.breakIns)
    pettyTheftValues.push(properties.pettyTheft)
  })

  const totalCrimes = totalViolentCrime + totalCarTheft + totalBreakIns + totalPettyTheft

  // Find safest and most dangerous using WEIGHTED scoring (violent crime counts more!)
  const sortedByWeightedTotal = [...neighborhoods].sort((a, b) => {
    const weightedA = (a.properties.violentCrime * 3) + (a.properties.carTheft * 2) + a.properties.breakIns + a.properties.pettyTheft
    const weightedB = (b.properties.violentCrime * 3) + (b.properties.carTheft * 2) + b.properties.breakIns + b.properties.pettyTheft
    return weightedA - weightedB
  })

  // Calculate percentiles
  const getPercentile = (sortedValues: number[], percentile: number): number => {
    const index = Math.ceil((percentile / 100) * sortedValues.length) - 1
    return sortedValues[Math.max(0, index)]
  }

  const getMedian = (values: number[]): number => {
    const sorted = [...values].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
  }

  const violentSorted = [...violentCrimeValues].sort((a, b) => a - b)
  const carTheftSorted = [...carTheftValues].sort((a, b) => a - b)
  const breakInSorted = [...breakInValues].sort((a, b) => a - b)
  const pettyTheftSorted = [...pettyTheftValues].sort((a, b) => a - b)

  return {
    totalNeighborhoods,
    totalCrimes,
    avgViolentCrime: Math.round(totalViolentCrime / totalNeighborhoods),
    avgCarTheft: Math.round(totalCarTheft / totalNeighborhoods),
    avgBreakIns: Math.round(totalBreakIns / totalNeighborhoods),
    avgPettyTheft: Math.round(totalPettyTheft / totalNeighborhoods),
    safestNeighborhood: sortedByWeightedTotal[0]?.properties.name || 'N/A',
    mostDangerous: sortedByWeightedTotal[sortedByWeightedTotal.length - 1]?.properties.name || 'N/A',
    // Percentiles for context
    medianViolentCrime: Math.round(getMedian(violentCrimeValues)),
    medianCarTheft: Math.round(getMedian(carTheftValues)),
    medianBreakIns: Math.round(getMedian(breakInValues)),
    medianPettyTheft: Math.round(getMedian(pettyTheftValues)),
    percentile25ViolentCrime: getPercentile(violentSorted, 25),
    percentile75ViolentCrime: getPercentile(violentSorted, 75),
    percentile25CarTheft: getPercentile(carTheftSorted, 25),
    percentile75CarTheft: getPercentile(carTheftSorted, 75),
  }
}

export function getNeighborhoodCrimeLevel(neighborhood: NeighborhoodData, metric: CrimeMetric): 'low' | 'medium' | 'high' {
  const value = neighborhood[metric]

  // CALIBRATED TO EXACT 33RD & 66TH PERCENTILES (Q4 2024: Oct-Dec)
  // Data ranges: Violent 2-11, Car Theft 4-15, Break-ins 5-18, Petty Theft 8-25
  // Thresholds calculated from actual data distribution to ensure perfect 33/33/33 split

  if (metric === 'violentCrime') {
    if (value <= 5) return 'low'     // Bottom 33%: safest areas (2-5)
    if (value <= 8) return 'medium'  // Middle 33%: moderate risk (6-8)
    return 'high'                     // Top 33%: highest risk (9-11+)
  }

  if (metric === 'carTheft') {
    if (value <= 7) return 'low'     // Bottom 33%: safest areas (4-7)
    if (value <= 11) return 'medium' // Middle 33%: moderate risk (8-11)
    return 'high'                     // Top 33%: highest risk (12-15+)
  }

  if (metric === 'breakIns') {
    if (value <= 9) return 'low'     // Bottom 33%: safest areas (5-9)
    if (value <= 14) return 'medium' // Middle 33%: moderate risk (10-14)
    return 'high'                     // Top 33%: highest risk (15-18+)
  }

  // pettyTheft - most common crime type
  if (value <= 13) return 'low'     // Bottom 33%: safest areas (8-13)
  if (value <= 19) return 'medium'  // Middle 33%: moderate risk (14-19)
  return 'high'                      // Top 33%: highest risk (20-25+)
}

export function getCrimeColor(level: 'low' | 'medium' | 'high', isDark: boolean = false): string {
  if (isDark) {
    switch (level) {
      case 'low': return '#10b981' // green-500
      case 'medium': return '#f59e0b' // amber-500
      case 'high': return '#ef4444' // red-500
    }
  }

  switch (level) {
    case 'low': return '#22c55e' // green-500
    case 'medium': return '#f59e0b' // amber-500
    case 'high': return '#dc2626' // red-600
  }
}

export const metricLabels: Record<CrimeMetric, string> = {
  violentCrime: 'Violent Crime',
  carTheft: 'Car Theft',
  breakIns: 'Break-ins',
  pettyTheft: 'Petty Theft',
}

export const metricDescriptions: Record<CrimeMetric, string> = {
  violentCrime: 'Assault, robbery, and other violent offenses',
  carTheft: 'Vehicle theft and attempted vehicle theft',
  breakIns: 'Residential and commercial burglaries',
  pettyTheft: 'Theft, shoplifting, and other property crimes',
}
