'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/main-layout'
import { MapWrapper } from '@/components/map/map-wrapper'
import { MetricSelector } from '@/components/ui/metric-selector'
import { StatsDashboard } from '@/components/ui/stats-dashboard'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { laNeighborhoods } from '@/lib/data/neighborhoods'
import { calculateCrimeStats } from '@/lib/utils/crime-stats'
import { CrimeMetric } from '@/lib/data/types'

// Dynamic imports for AI features (loaded only when needed - reduces initial bundle by ~125KB)
const AIChatAssistant = dynamic(() => import('@/components/features').then(mod => ({ default: mod.AIChatAssistant })), {
  ssr: false,
  loading: () => null
})

const AISmartInsights = dynamic(() => import('@/components/features').then(mod => ({ default: mod.AISmartInsights })), {
  ssr: false,
  loading: () => (
    <div className="bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  )
})

// Animation variants following healthcare project patterns
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
}

export default function Home() {
  const [selectedMetric, setSelectedMetric] = useState<CrimeMetric>('violentCrime')

  // Calculate statistics from neighborhood data
  const stats = calculateCrimeStats(laNeighborhoods)

  return (
    <ErrorBoundary>
      <MainLayout>
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageTransition}
          className="min-h-screen"
        >
          {/* Hero Section */}
          <motion.section
            className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-la-night-dark dark:via-la-night-base dark:to-la-night-dark py-12 px-4 sm:px-6 lg:px-8"
            variants={fadeInUp}
          >
            <div className="max-w-7xl mx-auto">
              <div className="text-center space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white dark:text-dark-text-primary">
                  Find Your Safe Haven in LA
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 dark:text-dark-text-secondary max-w-3xl mx-auto">
                  Explore neighborhood safety data to make confident decisions
                </p>
              </div>
            </div>
          </motion.section>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">

            {/* Stats Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <StatsDashboard stats={stats} />
            </motion.div>

            {/* AI Smart Insights */}
            {process.env.NEXT_PUBLIC_ENABLE_AI_FEATURES === 'true' && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.5 }}
              >
                <AISmartInsights />
              </motion.div>
            )}

            {/* Metric Selector */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <MetricSelector
                selectedMetric={selectedMetric}
                onChange={setSelectedMetric}
              />
            </motion.div>

            {/* Interactive Map */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-dark-text-primary">
                  Crime Map by {selectedMetric === 'violentCrime' ? 'Violent Crime' :
                             selectedMetric === 'carTheft' ? 'Car Theft' :
                             selectedMetric === 'breakIns' ? 'Break-ins' : 'Petty Theft'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-dark-text-tertiary mt-1">
                  Click on neighborhoods to view detailed information
                </p>
              </div>
              <div className="h-[400px] sm:h-[600px] md:h-[700px] lg:h-[800px]">
                <MapWrapper
                  data={laNeighborhoods}
                  selectedMetric={selectedMetric}
                />
              </div>
            </motion.div>

            {/* How It Works Section */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mt-12"
            >
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-dark-text-primary mb-3">
                  How It Works
                </h2>
                <p className="text-lg text-gray-600 dark:text-dark-text-secondary max-w-2xl mx-auto">
                  Three simple steps to understand your neighborhood safety
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <InfoCard
                  title="1. Search Your Area"
                  description="Enter any LA address or browse the interactive map to explore neighborhoods"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
                <InfoCard
                  title="2. Review Safety Data"
                  description="See clear safety scores and crime breakdowns based on official LA data"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  }
                />
                <InfoCard
                  title="3. Make Your Decision"
                  description="Compare neighborhoods side-by-side and find the perfect place for you"
                  icon={
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                />
              </div>
            </motion.div>

            {/* Safety Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mt-8"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    A Note About Our Data
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                    We compile data from official LA sources to help you understand neighborhood trends. Remember that safety is personal and
                    depends on many factors. Use this as one helpful tool in your decision-making process.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* AI Chat Assistant - Floating button */}
        {process.env.NEXT_PUBLIC_ENABLE_CHAT === 'true' && <AIChatAssistant />}
      </MainLayout>
    </ErrorBoundary>
  )
}

// Info Card Component with animations
interface InfoCardProps {
  title: string
  description: string
  icon: React.ReactNode
}

function InfoCard({ title, description, icon }: InfoCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      whileHover={{
        y: -4,
        transition: { type: 'spring', stiffness: 400, damping: 17 }
      }}
      className="bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-neon-cyan/10 dark:bg-neon-cyan/20 rounded-lg text-neon-cyan">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-dark-text-primary">
          {title}
        </h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-dark-text-secondary leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}
