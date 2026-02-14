'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/main-layout'
import { AddressSearch } from '@/components/features/address-search'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import type { AddressSearchResultData } from '@/components/features/address-search'

export default function SearchPage() {
  const [selectedLocation, setSelectedLocation] = useState<AddressSearchResultData | null>(null)

  return (
    <ErrorBoundary>
      <MainLayout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg-primary dark:to-dark-bg-secondary py-12"
        >
          <div className="max-w-7xl mx-auto">
            <AddressSearch
              onLocationFound={(result) => {
                setSelectedLocation(result)
                console.log('Location found:', result)
                // Here you could integrate with a map:
                // - Pan map to location
                // - Highlight neighborhood
                // - Show nearby incidents
              }}
            />
          </div>
        </motion.div>
      </MainLayout>
    </ErrorBoundary>
  )
}
