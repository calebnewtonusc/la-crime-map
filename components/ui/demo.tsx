'use client'

/**
 * UI Components Demo
 *
 * This file demonstrates all the UI components in action.
 * Use this as a reference or testing page.
 */

import { useState } from 'react'
import { Legend } from './legend'
import { InfoCard, InfoCardHelp, InfoCardSuccess, InfoCardWarning, InfoCardError } from './info-card'
import { SearchBar } from './search-bar'
import { FilterPanel, FilterState } from './filter-panel'
import { NeighborhoodData } from '@/lib/data/types'

export function UIComponentsDemo() {
  const [showInfoCard, setShowInfoCard] = useState(true)
  const [showSuccessCard, setShowSuccessCard] = useState(true)
  const [showWarningCard, setShowWarningCard] = useState(true)
  const [showErrorCard, setShowErrorCard] = useState(true)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string | null>(null)

  const [filters, setFilters] = useState<FilterState>({
    crimeTypes: ['violentCrime', 'carTheft', 'breakIns', 'pettyTheft'],
    dateRange: '1month',
    safetyRange: [0, 100],
    showOnlySufficientData: false
  })

  const handleNeighborhoodSelect = (neighborhood: NeighborhoodData) => {
    setSelectedNeighborhood(neighborhood.name)
    console.log('Selected neighborhood:', neighborhood)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            UI Components Demo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Interactive showcase of all UI components
          </p>
        </div>

        {/* Search Bar Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Search Bar
          </h2>
          <SearchBar
            onSelect={handleNeighborhoodSelect}
            placeholder="Search for a neighborhood..."
            showPopularSearches={true}
            className="max-w-2xl"
          />
          {selectedNeighborhood && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">
              Selected: <strong>{selectedNeighborhood}</strong>
            </p>
          )}
        </section>

        {/* Info Cards Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Info Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {showInfoCard && (
              <InfoCardHelp
                title="Information Card"
                onClose={() => setShowInfoCard(false)}
              >
                This is an informational card with helpful content. It can be closed
                and includes smooth animations.
              </InfoCardHelp>
            )}

            {showSuccessCard && (
              <InfoCardSuccess
                title="Success Card"
                onClose={() => setShowSuccessCard(false)}
              >
                Operation completed successfully! Data has been updated and is ready
                to use.
              </InfoCardSuccess>
            )}

            {showWarningCard && (
              <InfoCardWarning
                title="Warning Card"
                onClose={() => setShowWarningCard(false)}
              >
                Please be aware that some data may be outdated. Consider refreshing
                for the latest information.
              </InfoCardWarning>
            )}

            {showErrorCard && (
              <InfoCardError
                title="Error Card"
                onClose={() => setShowErrorCard(false)}
              >
                An error occurred while fetching data. Please try again later or
                contact support.
              </InfoCardError>
            )}
          </div>

          {(!showInfoCard && !showSuccessCard && !showWarningCard && !showErrorCard) && (
            <div className="text-center py-8">
              <button
                onClick={() => {
                  setShowInfoCard(true)
                  setShowSuccessCard(true)
                  setShowWarningCard(true)
                  setShowErrorCard(true)
                }}
                className="px-4 py-2 bg-neon-cyan text-white rounded-lg hover:bg-neon-cyan/90 dark:bg-neon-purple dark:hover:bg-neon-purple/90"
              >
                Reset Info Cards
              </button>
            </div>
          )}
        </section>

        {/* Two Column Layout */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Legend and Filter Panel
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Legend */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Map Legend
              </h3>
              <Legend showDetails={false} />
            </div>

            {/* Filter Panel */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Filter Panel
              </h3>
              <FilterPanel
                filters={filters}
                onChange={setFilters}
                isCollapsible={true}
              />

              {/* Filter State Display */}
              <div className="mt-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  Current Filter State:
                </h4>
                <pre className="text-xs text-gray-600 dark:text-gray-300 overflow-auto">
                  {JSON.stringify(filters, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Component Grid */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            All Components at a Glance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Legend Component
              </h3>
              <Legend showDetails={true} />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Search Component
              </h3>
              <SearchBar
                onSelect={handleNeighborhoodSelect}
                placeholder="Try searching..."
              />
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Info Card Variant
              </h3>
              <InfoCard
                variant="info"
                title="Component Showcase"
                isClosable={false}
              >
                All components feature smooth animations and dark mode support.
              </InfoCard>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-600 dark:text-gray-400 pt-8 border-t border-gray-200 dark:border-gray-700">
          <p>
            LA Crime Map - UI Components Library
          </p>
          <p className="mt-2">
            Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion
          </p>
        </footer>
      </div>
    </div>
  )
}

export default UIComponentsDemo
