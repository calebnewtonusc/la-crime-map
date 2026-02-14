'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Filter, ChevronDown, RotateCcw, Shield, Car, Home, ShoppingBag } from 'lucide-react'
import { useState } from 'react'
import { CrimeMetric, DateRange } from '@/lib/data/types'

export interface FilterState {
  crimeTypes: CrimeMetric[]
  dateRange: DateRange
  safetyRange: [number, number]
  showOnlySufficientData: boolean
}

interface FilterPanelProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  className?: string
  isCollapsible?: boolean
}

const crimeTypeOptions: { value: CrimeMetric; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
  { value: 'violentCrime', label: 'Violent Crime', icon: Shield, description: 'Assaults, robberies, etc.' },
  { value: 'carTheft', label: 'Car Theft', icon: Car, description: 'Vehicle thefts and break-ins' },
  { value: 'breakIns', label: 'Break-ins', icon: Home, description: 'Burglaries and property crimes' },
  { value: 'pettyTheft', label: 'Petty Theft', icon: ShoppingBag, description: 'Shoplifting, pickpocketing' }
]

const dateRangeOptions: { value: DateRange; label: string }[] = [
  { value: '1week', label: 'Last Week' },
  { value: '1month', label: 'Last Month' },
  { value: '3months', label: 'Last 3 Months' },
  { value: '1year', label: 'Last Year' }
]

const defaultFilters: FilterState = {
  crimeTypes: ['violentCrime', 'carTheft', 'breakIns', 'pettyTheft'],
  dateRange: '1month',
  safetyRange: [0, 100],
  showOnlySufficientData: false
}

export function FilterPanel({
  filters,
  onChange,
  className = '',
  isCollapsible = true
}: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [safetyMin, setSafetyMin] = useState(filters.safetyRange[0])
  const [safetyMax, setSafetyMax] = useState(filters.safetyRange[1])

  const handleCrimeTypeToggle = (crimeType: CrimeMetric) => {
    const newCrimeTypes = filters.crimeTypes.includes(crimeType)
      ? filters.crimeTypes.filter(t => t !== crimeType)
      : [...filters.crimeTypes, crimeType]

    // Ensure at least one crime type is selected
    if (newCrimeTypes.length > 0) {
      onChange({ ...filters, crimeTypes: newCrimeTypes })
    }
  }

  const handleDateRangeChange = (dateRange: DateRange) => {
    onChange({ ...filters, dateRange })
  }

  const handleSafetyRangeChange = () => {
    onChange({ ...filters, safetyRange: [safetyMin, safetyMax] })
  }

  const handleReset = () => {
    onChange(defaultFilters)
    setSafetyMin(defaultFilters.safetyRange[0])
    setSafetyMax(defaultFilters.safetyRange[1])
  }

  const isFiltersModified = JSON.stringify(filters) !== JSON.stringify(defaultFilters)

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden ${className}`}
      role="region"
      aria-label="Filter options"
    >
      {/* Header */}
      <div
        className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${
          isCollapsible ? 'cursor-pointer' : ''
        }`}
        onClick={() => isCollapsible && setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-neon-cyan dark:text-neon-purple" aria-hidden="true" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Filters
            </h3>
            {isFiltersModified && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                className="px-2 py-0.5 text-xs font-medium bg-neon-cyan/20 text-neon-cyan dark:bg-la-sunset-purple/20 dark:text-la-sunset-purple rounded-full"
              >
                Active
              </motion.span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isFiltersModified && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, rotate: -90 }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleReset()
                }}
                className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-dark-text-primary transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg-tertiary focus:outline-none focus:ring-2 focus:ring-neon-cyan dark:focus:ring-la-sunset-purple"
                aria-label="Reset all filters to default"
              >
                <RotateCcw className="w-5 h-5" aria-hidden="true" />
              </motion.button>
            )}

            {isCollapsible && (
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" aria-hidden="true" />
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Content */}
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-6">
              {/* Crime Types */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Crime Types
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {crimeTypeOptions.map((option, index) => {
                    const Icon = option.icon
                    const isSelected = filters.crimeTypes.includes(option.value)

                    return (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04, ease: 'easeOut' }}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleCrimeTypeToggle(option.value)}
                        className={`flex items-center gap-3 p-3 min-h-touch rounded-lg border-2 transition-all text-left focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary ${
                          isSelected
                            ? 'border-neon-cyan bg-neon-cyan/10 dark:border-la-sunset-purple dark:bg-la-sunset-purple/10 focus:ring-neon-cyan dark:focus:ring-la-sunset-purple'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-bg-tertiary/50 focus:ring-gray-300 dark:focus:ring-gray-600'
                        }`}
                        role="checkbox"
                        aria-checked={isSelected}
                        aria-label={`${option.label} - ${option.description}`}
                      >
                        <div
                          className={`p-2 rounded-lg transition-colors ${
                            isSelected
                              ? 'bg-neon-cyan text-white dark:bg-la-sunset-purple'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                          }`}
                        >
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`text-base sm:text-sm font-medium ${
                              isSelected
                                ? 'text-gray-900 dark:text-gray-100'
                                : 'text-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {option.label}
                          </div>
                          <div className="text-sm sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                            {option.description}
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Time Period
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {dateRangeOptions.map((option, index) => {
                    const isSelected = filters.dateRange === option.value

                    return (
                      <motion.button
                        key={option.value}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.04, ease: 'easeOut' }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleDateRangeChange(option.value)}
                        className={`px-4 py-3 min-h-touch rounded-lg text-base sm:text-sm font-medium transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary ${
                          isSelected
                            ? 'bg-neon-cyan text-white dark:bg-la-sunset-purple focus:ring-neon-cyan dark:focus:ring-la-sunset-purple shadow-sm'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 focus:ring-gray-300 dark:focus:ring-gray-600'
                        }`}
                        role="radio"
                        aria-checked={isSelected}
                        aria-label={option.label}
                      >
                        {option.label}
                      </motion.button>
                    )
                  })}
                </div>
              </div>

              {/* Safety Score Range */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Safety Score Range
                </label>
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <label htmlFor="safety-min" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Minimum
                      </label>
                      <input
                        id="safety-min"
                        type="range"
                        min="0"
                        max="100"
                        value={safetyMin}
                        onChange={(e) => setSafetyMin(Number(e.target.value))}
                        onMouseUp={handleSafetyRangeChange}
                        onTouchEnd={handleSafetyRangeChange}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-cyan dark:accent-neon-purple"
                        aria-label="Minimum safety score"
                      />
                      <div className="text-center text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                        {safetyMin}
                      </div>
                    </div>

                    <div className="flex-1">
                      <label htmlFor="safety-max" className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                        Maximum
                      </label>
                      <input
                        id="safety-max"
                        type="range"
                        min="0"
                        max="100"
                        value={safetyMax}
                        onChange={(e) => setSafetyMax(Number(e.target.value))}
                        onMouseUp={handleSafetyRangeChange}
                        onTouchEnd={handleSafetyRangeChange}
                        className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-neon-cyan dark:accent-neon-purple"
                        aria-label="Maximum safety score"
                      />
                      <div className="text-center text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1">
                        {safetyMax}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-medium">{safetyMin}</span>
                    <span>—</span>
                    <span className="font-medium">{safetyMax}</span>
                  </div>
                </div>
              </div>

              {/* Data Quality Toggle */}
              <div>
                <label className="flex items-center justify-between cursor-pointer group">
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                      Show Only Sufficient Data
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      Filter neighborhoods with high-quality data
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onChange({ ...filters, showOnlySufficientData: !filters.showOnlySufficientData })}
                    className={`relative w-14 h-8 rounded-full transition-colors min-w-[56px] min-h-[32px] focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-dark-bg-secondary ${
                      filters.showOnlySufficientData
                        ? 'bg-neon-cyan dark:bg-la-sunset-purple focus:ring-neon-cyan dark:focus:ring-la-sunset-purple'
                        : 'bg-gray-300 dark:bg-gray-700 focus:ring-gray-300 dark:focus:ring-gray-600'
                    }`}
                    role="switch"
                    aria-checked={filters.showOnlySufficientData}
                    aria-label="Toggle sufficient data filter"
                  >
                    <motion.div
                      animate={{ x: filters.showOnlySufficientData ? 28 : 2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-sm"
                    />
                  </motion.button>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
