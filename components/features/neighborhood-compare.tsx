'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Shield,
  Car,
  Home,
  ShoppingBag,
  AlertTriangle,
  Download,
  Share2,
  X,
  ChevronDown,
  Check,
  Award,
  ThumbsDown,
  Info,
  Sun,
  Moon,
  Copy,
  CheckCircle2
} from 'lucide-react'
import {
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts'
import { NeighborhoodData } from '@/lib/data/types'
import { laNeighborhoods } from '@/lib/data/neighborhoods'

interface NeighborhoodCompareProps {
  initialNeighborhoods?: string[]
  onClose?: () => void
}

interface ComparisonMetric {
  name: string
  value: number
  percentile: number | null
  trend: 'up' | 'down' | 'stable'
  color: string
}

interface NeighborhoodComparison {
  neighborhood: NeighborhoodData
  safetyScore: number
  metrics: {
    violent: ComparisonMetric
    carTheft: ComparisonMetric
    breakIns: ComparisonMetric
    pettyTheft: ComparisonMetric
  }
  populationDensity: number
  bestFeature: string
  worstFeature: string
  recommendation: string
  recommendationType: 'positive' | 'neutral' | 'warning'
}

export function NeighborhoodCompare({
  initialNeighborhoods = [],
  onClose
}: NeighborhoodCompareProps) {
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>(
    initialNeighborhoods
  )
  const [isOpen, setIsOpen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState(false)

  // Get all unique neighborhood names
  const availableNeighborhoods = useMemo(
    () => laNeighborhoods.features.map(f => f.properties.name).sort(),
    []
  )

  // Calculate safety score (lower crime = higher score)
  const calculateSafetyScore = (data: NeighborhoodData): number => {
    if (data.safetyScore !== null) return data.safetyScore

    const totalCrime = data.violentCrime + data.carTheft + data.breakIns + data.pettyTheft
    const maxCrime = 100 // Approximate max total crime
    const score = Math.max(0, Math.min(100, 100 - (totalCrime / maxCrime) * 100))
    return Math.round(score)
  }

  // Get trend indicator
  const getTrendIndicator = (
    value: number,
    avg: number
  ): 'up' | 'down' | 'stable' => {
    if (value < avg * 0.9) return 'down' // Good - below average
    if (value > avg * 1.1) return 'up' // Bad - above average
    return 'stable'
  }

  // Get population density (simulated based on crime rates and neighborhood characteristics)
  const getPopulationDensity = (name: string): number => {
    const densityMap: Record<string, number> = {
      'Downtown LA': 18000,
      'Koreatown': 42000,
      'Hollywood': 22000,
      'West Hollywood': 18000,
      'Santa Monica': 11000,
      'Venice': 13000,
      'Beverly Hills': 5700,
      'Bel Air': 1200,
      'Manhattan Beach': 4000,
      'Pasadena': 5900,
      'Compton': 9500,
      'Long Beach': 9200
    }
    return densityMap[name] || 8000
  }

  // Generate comparison data
  const comparisons = useMemo((): NeighborhoodComparison[] => {
    const selectedData = selectedNeighborhoods.map(name =>
      laNeighborhoods.features.find(f => f.properties.name === name)?.properties
    ).filter(Boolean) as NeighborhoodData[]

    if (selectedData.length === 0) return []

    // Calculate averages for trend comparison
    const avgViolent = selectedData.reduce((sum, d) => sum + d.violentCrime, 0) / selectedData.length
    const avgCar = selectedData.reduce((sum, d) => sum + d.carTheft, 0) / selectedData.length
    const avgBreak = selectedData.reduce((sum, d) => sum + d.breakIns, 0) / selectedData.length
    const avgPetty = selectedData.reduce((sum, d) => sum + d.pettyTheft, 0) / selectedData.length

    return selectedData.map(data => {
      const safetyScore = calculateSafetyScore(data)

      const metrics = {
        violent: {
          name: 'Violent Crime',
          value: data.violentCrime,
          percentile: data.violentCrimePercentile,
          trend: getTrendIndicator(data.violentCrime, avgViolent),
          color: '#ef4444'
        },
        carTheft: {
          name: 'Car Theft',
          value: data.carTheft,
          percentile: data.carTheftPercentile,
          trend: getTrendIndicator(data.carTheft, avgCar),
          color: '#f59e0b'
        },
        breakIns: {
          name: 'Break-ins',
          value: data.breakIns,
          percentile: data.breakInsPercentile,
          trend: getTrendIndicator(data.breakIns, avgBreak),
          color: '#8b5cf6'
        },
        pettyTheft: {
          name: 'Petty Theft',
          value: data.pettyTheft,
          percentile: data.pettyTheftPercentile,
          trend: getTrendIndicator(data.pettyTheft, avgPetty),
          color: '#06b6d4'
        }
      }

      // Find best and worst features
      const metricValues = [
        { name: 'violent crime', value: data.violentCrime, inverse: true },
        { name: 'car theft', value: data.carTheft, inverse: true },
        { name: 'break-ins', value: data.breakIns, inverse: true },
        { name: 'petty theft', value: data.pettyTheft, inverse: true }
      ]

      const sortedByValue = [...metricValues].sort((a, b) => a.value - b.value)
      const bestFeature = `Low ${sortedByValue[0].name}`
      const worstFeature = `High ${sortedByValue[sortedByValue.length - 1].name}`

      // Generate recommendation
      let recommendation = ''
      let recommendationType: 'positive' | 'neutral' | 'warning' = 'neutral'

      if (safetyScore >= 80) {
        recommendation = 'Excellent for families and young professionals'
        recommendationType = 'positive'
      } else if (safetyScore >= 65) {
        recommendation = 'Good overall, exercise normal caution'
        recommendationType = 'positive'
      } else if (safetyScore >= 50) {
        recommendation = 'Moderate safety, be aware of surroundings'
        recommendationType = 'neutral'
      } else if (safetyScore >= 35) {
        recommendation = 'Higher crime area, avoid walking alone at night'
        recommendationType = 'warning'
      } else {
        recommendation = 'High crime area, take extra precautions'
        recommendationType = 'warning'
      }

      return {
        neighborhood: data,
        safetyScore,
        metrics,
        populationDensity: getPopulationDensity(data.name),
        bestFeature,
        worstFeature,
        recommendation,
        recommendationType
      }
    })
  }, [selectedNeighborhoods])

  // Toggle neighborhood selection
  const toggleNeighborhood = (name: string) => {
    setSelectedNeighborhoods(prev => {
      if (prev.includes(name)) {
        return prev.filter(n => n !== name)
      } else if (prev.length < 4) {
        return [...prev, name]
      }
      return prev
    })
  }

  // Share URL functionality
  const shareComparison = async () => {
    const url = new URL(window.location.href)
    url.searchParams.set('compare', selectedNeighborhoods.join(','))

    try {
      await navigator.clipboard.writeText(url.toString())
      setCopiedUrl(true)
      setTimeout(() => setCopiedUrl(false), 2000)
    } catch (err) {
      console.error('Failed to copy URL:', err)
    }
  }

  // Export as image (simplified - would need html2canvas in production)
  const exportComparison = () => {
    alert('Export functionality would use html2canvas or similar library to generate a downloadable image/PDF')
  }

  // Initialize from URL params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      const compareParam = params.get('compare')
      if (compareParam) {
        const neighborhoods = compareParam.split(',').slice(0, 4)
        setSelectedNeighborhoods(neighborhoods)
        setIsOpen(true)
      }
    }
  }, [])

  // Prepare chart data
  const barChartData = useMemo(() => {
    return [
      {
        metric: 'Violent Crime',
        ...Object.fromEntries(
          comparisons.map(c => [c.neighborhood.name, c.metrics.violent.value])
        )
      },
      {
        metric: 'Car Theft',
        ...Object.fromEntries(
          comparisons.map(c => [c.neighborhood.name, c.metrics.carTheft.value])
        )
      },
      {
        metric: 'Break-ins',
        ...Object.fromEntries(
          comparisons.map(c => [c.neighborhood.name, c.metrics.breakIns.value])
        )
      },
      {
        metric: 'Petty Theft',
        ...Object.fromEntries(
          comparisons.map(c => [c.neighborhood.name, c.metrics.pettyTheft.value])
        )
      }
    ]
  }, [comparisons])

  const radarChartData = useMemo(() => {
    return [
      {
        metric: 'Safety',
        ...Object.fromEntries(
          comparisons.map(c => [c.neighborhood.name, c.safetyScore])
        ),
        fullMark: 100
      },
      {
        metric: 'Low Violent Crime',
        ...Object.fromEntries(
          comparisons.map(c => [c.neighborhood.name, Math.max(0, 100 - c.metrics.violent.value * 5)])
        ),
        fullMark: 100
      },
      {
        metric: 'Low Car Theft',
        ...Object.fromEntries(
          comparisons.map(c => [c.neighborhood.name, Math.max(0, 100 - c.metrics.carTheft.value * 5)])
        ),
        fullMark: 100
      },
      {
        metric: 'Low Break-ins',
        ...Object.fromEntries(
          comparisons.map(c => [c.neighborhood.name, Math.max(0, 100 - c.metrics.breakIns.value * 5)])
        ),
        fullMark: 100
      },
      {
        metric: 'Low Petty Theft',
        ...Object.fromEntries(
          comparisons.map(c => [c.neighborhood.name, Math.max(0, 100 - c.metrics.pettyTheft.value * 5)])
        ),
        fullMark: 100
      }
    ]
  }, [comparisons])

  const colors = ['#00f5ff', '#b537f2', '#ff2d95', '#10b981']

  const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-green-500" />
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  const ScoreBadge = ({ score }: { score: number }) => {
    let bgColor = 'bg-gray-100 dark:bg-gray-800'
    let textColor = 'text-gray-900 dark:text-gray-100'

    if (score >= 80) {
      bgColor = 'bg-green-100 dark:bg-green-900/30'
      textColor = 'text-green-900 dark:text-green-300'
    } else if (score >= 65) {
      bgColor = 'bg-blue-100 dark:bg-blue-900/30'
      textColor = 'text-blue-900 dark:text-blue-300'
    } else if (score >= 50) {
      bgColor = 'bg-yellow-100 dark:bg-yellow-900/30'
      textColor = 'text-yellow-900 dark:text-yellow-300'
    } else {
      bgColor = 'bg-red-100 dark:bg-red-900/30'
      textColor = 'text-red-900 dark:text-red-300'
    }

    return (
      <span className={`${bgColor} ${textColor} px-3 py-1 rounded-full text-lg font-bold`}>
        {score}
      </span>
    )
  }

  if (!isOpen && selectedNeighborhoods.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-neon-cyan/10 to-neon-purple/10 dark:from-neon-cyan/5 dark:to-neon-purple/5 rounded-2xl p-8 border-2 border-dashed border-gray-300 dark:border-gray-700"
      >
        <div className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-neon-cyan dark:text-neon-purple" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Compare Neighborhoods
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Select 2-4 neighborhoods to compare safety scores, crime rates, and get personalized recommendations
          </p>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-gradient-to-r from-neon-cyan to-neon-purple text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-neon-purple/50 transition-all"
          >
            Start Comparing
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Neighborhood Comparison
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Compare up to 4 neighborhoods side-by-side
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={shareComparison}
            className="flex items-center gap-2 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors"
          >
            {copiedUrl ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm font-medium text-green-600 dark:text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span className="text-sm font-medium">Share</span>
              </>
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={exportComparison}
            className="flex items-center gap-2 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm font-medium">Export</span>
          </motion.button>
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors"
            >
              <X className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Neighborhood Selector */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full flex items-center justify-between bg-white dark:bg-dark-bg-secondary border-2 border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 hover:border-neon-cyan dark:hover:border-neon-purple transition-colors"
        >
          <span className="text-gray-700 dark:text-gray-300">
            {selectedNeighborhoods.length === 0
              ? 'Select neighborhoods to compare...'
              : `${selectedNeighborhoods.length} neighborhood${selectedNeighborhoods.length > 1 ? 's' : ''} selected`}
          </span>
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              showDropdown ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {showDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-white dark:bg-dark-bg-secondary border border-gray-300 dark:border-gray-700 rounded-xl shadow-xl max-h-96 overflow-y-auto"
            >
              {availableNeighborhoods.map(name => {
                const isSelected = selectedNeighborhoods.includes(name)
                const isDisabled = !isSelected && selectedNeighborhoods.length >= 4

                return (
                  <button
                    key={name}
                    onClick={() => !isDisabled && toggleNeighborhood(name)}
                    disabled={isDisabled}
                    className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary transition-colors ${
                      isDisabled ? 'opacity-50 cursor-not-allowed' : ''
                    } ${
                      isSelected
                        ? 'bg-neon-cyan/10 dark:bg-neon-purple/10'
                        : ''
                    }`}
                  >
                    <span className="text-left">{name}</span>
                    {isSelected && (
                      <Check className="w-5 h-5 text-neon-cyan dark:text-neon-purple" />
                    )}
                  </button>
                )
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Neighborhoods Pills */}
      {selectedNeighborhoods.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedNeighborhoods.map((name, idx) => (
            <motion.div
              key={name}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium"
              style={{ backgroundColor: colors[idx] }}
            >
              {name}
              <button
                onClick={() => toggleNeighborhood(name)}
                className="hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Comparison Content */}
      {comparisons.length >= 2 && (
        <div className="space-y-8">
          {/* Comparison Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-dark-bg-secondary rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            {/* Mobile: Stacked Cards */}
            <div className="lg:hidden space-y-4 p-4">
              {comparisons.map((comp, idx) => (
                <motion.div
                  key={comp.neighborhood.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="border-2 rounded-xl p-4 space-y-4"
                  style={{ borderColor: colors[idx] }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{comp.neighborhood.name}</h3>
                    <ScoreBadge score={comp.safetyScore} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        Violent Crime
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{comp.metrics.violent.value}</span>
                        <TrendIcon trend={comp.metrics.violent.trend} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Car className="w-4 h-4 text-orange-500" />
                        Car Theft
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{comp.metrics.carTheft.value}</span>
                        <TrendIcon trend={comp.metrics.carTheft.trend} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Home className="w-4 h-4 text-purple-500" />
                        Break-ins
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{comp.metrics.breakIns.value}</span>
                        <TrendIcon trend={comp.metrics.breakIns.trend} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <ShoppingBag className="w-4 h-4 text-cyan-500" />
                        Petty Theft
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">{comp.metrics.pettyTheft.value}</span>
                        <TrendIcon trend={comp.metrics.pettyTheft.trend} />
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4" />
                      <span className="text-gray-600 dark:text-gray-400">Density:</span>
                      <span className="font-semibold">{comp.populationDensity.toLocaleString()}/mi²</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Award className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600 dark:text-gray-400">Best:</span>
                      <span className="font-semibold">{comp.bestFeature}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <ThumbsDown className="w-4 h-4 text-red-500" />
                      <span className="text-gray-600 dark:text-gray-400">Worst:</span>
                      <span className="font-semibold">{comp.worstFeature}</span>
                    </div>
                  </div>

                  <div
                    className={`p-3 rounded-lg ${
                      comp.recommendationType === 'positive'
                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                        : comp.recommendationType === 'warning'
                        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        : 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                    }`}
                  >
                    <div className="flex gap-2">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p className="text-sm font-medium">{comp.recommendation}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Desktop: Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-dark-bg-tertiary">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Metric
                    </th>
                    {comparisons.map((comp, idx) => (
                      <th
                        key={comp.neighborhood.name}
                        className="px-6 py-4 text-center text-sm font-semibold"
                        style={{ color: colors[idx] }}
                      >
                        {comp.neighborhood.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {/* Safety Score */}
                  <tr className="hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary/50">
                    <td className="px-6 py-4 font-semibold flex items-center gap-2">
                      <Shield className="w-5 h-5 text-neon-cyan dark:text-neon-purple" />
                      Overall Safety Score
                    </td>
                    {comparisons.map(comp => {
                      const isWinner = comp.safetyScore === Math.max(...comparisons.map(c => c.safetyScore))
                      return (
                        <td key={comp.neighborhood.name} className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <ScoreBadge score={comp.safetyScore} />
                            {isWinner && <Award className="w-5 h-5 text-yellow-500" />}
                          </div>
                        </td>
                      )
                    })}
                  </tr>

                  {/* Violent Crime */}
                  <tr className="hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary/50">
                    <td className="px-6 py-4 font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      Violent Crime
                    </td>
                    {comparisons.map(comp => {
                      const isWinner = comp.metrics.violent.value === Math.min(...comparisons.map(c => c.metrics.violent.value))
                      return (
                        <td key={comp.neighborhood.name} className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-lg font-bold">{comp.metrics.violent.value}</span>
                            <TrendIcon trend={comp.metrics.violent.trend} />
                            {isWinner && <Award className="w-5 h-5 text-yellow-500" />}
                          </div>
                        </td>
                      )
                    })}
                  </tr>

                  {/* Car Theft */}
                  <tr className="hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary/50">
                    <td className="px-6 py-4 font-semibold flex items-center gap-2">
                      <Car className="w-5 h-5 text-orange-500" />
                      Car Theft
                    </td>
                    {comparisons.map(comp => {
                      const isWinner = comp.metrics.carTheft.value === Math.min(...comparisons.map(c => c.metrics.carTheft.value))
                      return (
                        <td key={comp.neighborhood.name} className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-lg font-bold">{comp.metrics.carTheft.value}</span>
                            <TrendIcon trend={comp.metrics.carTheft.trend} />
                            {isWinner && <Award className="w-5 h-5 text-yellow-500" />}
                          </div>
                        </td>
                      )
                    })}
                  </tr>

                  {/* Break-ins */}
                  <tr className="hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary/50">
                    <td className="px-6 py-4 font-semibold flex items-center gap-2">
                      <Home className="w-5 h-5 text-purple-500" />
                      Break-ins
                    </td>
                    {comparisons.map(comp => {
                      const isWinner = comp.metrics.breakIns.value === Math.min(...comparisons.map(c => c.metrics.breakIns.value))
                      return (
                        <td key={comp.neighborhood.name} className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-lg font-bold">{comp.metrics.breakIns.value}</span>
                            <TrendIcon trend={comp.metrics.breakIns.trend} />
                            {isWinner && <Award className="w-5 h-5 text-yellow-500" />}
                          </div>
                        </td>
                      )
                    })}
                  </tr>

                  {/* Petty Theft */}
                  <tr className="hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary/50">
                    <td className="px-6 py-4 font-semibold flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-cyan-500" />
                      Petty Theft
                    </td>
                    {comparisons.map(comp => {
                      const isWinner = comp.metrics.pettyTheft.value === Math.min(...comparisons.map(c => c.metrics.pettyTheft.value))
                      return (
                        <td key={comp.neighborhood.name} className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-lg font-bold">{comp.metrics.pettyTheft.value}</span>
                            <TrendIcon trend={comp.metrics.pettyTheft.trend} />
                            {isWinner && <Award className="w-5 h-5 text-yellow-500" />}
                          </div>
                        </td>
                      )
                    })}
                  </tr>

                  {/* Population Density */}
                  <tr className="hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary/50">
                    <td className="px-6 py-4 font-semibold flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      Population Density
                    </td>
                    {comparisons.map(comp => (
                      <td key={comp.neighborhood.name} className="px-6 py-4 text-center">
                        <span className="text-lg font-bold">
                          {comp.populationDensity.toLocaleString()}/mi²
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Best Feature */}
                  <tr className="hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary/50">
                    <td className="px-6 py-4 font-semibold flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-500" />
                      Best Feature
                    </td>
                    {comparisons.map(comp => (
                      <td key={comp.neighborhood.name} className="px-6 py-4 text-center">
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                          {comp.bestFeature}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Worst Feature */}
                  <tr className="hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary/50">
                    <td className="px-6 py-4 font-semibold flex items-center gap-2">
                      <ThumbsDown className="w-5 h-5 text-red-500" />
                      Worst Feature
                    </td>
                    {comparisons.map(comp => (
                      <td key={comp.neighborhood.name} className="px-6 py-4 text-center">
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                          {comp.worstFeature}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Recommendation */}
                  <tr className="bg-gray-50 dark:bg-dark-bg-tertiary">
                    <td className="px-6 py-4 font-semibold flex items-center gap-2">
                      <Info className="w-5 h-5 text-blue-500" />
                      Recommendation
                    </td>
                    {comparisons.map(comp => (
                      <td key={comp.neighborhood.name} className="px-6 py-4">
                        <div
                          className={`p-3 rounded-lg text-sm font-medium text-center ${
                            comp.recommendationType === 'positive'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-900 dark:text-green-300'
                              : comp.recommendationType === 'warning'
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-900 dark:text-red-300'
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-900 dark:text-blue-300'
                          }`}
                        >
                          {comp.recommendation}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-dark-bg-secondary rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Crime Metrics Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis
                    dataKey="metric"
                    stroke="#9ca3af"
                    style={{ fontSize: '12px' }}
                  />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#f8fafc'
                    }}
                  />
                  <Legend />
                  {comparisons.map((comp, idx) => (
                    <Bar
                      key={comp.neighborhood.name}
                      dataKey={comp.neighborhood.name}
                      fill={colors[idx]}
                      radius={[8, 8, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Radar Chart */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-dark-bg-secondary rounded-2xl border border-gray-200 dark:border-gray-700 p-6"
            >
              <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
                Safety Profile
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarChartData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis
                    dataKey="metric"
                    stroke="#9ca3af"
                    style={{ fontSize: '11px' }}
                  />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#9ca3af" />
                  {comparisons.map((comp, idx) => (
                    <Radar
                      key={comp.neighborhood.name}
                      name={comp.neighborhood.name}
                      dataKey={comp.neighborhood.name}
                      stroke={colors[idx]}
                      fill={colors[idx]}
                      fillOpacity={0.3}
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>

          {/* Winner Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-2xl border-2 border-yellow-300 dark:border-yellow-700 p-6"
          >
            <div className="flex items-start gap-4">
              <Award className="w-8 h-8 text-yellow-600 dark:text-yellow-400 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Overall Winner
                </h3>
                {(() => {
                  const winner = comparisons.reduce((prev, current) =>
                    prev.safetyScore > current.safetyScore ? prev : current
                  )
                  return (
                    <div>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                        {winner.neighborhood.name}
                      </p>
                      <p className="text-gray-700 dark:text-gray-300">
                        With a safety score of <strong>{winner.safetyScore}</strong>, this neighborhood
                        offers the best overall safety profile in your comparison.
                      </p>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        {winner.recommendation}
                      </p>
                    </div>
                  )
                })()}
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {comparisons.length === 1 && (
        <div className="text-center py-12 text-gray-600 dark:text-gray-400">
          <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select at least one more neighborhood to start comparing</p>
        </div>
      )}
    </motion.div>
  )
}
