# LA Crime Map - Integration Guide

## Quick Start

### Basic Implementation

```tsx
import { MapWrapper } from '@/components/map/map-wrapper'
import { Legend } from '@/components/ui/legend'
import { useState } from 'react'

export default function MapPage() {
  const [selectedMetric, setSelectedMetric] = useState<CrimeMetric>('violentCrime')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodData | null>(null)

  return (
    <div className="relative w-full h-screen">
      {/* Map Container */}
      <MapWrapper
        data={neighborhoodData}
        selectedMetric={selectedMetric}
        onNeighborhoodClick={setSelectedNeighborhood}
      />

      {/* Legend - Positioned Absolutely */}
      <div className="absolute top-4 left-4 z-[1000] max-w-xs">
        <Legend showDetails={false} />
      </div>
    </div>
  )
}
```

---

## Advanced Implementation

### With All Controls and Features

```tsx
'use client'

import { MapWrapper } from '@/components/map/map-wrapper'
import { Legend } from '@/components/ui/legend'
import { MapControls, MapLegendToggle, MapGuide } from '@/components/map/map-controls'
import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'

export default function AdvancedMapPage() {
  const [selectedMetric, setSelectedMetric] = useState<CrimeMetric>('violentCrime')
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<NeighborhoodData | null>(null)
  const [showLegend, setShowLegend] = useState(true)
  const [showGuide, setShowGuide] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'r' || e.key === 'R') {
        handleRecenter()
      } else if (e.key === 'f' || e.key === 'F') {
        handleToggleFullscreen()
      } else if (e.key === 'l' || e.key === 'L') {
        setShowLegend(prev => !prev)
      } else if (e.key === '?') {
        setShowGuide(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  const handleRecenter = useCallback(() => {
    // Map will recenter to LA coordinates
    window.dispatchEvent(new CustomEvent('map-recenter'))
  }, [])

  const handleToggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-gray-50 dark:bg-dark-bg-primary">
      {/* Map Container */}
      <MapWrapper
        data={neighborhoodData}
        selectedMetric={selectedMetric}
        onNeighborhoodClick={setSelectedNeighborhood}
      />

      {/* Legend - Desktop Only */}
      {!isMobile && (
        <AnimatePresence>
          {showLegend && (
            <div className="absolute top-4 left-4 z-[1000] max-w-xs">
              <Legend showDetails={false} />
            </div>
          )}
        </AnimatePresence>
      )}

      {/* Legend Toggle - Mobile */}
      {isMobile && (
        <div className="absolute top-4 left-4 z-[1000]">
          <MapLegendToggle
            isOpen={showLegend}
            onToggle={() => setShowLegend(!showLegend)}
          />
        </div>
      )}

      {/* Map Controls - Desktop */}
      {!isMobile && (
        <div className="absolute top-4 right-4 z-[1000]">
          <MapControls
            onRecenter={handleRecenter}
            onToggleFullscreen={handleToggleFullscreen}
            isFullscreen={isFullscreen}
          />
        </div>
      )}

      {/* Map Guide */}
      <AnimatePresence>
        {showGuide && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1001]">
            <MapGuide onClose={() => setShowGuide(false)} />
          </div>
        )}
      </AnimatePresence>

      {/* Help Button */}
      <button
        onClick={() => setShowGuide(true)}
        className="absolute bottom-4 left-4 z-[1000] w-10 h-10 rounded-full bg-white dark:bg-dark-bg-secondary shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        aria-label="Show map guide"
      >
        <span className="text-lg">?</span>
      </button>

      {/* Metric Selector - Your existing component */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <MetricSelector
          selectedMetric={selectedMetric}
          onMetricChange={setSelectedMetric}
        />
      </div>
    </div>
  )
}
```

---

## Component Props Reference

### MapWrapper
```tsx
interface MapWrapperProps {
  data: NeighborhoodGeoJSON       // GeoJSON data with neighborhoods
  selectedMetric: CrimeMetric     // Current metric to display
  onNeighborhoodClick?: (neighborhood: NeighborhoodData) => void
}
```

### Legend
```tsx
interface LegendProps {
  className?: string              // Additional CSS classes
  showDetails?: boolean           // Auto-expand details section
}
```

### MapControls
```tsx
interface MapControlsProps {
  onRecenter?: () => void         // Callback for recenter button
  onToggleFullscreen?: () => void // Callback for fullscreen toggle
  isFullscreen?: boolean          // Current fullscreen state
  className?: string              // Additional CSS classes
}
```

### MapLegendToggle
```tsx
interface MapLegendToggleProps {
  isOpen: boolean                 // Current legend visibility
  onToggle: () => void            // Toggle callback
  className?: string              // Additional CSS classes
}
```

### MapGuide
```tsx
interface MapGuideProps {
  onClose: () => void             // Close callback
}
```

---

## Layout Patterns

### Sidebar Layout
```tsx
<div className="flex h-screen">
  {/* Sidebar */}
  <aside className="w-80 bg-white dark:bg-dark-bg-secondary p-4 overflow-y-auto">
    <Legend showDetails={true} />
    {/* Other sidebar content */}
  </aside>

  {/* Map */}
  <main className="flex-1">
    <MapWrapper {...props} />
  </main>
</div>
```

### Overlay Layout
```tsx
<div className="relative h-screen">
  {/* Map fills entire screen */}
  <MapWrapper {...props} />

  {/* Floating panels */}
  <div className="absolute top-4 left-4 right-4 flex justify-between pointer-events-none">
    <div className="pointer-events-auto">
      <Legend />
    </div>
    <div className="pointer-events-auto">
      <MapControls {...controlProps} />
    </div>
  </div>
</div>
```

### Mobile-First Layout
```tsx
<div className="relative h-screen">
  <MapWrapper {...props} />

  {/* Mobile: Bottom sheet */}
  <div className="md:hidden absolute bottom-0 left-0 right-0 z-[1000]">
    <SwipeableDrawer>
      <Legend showDetails={false} />
    </SwipeableDrawer>
  </div>

  {/* Desktop: Side panel */}
  <div className="hidden md:block absolute top-4 left-4 z-[1000] max-w-xs">
    <Legend showDetails={false} />
  </div>
</div>
```

---

## Styling Tips

### Custom Legend Position
```tsx
// Top Right
<div className="absolute top-4 right-4 z-[1000] max-w-xs">
  <Legend />
</div>

// Bottom Left
<div className="absolute bottom-4 left-4 z-[1000] max-w-xs">
  <Legend />
</div>

// Centered Top
<div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] max-w-xs">
  <Legend />
</div>
```

### Responsive Sizing
```tsx
// Different widths for different screens
<div className="w-full sm:w-96 md:w-80 lg:w-96">
  <Legend />
</div>

// Hide on mobile
<div className="hidden lg:block">
  <Legend />
</div>
```

### Custom Map Height
```tsx
// Full viewport minus header
<div className="h-[calc(100vh-4rem)]">
  <MapWrapper {...props} />
</div>

// Fixed height
<div className="h-[600px]">
  <MapWrapper {...props} />
</div>

// Dynamic height
<div className="min-h-screen">
  <MapWrapper {...props} />
</div>
```

---

## Event Handling

### Neighborhood Selection
```tsx
const handleNeighborhoodClick = (neighborhood: NeighborhoodData) => {
  // Update selected state
  setSelectedNeighborhood(neighborhood)

  // Log analytics
  analytics.track('neighborhood_viewed', {
    name: neighborhood.name,
    crimeLevel: getNeighborhoodCrimeLevel(neighborhood, selectedMetric)
  })

  // Update URL
  router.push(`/map?neighborhood=${encodeURIComponent(neighborhood.name)}`)

  // Show detail panel
  setShowDetailPanel(true)
}
```

### Metric Changes
```tsx
const handleMetricChange = (metric: CrimeMetric) => {
  setSelectedMetric(metric)

  // Clear selection when changing metrics
  setSelectedNeighborhood(null)

  // Update URL
  router.push(`/map?metric=${metric}`)
}
```

---

## Performance Tips

### Lazy Loading
```tsx
// Legend is heavy, load it only when needed
const Legend = dynamic(() => import('@/components/ui/legend').then(m => ({ default: m.Legend })), {
  ssr: false,
  loading: () => <LoadingSkeleton variant="card" />
})
```

### Memoization
```tsx
const memoizedData = useMemo(() => processNeighborhoodData(rawData), [rawData])

const handleClick = useCallback(
  (neighborhood: NeighborhoodData) => {
    // Handler logic
  },
  [/* dependencies */]
)
```

### Conditional Rendering
```tsx
// Don't render controls until map is loaded
{mapLoaded && <MapControls {...props} />}

// Hide legend on small screens
{!isMobile && <Legend />}
```

---

## Accessibility

### Keyboard Shortcuts
- `R` - Recenter map
- `F` - Toggle fullscreen
- `L` - Toggle legend
- `?` - Show help guide
- `Esc` - Close popups
- `Tab` - Navigate controls

### ARIA Labels
All interactive elements have proper labels:
```tsx
<button aria-label="Recenter map to Los Angeles">
<div role="region" aria-label="Crime map">
<button aria-expanded={isOpen}>
```

### Focus Management
```tsx
// Auto-focus first element in popup
useEffect(() => {
  if (showPopup) {
    popupRef.current?.querySelector('button')?.focus()
  }
}, [showPopup])
```

---

## Common Issues & Solutions

### Map Not Loading
```tsx
// Ensure dynamic import has ssr: false
const MapWrapper = dynamic(() => import('./map-wrapper'), {
  ssr: false,
  loading: () => <MapSkeleton />
})
```

### Popups Not Showing
```tsx
// Check z-index hierarchy
// Popup container should have z-[1001]
// Map should have z-0
// Legend should have z-[1000]
```

### Theme Not Switching
```tsx
// Ensure ThemeProvider wraps entire app
<ThemeProvider attribute="class" defaultTheme="system">
  <MapWrapper {...props} />
</ThemeProvider>
```

### Mobile Touch Issues
```tsx
// Ensure touch events are enabled
touchZoom={true}
dragging={true}
scrollWheelZoom={!isMobile}  // Disable on mobile
```

---

## Testing Checklist

- [ ] Map loads successfully
- [ ] Popups appear on click
- [ ] Hover states work on desktop
- [ ] Touch interactions work on mobile
- [ ] Legend displays correctly
- [ ] Theme switching works
- [ ] Keyboard shortcuts function
- [ ] Loading skeleton appears
- [ ] Data updates when metric changes
- [ ] Responsive on all screen sizes
- [ ] No console errors
- [ ] Smooth 60fps animations

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Safari 14+
- Chrome Mobile 90+

---

## Dependencies Required

Already included in package.json:
- `leaflet` - Map library
- `react-leaflet` - React bindings
- `framer-motion` - Animations
- `lucide-react` - Icons
- `next-themes` - Theme support

---

## Further Customization

### Custom Colors
Edit `lib/utils/crime-stats.ts`:
```tsx
export function getCrimeColor(level: 'low' | 'medium' | 'high', isDark: boolean) {
  // Your custom colors here
}
```

### Custom Popup Layout
Edit `components/map/crime-map.tsx`:
```tsx
function FloatingPopup({ ... }) {
  // Customize popup structure
}
```

### Custom Legend Items
Edit `components/ui/legend.tsx`:
```tsx
const legendItems = [
  // Your custom legend configuration
]
```

---

## Support

For issues or questions, check:
1. MAP_UX_IMPROVEMENTS.md for detailed documentation
2. Component prop interfaces for API details
3. Browser console for error messages
4. Network tab for data loading issues
