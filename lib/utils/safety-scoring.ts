/**
 * Safety Scoring System for LA Crime Map
 *
 * Transforms raw crime numbers into meaningful safety scores (0-100)
 * with letter grades (A-F) to help users understand what the data means.
 *
 * Weighted Algorithm:
 * - Violent Crime: 40% (highest weight - most serious)
 * - Break-ins: 25% (property crime affecting homes)
 * - Car Theft: 20% (property crime affecting vehicles)
 * - Petty Theft: 15% (lowest weight - least serious)
 */

import { NeighborhoodData, CrimeMetric } from '../data/types'

export type LetterGrade = 'A' | 'B' | 'C' | 'D' | 'F'

export interface SafetyScore {
  score: number // 0-100, where 100 is safest
  letterGrade: LetterGrade
  color: {
    light: string
    dark: string
    bg: string
    text: string
  }
  description: string
}

export interface ComparisonMetrics {
  vsLAAverage: number // Positive = safer than average, negative = less safe
  vsLAAveragePercent: string // e.g., "20% safer" or "15% less safe"
  percentile: number // 0-100, where 100 = safest
  percentileText: string // e.g., "Safer than 75% of LA"
  trafficLight: 'green' | 'yellow' | 'red'
}

// Crime weights for safety score calculation
const CRIME_WEIGHTS = {
  violentCrime: 0.40,
  breakIns: 0.25,
  carTheft: 0.20,
  pettyTheft: 0.15,
}

// Baseline thresholds for scoring (based on LA data)
const THRESHOLDS = {
  violentCrime: { min: 1, max: 16, average: 6.5 },
  breakIns: { min: 3, max: 19, average: 9.5 },
  carTheft: { min: 3, max: 18, average: 8.5 },
  pettyTheft: { min: 5, max: 28, average: 14 },
}

/**
 * Calculate safety score (0-100) for a neighborhood
 * Higher score = safer neighborhood
 */
export function calculateSafetyScore(neighborhood: NeighborhoodData): number {
  // Normalize each crime type to 0-100 scale (100 = lowest crime)
  const normalizedScores = {
    violentCrime: normalizeMetric(neighborhood.violentCrime, 'violentCrime'),
    breakIns: normalizeMetric(neighborhood.breakIns, 'breakIns'),
    carTheft: normalizeMetric(neighborhood.carTheft, 'carTheft'),
    pettyTheft: normalizeMetric(neighborhood.pettyTheft, 'pettyTheft'),
  }

  // Apply weighted average
  const weightedScore =
    normalizedScores.violentCrime * CRIME_WEIGHTS.violentCrime +
    normalizedScores.breakIns * CRIME_WEIGHTS.breakIns +
    normalizedScores.carTheft * CRIME_WEIGHTS.carTheft +
    normalizedScores.pettyTheft * CRIME_WEIGHTS.pettyTheft

  return Math.round(weightedScore)
}

/**
 * Normalize a crime metric to 0-100 scale
 * 0 = worst (highest crime), 100 = best (lowest crime)
 */
function normalizeMetric(value: number, metric: CrimeMetric): number {
  const threshold = THRESHOLDS[metric]

  // Clamp value between min and max
  const clampedValue = Math.max(threshold.min, Math.min(threshold.max, value))

  // Invert the scale: lower crime = higher score
  const normalized = ((threshold.max - clampedValue) / (threshold.max - threshold.min)) * 100

  return Math.max(0, Math.min(100, normalized))
}

/**
 * Convert safety score to letter grade
 */
export function getLetterGrade(score: number): LetterGrade {
  if (score >= 85) return 'A'
  if (score >= 70) return 'B'
  if (score >= 55) return 'C'
  if (score >= 40) return 'D'
  return 'F'
}

/**
 * Get complete safety score with grade and styling
 */
export function getSafetyScore(neighborhood: NeighborhoodData): SafetyScore {
  const score = calculateSafetyScore(neighborhood)
  const letterGrade = getLetterGrade(score)

  // Color scheme for each grade
  const gradeColors: Record<LetterGrade, SafetyScore['color']> = {
    A: {
      light: '#22c55e', // green-500
      dark: '#10b981', // green-500 dark
      bg: 'bg-green-100 dark:bg-green-900/30',
      text: 'text-green-700 dark:text-green-400',
    },
    B: {
      light: '#3b82f6', // blue-500
      dark: '#60a5fa', // blue-400
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      text: 'text-blue-700 dark:text-blue-400',
    },
    C: {
      light: '#eab308', // yellow-500
      dark: '#fbbf24', // yellow-400
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      text: 'text-yellow-700 dark:text-yellow-400',
    },
    D: {
      light: '#f97316', // orange-500
      dark: '#fb923c', // orange-400
      bg: 'bg-orange-100 dark:bg-orange-900/30',
      text: 'text-orange-700 dark:text-orange-400',
    },
    F: {
      light: '#ef4444', // red-500
      dark: '#f87171', // red-400
      bg: 'bg-red-100 dark:bg-red-900/30',
      text: 'text-red-700 dark:text-red-400',
    },
  }

  // Description for each grade
  const gradeDescriptions: Record<LetterGrade, string> = {
    A: 'Very Safe - Excellent safety record with minimal crime',
    B: 'Safe - Good safety record with below-average crime',
    C: 'Moderately Safe - Average safety with some crime concerns',
    D: 'Less Safe - Above-average crime levels, exercise caution',
    F: 'High Crime - Significantly elevated crime levels',
  }

  return {
    score,
    letterGrade,
    color: gradeColors[letterGrade],
    description: gradeDescriptions[letterGrade],
  }
}

/**
 * Calculate comparison metrics vs LA average
 */
export function getComparisonMetrics(
  neighborhood: NeighborhoodData,
  allNeighborhoods: NeighborhoodData[]
): ComparisonMetrics {
  const neighborhoodScore = calculateSafetyScore(neighborhood)

  // Calculate LA average score
  const averageScore = allNeighborhoods.reduce((sum, n) => sum + calculateSafetyScore(n), 0) / allNeighborhoods.length

  // Calculate difference from average
  const vsLAAverage = neighborhoodScore - averageScore
  const vsLAAveragePercent = formatPercentDifference(vsLAAverage, averageScore)

  // Calculate percentile (what % of neighborhoods this one is safer than)
  const scores = allNeighborhoods.map(n => calculateSafetyScore(n)).sort((a, b) => a - b)
  const position = scores.filter(s => s < neighborhoodScore).length
  const percentile = Math.round((position / scores.length) * 100)
  const percentileText = `Safer than ${percentile}% of LA`

  // Determine traffic light color
  let trafficLight: 'green' | 'yellow' | 'red'
  if (neighborhoodScore >= 70) trafficLight = 'green'
  else if (neighborhoodScore >= 50) trafficLight = 'yellow'
  else trafficLight = 'red'

  return {
    vsLAAverage,
    vsLAAveragePercent,
    percentile,
    percentileText,
    trafficLight,
  }
}

/**
 * Format percent difference as human-readable text
 */
function formatPercentDifference(difference: number, baseline: number): string {
  const percent = Math.abs(Math.round((difference / baseline) * 100))

  if (Math.abs(difference) < 2) {
    return 'About average for LA'
  }

  if (difference > 0) {
    return `${percent}% safer than average`
  } else {
    return `${percent}% less safe than average`
  }
}

/**
 * Get individual metric comparison
 */
export function getMetricComparison(
  value: number,
  metric: CrimeMetric,
  allNeighborhoods: NeighborhoodData[]
): {
  vsAverage: string
  trafficLight: 'green' | 'yellow' | 'red'
  percentile: number
} {
  const average = allNeighborhoods.reduce((sum, n) => sum + n[metric], 0) / allNeighborhoods.length
  const difference = average - value // Inverted: lower crime is better
  const percentDiff = Math.abs(Math.round((difference / average) * 100))

  // Calculate percentile for this specific metric
  const values = allNeighborhoods.map(n => n[metric]).sort((a, b) => a - b)
  const position = values.filter(v => v > value).length // Inverted: lower is better
  const percentile = Math.round((position / values.length) * 100)

  let vsAverage: string
  let trafficLight: 'green' | 'yellow' | 'red'

  if (Math.abs(difference) < average * 0.15) {
    vsAverage = 'About average'
    trafficLight = 'yellow'
  } else if (difference > 0) {
    vsAverage = `${percentDiff}% below average`
    trafficLight = value <= average * 0.7 ? 'green' : 'yellow'
  } else {
    vsAverage = `${percentDiff}% above average`
    trafficLight = value >= average * 1.3 ? 'red' : 'yellow'
  }

  return {
    vsAverage,
    trafficLight,
    percentile,
  }
}

/**
 * Get tooltip text explaining what a crime number means
 */
export function getCrimeTooltip(metric: CrimeMetric, value: number): string {
  const frequency = getFrequencyDescription(value, metric)

  const descriptions: Record<CrimeMetric, string> = {
    violentCrime: `${value} violent crimes per month. This includes assault, robbery, and other violent offenses. ${frequency}`,
    breakIns: `${value} break-ins per month. This includes residential and commercial burglaries. ${frequency}`,
    carTheft: `${value} car thefts per month. This includes vehicle theft and attempted theft. ${frequency}`,
    pettyTheft: `${value} petty thefts per month. This includes theft, shoplifting, and other property crimes. ${frequency}`,
  }

  return descriptions[metric]
}

/**
 * Convert crime count to frequency description
 */
function getFrequencyDescription(value: number, metric: CrimeMetric): string {
  const threshold = THRESHOLDS[metric]

  if (value <= threshold.min + (threshold.average - threshold.min) * 0.3) {
    return 'This is very rare in this neighborhood.'
  } else if (value <= threshold.average) {
    return 'This is below average for LA.'
  } else if (value <= threshold.average + (threshold.max - threshold.average) * 0.5) {
    return 'This is above average for LA.'
  } else {
    return 'This is significantly higher than average for LA.'
  }
}
