'use client'

import { motion } from 'framer-motion'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'card' | 'map'
}

export function LoadingSkeleton({ className = '', variant = 'text' }: LoadingSkeletonProps) {
  const baseClass = 'animate-pulse bg-gray-200 dark:bg-dark-bg-secondary rounded'

  if (variant === 'map') {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 bg-gray-200 dark:bg-dark-bg-secondary rounded-lg overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent"
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </div>
        <div className="absolute top-4 left-4 right-4 space-y-3">
          <div className="h-4 bg-gray-300/50 dark:bg-dark-bg-tertiary/50 rounded w-1/3" />
          <div className="h-3 bg-gray-300/50 dark:bg-dark-bg-tertiary/50 rounded w-1/4" />
        </div>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={`${className} space-y-3`}>
        <div className="h-4 bg-gray-200 dark:bg-dark-bg-secondary rounded w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-dark-bg-secondary rounded w-1/2" />
      </div>
    )
  }

  return <div className={`${baseClass} ${className}`} />
}

export function MapSkeleton() {
  return (
    <div className="w-full h-[calc(100vh-4rem)] bg-gray-100 dark:bg-dark-bg-secondary rounded-lg overflow-hidden relative">
      <LoadingSkeleton variant="map" className="w-full h-full" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-neon-cyan border-t-transparent rounded-full mx-auto mb-4"
        />
        <p className="text-gray-600 dark:text-dark-text-secondary">Getting your map ready...</p>
      </div>
    </div>
  )
}
