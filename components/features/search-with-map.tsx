'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AddressSearch, AddressSearchResultData } from './address-search'
import { MapWrapper } from '../map/map-wrapper'
import { laNeighborhoods } from '@/lib/data/neighborhoods'
import { CrimeMetric } from '@/lib/data/types'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface SearchWithMapProps {
  defaultMetric?: CrimeMetric
  className?: string
}

export function SearchWithMap({ defaultMetric = 'violentCrime', className = '' }: SearchWithMapProps) {
  const [selectedMetric, setSelectedMetric] = useState<CrimeMetric>(defaultMetric)
  const [searchResult, setSearchResult] = useState<AddressSearchResultData | null>(null)
  const [showMap, setShowMap] = useState(true)

  const handleLocationFound = (result: AddressSearchResultData) => {
    setSearchResult(result)
    setShowMap(true)
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Address Search */}
      <AddressSearch onLocationFound={handleLocationFound} />

      {/* Map Section */}
      {searchResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto px-4"
        >
          {/* Map Toggle Button (Mobile) */}
          <button
            onClick={() => setShowMap(!showMap)}
            className="w-full sm:hidden flex items-center justify-between bg-white dark:bg-gray-800
                     border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-4
                     hover:bg-gray-50 dark:hover:bg-dark-bg-primary transition-colors"
          >
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              View on Map
            </span>
            {showMap ? (
              <ChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          {/* Map Container */}
          <AnimatePresence>
            {(showMap || window.innerWidth >= 640) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden"
              >
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    {searchResult.neighborhoodName} on Map
                  </h2>

                  {/* Metric Selector */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'violentCrime' as CrimeMetric, label: 'Violent Crime' },
                      { value: 'carTheft' as CrimeMetric, label: 'Car Theft' },
                      { value: 'breakIns' as CrimeMetric, label: 'Break-ins' },
                      { value: 'pettyTheft' as CrimeMetric, label: 'Petty Theft' }
                    ].map(({ value, label }) => (
                      <button
                        key={value}
                        onClick={() => setSelectedMetric(value)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedMetric === value
                            ? 'bg-neon-cyan text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Map */}
                <div className="h-[500px] sm:h-[600px] lg:h-[700px]">
                  <MapWrapper
                    data={laNeighborhoods}
                    selectedMetric={selectedMetric}
                    onNeighborhoodClick={(neighborhood) => {
                      console.log('Clicked neighborhood:', neighborhood)
                    }}
                  />
                </div>

                {/* Map Legend */}
                <div className="p-4 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Risk Level:</span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded bg-green-500"></div>
                          <span className="text-xs text-gray-700 dark:text-gray-300">Low</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded bg-yellow-500"></div>
                          <span className="text-xs text-gray-700 dark:text-gray-300">Medium</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded bg-red-500"></div>
                          <span className="text-xs text-gray-700 dark:text-gray-300">High</span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Click neighborhoods for details
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
