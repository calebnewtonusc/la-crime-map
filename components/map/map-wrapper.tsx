'use client'

import dynamic from 'next/dynamic'
import { MapSkeleton } from '../ui/loading-skeleton'
import { NeighborhoodGeoJSON, CrimeMetric, NeighborhoodData } from '@/lib/data/types'

const CrimeMap = dynamic(
  () => import('./crime-map').then((mod) => ({ default: mod.CrimeMap })),
  {
    ssr: false,
    loading: () => <MapSkeleton />,
  }
)

interface MapWrapperProps {
  data: NeighborhoodGeoJSON
  selectedMetric: CrimeMetric
  onNeighborhoodClick?: (neighborhood: NeighborhoodData) => void
}

export function MapWrapper({ data, selectedMetric, onNeighborhoodClick }: MapWrapperProps) {
  return <CrimeMap data={data} selectedMetric={selectedMetric} onNeighborhoodClick={onNeighborhoodClick} />
}
