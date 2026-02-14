'use client'

import { motion } from 'framer-motion'
import { Shield, Info } from 'lucide-react'
import { SafetyScore } from '@/lib/utils/safety-scoring'
import { useState } from 'react'

interface SafetyBadgeProps {
  safetyScore: SafetyScore
  showDescription?: boolean
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export function SafetyBadge({
  safetyScore,
  showDescription = false,
  size = 'md',
  animated = true,
}: SafetyBadgeProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  // Size configurations
  const sizes = {
    sm: {
      container: 'px-2 py-1',
      text: 'text-xs',
      icon: 'w-3 h-3',
      badge: 'text-sm',
      score: 'text-xs',
    },
    md: {
      container: 'px-3 py-2',
      text: 'text-sm',
      icon: 'w-4 h-4',
      badge: 'text-lg',
      score: 'text-sm',
    },
    lg: {
      container: 'px-4 py-3',
      text: 'text-base',
      icon: 'w-5 h-5',
      badge: 'text-2xl',
      score: 'text-base',
    },
  }

  const sizeConfig = sizes[size]

  const content = (
    <div className={`inline-flex items-center gap-2 rounded-lg ${safetyScore.color.bg} ${sizeConfig.container} shadow-sm`}>
      <Shield className={`${sizeConfig.icon} ${safetyScore.color.text}`} aria-hidden="true" />
      <div className="flex items-baseline gap-1.5">
        <span className={`font-bold ${safetyScore.color.text} ${sizeConfig.badge}`}>
          {safetyScore.letterGrade}
        </span>
        <span className={`font-medium text-gray-600 dark:text-gray-400 ${sizeConfig.score}`}>
          ({safetyScore.score})
        </span>
      </div>
      {showDescription && (
        <button
          type="button"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
          className="relative ml-1 p-1 rounded focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-400"
          aria-label="Safety score information"
        >
          <Info className={`${sizeConfig.icon} text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors`} aria-hidden="true" />
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-3 bg-gray-900 dark:bg-gray-800 text-white text-xs rounded-lg shadow-xl z-50 pointer-events-none"
            >
              <div className="font-semibold mb-1.5">Safety Grade: {safetyScore.letterGrade}</div>
              <div className="text-gray-300 leading-relaxed">{safetyScore.description}</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-px w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900 dark:border-t-gray-800" />
            </motion.div>
          )}
        </button>
      )}
    </div>
  )

  if (!animated) {
    return content
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      whileHover={{ scale: 1.02 }}
    >
      {content}
    </motion.div>
  )
}

interface SafetyBadgeWithDescriptionProps {
  safetyScore: SafetyScore
  size?: 'sm' | 'md' | 'lg'
}

export function SafetyBadgeWithDescription({
  safetyScore,
  size = 'md',
}: SafetyBadgeWithDescriptionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex-shrink-0 rounded-xl p-3 ${safetyScore.color.bg} shadow-sm`}
          aria-hidden="true"
        >
          <Shield className={`w-7 h-7 ${safetyScore.color.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 mb-2">
            <span className={`text-4xl font-bold ${safetyScore.color.text}`}>
              {safetyScore.letterGrade}
            </span>
            <span className="text-xl font-semibold text-gray-600 dark:text-gray-400">
              Safety Grade
            </span>
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">
            Safety Score: {safetyScore.score}/100
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {safetyScore.description}
          </p>
        </div>
      </div>
    </motion.div>
  )
}

interface TrafficLightProps {
  color: 'green' | 'yellow' | 'red'
  size?: 'sm' | 'md' | 'lg'
  label?: string
  animated?: boolean
}

export function TrafficLight({ color, size = 'sm', label, animated = true }: TrafficLightProps) {
  const colors = {
    green: 'bg-green-500 shadow-green-500/50',
    yellow: 'bg-yellow-500 shadow-yellow-500/50',
    red: 'bg-red-500 shadow-red-500/50',
  }

  const sizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  }

  const indicator = (
    <div className="flex items-center gap-2">
      <div
        className={`rounded-full ${colors[color]} ${sizes[size]} ${
          animated ? 'animate-pulse shadow-sm' : 'shadow-sm'
        }`}
        role="status"
        aria-label={`${color} status indicator${label ? ': ' + label : ''}`}
      />
      {label && <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>}
    </div>
  )

  if (!animated) {
    return indicator
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {indicator}
    </motion.div>
  )
}
