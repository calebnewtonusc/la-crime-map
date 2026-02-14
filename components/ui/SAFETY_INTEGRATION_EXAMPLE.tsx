'use client'

/**
 * Safety Scoring Integration Example
 *
 * This file demonstrates how to integrate the new UX context features:
 * - Safety scoring with letter grades (A-F)
 * - Comparison metrics vs LA average
 * - Percentile rankings
 * - Traffic light indicators
 * - Contextual tooltips
 *
 * Use this as a reference for implementing these features in your app.
 */

import { Shield, AlertTriangle, Car, Home, ShoppingBag } from 'lucide-react'
import { MetricCard } from './metric-card'
import { SafetyBadge, SafetyBadgeWithDescription } from './safety-badge'
import {
  getSafetyScore,
  getComparisonMetrics,
  getMetricComparison,
  getCrimeTooltip,
} from '@/lib/utils/safety-scoring'
import { laNeighborhoods } from '@/lib/data/neighborhoods'
import { NeighborhoodData, CrimeMetric } from '@/lib/data/types'

export function SafetyScoringDemo() {
  // Example: Get Beverly Hills data (one of the safest neighborhoods)
  const beverlyHills = laNeighborhoods.features.find(
    f => f.properties.name === 'Beverly Hills'
  )?.properties

  // Example: Get Compton data (higher crime area for comparison)
  const compton = laNeighborhoods.features.find(
    f => f.properties.name === 'Compton'
  )?.properties

  // Get all neighborhoods for comparison
  const allNeighborhoods = laNeighborhoods.features.map(f => f.properties)

  if (!beverlyHills || !compton) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Safety Scoring Integration Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Transforming raw crime numbers into meaningful insights
          </p>
        </div>

        {/* Safety Badges Showcase */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Safety Badges
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <NeighborhoodSafetyCard neighborhood={beverlyHills} allNeighborhoods={allNeighborhoods} />
            <NeighborhoodSafetyCard neighborhood={compton} allNeighborhoods={allNeighborhoods} />
          </div>
        </section>

        {/* Enhanced Metric Cards */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Enhanced Metric Cards (Beverly Hills)
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Raw numbers now include context: comparisons, percentiles, and explanations
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <EnhancedMetricCard
              neighborhood={beverlyHills}
              metric="violentCrime"
              label="Violent Crime"
              icon={AlertTriangle}
              allNeighborhoods={allNeighborhoods}
              delay={0}
            />
            <EnhancedMetricCard
              neighborhood={beverlyHills}
              metric="breakIns"
              label="Break-ins"
              icon={Home}
              allNeighborhoods={allNeighborhoods}
              delay={0.1}
            />
            <EnhancedMetricCard
              neighborhood={beverlyHills}
              metric="carTheft"
              label="Car Theft"
              icon={Car}
              allNeighborhoods={allNeighborhoods}
              delay={0.2}
            />
            <EnhancedMetricCard
              neighborhood={beverlyHills}
              metric="pettyTheft"
              label="Petty Theft"
              icon={ShoppingBag}
              allNeighborhoods={allNeighborhoods}
              delay={0.3}
            />
          </div>
        </section>

        {/* Side-by-side comparison */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Side-by-Side Comparison
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Beverly Hills Column */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Beverly Hills - Very Safe (Grade A)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <EnhancedMetricCard
                  neighborhood={beverlyHills}
                  metric="violentCrime"
                  label="Violent Crime"
                  icon={AlertTriangle}
                  allNeighborhoods={allNeighborhoods}
                />
                <EnhancedMetricCard
                  neighborhood={beverlyHills}
                  metric="carTheft"
                  label="Car Theft"
                  icon={Car}
                  allNeighborhoods={allNeighborhoods}
                />
              </div>
            </div>

            {/* Compton Column */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Compton - Higher Crime (Grade F)
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <EnhancedMetricCard
                  neighborhood={compton}
                  metric="violentCrime"
                  label="Violent Crime"
                  icon={AlertTriangle}
                  allNeighborhoods={allNeighborhoods}
                />
                <EnhancedMetricCard
                  neighborhood={compton}
                  metric="carTheft"
                  label="Car Theft"
                  icon={Car}
                  allNeighborhoods={allNeighborhoods}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Implementation Code Example */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            How to Use in Your Code
          </h2>

          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6">
            <pre className="text-sm text-gray-800 dark:text-gray-200 overflow-x-auto">
{`import { MetricCard } from '@/components/ui/metric-card'
import { SafetyBadge } from '@/components/ui/safety-badge'
import {
  getSafetyScore,
  getMetricComparison,
  getCrimeTooltip
} from '@/lib/utils/safety-scoring'

// Get safety score for a neighborhood
const safetyScore = getSafetyScore(neighborhood)

// Get comparison for a specific crime metric
const comparison = getMetricComparison(
  neighborhood.violentCrime,
  'violentCrime',
  allNeighborhoods
)

// Render safety badge
<SafetyBadge safetyScore={safetyScore} showDescription />

// Render enhanced metric card
<MetricCard
  label="Violent Crime"
  value={neighborhood.violentCrime}
  icon={AlertTriangle}
  vsAverage={comparison.vsAverage}
  percentile={comparison.percentile}
  trafficLight={comparison.trafficLight}
  tooltip={getCrimeTooltip('violentCrime', neighborhood.violentCrime)}
/>`}
            </pre>
          </div>
        </section>
      </div>
    </div>
  )
}

/**
 * Component: Neighborhood Safety Card
 * Displays safety badge with full description
 */
function NeighborhoodSafetyCard({
  neighborhood,
  allNeighborhoods,
}: {
  neighborhood: NeighborhoodData
  allNeighborhoods: NeighborhoodData[]
}) {
  const safetyScore = getSafetyScore(neighborhood)
  const comparison = getComparisonMetrics(neighborhood, allNeighborhoods)

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        {neighborhood.name}
      </h3>

      <SafetyBadgeWithDescription safetyScore={safetyScore} />

      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">vs LA Average:</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {comparison.vsLAAveragePercent}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Safety Ranking:</span>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {comparison.percentileText}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Component: Enhanced Metric Card
 * Metric card with all UX context features
 */
function EnhancedMetricCard({
  neighborhood,
  metric,
  label,
  icon,
  allNeighborhoods,
  delay = 0,
}: {
  neighborhood: NeighborhoodData
  metric: CrimeMetric
  label: string
  icon: any
  allNeighborhoods: NeighborhoodData[]
  delay?: number
}) {
  const comparison = getMetricComparison(neighborhood[metric], metric, allNeighborhoods)
  const tooltip = getCrimeTooltip(metric, neighborhood[metric])

  return (
    <MetricCard
      label={label}
      value={neighborhood[metric]}
      icon={icon}
      vsAverage={comparison.vsAverage}
      percentile={comparison.percentile}
      trafficLight={comparison.trafficLight}
      tooltip={tooltip}
      delay={delay}
    />
  )
}

export default SafetyScoringDemo
