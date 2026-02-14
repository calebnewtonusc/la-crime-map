'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  MapPin,
  X,
  History,
  Loader2,
  AlertCircle,
  Filter,
  SortAsc,
  SortDesc,
  Star,
  Trash2,
  TrendingDown,
  TrendingUp,
  Shield,
  ChevronDown,
  Bookmark,
  BookmarkCheck,
  Grid,
  List,
  Map as MapIcon
} from 'lucide-react'
import { MainLayout } from '@/components/layout/main-layout'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { geocodeAddress, isPointInPolygon } from '@/lib/utils/geocoding'
import { laNeighborhoods } from '@/lib/data/neighborhoods'
import { NeighborhoodData, CrimeMetric } from '@/lib/data/types'
import { calculateCrimeStats } from '@/lib/utils/crime-stats'

// Local storage keys
const SEARCH_HISTORY_KEY = 'la-crime-map-search-history'
const SAVED_LOCATIONS_KEY = 'la-crime-map-saved-locations'
const MAX_HISTORY_ITEMS = 10
const MAX_SAVED_ITEMS = 20

interface SearchResultData {
  id: string
  address: string
  coordinates: { lat: number; lng: number }
  neighborhood: NeighborhoodData | null
  neighborhoodName: string
  timestamp: number
}

interface SavedLocation extends SearchResultData {
  notes?: string
  savedAt: number
}

type SortOption = 'recent' | 'safety-high' | 'safety-low' | 'name-asc' | 'name-desc'
type ViewMode = 'grid' | 'list'
type FilterOption = 'all' | 'saved' | 'history'

export default function SearchPage() {
  // Search state
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<SearchResultData[]>([])
  const [selectedResult, setSelectedResult] = useState<SearchResultData | null>(null)

  // UI state
  const [showHistory, setShowHistory] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')

  // Storage state
  const [searchHistory, setSearchHistory] = useState<SearchResultData[]>([])
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([])

  // Load from localStorage
  useEffect(() => {
    try {
      const historyData = localStorage.getItem(SEARCH_HISTORY_KEY)
      const savedData = localStorage.getItem(SAVED_LOCATIONS_KEY)

      if (historyData) {
        setSearchHistory(JSON.parse(historyData))
      }
      if (savedData) {
        setSavedLocations(JSON.parse(savedData))
      }
    } catch (e) {
      console.error('Failed to load saved data:', e)
    }
  }, [])

  // Calculate LA stats for comparison
  const laStats = useMemo(() => calculateCrimeStats(laNeighborhoods), [])

  // Find neighborhood for coordinates
  const findNeighborhood = useCallback((lat: number, lng: number): { name: string; data: NeighborhoodData | null } => {
    for (const feature of laNeighborhoods.features) {
      const coordinates = feature.geometry.coordinates[0]
      const polygonPoints = coordinates.map(coord => [coord[1], coord[0]])

      if (isPointInPolygon(lat, lng, polygonPoints)) {
        return {
          name: feature.properties.name,
          data: feature.properties
        }
      }
    }
    return { name: 'Unknown Area', data: null }
  }, [])

  // Calculate safety score
  const getSafetyScore = useCallback((neighborhood: NeighborhoodData | null): number => {
    if (!neighborhood) return 0

    const totalCrime = neighborhood.violentCrime + neighborhood.carTheft +
                      neighborhood.breakIns + neighborhood.pettyTheft
    const avgTotal = laStats.avgViolentCrime + laStats.avgCarTheft +
                    laStats.avgBreakIns + laStats.avgPettyTheft

    return Math.max(0, Math.min(100, Math.round(100 - (totalCrime / avgTotal) * 100)))
  }, [laStats])

  // Handle search
  const handleSearch = useCallback(async (address: string) => {
    if (!address.trim()) {
      setError('Please enter an address to search')
      return
    }

    setIsSearching(true)
    setError(null)

    try {
      const result = await geocodeAddress(address)

      if (!result) {
        setError('Address not found. Try being more specific or use a nearby street name.')
        setIsSearching(false)
        return
      }

      const { lat, lon } = result
      const isInLA = lat >= 33.7 && lat <= 34.8 && lon >= -118.7 && lon <= -117.6

      if (!isInLA) {
        setError('This location is outside LA County. We only have data for Los Angeles area.')
        setIsSearching(false)
        return
      }

      const neighborhood = findNeighborhood(lat, lon)
      const newResult: SearchResultData = {
        id: `${lat}-${lon}-${Date.now()}`,
        address: result.display_name,
        coordinates: { lat, lng: lon },
        neighborhood: neighborhood.data,
        neighborhoodName: neighborhood.name,
        timestamp: Date.now()
      }

      // Add to results and history
      setSearchResults(prev => [newResult, ...prev.slice(0, 9)])

      const newHistory = [newResult, ...searchHistory.filter(h => h.address !== newResult.address)]
        .slice(0, MAX_HISTORY_ITEMS)
      setSearchHistory(newHistory)
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory))

      setSelectedResult(newResult)
      setSearchQuery('')
      setShowHistory(false)
    } catch (err) {
      console.error('Search error:', err)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }, [searchHistory, findNeighborhood])

  // Save/unsave location
  const toggleSaveLocation = useCallback((result: SearchResultData) => {
    const isSaved = savedLocations.some(loc => loc.id === result.id)

    if (isSaved) {
      const updated = savedLocations.filter(loc => loc.id !== result.id)
      setSavedLocations(updated)
      localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(updated))
    } else {
      const newSaved: SavedLocation = { ...result, savedAt: Date.now() }
      const updated = [newSaved, ...savedLocations].slice(0, MAX_SAVED_ITEMS)
      setSavedLocations(updated)
      localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(updated))
    }
  }, [savedLocations])

  // Clear history
  const clearHistory = useCallback(() => {
    setSearchHistory([])
    localStorage.removeItem(SEARCH_HISTORY_KEY)
    setSearchResults([])
  }, [])

  // Clear saved
  const clearSaved = useCallback(() => {
    setSavedLocations([])
    localStorage.removeItem(SAVED_LOCATIONS_KEY)
  }, [])

  // Get filtered and sorted results
  const displayResults = useMemo(() => {
    let results: SearchResultData[] = []

    // Apply filter
    switch (filterBy) {
      case 'saved':
        results = savedLocations
        break
      case 'history':
        results = searchHistory
        break
      default:
        results = [...searchResults, ...savedLocations]
          .filter((item, index, self) =>
            index === self.findIndex(t => t.id === item.id)
          )
    }

    // Apply sort
    return [...results].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return b.timestamp - a.timestamp
        case 'safety-high':
          return getSafetyScore(b.neighborhood) - getSafetyScore(a.neighborhood)
        case 'safety-low':
          return getSafetyScore(a.neighborhood) - getSafetyScore(b.neighborhood)
        case 'name-asc':
          return a.neighborhoodName.localeCompare(b.neighborhoodName)
        case 'name-desc':
          return b.neighborhoodName.localeCompare(a.neighborhoodName)
        default:
          return 0
      }
    })
  }, [filterBy, sortBy, searchResults, savedLocations, searchHistory, getSafetyScore])

  return (
    <ErrorBoundary>
      <MainLayout>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50
                      dark:from-la-night-dark dark:via-purple-950/20 dark:to-orange-950/20">

          {/* Hero Section with LA Sunset Theme */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-gradient-to-r from-la-sunset-purple via-la-sunset-pink to-la-sunset-orange
                     dark:from-purple-900 dark:via-pink-900 dark:to-orange-900 py-16 px-4 sm:px-6 overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0"
                   style={{
                     backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                     backgroundSize: '40px 40px'
                   }}
              />
            </div>

            <div className="relative max-w-7xl mx-auto text-center">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                  Search Your Future Home
                </h1>
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto">
                  Explore LA neighborhoods with powerful search, filters, and safety comparisons
                </p>
              </motion.div>
            </div>
          </motion.div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative mb-8"
            >
              <form onSubmit={(e) => { e.preventDefault(); handleSearch(searchQuery); }}>
                <div className="relative flex items-center max-w-4xl mx-auto">
                  <div className="absolute left-6 pointer-events-none z-10">
                    {isSearching ? (
                      <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                    ) : (
                      <Search className="w-6 h-6 text-gray-400" />
                    )}
                  </div>

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowHistory(searchHistory.length > 0)}
                    placeholder="Search any LA address... (e.g., 1234 Sunset Blvd, Silver Lake)"
                    disabled={isSearching}
                    className="w-full pl-16 pr-40 py-5 text-lg border-2 border-gray-300 dark:border-gray-600
                             rounded-2xl bg-white dark:bg-gray-800
                             text-gray-900 dark:text-gray-100
                             placeholder-gray-400 dark:placeholder-gray-500
                             focus:border-la-sunset-purple focus:ring-4 focus:ring-la-sunset-purple/20
                             transition-all duration-200 outline-none
                             disabled:opacity-50 disabled:cursor-not-allowed
                             shadow-2xl hover:shadow-3xl"
                    aria-label="Search address"
                  />

                  {searchQuery && !isSearching && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-32 p-2 text-gray-400 hover:text-gray-600
                               dark:hover:text-gray-300 transition-colors rounded-lg
                               hover:bg-gray-100 dark:hover:bg-gray-700"
                      aria-label="Clear search"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={isSearching || !searchQuery.trim()}
                    className="absolute right-2 px-8 py-3 bg-gradient-to-r from-la-sunset-purple
                             to-la-sunset-pink text-white font-semibold rounded-xl
                             hover:from-la-sunset-purple/90 hover:to-la-sunset-pink/90
                             focus:ring-4 focus:ring-la-sunset-purple/30
                             transition-all duration-200
                             disabled:opacity-50 disabled:cursor-not-allowed
                             shadow-lg hover:shadow-xl min-h-[48px]"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Quick History Dropdown */}
              <AnimatePresence>
                {showHistory && searchHistory.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 w-full max-w-4xl mx-auto mt-2 bg-white
                             dark:bg-gray-800 border border-gray-200 dark:border-gray-700
                             rounded-2xl shadow-2xl overflow-hidden left-0 right-0"
                  >
                    <div className="flex items-center justify-between px-6 py-4 border-b
                                  border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-2 text-sm font-medium
                                    text-gray-700 dark:text-gray-300">
                        <History className="w-4 h-4" />
                        <span>Recent Searches</span>
                      </div>
                      <button
                        onClick={() => setShowHistory(false)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {searchHistory.slice(0, 5).map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(item.address)
                            setShowHistory(false)
                            handleSearch(item.address)
                          }}
                          className="w-full px-6 py-4 text-left hover:bg-gray-50
                                   dark:hover:bg-gray-700/50 transition-colors flex
                                   items-center gap-4 group border-b border-gray-100
                                   dark:border-gray-700/50 last:border-0"
                        >
                          <MapPin className="w-5 h-5 text-gray-400 group-hover:text-la-sunset-purple
                                           flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 dark:text-gray-100 font-medium
                                        truncate group-hover:text-la-sunset-purple transition-colors">
                              {item.neighborhoodName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {item.address}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="max-w-4xl mx-auto mb-6"
                >
                  <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200
                                dark:border-red-800 rounded-2xl p-6 flex items-start gap-4">
                    <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400
                                          flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-bold text-red-900 dark:text-red-300 mb-2 text-lg">
                        Search Error
                      </h3>
                      <p className="text-red-700 dark:text-red-400">{error}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Controls Bar */}
            {(searchResults.length > 0 || savedLocations.length > 0 || searchHistory.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 border border-gray-200
                         dark:border-gray-700 rounded-2xl p-6 mb-6 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                  {/* Filter Tabs */}
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { key: 'all', label: 'All Results', icon: Grid },
                      { key: 'saved', label: 'Saved', icon: BookmarkCheck },
                      { key: 'history', label: 'History', icon: History }
                    ].map(({ key, label, icon: Icon }) => (
                      <button
                        key={key}
                        onClick={() => setFilterBy(key as FilterOption)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center
                                  gap-2 ${
                          filterBy === key
                            ? 'bg-la-sunset-purple text-white shadow-md'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                        {key === 'saved' && savedLocations.length > 0 && (
                          <span className="ml-1 px-2 py-0.5 bg-white/30 rounded-full text-xs">
                            {savedLocations.length}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* View & Sort Controls */}
                  <div className="flex items-center gap-3">
                    {/* View Mode */}
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-white dark:bg-gray-600 text-la-sunset-purple shadow-sm'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                        aria-label="Grid view"
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded transition-colors ${
                          viewMode === 'list'
                            ? 'bg-white dark:bg-gray-600 text-la-sunset-purple shadow-sm'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}
                        aria-label="List view"
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Sort Dropdown */}
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="appearance-none pl-4 pr-10 py-2 bg-gray-100 dark:bg-gray-700
                                 text-gray-700 dark:text-gray-300 rounded-lg font-medium
                                 border-0 focus:ring-2 focus:ring-la-sunset-purple cursor-pointer"
                      >
                        <option value="recent">Most Recent</option>
                        <option value="safety-high">Safest First</option>
                        <option value="safety-low">Least Safe First</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4
                                            text-gray-500 pointer-events-none" />
                    </div>

                    {/* Clear All */}
                    {filterBy === 'history' && searchHistory.length > 0 && (
                      <button
                        onClick={clearHistory}
                        className="px-4 py-2 text-sm text-red-600 dark:text-red-400
                                 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg
                                 transition-colors font-medium flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear History
                      </button>
                    )}
                    {filterBy === 'saved' && savedLocations.length > 0 && (
                      <button
                        onClick={clearSaved}
                        className="px-4 py-2 text-sm text-red-600 dark:text-red-400
                                 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg
                                 transition-colors font-medium flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear Saved
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Results Grid/List */}
            <AnimatePresence mode="wait">
              {displayResults.length > 0 ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                      : 'space-y-4'
                  }
                >
                  {displayResults.map((result, index) => (
                    <ResultCard
                      key={result.id}
                      result={result}
                      index={index}
                      viewMode={viewMode}
                      safetyScore={getSafetyScore(result.neighborhood)}
                      isSaved={savedLocations.some(loc => loc.id === result.id)}
                      onToggleSave={() => toggleSaveLocation(result)}
                      onClick={() => setSelectedResult(result)}
                      laStats={laStats}
                    />
                  ))}
                </motion.div>
              ) : (
                <EmptyState filterBy={filterBy} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </MainLayout>
    </ErrorBoundary>
  )
}

// Result Card Component
interface ResultCardProps {
  result: SearchResultData
  index: number
  viewMode: ViewMode
  safetyScore: number
  isSaved: boolean
  onToggleSave: () => void
  onClick: () => void
  laStats: any
}

function ResultCard({
  result,
  index,
  viewMode,
  safetyScore,
  isSaved,
  onToggleSave,
  onClick,
  laStats
}: ResultCardProps) {
  const { neighborhood, neighborhoodName, address } = result

  const getSafetyRating = (score: number) => {
    if (score >= 75) return { label: 'Great Choice', color: 'green', icon: Shield }
    if (score >= 50) return { label: 'Solid Option', color: 'blue', icon: Shield }
    if (score >= 30) return { label: 'Know Your Area', color: 'yellow', icon: AlertCircle }
    return { label: 'Stay Alert', color: 'red', icon: AlertCircle }
  }

  const rating = getSafetyRating(safetyScore)
  const SafetyIcon = rating.icon

  const getCrimeComparison = (value: number, avg: number) => {
    const percentDiff = ((value - avg) / avg) * 100
    return { percentDiff: Math.abs(percentDiff), isHigher: value > avg }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 border-2 border-gray-200
                dark:border-gray-700 rounded-2xl overflow-hidden shadow-lg
                hover:shadow-2xl transition-all duration-300 cursor-pointer
                hover:border-la-sunset-purple ${
        viewMode === 'list' ? 'flex items-center' : ''
      }`}
    >
      {/* Header */}
      <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-la-sunset-purple flex-shrink-0" />
              <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 truncate">
                {neighborhoodName}
              </h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {address}
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleSave()
            }}
            className="ml-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700
                     transition-colors"
            aria-label={isSaved ? 'Remove from saved' : 'Save location'}
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 text-la-sunset-purple" />
            ) : (
              <Bookmark className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        {/* Safety Score */}
        {neighborhood && (
          <>
            <div className={`p-4 rounded-xl mb-4 ${
              rating.color === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800' :
              rating.color === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800' :
              rating.color === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800' :
              'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SafetyIcon className={`w-6 h-6 ${
                    rating.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    rating.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    rating.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`} />
                  <div>
                    <p className={`font-bold text-lg ${
                      rating.color === 'green' ? 'text-green-900 dark:text-green-300' :
                      rating.color === 'blue' ? 'text-blue-900 dark:text-blue-300' :
                      rating.color === 'yellow' ? 'text-yellow-900 dark:text-yellow-300' :
                      'text-red-900 dark:text-red-300'
                    }`}>
                      {rating.label}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">Safety Rating</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${
                    rating.color === 'green' ? 'text-green-600 dark:text-green-400' :
                    rating.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                    rating.color === 'yellow' ? 'text-yellow-600 dark:text-yellow-400' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {safetyScore}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">/ 100</p>
                </div>
              </div>
            </div>

            {/* Crime Stats Preview */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Violent', value: neighborhood.violentCrime, avg: laStats.avgViolentCrime },
                  { label: 'Car Theft', value: neighborhood.carTheft, avg: laStats.avgCarTheft }
                ].map(({ label, value, avg }) => {
                  const comparison = getCrimeComparison(value, avg)
                  return (
                    <div key={label} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{label}</p>
                      <div className="flex items-end justify-between">
                        <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          {value}
                        </p>
                        <div className={`flex items-center gap-1 text-xs font-medium ${
                          comparison.isHigher
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        }`}>
                          {comparison.isHigher ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {comparison.percentDiff.toFixed(0)}%
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}

        {!neighborhood && (
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-center">
            <AlertCircle className="w-6 h-6 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No crime data available for this area
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Empty State Component
function EmptyState({ filterBy }: { filterBy: FilterOption }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="max-w-2xl mx-auto text-center py-16"
    >
      <div className="bg-white dark:bg-gray-800 border-2 border-dashed
                    border-gray-300 dark:border-gray-600 rounded-2xl p-12">
        {filterBy === 'saved' ? (
          <>
            <Bookmark className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              No Saved Locations Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Search for addresses and save your favorites for easy comparison
            </p>
          </>
        ) : filterBy === 'history' ? (
          <>
            <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              No Search History
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Your recent searches will appear here
            </p>
          </>
        ) : (
          <>
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              Ready to Explore LA?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Search for any address to view detailed crime statistics and safety scores
            </p>
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20
                          dark:to-pink-900/20 rounded-xl p-6 space-y-3">
              <div className="flex items-start gap-3 text-left">
                <div className="p-2 bg-la-sunset-purple/10 rounded-lg">
                  <Search className="w-5 h-5 text-la-sunset-purple" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Powerful Search
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Find any LA address instantly with autocomplete
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <div className="p-2 bg-la-sunset-pink/10 rounded-lg">
                  <Filter className="w-5 h-5 text-la-sunset-pink" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Smart Filters
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Sort by safety score, name, or recency
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-left">
                <div className="p-2 bg-la-sunset-orange/10 rounded-lg">
                  <Bookmark className="w-5 h-5 text-la-sunset-orange" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">
                    Save & Compare
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Save locations to compare neighborhoods side-by-side
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
