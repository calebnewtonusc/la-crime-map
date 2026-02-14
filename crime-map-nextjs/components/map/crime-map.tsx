'use client'

import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, Popup, useMap } from 'react-leaflet'
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

export function CrimeMap({ data, selectedMetric, onNeighborhoodClick }: CrimeMapProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const center: LatLngExpression = [34.0522, -118.2437] // LA coordinates
  const zoom = 10

  const getFeatureStyle = (feature: any) => {
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
  }

  const onEachFeature = (feature: any, layer: any) => {
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

    // Bind popup
    const level = getNeighborhoodCrimeLevel(neighborhood, selectedMetric)
    const popupContent = `
      <div class="p-2">
        <h3 class="font-bold text-lg mb-2">${neighborhood.name}</h3>
        <div class="space-y-1 text-sm">
          <p><strong>${metricLabels[selectedMetric]}:</strong> ${neighborhood[selectedMetric]}</p>
          <p class="text-xs ${
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
    layer.bindPopup(popupContent)
  }

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
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
}
