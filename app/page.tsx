'use client'

import { useState, useMemo, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/main-layout'
import { MapWrapper } from '@/components/map/map-wrapper'
import { MetricSelector } from '@/components/ui/metric-selector'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { SearchBar } from '@/components/ui/search-bar'
import { TimeFilter, TimeFilterValue } from '@/components/ui/time-filter'
import { ExportButton } from '@/components/ui/export-button'
import { TopNeighborhoods } from '@/components/ui/top-neighborhoods'
import { EnhancedStatsPanel } from '@/components/ui/enhanced-stats-panel'
import { laNeighborhoods } from '@/lib/data/neighborhoods'
import { useRealCrimeData } from '@/lib/hooks/use-real-crime-data'
import { mergeCrimeDataWithBoundaries, formatLastUpdated, isDataStale } from '@/lib/utils/merge-crime-data'
import { calculateCrimeStats } from '@/lib/utils/crime-stats'
import { CrimeMetric, NeighborhoodData } from '@/lib/data/types'
import { RefreshCw, AlertTriangle, Map, BarChart2 } from 'lucide-react'

// Dynamic imports for AI features
const AIChatAssistant = dynamic(() => import('@/components/features').then(mod => ({ default: mod.AIChatAssistant })), {
  ssr: false,
  loading: () => null
})

const AISmartInsights = dynamic(() => import('@/components/features').then(mod => ({ default: mod.AISmartInsights })), {
  ssr: false,
  loading: () => (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 animate-pulse">
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
      </div>
    </div>
  )
})

// Animation variants
const pageTransition = { initial: { opacity: 0 }, animate: { opacity: 1 } }
const heroVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }
const staggerContainer = { hidden: { opacity: 0 }, visible: { opacity: 1 } }
const fadeInUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }

const defaultTimeFilter: TimeFilterValue = { mode: 'preset', days: 30, label: 'Last 30 Days' }

// Convert TimeFilterValue to days for the API
function timeFilterToDays(filter: TimeFilterValue): number {
  if (filter.mode === 'preset') return filter.days ?? 30
  if (filter.mode === 'year') return 365
  if (filter.mode === 'season') return 90
  if (filter.mode === 'month') return 31
  return 30
}

export default function Home() {
  const [selectedMetric, setSelectedMetric] = useState<CrimeMetric>('violentCrime')
  const [timeFilter, setTimeFilter] = useState<TimeFilterValue>(defaultTimeFilter)
  const [activeTab, setActiveTab] = useState<'map' | 'analytics'>('map')
  const [highlightedNeighborhood, setHighlightedNeighborhood] = useState<NeighborhoodData | null>(null)

  const days = timeFilterToDays(timeFilter)

  const { neighborhoods: crimeData, metadata, loading, error, refetch } = useRealCrimeData({
    days,
    autoFetch: true
  })

  const mergedNeighborhoods = useMemo(() => {
    if (crimeData.length === 0) {
      return laNeighborhoods
    }
    return mergeCrimeDataWithBoundaries(crimeData, laNeighborhoods)
  }, [crimeData])

  const stats = calculateCrimeStats(mergedNeighborhoods)
  const dataIsStale = metadata ? isDataStale(metadata.lastUpdated) : false

  const handleNeighborhoodSelect = useCallback((neighborhood: NeighborhoodData) => {
    setHighlightedNeighborhood(neighborhood)
    // Switch to map tab and scroll to map
    setActiveTab('map')
    setTimeout(() => {
      document.getElementById('explore-map')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }, [])

  const metricLabel =
    selectedMetric === 'violentCrime' ? 'Violent Crime' :
    selectedMetric === 'carTheft' ? 'Car Theft' :
    selectedMetric === 'breakIns' ? 'Break-ins' : 'Petty Theft'

  return (
    <ErrorBoundary>
      <MainLayout>
        <motion.div
          initial="initial"
          animate="animate"
          variants={pageTransition}
          className="min-h-screen"
        >
          {/* Hero Section */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={heroVariants}
            style={{ background: 'linear-gradient(to bottom right, #0a0e1a 0%, #9D4EDD 50%, #131827 100%)' }}
            className="relative overflow-hidden py-16 sm:py-24 lg:py-32"
          >
            <div className="absolute inset-0 animate-pulse" style={{ background: 'linear-gradient(to top right, rgba(255,107,53,0.2) 0%, transparent 50%, rgba(255,46,151,0.2) 100%)', animationDuration: '4s' }} />
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-8 max-w-4xl mx-auto">
                <motion.h1
                  variants={fadeInUp}
                  className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight"
                >
                  Make Smarter Moving Decisions
                  <span className="block mt-2 text-white" style={{ background: 'linear-gradient(to right, #FF6B35, #FF2E97, #9D4EDD)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    With Real LA Crime Data
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-xl sm:text-2xl leading-relaxed max-w-3xl mx-auto font-light"
                  style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                >
                  Interactive crime data from the <strong>LAPD Open Data Portal</strong>. Compare neighborhoods, explore trends, and make informed decisions.
                </motion.p>

                {/* Hero search bar */}
                <motion.div
                  variants={fadeInUp}
                  className="max-w-xl mx-auto"
                >
                  <SearchBar
                    onSelect={handleNeighborhoodSelect}
                    placeholder="Search any LA neighborhood..."
                    showPopularSearches={true}
                    className="shadow-2xl"
                  />
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
                >
                  <a
                    href="#explore-map"
                    style={{ background: 'linear-gradient(to right, #FF6B35, #FF2E97)' }}
                    className="group relative px-8 py-4 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 min-w-[200px] text-center"
                  >
                    <span className="relative z-10">Explore Map</span>
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to right, #FF2E97, #FF6B35)' }} />
                  </a>
                  <a
                    href="#how-it-works"
                    className="px-8 py-4 text-white font-semibold rounded-xl border-2 transition-all duration-300 min-w-[200px] text-center"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderColor: 'rgba(255,255,255,0.2)' }}
                  >
                    How It Works
                  </a>
                </motion.div>

                <motion.div
                  variants={fadeInUp}
                  className="flex flex-wrap justify-center items-center gap-8 pt-4"
                  style={{ color: 'rgba(255, 255, 255, 0.8)' }}
                >
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" style={{ color: '#FFB020' }} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-medium">Official LAPD Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" style={{ color: '#FFB020' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Q4 2024 Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" style={{ color: '#FFB020' }} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">100% Free</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Data Freshness Warning */}
          {(dataIsStale || error) && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-400 p-4 rounded-r-lg" role="alert">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" aria-hidden="true" />
                  <div className="flex-1">
                    {error ? (
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Error loading data:</strong> {error}. Showing cached data.
                      </p>
                    ) : (
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        <strong>Data may be stale.</strong> Last updated: {metadata ? formatLastUpdated(metadata.lastUpdated) : 'Unknown'}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <RefreshCw className="w-4 h-4" aria-hidden="true" />
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Stats + Analytics Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {loading ? (
              <div className="text-center py-16" role="status" aria-live="polite">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-la-sunset-orange mb-4" aria-hidden="true"></div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">Loading real-time crime data...</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Fetching {days}-day window from LAPD</p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <EnhancedStatsPanel
                  stats={stats}
                  data={mergedNeighborhoods}
                  selectedMetric={selectedMetric}
                />

                {metadata && (
                  <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Showing data from{' '}
                    <strong className="text-gray-700 dark:text-gray-300">{new Date(metadata.dateRange.start).toLocaleDateString()}</strong>
                    {' '}to{' '}
                    <strong className="text-gray-700 dark:text-gray-300">{new Date(metadata.dateRange.end).toLocaleDateString()}</strong>
                    {' • '}
                    {formatLastUpdated(metadata.lastUpdated)}
                    {' • '}
                    <strong>{metadata.totalIncidents.toLocaleString()}</strong> total incidents
                  </div>
                )}

                {/* AI Smart Insights */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.6 }}
                  className="mt-6"
                >
                  <AISmartInsights />
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* Interactive Map + Sidebar Section */}
          <div id="explore-map" className="bg-gray-50 dark:bg-gray-950 py-12 sm:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              {/* Section header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
              >
                <div>
                  <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100">
                    Explore Every Neighborhood
                  </h2>
                  <p className="text-base text-gray-600 dark:text-gray-400 mt-2">
                    Click any area for detailed stats. Filter by crime type and time period.
                  </p>
                </div>

                {/* Time filter + Export controls */}
                <div className="flex flex-wrap items-center gap-2">
                  <TimeFilter
                    value={timeFilter}
                    onChange={setTimeFilter}
                  />
                  <ExportButton
                    data={mergedNeighborhoods}
                    selectedMetric={selectedMetric}
                    dateLabel={timeFilter.label}
                  />
                </div>
              </motion.div>

              {/* Tab switcher */}
              <div className="flex gap-1 bg-gray-200 dark:bg-gray-800 rounded-xl p-1 w-fit" role="tablist" aria-label="View mode">
                <button
                  role="tab"
                  aria-selected={activeTab === 'map'}
                  onClick={() => setActiveTab('map')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    activeTab === 'map'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <Map className="w-4 h-4" aria-hidden="true" />
                  Map View
                </button>
                <button
                  role="tab"
                  aria-selected={activeTab === 'analytics'}
                  onClick={() => setActiveTab('analytics')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    activeTab === 'analytics'
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  <BarChart2 className="w-4 h-4" aria-hidden="true" />
                  Analytics
                </button>
              </div>

              {/* Crime type selector */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <MetricSelector
                  selectedMetric={selectedMetric}
                  onChange={setSelectedMetric}
                />
              </motion.div>

              {activeTab === 'map' ? (
                /* Map + Sidebar layout */
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                  className="grid grid-cols-1 lg:grid-cols-4 gap-6"
                >
                  {/* Map */}
                  <div className="lg:col-span-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          {metricLabel} Map
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          Darker = higher incidents. Click neighborhood for details.
                        </p>
                      </div>
                      {/* Inline search */}
                      <div className="hidden sm:block w-56">
                        <SearchBar
                          onSelect={handleNeighborhoodSelect}
                          placeholder="Find neighborhood..."
                          showPopularSearches={false}
                        />
                      </div>
                    </div>
                    <div className="h-[500px] sm:h-[600px] md:h-[700px]">
                      {loading ? (
                        <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900" role="status" aria-live="polite">
                          <div className="text-center">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-la-sunset-orange mb-4" aria-hidden="true"></div>
                            <p className="text-gray-600 dark:text-gray-400 font-medium">Loading map...</p>
                          </div>
                        </div>
                      ) : (
                        <MapWrapper
                          data={mergedNeighborhoods}
                          selectedMetric={selectedMetric}
                          onNeighborhoodClick={setHighlightedNeighborhood}
                        />
                      )}
                    </div>
                  </div>

                  {/* Sidebar: Top 10 */}
                  <div className="lg:col-span-1">
                    <TopNeighborhoods
                      data={mergedNeighborhoods}
                      selectedMetric={selectedMetric}
                      onNeighborhoodSelect={handleNeighborhoodSelect}
                    />
                  </div>
                </motion.div>
              ) : (
                /* Analytics view */
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {loading ? (
                    <div className="text-center py-16" role="status">
                      <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-la-sunset-orange mb-4" aria-hidden="true"></div>
                      <p className="text-gray-600 dark:text-gray-400">Loading analytics...</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2">
                        <EnhancedStatsPanel
                          stats={stats}
                          data={mergedNeighborhoods}
                          selectedMetric={selectedMetric}
                        />
                      </div>
                      <div>
                        <TopNeighborhoods
                          data={mergedNeighborhoods}
                          selectedMetric={selectedMetric}
                          onNeighborhoodSelect={handleNeighborhoodSelect}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* How It Works Section */}
          <div id="how-it-works" className="py-16 sm:py-24 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-12 sm:mb-16"
              >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                  Three Steps to Better Decisions
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Understanding neighborhood safety has never been easier
                </p>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
              >
                <FeatureCard
                  number="01"
                  title="Filter & Search"
                  description="Filter by crime type, time period, or season. Search for any LA neighborhood instantly with full keyboard support."
                  icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  }
                />
                <FeatureCard
                  number="02"
                  title="Explore & Analyze"
                  description="Click any neighborhood to see detailed crime breakdowns. Toggle between map view and analytics charts."
                  icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  }
                />
                <FeatureCard
                  number="03"
                  title="Compare & Export"
                  description="See the top 10 safest and most dangerous neighborhoods. Export the full dataset as CSV for your own analysis."
                  icon={
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  }
                />
              </motion.div>
            </div>
          </div>

          {/* Data Trust Section */}
          <div className="py-12 sm:py-16 bg-gray-50 dark:bg-gray-950">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-gradient-to-br from-la-sunset-orange/10 via-la-sunset-pink/10 to-la-sunset-purple/10 dark:from-la-sunset-orange/5 dark:via-la-sunset-pink/5 dark:to-la-sunset-purple/5 border-2 border-la-sunset-orange/20 dark:border-la-sunset-orange/30 rounded-2xl p-8 sm:p-12"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex-shrink-0 p-3 bg-la-sunset-orange/20 dark:bg-la-sunset-orange/30 rounded-xl">
                    <svg className="w-8 h-8 text-la-sunset-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                      Reliable Data You Can Trust
                    </h3>
                    <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                      <p className="text-base sm:text-lg">
                        Our crime data comes directly from the <strong>Los Angeles Police Department Open Data Portal</strong>. Data is from official LAPD records updated regularly.
                      </p>
                      <p className="text-base sm:text-lg">
                        Remember: Safety is personal and multifaceted. Crime data is just one factor to consider. Use this tool alongside neighborhood visits and local insights.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="py-16 sm:py-24 relative overflow-hidden" style={{ background: 'linear-gradient(to bottom right, #0a0e1a, #9D4EDD, #131827)' }}>
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '4rem 4rem' }} />
            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                  Ready to Find Your Perfect Neighborhood?
                </h2>
                <p className="text-xl max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  Start exploring real LA crime data and make your next move with confidence
                </p>
                <a
                  href="#explore-map"
                  style={{ background: 'linear-gradient(to right, #FF6B35, #FF2E97)' }}
                  className="inline-block px-10 py-5 text-white text-lg font-semibold rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-400"
                >
                  Get Started Free
                </a>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* AI Chat Assistant */}
        <AIChatAssistant />
      </MainLayout>
    </ErrorBoundary>
  )
}

interface FeatureCardProps {
  number: string
  title: string
  description: string
  icon: React.ReactNode
}

function FeatureCard({ number, title, description, icon }: FeatureCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className="relative group"
    >
      <div className="h-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-la-sunset-orange to-la-sunset-pink rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg" aria-hidden="true">
          {number}
        </div>
        <div className="mb-6 p-4 bg-gradient-to-br from-la-sunset-orange/10 to-la-sunset-pink/10 dark:from-la-sunset-orange/20 dark:to-la-sunset-pink/20 rounded-xl text-la-sunset-orange inline-block" aria-hidden="true">
          {icon}
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  )
}
