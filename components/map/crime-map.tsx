'use client'

import { useEffect, useRef, useState, useCallback, memo, useMemo } from 'react'
import { MapContainer, TileLayer, GeoJSON, Popup, useMap, ZoomControl } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import type { GeoJsonObject } from 'geojson'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import { NeighborhoodGeoJSON, CrimeMetric, NeighborhoodData } from '@/lib/data/types'
import { getNeighborhoodCrimeLevel, getCrimeColor, metricLabels } from '@/lib/utils/crime-stats'
import 'leaflet/dist/leaflet.css'

interface CrimeMapProps {
  data: NeighborhoodGeoJSON
  selectedMetric: CrimeMetric
  onNeighborhoodClick?: (neighborhood: NeighborhoodData) => void
}

// Fix Leaflet icon issue with Next.js
if (typeof window !== 'undefined') {
  const L = require('leaflet')
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/leaflet/marker-icon-2x.png',
    iconUrl: '/leaflet/marker-icon.png',
    shadowUrl: '/leaflet/marker-shadow.png',
  })
}

function MapThemeUpdater() {
  const map = useMap()
  const { theme } = useTheme()

  useEffect(() => {
    const tileLayer = document.querySelector('.leaflet-tile-pane')
    if (tileLayer && theme === 'dark') {
      ;(tileLayer as HTMLElement).style.filter = 'invert(100%) hue-rotate(180deg) brightness(0.9)'
    } else if (tileLayer) {
      ;(tileLayer as HTMLElement).style.filter = 'none'
    }
  }, [theme, map])

  return null
}

// Memoize the component to prevent unnecessary re-renders
export const CrimeMap = memo(function CrimeMap({ data, selectedMetric, onNeighborhoodClick }: CrimeMapProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Detect mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const center: LatLngExpression = [34.0522, -118.2437] // LA coordinates
  const zoom = isMobile ? 9 : 10 // Lower initial zoom on mobile

  // Memoize style calculation to avoid recalculating on every render
  const getFeatureStyle = useCallback((feature: any) => {
    const neighborhood = feature.properties as NeighborhoodData
    const level = getNeighborhoodCrimeLevel(neighborhood, selectedMetric)
    const color = getCrimeColor(level, theme === 'dark')

    return {
      fillColor: color,
      weight: 2,
      opacity: 1,
      color: theme === 'dark' ? '#64748b' : '#cbd5e1',
      fillOpacity: 0.6,
    }
  }, [selectedMetric, theme])

  // Memoize event handlers to prevent unnecessary re-renders
  const onEachFeature = useCallback((feature: any, layer: any) => {
    const neighborhood = feature.properties as NeighborhoodData

    layer.on({
      mouseover: (e: any) => {
        const layer = e.target
        layer.setStyle({
          weight: 3,
          fillOpacity: 0.8,
        })
      },
      mouseout: (e: any) => {
        const layer = e.target
        layer.setStyle(getFeatureStyle(feature))
      },
      click: () => {
        if (onNeighborhoodClick) {
          onNeighborhoodClick(neighborhood)
        }
      },
    })

    // Bind popup with mobile-optimized styling
    const level = getNeighborhoodCrimeLevel(neighborhood, selectedMetric)
    const popupContent = `
      <div class="p-3 sm:p-2">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-bold text-lg sm:text-base">${neighborhood.name}</h3>
        </div>
        <div class="space-y-2 text-base sm:text-sm">
          <p><strong>${metricLabels[selectedMetric]}:</strong> ${neighborhood[selectedMetric]}</p>
          <p class="text-sm sm:text-xs font-semibold ${
            level === 'low'
              ? 'text-green-600'
              : level === 'medium'
              ? 'text-amber-600'
              : 'text-red-600'
          }">
            Risk Level: ${level.toUpperCase()}
          </p>
        </div>
      </div>
    `
    layer.bindPopup(popupContent, {
      minWidth: isMobile ? 250 : 200,
      maxWidth: isMobile ? 300 : 250,
      closeButton: true,
      autoPan: true,
      autoPanPadding: [50, 50],
    })
  }, [selectedMetric, isMobile, onNeighborhoodClick, getFeatureStyle])

  if (!mounted) {
    return null
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        zoomControl={false}
        touchZoom={isMobile}
        scrollWheelZoom={!isMobile}
        doubleClickZoom={true}
        dragging={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position={isMobile ? 'bottomright' : 'topleft'} />
        <GeoJSON
          data={data as GeoJsonObject}
          style={getFeatureStyle}
          onEachFeature={onEachFeature}
          key={selectedMetric} // Force re-render when metric changes
        />
        <MapThemeUpdater />
      </MapContainer>
    </div>
  )
})
