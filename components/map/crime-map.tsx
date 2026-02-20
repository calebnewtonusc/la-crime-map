'use client'

import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import { LatLngExpression, Layer, Map as LeafletMap } from 'leaflet'
import type { GeoJsonObject } from 'geojson'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { MapPin, TrendingUp, TrendingDown, Minus, ChevronRight, X, AlertTriangle, Shield, Info, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { NeighborhoodGeoJSON, CrimeMetric, NeighborhoodData } from '@/lib/data/types'
import { getNeighborhoodCrimeLevel, getCrimeColor, metricLabels, metricDescriptions } from '@/lib/utils/crime-stats'
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

// Color mapping with 5-level granularity for richer visuals
function getGradientCrimeColor(value: number, metric: CrimeMetric, isDark: boolean): string {
  // Normalized 0-1 scale per metric
  const ranges: Record<CrimeMetric, [number, number]> = {
    violentCrime: [2, 11],
    carTheft: [4, 15],
    breakIns: [5, 18],
    pettyTheft: [8, 25],
  }
  const [min, max] = ranges[metric]
  const normalized = Math.min(1, Math.max(0, (value - min) / (max - min)))

  if (isDark) {
    // Dark mode: green to yellow to red
    if (normalized < 0.25) return '#059669'
    if (normalized < 0.5) return '#10b981'
    if (normalized < 0.65) return '#f59e0b'
    if (normalized < 0.82) return '#ef4444'
    return '#b91c1c'
  }

  if (normalized < 0.25) return '#16a34a'
  if (normalized < 0.5) return '#65a30d'
  if (normalized < 0.65) return '#ca8a04'
  if (normalized < 0.82) return '#dc2626'
  return '#991b1b'
}

// Map theme updater
function MapThemeUpdater() {
  const map = useMap()
  const { theme } = useTheme()

  useEffect(() => {
    const tileLayer = document.querySelector('.leaflet-tile-pane')
    if (tileLayer) {
      const element = tileLayer as HTMLElement
      element.style.transition = 'filter 0.3s ease-in-out'
      if (theme === 'dark') {
        element.style.filter = 'invert(100%) hue-rotate(180deg) brightness(0.9) contrast(0.85)'
      } else {
        element.style.filter = 'brightness(1.05) contrast(1.05) saturate(1.1)'
      }
    }
  }, [theme, map])

  return null
}

// Map bounds resetter
function MapController({ mapRef }: { mapRef: React.MutableRefObject<LeafletMap | null> }) {
  const map = useMap()
  useEffect(() => {
    mapRef.current = map
  }, [map, mapRef])
  return null
}

// Floating popup with comprehensive drill-down info
interface FloatingPopupProps {
  neighborhood: NeighborhoodData
  selectedMetric: CrimeMetric
  onClose: () => void
  isDark: boolean
  onCompare?: () => void
}

function FloatingPopup({ neighborhood, selectedMetric, onClose, isDark }: FloatingPopupProps) {
  const level = getNeighborhoodCrimeLevel(neighborhood, selectedMetric)
  const allMetrics: CrimeMetric[] = ['violentCrime', 'carTheft', 'breakIns', 'pettyTheft']
  const totalCrimes = allMetrics.reduce((sum, metric) => sum + neighborhood[metric], 0)

  const getTrendIcon = () => {
    if (neighborhood.trendIndicator === 'improving') return <TrendingDown className="w-3.5 h-3.5" aria-hidden="true" />
    if (neighborhood.trendIndicator === 'worsening') return <TrendingUp className="w-3.5 h-3.5" aria-hidden="true" />
    return <Minus className="w-3.5 h-3.5" aria-hidden="true" />
  }

  const getTrendColor = () => {
    if (neighborhood.trendIndicator === 'improving') return 'text-green-500'
    if (neighborhood.trendIndicator === 'worsening') return 'text-red-500'
    return 'text-gray-500'
  }

  const getTrendLabel = () => {
    if (neighborhood.trendIndicator === 'improving') return 'Improving'
    if (neighborhood.trendIndicator === 'worsening') return 'Worsening'
    if (neighborhood.trendIndicator === 'stable') return 'Stable'
    return null
  }

  const levelConfig = {
    low: {
      icon: Shield,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-700',
      badge: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      label: 'LOW RISK',
    },
    medium: {
      icon: Info,
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      border: 'border-amber-200 dark:border-amber-700',
      badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
      label: 'MEDIUM RISK',
    },
    high: {
      icon: AlertTriangle,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-700',
      badge: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      label: 'HIGH RISK',
    },
  }

  const config = levelConfig[level]
  const LevelIcon = config.icon
  const trendLabel = getTrendLabel()

  const maxValue = Math.max(...allMetrics.map(m => neighborhood[m]))

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 4 }}
      transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      className={`w-[320px] sm:w-[360px] rounded-2xl shadow-2xl border overflow-hidden ${
        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
      }`}
      role="dialog"
      aria-label={`Crime details for ${neighborhood.name}`}
      aria-modal="true"
    >
      {/* Header */}
      <div className={`relative px-5 py-4 border-b ${isDark ? 'bg-gray-800/80 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
        <button
          onClick={onClose}
          className={`absolute top-3 right-3 p-1.5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-100' : 'hover:bg-gray-200 text-gray-500 hover:text-gray-900'
          }`}
          aria-label={`Close details for ${neighborhood.name}`}
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <div className={`p-2 rounded-xl ${config.bg} ${config.border} border flex-shrink-0`} aria-hidden="true">
            <MapPin className={`w-4 h-4 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-base mb-1.5 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              {neighborhood.name}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${config.badge}`}>
                {config.label}
              </span>
              {trendLabel && (
                <span className={`flex items-center gap-1 text-xs font-medium ${getTrendColor()}`}>
                  {getTrendIcon()}
                  {trendLabel}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Selected metric spotlight */}
      <div className="px-5 pt-4 pb-2">
        <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-800 border-gray-700' : `${config.bg} ${config.border}`}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {metricLabels[selectedMetric]}
              </p>
              <p className={`text-3xl font-bold mt-0.5 ${config.color}`}>
                {neighborhood[selectedMetric]}
              </p>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                {metricDescriptions[selectedMetric]}
              </p>
            </div>
            <LevelIcon className={`w-10 h-10 ${config.color} opacity-30`} aria-hidden="true" />
          </div>
        </div>
      </div>

      {/* All metrics breakdown */}
      <div className="px-5 pb-4 space-y-2">
        <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          All Crime Types — Total: {totalCrimes}
        </p>
        {allMetrics.map((metric) => {
          const value = neighborhood[metric]
          const isSelected = metric === selectedMetric
          const pct = maxValue > 0 ? (value / maxValue) * 100 : 0

          return (
            <div
              key={metric}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                isSelected
                  ? isDark ? 'bg-gray-700/60' : config.bg
                  : ''
              }`}
            >
              <span className={`text-xs w-20 flex-shrink-0 ${
                isSelected
                  ? isDark ? 'text-gray-200 font-semibold' : `${config.color} font-semibold`
                  : isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {metricLabels[metric]}
              </span>
              <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`h-full rounded-full ${isSelected ? (level === 'low' ? 'bg-green-500' : level === 'medium' ? 'bg-amber-500' : 'bg-red-500') : 'bg-gray-400 dark:bg-gray-500'}`}
                />
              </div>
              <span className={`text-sm font-bold w-6 text-right flex-shrink-0 ${
                isSelected
                  ? isDark ? 'text-gray-100' : config.color
                  : isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {value}
              </span>
            </div>
          )
        })}
      </div>

      {/* Safety score + data quality */}
      {neighborhood.safetyScore !== null && (
        <div className={`mx-5 mb-3 px-3 py-2.5 rounded-lg text-xs flex items-center justify-between ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" aria-hidden="true" />
            <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Safety Score:
            </span>
            <span className={`font-bold ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
              {neighborhood.safetyScore?.toFixed(1)}
            </span>
          </div>
          {neighborhood.hasSufficientData && (
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
              <span className={isDark ? 'text-gray-500' : 'text-gray-500'}>
                High quality data
              </span>
            </div>
          )}
        </div>
      )}

      {/* Footer actions */}
      <div className={`px-5 py-3 border-t flex items-center gap-2 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
        <a
          href={`/search?compare=${encodeURIComponent(neighborhood.name)}`}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Compare <ChevronRight className="w-3.5 h-3.5" aria-hidden="true" />
        </a>
        <button
          onClick={() => {
            const saved = JSON.parse(localStorage.getItem('savedNeighborhoods') || '[]')
            if (!saved.includes(neighborhood.name)) {
              saved.push(neighborhood.name)
              localStorage.setItem('savedNeighborhoods', JSON.stringify(saved))
            }
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
          aria-label={`Save ${neighborhood.name} to favorites`}
        >
          Save
        </button>
        <button
          onClick={() => {
            const url = `${window.location.origin}?neighborhood=${encodeURIComponent(neighborhood.name)}`
            navigator.clipboard.writeText(url).then(() => {}).catch(() => {})
          }}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
          aria-label={`Copy link for ${neighborhood.name}`}
        >
          Share
        </button>
      </div>
    </motion.div>
  )
}

// Custom keyboard-accessible zoom controls
function CustomZoomControl({ isMobile }: { isMobile: boolean }) {
  const map = useMap()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const handleReset = useCallback(() => {
    map.setView([34.0522, -118.2437], isMobile ? 9 : 10)
  }, [map, isMobile])

  const baseClass = `w-10 h-10 rounded-lg shadow-lg backdrop-blur-md flex items-center justify-center font-bold text-lg transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    isDark
      ? 'bg-gray-800/90 text-gray-100 hover:bg-gray-700 border border-gray-700'
      : 'bg-white/90 text-gray-900 hover:bg-gray-50 border border-gray-200'
  }`

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className={`absolute ${isMobile ? 'bottom-24 right-3' : 'top-3 left-3'} z-[1000] flex flex-col gap-1`}
      role="group"
      aria-label="Map zoom controls"
    >
      <button
        onClick={() => map.zoomIn()}
        className={baseClass}
        aria-label="Zoom in"
        title="Zoom in"
      >
        <ZoomIn className="w-4 h-4" aria-hidden="true" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className={baseClass}
        aria-label="Zoom out"
        title="Zoom out"
      >
        <ZoomOut className="w-4 h-4" aria-hidden="true" />
      </button>
      <button
        onClick={handleReset}
        className={baseClass}
        aria-label="Reset map view"
        title="Reset view"
      >
        <Maximize2 className="w-3.5 h-3.5" aria-hidden="true" />
      </button>
    </motion.div>
  )
}

// Hover tooltip (quick info, non-modal)
function HoverTooltip({ name, value, metric, isDark }: { name: string; value: number; metric: CrimeMetric; isDark: boolean }) {
  return (
    <div
      className={`px-3 py-2 rounded-lg shadow-lg text-xs font-medium pointer-events-none ${
        isDark ? 'bg-gray-900 text-gray-100 border border-gray-700' : 'bg-white text-gray-900 border border-gray-200'
      }`}
    >
      <p className="font-bold">{name}</p>
      <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
        {metricLabels[metric]}: <span className="font-semibold text-gray-900 dark:text-gray-100">{value}</span>
      </p>
    </div>
  )
}

// Main map component
export const CrimeMap = memo(function CrimeMap({ data, selectedMetric, onNeighborhoodClick }: CrimeMapProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodData | null>(null)
  const [hoveredNeighborhood, setHoveredNeighborhood] = useState<{ name: string; value: number; x: number; y: number } | null>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Keyboard: escape closes popup
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedNeighborhood) {
        setSelectedNeighborhood(null)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [selectedNeighborhood])

  const center: LatLngExpression = [34.0522, -118.2437]
  const zoom = isMobile ? 9 : 10
  const isDark = mounted ? theme === 'dark' : false

  const getFeatureStyle = useCallback((feature: any, isHovered = false, isSelected = false) => {
    const neighborhood = feature.properties as NeighborhoodData
    const value = neighborhood[selectedMetric]
    const color = getGradientCrimeColor(value, selectedMetric, isDark)

    return {
      fillColor: color,
      weight: isSelected ? 3 : isHovered ? 2.5 : 1.5,
      opacity: 1,
      color: isSelected
        ? '#3b82f6'
        : isHovered
          ? (isDark ? '#94a3b8' : '#475569')
          : (isDark ? '#52525b' : '#cbd5e1'),
      fillOpacity: isSelected ? 0.9 : isHovered ? 0.85 : 0.72,
      className: 'transition-all duration-150',
    }
  }, [selectedMetric, isDark])

  const onEachFeature = useCallback((feature: any, layer: any) => {
    const neighborhood = feature.properties as NeighborhoodData

    layer.on({
      mouseover: (e: any) => {
        const l = e.target
        l.setStyle(getFeatureStyle(feature, true))
        if (!isMobile) l.bringToFront()

        // Position hover tooltip relative to map container
        if (containerRef.current && !isMobile) {
          const rect = containerRef.current.getBoundingClientRect()
          const point = e.containerPoint
          setHoveredNeighborhood({
            name: neighborhood.name,
            value: neighborhood[selectedMetric],
            x: point.x,
            y: point.y,
          })
        }
      },
      mousemove: (e: any) => {
        if (!isMobile && containerRef.current) {
          const point = e.containerPoint
          setHoveredNeighborhood(prev => prev ? { ...prev, x: point.x, y: point.y } : null)
        }
      },
      mouseout: (e: any) => {
        const l = e.target
        const isSelected = selectedNeighborhood?.name === neighborhood.name
        l.setStyle(getFeatureStyle(feature, false, isSelected))
        setHoveredNeighborhood(null)
      },
      click: () => {
        setSelectedNeighborhood(neighborhood)
        setHoveredNeighborhood(null)
        if (onNeighborhoodClick) onNeighborhoodClick(neighborhood)

        // Pan map to center on clicked neighborhood on mobile
        if (isMobile && mapRef.current && feature.geometry?.coordinates?.[0]) {
          try {
            const coords = feature.geometry.coordinates[0]
            if (coords && coords.length > 0) {
              const lats = coords.map((c: number[]) => c[1])
              const lngs = coords.map((c: number[]) => c[0])
              const avgLat = lats.reduce((a: number, b: number) => a + b, 0) / lats.length
              const avgLng = lngs.reduce((a: number, b: number) => a + b, 0) / lngs.length
              mapRef.current.panTo([avgLat, avgLng])
            }
          } catch {}
        }
      },
    })

    // Add accessible title attribute
    if (layer.getElement) {
      const el = layer.getElement?.()
      if (el) {
        el.setAttribute('aria-label', `${neighborhood.name} - ${metricLabels[selectedMetric]}: ${neighborhood[selectedMetric]}`)
        el.setAttribute('tabindex', '0')
        el.setAttribute('role', 'button')
      }
    }
  }, [selectedMetric, isMobile, onNeighborhoodClick, getFeatureStyle, selectedNeighborhood])

  if (!mounted) return null

  return (
    <div ref={containerRef} className="relative w-full h-full" role="region" aria-label="LA Crime Map">
      {/* Skip link for keyboard users */}
      <a
        href="#map-skip-target"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[2000] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:font-semibold"
      >
        Skip map to content
      </a>

      <div className="w-full h-full rounded-xl overflow-hidden border-2 shadow-2xl border-gray-200 dark:border-gray-700">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
          zoomControl={false}
          touchZoom={true}
          scrollWheelZoom={!isMobile}
          doubleClickZoom={true}
          dragging={true}
          minZoom={8}
          maxZoom={14}
          aria-label="Interactive crime map of Los Angeles"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
            data={data as GeoJsonObject}
            style={(feature) => getFeatureStyle(feature, false, selectedNeighborhood?.name === feature?.properties?.name)}
            onEachFeature={onEachFeature}
            key={`${selectedMetric}-${data.features.length}`}
          />
          <MapThemeUpdater />
          <CustomZoomControl isMobile={isMobile} />
          <MapController mapRef={mapRef} />
        </MapContainer>
      </div>

      {/* Hover tooltip */}
      <AnimatePresence>
        {hoveredNeighborhood && !selectedNeighborhood && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute z-[999] pointer-events-none"
            style={{
              left: Math.min(hoveredNeighborhood.x + 12, (containerRef.current?.offsetWidth ?? 400) - 180),
              top: Math.max(hoveredNeighborhood.y - 50, 8),
            }}
            aria-hidden="true"
          >
            <HoverTooltip
              name={hoveredNeighborhood.name}
              value={hoveredNeighborhood.value}
              metric={selectedMetric}
              isDark={isDark}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating detail popup */}
      <AnimatePresence>
        {selectedNeighborhood && (
          <div
            className={`absolute z-[1001] ${
              isMobile
                ? 'bottom-3 left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)]'
                : 'top-3 right-3'
            }`}
          >
            <FloatingPopup
              neighborhood={selectedNeighborhood}
              selectedMetric={selectedMetric}
              onClose={() => setSelectedNeighborhood(null)}
              isDark={isDark}
            />
          </div>
        )}
      </AnimatePresence>

      {/* Mobile: tap instruction */}
      {isMobile && !selectedNeighborhood && (
        <div className="absolute bottom-3 left-3 right-3 flex justify-center pointer-events-none z-[1000]">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="px-4 py-2 bg-black/70 backdrop-blur-md text-white text-xs rounded-full font-medium"
          >
            Tap a neighborhood to see details
          </motion.div>
        </div>
      )}

      {/* Accessible skip target */}
      <div id="map-skip-target" tabIndex={-1} className="sr-only">End of map</div>
    </div>
  )
})
