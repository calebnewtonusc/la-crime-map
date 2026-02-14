'use client'

import { useEffect, useRef, useState, useCallback, memo } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap, ZoomControl } from 'react-leaflet'
import { LatLngExpression, Layer } from 'leaflet'
import type { GeoJsonObject } from 'geojson'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'
import { MapPin, TrendingUp, TrendingDown, Minus, ChevronRight, X, AlertTriangle, Shield, Info } from 'lucide-react'
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

// Enhanced color scheme with gradients for better visual appeal
function getEnhancedCrimeColor(level: 'low' | 'medium' | 'high', isDark: boolean = false): string {
  if (isDark) {
    switch (level) {
      case 'low': return '#10b981' // emerald-500
      case 'medium': return '#f59e0b' // amber-500
      case 'high': return '#ef4444' // red-500
    }
  }

  switch (level) {
    case 'low': return '#22c55e' // green-500
    case 'medium': return '#f59e0b' // amber-500
    case 'high': return '#dc2626' // red-600
  }
}

// Advanced theme updater with smooth transitions
function MapThemeUpdater() {
  const map = useMap()
  const { theme } = useTheme()

  useEffect(() => {
    const tileLayer = document.querySelector('.leaflet-tile-pane')
    if (tileLayer) {
      const element = tileLayer as HTMLElement
      element.style.transition = 'filter 0.3s ease-in-out'

      if (theme === 'dark') {
        element.style.filter = 'invert(100%) hue-rotate(180deg) brightness(0.95) contrast(0.9)'
      } else {
        element.style.filter = 'brightness(1.05) contrast(1.05) saturate(1.1)'
      }
    }
  }, [theme, map])

  return null
}

// Beautiful floating popup component
interface FloatingPopupProps {
  neighborhood: NeighborhoodData
  selectedMetric: CrimeMetric
  onClose: () => void
  isDark: boolean
}

function FloatingPopup({ neighborhood, selectedMetric, onClose, isDark }: FloatingPopupProps) {
  const level = getNeighborhoodCrimeLevel(neighborhood, selectedMetric)
  const allMetrics: CrimeMetric[] = ['violentCrime', 'carTheft', 'breakIns', 'pettyTheft']
  const totalCrimes = allMetrics.reduce((sum, metric) => sum + neighborhood[metric], 0)

  const getTrendIcon = () => {
    if (neighborhood.trendIndicator === 'improving') return <TrendingDown className="w-4 h-4" />
    if (neighborhood.trendIndicator === 'worsening') return <TrendingUp className="w-4 h-4" />
    return <Minus className="w-4 h-4" />
  }

  const getTrendColor = () => {
    if (neighborhood.trendIndicator === 'improving') return 'text-green-500'
    if (neighborhood.trendIndicator === 'worsening') return 'text-red-500'
    return 'text-gray-500'
  }

  const levelConfig = {
    low: { icon: Shield, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
    medium: { icon: Info, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
    high: { icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' }
  }

  const config = levelConfig[level]
  const LevelIcon = config.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 5 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={`
        min-w-[320px] max-w-[380px]
        ${isDark ? 'bg-dark-bg-secondary' : 'bg-white'}
        rounded-2xl shadow-2xl border
        ${isDark ? 'border-gray-700' : 'border-gray-200'}
        overflow-hidden
      `}
    >
      {/* Header with gradient */}
      <div className={`
        relative px-5 py-4
        ${isDark
          ? 'bg-gradient-to-br from-dark-bg-tertiary to-dark-bg-secondary'
          : 'bg-gradient-to-br from-gray-50 to-white'
        }
        border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}
      `}>
        <button
          onClick={onClose}
          className={`
            absolute top-3 right-3 p-1.5 rounded-lg transition-all
            ${isDark
              ? 'hover:bg-dark-bg-primary text-dark-text-secondary hover:text-dark-text-primary'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }
          `}
          aria-label="Close popup"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 pr-8">
          <div className={`
            p-2 rounded-xl ${config.bg} ${config.border} border
          `}>
            <MapPin className={`w-5 h-5 ${config.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`
              font-bold text-lg mb-1
              ${isDark ? 'text-dark-text-primary' : 'text-gray-900'}
            `}>
              {neighborhood.name}
            </h3>
            <div className="flex items-center gap-2">
              <span className={`
                text-xs font-semibold px-2.5 py-1 rounded-full
                ${config.bg} ${config.color}
              `}>
                {level.toUpperCase()} RISK
              </span>
              {neighborhood.trendIndicator !== 'insufficient_data' && (
                <span className={`flex items-center gap-1 text-xs ${getTrendColor()}`}>
                  {getTrendIcon()}
                  <span className="capitalize">{neighborhood.trendIndicator}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Crime Statistics */}
      <div className="px-5 py-4 space-y-3">
        {/* Primary Metric */}
        <div className={`
          p-4 rounded-xl border
          ${isDark
            ? 'bg-dark-bg-primary border-gray-700'
            : 'bg-gradient-to-br from-gray-50 to-white border-gray-200'
          }
        `}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${isDark ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
              {metricLabels[selectedMetric]}
            </span>
            <span className={`text-2xl font-bold ${config.color}`}>
              {neighborhood[selectedMetric]}
            </span>
          </div>
          <p className={`text-xs ${isDark ? 'text-dark-text-tertiary' : 'text-gray-500'}`}>
            {metricDescriptions[selectedMetric]}
          </p>
        </div>

        {/* All Crime Types */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wide ${isDark ? 'text-dark-text-tertiary' : 'text-gray-500'}`}>
              All Crime Types
            </span>
            <span className={`text-xs font-bold ${isDark ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
              Total: {totalCrimes}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {allMetrics.map((metric) => {
              const isSelected = metric === selectedMetric
              const metricLevel = getNeighborhoodCrimeLevel(neighborhood, metric)
              const metricColor = getEnhancedCrimeColor(metricLevel, isDark)

              return (
                <div
                  key={metric}
                  className={`
                    p-3 rounded-lg border transition-all
                    ${isSelected
                      ? `${config.bg} ${config.border} border-2`
                      : isDark
                        ? 'bg-dark-bg-tertiary/50 border-gray-700'
                        : 'bg-gray-50 border-gray-200'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-medium ${isDark ? 'text-dark-text-secondary' : 'text-gray-600'}`}>
                      {metricLabels[metric]}
                    </span>
                    <span className={`text-lg font-bold ${isSelected ? config.color : isDark ? 'text-dark-text-primary' : 'text-gray-900'}`}>
                      {neighborhood[metric]}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(neighborhood[metric] / 25) * 100}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: metricColor }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Data Quality Indicator */}
        {neighborhood.hasSufficientData && (
          <div className={`
            flex items-center gap-2 px-3 py-2 rounded-lg text-xs
            ${isDark ? 'bg-dark-bg-primary' : 'bg-gray-50'}
          `}>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className={isDark ? 'text-dark-text-secondary' : 'text-gray-600'}>
              Data Quality: {Math.round(neighborhood.dataQualityScore * 100)}% •
              Updated {new Date(neighborhood.lastUpdated).toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Footer Action */}
      <div className={`
        px-5 py-3 border-t
        ${isDark ? 'bg-dark-bg-tertiary/30 border-gray-700' : 'bg-gray-50 border-gray-200'}
      `}>
        <button
          onClick={onClose}
          className={`
            w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
            font-medium text-sm transition-all
            ${isDark
              ? 'bg-neon-cyan/10 text-neon-cyan hover:bg-neon-cyan/20'
              : 'bg-blue-500 text-white hover:bg-blue-600'
            }
          `}
        >
          View Full Details
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

// Custom zoom controls with LA theming
function CustomZoomControl({ isMobile }: { isMobile: boolean }) {
  const map = useMap()
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      className={`
        absolute ${isMobile ? 'bottom-24 right-4' : 'top-4 left-4'}
        z-[1000] flex flex-col gap-1
      `}
    >
      <button
        onClick={() => map.zoomIn()}
        className={`
          w-10 h-10 rounded-lg shadow-lg backdrop-blur-md
          flex items-center justify-center font-bold text-lg
          transition-all active:scale-95
          ${isDark
            ? 'bg-dark-bg-secondary/90 text-dark-text-primary hover:bg-dark-bg-tertiary border border-gray-700'
            : 'bg-white/90 text-gray-900 hover:bg-gray-50 border border-gray-200'
          }
        `}
        aria-label="Zoom in"
      >
        +
      </button>
      <button
        onClick={() => map.zoomOut()}
        className={`
          w-10 h-10 rounded-lg shadow-lg backdrop-blur-md
          flex items-center justify-center font-bold text-lg
          transition-all active:scale-95
          ${isDark
            ? 'bg-dark-bg-secondary/90 text-dark-text-primary hover:bg-dark-bg-tertiary border border-gray-700'
            : 'bg-white/90 text-gray-900 hover:bg-gray-50 border border-gray-200'
          }
        `}
        aria-label="Zoom out"
      >
        −
      </button>
    </motion.div>
  )
}

// Main map component with all enhancements
export const CrimeMap = memo(function CrimeMap({ data, selectedMetric, onNeighborhoodClick }: CrimeMapProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodData | null>(null)
  const [hoveredLayer, setHoveredLayer] = useState<Layer | null>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const center: LatLngExpression = [34.0522, -118.2437]
  const zoom = isMobile ? 9 : 10

  const isDark = theme === 'dark'

  // Enhanced feature styling with smooth animations
  const getFeatureStyle = useCallback((feature: any, isHovered = false) => {
    const neighborhood = feature.properties as NeighborhoodData
    const level = getNeighborhoodCrimeLevel(neighborhood, selectedMetric)
    const color = getEnhancedCrimeColor(level, isDark)

    return {
      fillColor: color,
      weight: isHovered ? 3 : 2,
      opacity: 1,
      color: isHovered
        ? (isDark ? '#94a3b8' : '#475569')
        : (isDark ? '#64748b' : '#cbd5e1'),
      fillOpacity: isHovered ? 0.85 : 0.7,
      className: 'transition-all duration-200'
    }
  }, [selectedMetric, isDark])

  // Enhanced interaction handlers
  const onEachFeature = useCallback((feature: any, layer: any) => {
    const neighborhood = feature.properties as NeighborhoodData

    layer.on({
      mouseover: (e: any) => {
        const layer = e.target
        setHoveredLayer(layer)
        layer.setStyle(getFeatureStyle(feature, true))

        if (!isMobile) {
          layer.bringToFront()
        }
      },
      mouseout: (e: any) => {
        const layer = e.target
        setHoveredLayer(null)
        layer.setStyle(getFeatureStyle(feature, false))
      },
      click: (e: any) => {
        setSelectedNeighborhood(neighborhood)
        if (onNeighborhoodClick) {
          onNeighborhoodClick(neighborhood)
        }
      },
    })
  }, [selectedMetric, isMobile, onNeighborhoodClick, getFeatureStyle])

  if (!mounted) {
    return null
  }

  return (
    <div className="relative w-full h-full">
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
          minZoom={9}
          maxZoom={13}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <GeoJSON
            data={data as GeoJsonObject}
            style={(feature) => getFeatureStyle(feature, false)}
            onEachFeature={onEachFeature}
            key={selectedMetric}
          />
          <MapThemeUpdater />
          <CustomZoomControl isMobile={isMobile} />
        </MapContainer>
      </div>

      {/* Floating popup */}
      <AnimatePresence>
        {selectedNeighborhood && (
          <div
            ref={popupRef}
            className={`
              absolute z-[1001]
              ${isMobile
                ? 'bottom-4 left-1/2 -translate-x-1/2'
                : 'top-4 right-4'
              }
            `}
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
    </div>
  )
})
