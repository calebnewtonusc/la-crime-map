'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, MapPin, TrendingUp } from 'lucide-react'
import { useState, useRef, useEffect, useMemo } from 'react'
import { laNeighborhoods } from '@/lib/data/neighborhoods'
import { NeighborhoodData } from '@/lib/data/types'

interface SearchResult {
  name: string
  data: NeighborhoodData
  matchScore: number
}

interface SearchBarProps {
  onSelect?: (neighborhood: NeighborhoodData) => void
  placeholder?: string
  className?: string
  showPopularSearches?: boolean
}

export function SearchBar({
  onSelect,
  placeholder = 'Search neighborhoods...',
  className = '',
  showPopularSearches = true
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Get all neighborhoods
  const neighborhoods = useMemo(
    () => laNeighborhoods.features.map(f => f.properties),
    []
  )

  // Popular neighborhoods (safest and most searched)
  const popularNeighborhoods = useMemo(() => {
    return [...neighborhoods]
      .sort((a, b) => {
        const aSafety = a.safetyScore || 0
        const bSafety = b.safetyScore || 0
        return bSafety - aSafety
      })
      .slice(0, 5)
  }, [neighborhoods])

  // Search and filter neighborhoods
  const searchResults = useMemo(() => {
    if (!query.trim()) return []

    const lowerQuery = query.toLowerCase()
    const results: SearchResult[] = []

    neighborhoods.forEach(neighborhood => {
      const name = neighborhood.name.toLowerCase()

      // Exact match
      if (name === lowerQuery) {
        results.push({ name: neighborhood.name, data: neighborhood, matchScore: 100 })
      }
      // Starts with query
      else if (name.startsWith(lowerQuery)) {
        results.push({ name: neighborhood.name, data: neighborhood, matchScore: 80 })
      }
      // Contains query
      else if (name.includes(lowerQuery)) {
        results.push({ name: neighborhood.name, data: neighborhood, matchScore: 60 })
      }
      // Fuzzy match (words)
      else {
        const words = name.split(' ')
        const matchingWords = words.filter(word => word.startsWith(lowerQuery))
        if (matchingWords.length > 0) {
          results.push({ name: neighborhood.name, data: neighborhood, matchScore: 40 })
        }
      }
    })

    // Sort by match score and then safety score
    return results
      .sort((a, b) => {
        if (a.matchScore !== b.matchScore) {
          return b.matchScore - a.matchScore
        }
        const aSafety = a.data.safetyScore || 0
        const bSafety = b.data.safetyScore || 0
        return bSafety - aSafety
      })
      .slice(0, 8)
  }, [query, neighborhoods])

  // Handle selection
  const handleSelect = (neighborhood: NeighborhoodData) => {
    setQuery('')
    setIsOpen(false)
    setSelectedIndex(-1)
    onSelect?.(neighborhood)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return

    const results = query ? searchResults : popularNeighborhoods

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev =>
          prev < results.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          if (query) {
            const selected = searchResults[selectedIndex]
            handleSelect(selected.data)
          } else {
            const selected = popularNeighborhoods[selectedIndex]
            handleSelect(selected)
          }
        }
        break
      case 'Escape':
        e.preventDefault()
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Get safety color
  const getSafetyColor = (safetyScore: number | null) => {
    if (!safetyScore) return 'text-gray-400'
    if (safetyScore >= 70) return 'text-green-500 dark:text-green-400'
    if (safetyScore >= 40) return 'text-amber-500 dark:text-amber-400'
    return 'text-red-500 dark:text-red-400'
  }

  const displayResults = query ? searchResults : (showPopularSearches ? popularNeighborhoods : [])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-dark-text-tertiary pointer-events-none"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setIsOpen(true)
              setSelectedIndex(-1)
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-3 bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-dark-text-primary placeholder-gray-500 dark:placeholder-dark-text-tertiary focus:outline-none focus:ring-2 focus:ring-neon-cyan dark:focus:ring-neon-purple focus:border-transparent transition-all"
            aria-label="Search neighborhoods"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-expanded={isOpen}
            role="combobox"
          />

          {query && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setQuery('')
                inputRef.current?.focus()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:text-dark-text-tertiary dark:hover:text-dark-text-secondary transition-colors"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && displayResults.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 w-full bg-white dark:bg-dark-bg-secondary border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-50"
            id="search-results"
            role="listbox"
          >
            {!query && showPopularSearches && (
              <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-dark-bg-primary">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-neon-cyan dark:text-neon-purple" aria-hidden="true" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-dark-text-secondary">
                    Popular Neighborhoods
                  </span>
                </div>
              </div>
            )}

            <div className="max-h-80 overflow-y-auto">
              {displayResults.map((result, index) => {
                const neighborhood = query ? (result as SearchResult).data : (result as NeighborhoodData)
                const isSelected = index === selectedIndex

                return (
                  <motion.button
                    key={neighborhood.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ backgroundColor: 'rgba(0, 245, 255, 0.05)' }}
                    onClick={() => handleSelect(neighborhood)}
                    className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                      isSelected
                        ? 'bg-neon-cyan/10 dark:bg-neon-purple/10'
                        : 'hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <MapPin
                      className={`w-4 h-4 flex-shrink-0 ${getSafetyColor(neighborhood.safetyScore)}`}
                      aria-hidden="true"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 dark:text-dark-text-primary">
                        {neighborhood.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-dark-text-tertiary mt-0.5">
                        Safety Score: {neighborhood.safetyScore?.toFixed(0) || 'N/A'} •
                        Total Crimes: {(
                          neighborhood.violentCrime +
                          neighborhood.carTheft +
                          neighborhood.breakIns +
                          neighborhood.pettyTheft
                        ).toLocaleString()}
                      </div>
                    </div>

                    {neighborhood.safetyScore && (
                      <div
                        className={`text-xs font-semibold px-2 py-1 rounded ${
                          neighborhood.safetyScore >= 70
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : neighborhood.safetyScore >= 40
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {neighborhood.safetyScore >= 70 ? 'Safe' : neighborhood.safetyScore >= 40 ? 'Moderate' : 'Caution'}
                      </div>
                    )}
                  </motion.button>
                )
              })}
            </div>

            {query && searchResults.length === 0 && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-600 dark:text-dark-text-secondary">
                  No neighborhoods found for &ldquo;{query}&rdquo;
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
