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

  // Tighter thresholds for 90-day period (Q4 2024: Oct-Dec)
  // Calibrated to create balanced green/yellow/red distribution

  if (metric === 'violentCrime') {
    if (value <= 30) return 'low'     // Bottom 33%: <30 violent crimes
    if (value <= 80) return 'medium'  // Middle 33%: 30-80
    return 'high'                     // Top 33%: >80
  }

  if (metric === 'carTheft') {
    if (value <= 40) return 'low'     // Bottom 33%: <40 car thefts
    if (value <= 100) return 'medium' // Middle 33%: 40-100
    return 'high'                     // Top 33%: >100
  }

  if (metric === 'breakIns') {
    if (value <= 50) return 'low'     // Bottom 33%: <50 break-ins
    if (value <= 120) return 'medium' // Middle 33%: 50-120
    return 'high'                     // Top 33%: >120
  }

  // pettyTheft - most common crime type
  if (value <= 100) return 'low'     // Bottom 33%: <100 petty thefts
  if (value <= 250) return 'medium'  // Middle 33%: 100-250
  return 'high'                      // Top 33%: >250
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
