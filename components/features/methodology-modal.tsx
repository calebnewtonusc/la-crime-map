'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Calculator, TrendingUp, AlertTriangle, BarChart3, Percent } from 'lucide-react'
import { useEffect } from 'react'

interface MethodologyModalProps {
  isOpen: boolean
  onClose: () => void
}

export function MethodologyModal({ isOpen, onClose }: MethodologyModalProps) {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEscape)
    }
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
                role="dialog"
                aria-modal="true"
                aria-labelledby="methodology-title"
              >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-700 dark:to-indigo-700 p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                        <Calculator className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 id="methodology-title" className="text-2xl font-bold text-white">
                          Safety Score Methodology
                        </h2>
                        <p className="text-purple-100 text-sm mt-1">
                          How we calculate neighborhood safety ratings
                        </p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="text-white/80 hover:text-white transition-colors"
                      aria-label="Close modal"
                    >
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-6">

                  {/* Overview */}
                  <section className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      Overview
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Our safety scores are calculated using a multi-factor weighted algorithm that combines crime statistics,
                      per-capita normalization, and percentile ranking to provide a comprehensive neighborhood safety rating from 0-100.
                    </p>
                  </section>

                  {/* Formula Breakdown */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Calculator className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      Formula Breakdown
                    </h3>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                      <div className="text-gray-900 dark:text-gray-100">
                        Safety Score = 100 - (Weighted Crime Index × 100)
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 mt-2 text-xs">
                        where Weighted Crime Index is normalized to 0-1 range
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        Crime Index Calculation:
                      </h4>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="font-mono text-xs space-y-2 text-gray-800 dark:text-gray-300">
                          <div>Crime Index = (</div>
                          <div className="pl-4">Violent Crime × 0.40 +</div>
                          <div className="pl-4">Break-ins × 0.25 +</div>
                          <div className="pl-4">Car Theft × 0.20 +</div>
                          <div className="pl-4">Petty Theft × 0.15</div>
                          <div>) / Population</div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Weighting Factors */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                      Weighting Factors
                    </h3>

                    <div className="space-y-3">
                      <WeightBar
                        label="Violent Crime"
                        weight={40}
                        color="bg-red-500"
                        description="Highest priority due to severity and public safety impact"
                      />
                      <WeightBar
                        label="Break-ins"
                        weight={25}
                        color="bg-orange-500"
                        description="Property crimes affecting residential security"
                      />
                      <WeightBar
                        label="Car Theft"
                        weight={20}
                        color="bg-yellow-500"
                        description="Vehicle-related property crimes"
                      />
                      <WeightBar
                        label="Petty Theft"
                        weight={15}
                        color="bg-blue-500"
                        description="Lower severity property crimes"
                      />
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                      <p className="text-xs text-blue-900 dark:text-blue-100 leading-relaxed">
                        <strong>Why these weights?</strong> Violent crimes are weighted highest because they pose the greatest
                        threat to personal safety. Property crimes are weighted based on their severity and impact on quality of life.
                        These weights reflect criminology research on crime severity indices.
                      </p>
                    </div>
                  </section>

                  {/* Normalization Process */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <Percent className="w-5 h-5 text-green-600 dark:text-green-400" />
                      Normalization Process
                    </h3>

                    <div className="space-y-3">
                      <ProcessCard
                        step={1}
                        title="Per Capita Calculation"
                        description="All crime counts are divided by neighborhood population to account for size differences. This ensures fair comparison between large and small neighborhoods."
                      />
                      <ProcessCard
                        step={2}
                        title="Percentile Ranking"
                        description="Each neighborhood is ranked relative to all LA County neighborhoods. A percentile score shows how a neighborhood compares to others."
                      />
                      <ProcessCard
                        step={3}
                        title="Score Scaling"
                        description="Final scores are scaled to 0-100 range where 100 represents the safest possible score and 0 represents highest crime rates."
                      />
                    </div>
                  </section>

                  {/* Confidence Intervals */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                      Confidence Intervals
                    </h3>

                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      Each crime statistic includes a 95% confidence interval calculated using standard error estimation.
                      This helps account for:
                    </p>

                    <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-600 dark:text-cyan-400 mt-0.5">•</span>
                        <span>Sample size variations across neighborhoods</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-600 dark:text-cyan-400 mt-0.5">•</span>
                        <span>Temporal fluctuations in crime rates</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-cyan-600 dark:text-cyan-400 mt-0.5">•</span>
                        <span>Reporting variations and data collection uncertainties</span>
                      </li>
                    </ul>

                    <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                      <div className="text-xs font-mono text-gray-800 dark:text-gray-300">
                        CI = mean ± (1.96 × SE)
                        <div className="text-gray-600 dark:text-gray-400 mt-1">
                          where SE = standard deviation / √n
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Limitations */}
                  <section className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                      Known Limitations
                    </h3>

                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 space-y-3">
                      <LimitationItem
                        title="Reporting Bias"
                        description="Crime statistics only reflect reported crimes. Actual crime rates may differ due to underreporting in some areas."
                      />
                      <LimitationItem
                        title="Temporal Variations"
                        description="Crime rates fluctuate seasonally and over time. Historical data may not predict future trends."
                      />
                      <LimitationItem
                        title="Spatial Granularity"
                        description="Neighborhood-level aggregation can mask variations within neighborhoods. Crime hotspots may exist in otherwise safe areas."
                      />
                      <LimitationItem
                        title="Simplified Metrics"
                        description="Safety is multidimensional. Our scores focus on crime but don't capture other safety factors like emergency response times, street lighting, or community programs."
                      />
                    </div>
                  </section>

                  {/* Data Quality */}
                  <section className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Data Quality Score
                    </h4>
                    <p className="text-xs text-green-800 dark:text-green-200 leading-relaxed">
                      Each neighborhood receives a data quality score (0-100) based on completeness, recency, and sample size.
                      Scores below 70 are flagged with insufficient data warnings. Only neighborhoods with quality scores above
                      60 are included in comparative rankings.
                    </p>
                  </section>

                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 p-4">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Methodology version 1.0.0 | Last updated: January 2025
                    </div>
                    <button
                      onClick={onClose}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium text-sm transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

interface WeightBarProps {
  label: string
  weight: number
  color: string
  description: string
}

function WeightBar({ label, weight, color, description }: WeightBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-900 dark:text-gray-100">{label}</span>
        <span className="font-semibold text-gray-700 dark:text-gray-300">{weight}%</span>
      </div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${weight}%` }}
          transition={{ duration: 1, delay: 0.2 }}
          className={`h-full ${color} rounded-full`}
        />
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  )
}

interface ProcessCardProps {
  step: number
  title: string
  description: string
}

function ProcessCard({ step, title, description }: ProcessCardProps) {
  return (
    <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-700 rounded-lg">
      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
        {step}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm mb-1">
          {title}
        </h4>
        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}

interface LimitationItemProps {
  title: string
  description: string
}

function LimitationItem({ title, description }: LimitationItemProps) {
  return (
    <div className="flex items-start gap-2">
      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
      <div>
        <div className="font-medium text-amber-900 dark:text-amber-100 text-sm">{title}</div>
        <div className="text-xs text-amber-800 dark:text-amber-200 mt-0.5">{description}</div>
      </div>
    </div>
  )
}
