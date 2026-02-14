'use client'

import { MainLayout } from '@/components/layout/main-layout'
import { SmartRecommendationsEngine } from '@/components/features/recommendations'
import { ErrorBoundary } from '@/components/ui/error-boundary'

export default function RecommendationsPage() {
  return (
    <ErrorBoundary>
      <MainLayout>
        <SmartRecommendationsEngine />
      </MainLayout>
    </ErrorBoundary>
  )
}
