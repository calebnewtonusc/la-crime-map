'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, MapPin, X, History, Loader2, AlertCircle } from 'lucide-react'
import { geocodeAddress, GeocodingResult, isPointInPolygon } from '@/lib/utils/geocoding'
import { laNeighborhoods } from '@/lib/data/neighborhoods'
import { NeighborhoodData } from '@/lib/data/types'
import { AddressSearchResult } from './address-search-result'

// Local storage key for search history
const SEARCH_HISTORY_KEY = 'la-crime-map-search-history'
const MAX_HISTORY_ITEMS = 5

interface SearchHistory {
  address: string
  timestamp: number
}

export interface AddressSearchResultData {
  address: string
  coordinates: { lat: number; lng: number }
  neighborhood: NeighborhoodData | null
  neighborhoodName: string
}

interface AddressSearchProps {
  onLocationFound?: (result: AddressSearchResultData) => void
  className?: string
}

export function AddressSearch({ onLocationFound, className = '' }: AddressSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchResult, setSearchResult] = useState<AddressSearchResultData | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)

  // Load search history from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SEARCH_HISTORY_KEY)
      if (stored) {
        const history: SearchHistory[] = JSON.parse(stored)
        setSearchHistory(history.slice(0, MAX_HISTORY_ITEMS))
      }
    } catch (e) {
      console.error('Failed to load search history:', e)
    }
  }, [])

  // Save to search history
  const saveToHistory = useCallback((address: string) => {
    try {
      const newHistory = [
        { address, timestamp: Date.now() },
        ...searchHistory.filter(h => h.address !== address)
      ].slice(0, MAX_HISTORY_ITEMS)

      setSearchHistory(newHistory)
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))
    } catch (e) {
      console.error('Failed to save search history:', e)
    }
  }, [searchHistory])

  // Clear search history
  const clearHistory = useCallback(() => {
    setSearchHistory([])
    localStorage.removeItem(SEARCH_HISTORY_KEY)
  }, [])

  // Find which neighborhood contains the coordinates
  const findNeighborhood = useCallback((lat: number, lng: number): { name: string; data: NeighborhoodData | null } => {
    for (const feature of laNeighborhoods.features) {
      const coordinates = feature.geometry.coordinates[0]
      // Convert from GeoJSON [lng, lat] to [lat, lng] for the function
      const polygonPoints = coordinates.map(coord => [coord[1], coord[0]])

      if (isPointInPolygon(lat, lng, polygonPoints)) {
        return {
          name: feature.properties.name,
          data: feature.properties
        }
      }
    }
    return { name: 'Unknown (outside mapped areas)', data: null }
  }, [])

  // Handle search
  const handleSearch = useCallback(async (address: string) => {
    if (!address.trim()) {
      setError('Please enter an address to get started')
      return
    }

    setIsSearching(true)
    setError(null)
    setSearchResult(null)

    try {
      const result = await geocodeAddress(address)

      if (!result) {
        setError('We couldn\'t find that address. Try being more specific or use a nearby street name.')
        setIsSearching(false)
        return
      }

      // Check if the location is roughly in LA County
      const { lat, lon } = result
      const isInLA = lat >= 33.7 && lat <= 34.8 && lon >= -118.7 && lon <= -117.6

      if (!isInLA) {
        setError('That location is outside LA County. We only have data for Los Angeles area addresses right now.')
        setIsSearching(false)
        return
      }

      // Find neighborhood
      const neighborhood = findNeighborhood(lat, lon)

      const searchResultData: AddressSearchResultData = {
        address: result.display_name,
        coordinates: { lat, lng: lon },
        neighborhood: neighborhood.data,
        neighborhoodName: neighborhood.name
      }

      setSearchResult(searchResultData)
      saveToHistory(address)
      onLocationFound?.(searchResultData)
    } catch (err) {
      console.error('Search error:', err)
      setError('Something went wrong on our end. Please try again in a moment.')
    } finally {
      setIsSearching(false)
    }
  }, [findNeighborhood, saveToHistory, onLocationFound])

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(searchQuery)
    setShowHistory(false)
  }

  // Handle history item click
  const handleHistoryClick = (address: string) => {
    setSearchQuery(address)
    setShowHistory(false)
    handleSearch(address)
  }

  // Close history when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowHistory(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Clear search
  const handleClear = () => {
    setSearchQuery('')
    setSearchResult(null)
    setError(null)
    inputRef.current?.focus()
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 px-4"
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
          Search Your Address
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Find out which neighborhood you're in and view detailed crime statistics for your area
        </p>
      </motion.div>

      {/* Search Bar */}
      <motion.div
        ref={searchContainerRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative max-w-3xl mx-auto mb-8 px-4"
      >
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center">
            {/* Search Icon */}
            <div className="absolute left-4 pointer-events-none">
              {isSearching ? (
                <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
              ) : (
                <Search className="w-6 h-6 text-gray-400" />
              )}
            </div>

            {/* Input Field */}
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowHistory(searchHistory.length > 0)}
              placeholder="Try '1234 Sunset Blvd' or 'Silver Lake'..."
              disabled={isSearching}
              className="w-full pl-14 pr-32 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                       placeholder-gray-400 dark:placeholder-gray-500
                       focus:border-neon-cyan focus:ring-4 focus:ring-neon-cyan/20 dark:focus:ring-neon-cyan/30
                       transition-all duration-200 outline-none
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg hover:shadow-xl"
              aria-label="Search address"
            />

            {/* Clear Button */}
            {searchQuery && !isSearching && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-28 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                         transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label="Clear search"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* Search Button */}
            <button
              type="submit"
              disabled={isSearching || !searchQuery.trim()}
              className="absolute right-2 px-6 py-2.5 bg-gradient-to-r from-neon-cyan to-blue-500
                       text-white font-semibold rounded-lg
                       hover:from-neon-cyan/90 hover:to-blue-500/90
                       focus:ring-4 focus:ring-neon-cyan/30
                       transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed
                       shadow-lg hover:shadow-xl
                       touch-manipulation min-h-[48px]"
              aria-label="Get Safety Report"
            >
              Get Safety Report
            </button>
          </div>
        </form>

        {/* Search History Dropdown */}
        <AnimatePresence>
          {showHistory && searchHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800
                       border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <History className="w-4 h-4" />
                  <span>Recent Searches</span>
                </div>
                <button
                  onClick={clearHistory}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300
                           transition-colors underline"
                >
                  Clear All
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(item.address)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50
                             transition-colors flex items-center gap-3 group"
                  >
                    <MapPin className="w-4 h-4 text-gray-400 group-hover:text-neon-cyan flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-dark-text-primary
                                   truncate flex-1">
                      {item.address}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="max-w-3xl mx-auto mb-6 px-4"
          >
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4
                          flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-300 mb-1">Hmm, we couldn't find that</h3>
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Result */}
      <AnimatePresence>
        {searchResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="px-4"
          >
            <AddressSearchResult result={searchResult} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      {!searchResult && !error && !isSearching && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto px-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <InfoTip
              icon={<Search className="w-5 h-5" />}
              title="Search Any Address"
              description="Enter your street address, apartment building, or any LA location"
            />
            <InfoTip
              icon={<MapPin className="w-5 h-5" />}
              title="Find Your Neighborhood"
              description="We'll show you which neighborhood you're in and its crime stats"
            />
            <InfoTip
              icon={<History className="w-5 h-5" />}
              title="Quick Access"
              description="Your recent searches are saved for easy access later"
            />
          </div>
        </motion.div>
      )}
    </div>
  )
}

// Info Tip Component
function InfoTip({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="text-neon-cyan">{icon}</div>
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{title}</h3>
      </div>
      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
    </div>
  )
}
