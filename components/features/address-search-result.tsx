'use client'

import { motion } from 'framer-motion'
import { MapPin, TrendingDown, TrendingUp, Minus, Shield, AlertTriangle, Car, Home, ShoppingBag, Users } from 'lucide-react'
import { AddressSearchResultData } from './address-search'
import { CrimeMetric } from '@/lib/data/types'
import { calculateCrimeStats } from '@/lib/utils/crime-stats'
import { laNeighborhoods } from '@/lib/data/neighborhoods'

interface AddressSearchResultProps {
  result: AddressSearchResultData
}

export function AddressSearchResult({ result }: AddressSearchResultProps) {
  const { address, neighborhood, neighborhoodName } = result

  // Calculate LA averages for comparison
  const laStats = calculateCrimeStats(laNeighborhoods)

  // Get safety score and rating
  const getSafetyInfo = () => {
    if (!neighborhood) {
      return {
        score: 0,
        rating: 'Unknown',
        color: 'gray',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        textColor: 'text-gray-700 dark:text-gray-300',
        borderColor: 'border-gray-300 dark:border-gray-600'
      }
    }

    const totalCrime = neighborhood.violentCrime + neighborhood.carTheft + neighborhood.breakIns + neighborhood.pettyTheft
    const avgTotal = laStats.avgViolentCrime + laStats.avgCarTheft + laStats.avgBreakIns + laStats.avgPettyTheft

    // Calculate score (0-100, higher is safer)
    const score = Math.max(0, Math.min(100, Math.round(100 - (totalCrime / avgTotal) * 100)))

    if (score >= 75) {
      return {
        score,
        rating: 'Great Choice',
        color: 'green',
        bgColor: 'bg-green-100 dark:bg-green-900/30',
        textColor: 'text-green-700 dark:text-green-300',
        borderColor: 'border-green-300 dark:border-green-700',
        icon: Shield
      }
    } else if (score >= 50) {
      return {
        score,
        rating: 'Solid Option',
        color: 'blue',
        bgColor: 'bg-blue-100 dark:bg-blue-900/30',
        textColor: 'text-blue-700 dark:text-blue-300',
        borderColor: 'border-blue-300 dark:border-blue-700',
        icon: Shield
      }
    } else if (score >= 30) {
      return {
        score,
        rating: 'Know Your Area',
        color: 'yellow',
        bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
        textColor: 'text-yellow-700 dark:text-yellow-300',
        borderColor: 'border-yellow-300 dark:border-yellow-700',
        icon: AlertTriangle
      }
    } else {
      return {
        score,
        rating: 'Stay Alert',
        color: 'red',
        bgColor: 'bg-red-100 dark:bg-red-900/30',
        textColor: 'text-red-700 dark:text-red-300',
        borderColor: 'border-red-300 dark:border-red-700',
        icon: AlertTriangle
      }
    }
  }

  const safetyInfo = getSafetyInfo()
  const SafetyIcon = safetyInfo.icon || Shield

  // Get verdict and explanation
  const getVerdict = () => {
    if (!neighborhood) {
      return {
        title: 'Outside Mapped Areas',
        description: 'This address is in an area we don\'t currently have detailed crime data for. It may be outside LA County or in a region not yet covered by our mapping.'
      }
    }

    const { score } = safetyInfo

    if (score >= 75) {
      return {
        title: 'You picked a winner',
        description: 'This neighborhood has lower crime rates than most of LA County. Many residents feel comfortable here and enjoy their community. Like anywhere in a big city, stay aware of your surroundings.'
      }
    } else if (score >= 50) {
      return {
        title: 'Right in the middle',
        description: 'This area has crime rates similar to the LA County average. It\'s a typical urban neighborhood where being aware and taking standard precautions goes a long way.'
      }
    } else if (score >= 30) {
      return {
        title: 'Get to know your block',
        description: 'Crime rates here are above average, but many residents love their community. Take time to learn your specific streets, connect with neighbors, and stay aware - especially at night.'
      }
    } else {
      return {
        title: 'Extra awareness helps here',
        description: 'This area has higher crime rates. If you choose to live here, get to know your immediate surroundings well, build relationships with neighbors, and take security seriously. Many people still call it home.'
      }
    }
  }

  const verdict = getVerdict()

  // Crime comparison data
  const getCrimeComparison = (metric: CrimeMetric) => {
    if (!neighborhood) return null

    const value = neighborhood[metric]
    const avg = metric === 'violentCrime' ? laStats.avgViolentCrime :
                metric === 'carTheft' ? laStats.avgCarTheft :
                metric === 'breakIns' ? laStats.avgBreakIns :
                laStats.avgPettyTheft

    const percentDiff = ((value - avg) / avg) * 100
    const isHigher = value > avg

    return {
      value,
      avg,
      percentDiff: Math.abs(percentDiff),
      isHigher
    }
  }

  const crimeTypes: { metric: CrimeMetric; label: string; icon: any }[] = [
    { metric: 'violentCrime', label: 'Violent Crime', icon: Users },
    { metric: 'carTheft', label: 'Car Theft', icon: Car },
    { metric: 'breakIns', label: 'Break-ins', icon: Home },
    { metric: 'pettyTheft', label: 'Petty Theft', icon: ShoppingBag }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Location Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg"
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 bg-neon-cyan/10 dark:bg-neon-cyan/20 rounded-lg">
            <MapPin className="w-6 h-6 text-neon-cyan" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Your Address</h3>
            <p className="text-lg text-gray-900 dark:text-dark-text-primary">{address}</p>
          </div>
        </div>

        <div className={`p-4 ${safetyInfo.bgColor} border ${safetyInfo.borderColor} rounded-lg`}>
          <p className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">
            Your address is in <span className="text-neon-cyan">{neighborhoodName}</span>
          </p>
        </div>
      </motion.div>

      {/* Safety Score Card */}
      {neighborhood && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${safetyInfo.bgColor} border-2 ${safetyInfo.borderColor} rounded-xl p-6 shadow-lg`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`p-3 ${safetyInfo.textColor} bg-white dark:bg-dark-bg-primary rounded-lg`}>
                <SafetyIcon className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-dark-text-primary">
                  {safetyInfo.rating}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Safety Rating</p>
              </div>
            </div>

            {/* Score Display */}
            <div className="text-center">
              <div className={`text-5xl font-bold ${safetyInfo.textColor}`}>
                {safetyInfo.score}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                out of 100
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${safetyInfo.score}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className={`h-full ${
                safetyInfo.color === 'green' ? 'bg-green-500' :
                safetyInfo.color === 'blue' ? 'bg-blue-500' :
                safetyInfo.color === 'yellow' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}
            />
          </div>
        </motion.div>
      )}

      {/* Crime Breakdown */}
      {neighborhood && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary mb-4">
            See Full Crime Breakdown
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {crimeTypes.map(({ metric, label, icon: Icon }) => {
              const comparison = getCrimeComparison(metric)
              if (!comparison) return null

              return (
                <div
                  key={metric}
                  className="bg-gray-50 dark:bg-dark-bg-primary border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <h4 className="font-semibold text-gray-900 dark:text-dark-text-primary text-sm">
                      {label}
                    </h4>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary">
                      {comparison.value}
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      comparison.isHigher ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                    }`}>
                      {comparison.isHigher ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : comparison.percentDiff < 5 ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>
                        {comparison.percentDiff.toFixed(0)}%
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    LA avg: {comparison.avg}
                  </p>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Safety Verdict */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg-secondary dark:to-dark-bg-primary
                   border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-lg"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-dark-text-primary mb-3">
          What should I know?
        </h3>
        <h4 className="text-lg font-semibold text-neon-cyan mb-2">
          {verdict.title}
        </h4>
        <p className="text-gray-700 dark:text-dark-text-secondary leading-relaxed">
          {verdict.description}
        </p>
      </motion.div>

      {/* Additional Context */}
      {neighborhood && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1 text-sm text-blue-800 dark:text-blue-200">
              <p className="font-semibold mb-1">Remember:</p>
              <p>Crime statistics are simplified indicators and may not reflect current conditions. Your personal safety experience depends on many factors including specific location, time of day, and personal precautions. Always use your best judgment and consult local resources.</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
