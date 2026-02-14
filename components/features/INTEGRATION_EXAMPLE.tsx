/**
 * NEIGHBORHOOD COMPARISON INTEGRATION EXAMPLE
 *
 * This file demonstrates how to integrate the NeighborhoodCompare component
 * into your LA Crime Map application.
 */

'use client'

import { useState } from 'react'
import { NeighborhoodCompare } from './neighborhood-compare'
import { motion } from 'framer-motion'

/**
 * EXAMPLE 1: Standalone Comparison Page
 * Use this as a dedicated comparison page at /compare
 */
export function ComparisonPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <NeighborhoodCompare />
      </div>
    </div>
  )
}

/**
 * EXAMPLE 2: Add to Main Page with Toggle
 * Add comparison section below the map on the main page
 */
export function MainPageWithComparison() {
  const [showComparison, setShowComparison] = useState(false)

  return (
    <div className="space-y-8">
      {/* Your existing map and stats here */}

      {/* Toggle button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="bg-gradient-to-r from-neon-cyan to-neon-purple text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          {showComparison ? 'Hide' : 'Show'} Neighborhood Comparison
        </button>
      </div>

      {/* Comparison section */}
      {showComparison && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <NeighborhoodCompare />
        </motion.div>
      )}
    </div>
  )
}

/**
 * EXAMPLE 3: Modal/Overlay Version
 * Open comparison in a modal overlay
 */
export function ComparisonModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-neon-cyan to-neon-purple text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-neon-purple/50 transition-all z-50"
      >
        Compare Neighborhoods
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="relative min-h-screen flex items-start justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="relative bg-gray-50 dark:bg-dark-bg-primary rounded-2xl shadow-2xl w-full max-w-7xl my-8 p-6"
            >
              <NeighborhoodCompare onClose={() => setIsOpen(false)} />
            </motion.div>
          </div>
        </div>
      )}
    </>
  )
}

/**
 * EXAMPLE 4: Pre-selected Neighborhoods
 * Start with specific neighborhoods already selected
 */
export function PreselectedComparison() {
  return (
    <NeighborhoodCompare
      initialNeighborhoods={['Beverly Hills', 'Downtown LA', 'Santa Monica']}
    />
  )
}

/**
 * EXAMPLE 5: Map Integration with "Add to Compare" Button
 * Add this to your map popup/tooltip component
 */
export function MapPopupWithCompare({ neighborhoodName }: { neighborhoodName: string }) {
  const [compareList, setCompareList] = useState<string[]>([])

  const addToCompare = (name: string) => {
    if (!compareList.includes(name) && compareList.length < 4) {
      setCompareList([...compareList, name])
    }
  }

  return (
    <div className="space-y-4">
      {/* Your existing popup content */}
      <div className="p-4 bg-white dark:bg-dark-bg-secondary rounded-lg">
        <h3 className="font-bold text-lg mb-2">{neighborhoodName}</h3>
        {/* Crime stats, etc. */}
      </div>

      {/* Add to Compare button */}
      <button
        onClick={() => addToCompare(neighborhoodName)}
        disabled={compareList.includes(neighborhoodName) || compareList.length >= 4}
        className="w-full bg-neon-cyan hover:bg-neon-cyan/90 disabled:bg-gray-300 text-white py-2 rounded-lg transition-colors"
      >
        {compareList.includes(neighborhoodName)
          ? '✓ Added to Compare'
          : 'Add to Compare'}
      </button>

      {/* Show comparison when 2+ neighborhoods selected */}
      {compareList.length >= 2 && (
        <div className="mt-8">
          <NeighborhoodCompare initialNeighborhoods={compareList} />
        </div>
      )}
    </div>
  )
}

/**
 * HOW TO USE IN YOUR APP
 *
 * 1. Import the component:
 *    import { NeighborhoodCompare } from '@/components/features/neighborhood-compare'
 *
 * 2. Add it to your page:
 *    <NeighborhoodCompare />
 *
 * 3. Or with pre-selected neighborhoods:
 *    <NeighborhoodCompare initialNeighborhoods={['Beverly Hills', 'Downtown LA']} />
 *
 * 4. With close handler:
 *    <NeighborhoodCompare onClose={() => setShowModal(false)} />
 *
 * FEATURES:
 * - Multi-select dropdown for choosing 2-4 neighborhoods
 * - Side-by-side comparison table (responsive mobile cards + desktop table)
 * - Safety scores with color-coded badges
 * - Crime metrics with trend indicators (↑↓→)
 * - Population density estimates
 * - Best/worst feature analysis
 * - Smart recommendations based on safety scores
 * - Winner badges for best metrics
 * - Interactive bar charts (Recharts)
 * - Radar charts for safety profiles
 * - Overall winner summary
 * - Share URL functionality (comparison encoded in URL params)
 * - Export placeholder (ready for PDF/image export)
 * - Fully responsive (stacked cards on mobile, table on desktop)
 * - Framer Motion animations throughout
 * - Dark mode support
 *
 * URL SHARING:
 * When users click "Share", a URL is generated like:
 * https://yoursite.com/?compare=Beverly%20Hills,Downtown%20LA,Santa%20Monica
 *
 * The component automatically reads this parameter and pre-selects neighborhoods
 * on page load, making it easy to share specific comparisons.
 */
