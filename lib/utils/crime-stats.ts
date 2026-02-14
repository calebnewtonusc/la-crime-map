// Crime statistics utilities
import { NeighborhoodGeoJSON, CrimeStats, CrimeMetric, NeighborhoodData } from '../data/types'

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
    }
  }

  let totalViolentCrime = 0
  let totalCarTheft = 0
  let totalBreakIns = 0
  let totalPettyTheft = 0

  neighborhoods.forEach(({ properties }) => {
    totalViolentCrime += properties.violentCrime
    totalCarTheft += properties.carTheft
    totalBreakIns += properties.breakIns
    totalPettyTheft += properties.pettyTheft
  })

  const totalCrimes = totalViolentCrime + totalCarTheft + totalBreakIns + totalPettyTheft

  // Find safest and most dangerous
  const sortedByTotal = [...neighborhoods].sort((a, b) => {
    const totalA = a.properties.violentCrime + a.properties.carTheft + a.properties.breakIns + a.properties.pettyTheft
    const totalB = b.properties.violentCrime + b.properties.carTheft + b.properties.breakIns + b.properties.pettyTheft
    return totalA - totalB
  })

  return {
    totalNeighborhoods,
    totalCrimes,
    avgViolentCrime: Math.round(totalViolentCrime / totalNeighborhoods),
    avgCarTheft: Math.round(totalCarTheft / totalNeighborhoods),
    avgBreakIns: Math.round(totalBreakIns / totalNeighborhoods),
    avgPettyTheft: Math.round(totalPettyTheft / totalNeighborhoods),
    safestNeighborhood: sortedByTotal[0]?.properties.name || 'N/A',
    mostDangerous: sortedByTotal[sortedByTotal.length - 1]?.properties.name || 'N/A',
  }
}

export function getNeighborhoodCrimeLevel(neighborhood: NeighborhoodData, metric: CrimeMetric): 'low' | 'medium' | 'high' {
  const value = neighborhood[metric]

  // CALIBRATED TO ACTUAL DATA RANGES (Q4 2024: Oct-Dec)
  // Data ranges: Violent 2-11, Car Theft 4-15, Break-ins 5-18, Petty Theft 8-25
  // Thresholds designed for balanced 33/33/33 green/yellow/red distribution

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
    if (value <= 13) return 'medium' // Middle 33%: moderate risk (10-13)
    return 'high'                     // Top 33%: highest risk (14-18+)
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
