'use client'

/**
 * Complete Integration Example
 *
 * This file shows how to integrate all the new UI components
 * into a complete dashboard page. Copy and adapt this for your needs.
 */

import { useState } from 'react'
import { Legend } from './legend'
import { InfoCardHelp, InfoCardWarning } from './info-card'
import { SearchBar } from './search-bar'
import { FilterPanel, FilterState } from './filter-panel'
import { NeighborhoodData } from '@/lib/data/types'

export function CrimeDashboardExample() {
  // State management
  const [showWelcome, setShowWelcome] = useState(true)
  const [showWarning, setShowWarning] = useState(true)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodData | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    crimeTypes: ['violentCrime', 'carTheft', 'breakIns', 'pettyTheft'],
    dateRange: '1month',
    safetyRange: [0, 100],
    showOnlySufficientData: false
  })

  // Handlers
  const handleNeighborhoodSelect = (neighborhood: NeighborhoodData) => {
    setSelectedNeighborhood(neighborhood)
    console.log('Selected neighborhood:', neighborhood)
    // TODO: Center map on neighborhood, update statistics, etc.
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    console.log('Filters updated:', newFilters)
    // TODO: Update map markers, refresh statistics, etc.
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            LA Crime Map Dashboard
          </h1>

          {/* Search Bar - Prominent position */}
          <SearchBar
            onSelect={handleNeighborhoodSelect}
            placeholder="Search for a neighborhood..."
            showPopularSearches={true}
            className="max-w-2xl"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        {/* Info Cards - Notification Area */}
        <div className="space-y-3 mb-6">
          {showWelcome && (
            <InfoCardHelp
              title="Welcome to LA Crime Map"
              onClose={() => setShowWelcome(false)}
            >
              Use the search bar to find neighborhoods, apply filters to refine your view,
              and check the legend for crime level colors. Click on any area of the map
              to see detailed statistics.
            </InfoCardHelp>
          )}

          {showWarning && selectedNeighborhood && !selectedNeighborhood.hasSufficientData && (
            <InfoCardWarning
              title="Limited Data Available"
              onClose={() => setShowWarning(false)}
            >
              The selected neighborhood has limited historical data. Statistics may not be
              fully representative. Consider viewing nearby neighborhoods for comparison.
            </InfoCardWarning>
          )}
        </div>

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Section - Takes up 3 columns on large screens */}
          <div className="lg:col-span-3">
            {/* Map Container */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-lg">
              <div className="relative h-[600px] bg-gray-100 dark:bg-gray-700">
                {/* Your Map Component Goes Here */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 dark:text-gray-400">
                  {selectedNeighborhood ? (
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                        {selectedNeighborhood.name}
                      </p>
                      <p className="text-sm mt-2">
                        Safety Score: {selectedNeighborhood.safetyScore?.toFixed(1) || 'N/A'}
                      </p>
                    </div>
                  ) : (
                    <p className="text-center px-4">
                      Map Component Would Go Here
                      <br />
                      <span className="text-sm">Search or select a neighborhood to view details</span>
                    </p>
                  )}
                </div>

                {/* Legend Overlay - Positioned on map */}
                <div className="absolute top-4 right-4 w-64">
                  <Legend showDetails={false} />
                </div>
              </div>
            </div>

            {/* Statistics Panel Below Map */}
            {selectedNeighborhood && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  label="Violent Crime"
                  value={selectedNeighborhood.violentCrime}
                  color="red"
                />
                <StatCard
                  label="Car Theft"
                  value={selectedNeighborhood.carTheft}
                  color="amber"
                />
                <StatCard
                  label="Break-ins"
                  value={selectedNeighborhood.breakIns}
                  color="orange"
                />
                <StatCard
                  label="Petty Theft"
                  value={selectedNeighborhood.pettyTheft}
                  color="yellow"
                />
              </div>
            )}
          </div>

          {/* Sidebar - Takes up 1 column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filter Panel */}
            <FilterPanel
              filters={filters}
              onChange={handleFilterChange}
              isCollapsible={true}
            />

            {/* Additional Info Panel */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Current Selection
              </h3>
              {selectedNeighborhood ? (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Neighborhood:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedNeighborhood.name}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Safety Score:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedNeighborhood.safetyScore?.toFixed(1) || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Total Incidents:</span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {(
                        selectedNeighborhood.violentCrime +
                        selectedNeighborhood.carTheft +
                        selectedNeighborhood.breakIns +
                        selectedNeighborhood.pettyTheft
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  No neighborhood selected. Use the search bar or click on the map.
                </p>
              )}
            </div>

            {/* Active Filters Display */}
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                Active Filters
              </h3>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Crime Types:</span>
                  <p className="text-gray-900 dark:text-gray-100">
                    {filters.crimeTypes.length} selected
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Period:</span>
                  <p className="text-gray-900 dark:text-gray-100">
                    {filters.dateRange}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-300">Safety Range:</span>
                  <p className="text-gray-900 dark:text-gray-100">
                    {filters.safetyRange[0]} - {filters.safetyRange[1]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// Helper component for statistics
function StatCard({
  label,
  value,
  color
}: {
  label: string
  value: number
  color: string
}) {
  const colorClasses = {
    red: 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400',
    amber: 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400',
    orange: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400',
    yellow: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400'
  }

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <p className="text-sm font-medium mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}

export default CrimeDashboardExample
