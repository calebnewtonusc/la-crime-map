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

  if (metric === 'violentCrime') {
    if (value <= 4) return 'low'
    if (value <= 8) return 'medium'
    return 'high'
  }

  if (metric === 'carTheft') {
    if (value <= 6) return 'low'
    if (value <= 10) return 'medium'
    return 'high'
  }

  if (metric === 'breakIns') {
    if (value <= 8) return 'low'
    if (value <= 12) return 'medium'
    return 'high'
  }

  // pettyTheft
  if (value <= 14) return 'low'
  if (value <= 20) return 'medium'
  return 'high'
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
