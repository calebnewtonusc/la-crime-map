/**
 * INTEGRATION GUIDE - LA Crime Map Trust Signals
 *
 * This file shows exactly how to integrate trust signal components
 * into your main app/page.tsx file.
 *
 * Copy and adapt this code to add credibility features to your LA Crime Map.
 */

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator } from 'lucide-react'

// Trust signal components
import { DataSources, MethodologyModal, AboutSection } from '@/components/features'

// Your existing components
import { MainLayout } from '@/components/layout/main-layout'
import { MapWrapper } from '@/components/map/map-wrapper'
import { MetricSelector } from '@/components/ui/metric-selector'
import { StatsDashboard } from '@/components/ui/stats-dashboard'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { laNeighborhoods } from '@/lib/data/neighborhoods'
import { calculateCrimeStats } from '@/lib/utils/crime-stats'
import { CrimeMetric } from '@/lib/data/types'

export default function HomeWithTrustSignals() {
  const [selectedMetric, setSelectedMetric] = useState<CrimeMetric>('violentCrime')
  const [methodologyOpen, setMethodologyOpen] = useState(false)

  // Calculate statistics from neighborhood data
  const stats = calculateCrimeStats(laNeighborhoods)

  return (
    <ErrorBoundary>
      <MainLayout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen"
        >
          {/* Hero Section */}
          <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 dark:from-dark-bg-primary dark:via-dark-bg-secondary dark:to-dark-bg-primary py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                className="text-center space-y-4 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-neon-cyan via-blue-400 to-neon-purple bg-clip-text text-transparent">
                  LA Crime Map
                </h1>
                <p className="text-lg sm:text-xl text-gray-300 dark:text-dark-text-secondary max-w-3xl mx-auto">
                  Visualize crime data across Los Angeles neighborhoods with interactive maps and real-time statistics
                </p>

                {/* TRUST SIGNAL 1: Compact Data Badge */}
                <div className="flex justify-center pt-4">
                  <DataSources compact />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Stats Dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <StatsDashboard stats={stats} />
            </motion.div>

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
              <div className="h-[600px] sm:h-[700px] lg:h-[800px]">
                <MapWrapper
                  data={laNeighborhoods}
                  selectedMetric={selectedMetric}
                />
              </div>
            </motion.div>

            {/* TRUST SIGNAL 2: Methodology Link */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100">
                      How are safety scores calculated?
                    </h3>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      View our transparent methodology with formulas and weighting factors
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMethodologyOpen(true)}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors text-sm"
                >
                  View Methodology
                </button>
              </div>
            </motion.div>

            {/* Information Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <InfoCard
                title="Real-time Data"
                description="Access up-to-date crime statistics from official LA sources"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
              />
              <InfoCard
                title="Interactive Visualization"
                description="Explore crime patterns with our intuitive map interface"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                }
              />
              <InfoCard
                title="Comprehensive Coverage"
                description="Data from 35+ neighborhoods across LA County"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
              />
            </motion.div>

            {/* TRUST SIGNAL 3: Full Data Sources Card (Optional) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <DataSources />
            </motion.div>

            {/* TRUST SIGNAL 4: About Section */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <AboutSection />
            </motion.div>

            {/* Safety Notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-2">
                    Data Disclaimer
                  </h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
                    This map is for informational purposes only. Crime statistics are simplified and may not reflect current conditions.
                    Always consult official sources and local authorities for the most accurate and up-to-date information about neighborhood safety.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* TRUST SIGNAL 5: Methodology Modal */}
        <MethodologyModal
          isOpen={methodologyOpen}
          onClose={() => setMethodologyOpen(false)}
        />

        {/* Note: Footer is automatically included in MainLayout */}
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

/**
 * INTEGRATION CHECKLIST:
 *
 * ✓ Import trust signal components at the top
 * ✓ Add state for methodology modal
 * ✓ Add compact DataSources badge in hero section
 * ✓ Add methodology link/button with call-to-action
 * ✓ Add full DataSources card (optional, can be on separate page)
 * ✓ Add AboutSection near bottom of page
 * ✓ Add MethodologyModal component with state controls
 * ✓ Footer is already integrated in MainLayout (no action needed)
 *
 * CUSTOMIZATION NEEDED:
 * - Update GitHub URLs in AboutSection and Footer
 * - Update contact email addresses
 * - Adjust positioning/ordering based on your design
 * - Add/remove sections as needed for your layout
 * - Connect live data API for real-time updates
 */
