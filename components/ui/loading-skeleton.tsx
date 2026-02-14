'use client'

import { motion } from 'framer-motion'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'card' | 'map' | 'metric' | 'button'
  count?: number
}

export function LoadingSkeleton({ className = '', variant = 'text', count = 1 }: LoadingSkeletonProps) {
  const shimmer = (
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent"
      animate={{
        x: ['-100%', '100%'],
      }}
      transition={{
        duration: 1.8,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )

  if (variant === 'map') {
    return (
      <div className={`relative ${className}`} role="status" aria-label="Loading map">
        <div className="absolute inset-0 bg-gray-100 dark:bg-dark-bg-secondary rounded-xl overflow-hidden">
          {shimmer}
        </div>
        <div className="absolute top-6 left-6 right-6 space-y-4">
          <div className="h-5 bg-gray-300/60 dark:bg-dark-bg-tertiary/60 rounded-lg w-1/3" />
          <div className="h-4 bg-gray-300/40 dark:bg-dark-bg-tertiary/40 rounded-lg w-1/4" />
        </div>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-gray-100 dark:bg-dark-bg-secondary p-6 ${className}`} role="status" aria-label="Loading content">
        {shimmer}
        <div className="space-y-3 relative z-10">
          <div className="h-5 bg-gray-300/60 dark:bg-dark-bg-tertiary/60 rounded-lg w-3/4" />
          <div className="h-4 bg-gray-300/40 dark:bg-dark-bg-tertiary/40 rounded-lg w-1/2" />
          <div className="h-4 bg-gray-300/40 dark:bg-dark-bg-tertiary/40 rounded-lg w-5/6" />
        </div>
      </div>
    )
  }

  if (variant === 'metric') {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-gray-100 dark:bg-dark-bg-secondary p-6 ${className}`} role="status" aria-label="Loading metric">
        {shimmer}
        <div className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-300/60 dark:bg-dark-bg-tertiary/60 rounded-lg w-1/3" />
            <div className="w-12 h-12 bg-gray-300/60 dark:bg-dark-bg-tertiary/60 rounded-lg" />
          </div>
          <div className="h-8 bg-gray-300/60 dark:bg-dark-bg-tertiary/60 rounded-lg w-2/3" />
          <div className="h-3 bg-gray-300/40 dark:bg-dark-bg-tertiary/40 rounded-lg w-1/2" />
        </div>
      </div>
    )
  }

  if (variant === 'button') {
    return (
      <div className={`relative overflow-hidden rounded-lg bg-gray-200 dark:bg-dark-bg-tertiary h-11 ${className}`} role="status" aria-label="Loading">
        {shimmer}
      </div>
    )
  }

  // Default text variant
  if (count > 1) {
    return (
      <div className={`space-y-2 ${className}`} role="status" aria-label="Loading content">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="relative overflow-hidden">
            <div className={`h-4 bg-gray-200 dark:bg-dark-bg-secondary rounded ${i === count - 1 ? 'w-2/3' : 'w-full'}`}>
              {shimmer}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded ${className}`} role="status" aria-label="Loading">
      <div className="h-4 bg-gray-200 dark:bg-dark-bg-secondary">
        {shimmer}
      </div>
    </div>
  )
}

export function MapSkeleton() {
  return (
    <div
      className="w-full h-[calc(100vh-4rem)] bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-dark-bg-primary dark:via-dark-bg-secondary dark:to-dark-bg-primary rounded-2xl overflow-hidden relative border-2 border-gray-200 dark:border-gray-700 shadow-2xl"
      role="status"
      aria-live="polite"
      aria-label="Loading crime map"
    >
      <LoadingSkeleton variant="map" className="w-full h-full" />

      {/* Animated loading overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="relative">
          {/* Outer rotating ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-24 h-24 border-4 border-transparent border-t-neon-cyan border-r-la-sunset-purple rounded-full"
            aria-hidden="true"
          />

          {/* Inner rotating ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="absolute top-2 left-2 w-20 h-20 border-4 border-transparent border-b-la-sunset-pink border-l-la-sunset-gold rounded-full"
            aria-hidden="true"
          />

          {/* Center icon */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-8 h-8 bg-gradient-to-br from-neon-cyan to-la-sunset-purple rounded-lg flex items-center justify-center shadow-lg"
              aria-hidden="true"
            >
              <div className="w-3 h-3 bg-white rounded-full" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Loading text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 text-center z-10"
      >
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-lg font-semibold text-gray-700 dark:text-dark-text-primary mb-2"
        >
          Loading LA Crime Map
        </motion.p>
        <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
          Preparing neighborhood data...
        </p>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-4 left-4 space-y-2 z-10">
        <motion.div
          animate={{ width: ['40%', '60%', '40%'] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="h-3 bg-gray-300/50 dark:bg-dark-bg-tertiary/50 rounded-full"
        />
        <motion.div
          animate={{ width: ['30%', '50%', '30%'] }}
          transition={{ duration: 2, delay: 0.3, repeat: Infinity }}
          className="h-3 bg-gray-300/50 dark:bg-dark-bg-tertiary/50 rounded-full w-24"
        />
      </div>

      {/* Simulated map tiles */}
      <div className="absolute inset-0 opacity-20 dark:opacity-10">
        <div className="grid grid-cols-4 grid-rows-4 h-full gap-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              className="bg-gradient-to-br from-neon-cyan/20 to-la-sunset-purple/20 rounded"
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <LoadingSkeleton key={i} variant="metric" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LoadingSkeleton variant="card" className="h-48" />
        <LoadingSkeleton variant="card" className="h-48" />
      </div>
    </div>
  )
}
