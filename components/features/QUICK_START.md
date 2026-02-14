# Quick Start Guide: Neighborhood Comparison Tool

## Add to Main Page (Easiest Method)

### Step 1: Import the Component
In your `app/page.tsx`, add this import at the top:

```tsx
import { NeighborhoodCompare } from '@/components/features'
```

### Step 2: Add to the Page
Insert the component after your map section (around line 135):

```tsx
{/* Neighborhood Comparison Section */}
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5, duration: 0.5 }}
  className="mt-12"
>
  <NeighborhoodCompare />
</motion.div>
```

### Complete Example

```tsx
'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/components/layout/main-layout'
import { MapWrapper } from '@/components/map/map-wrapper'
import { MetricSelector } from '@/components/ui/metric-selector'
import { StatsDashboard } from '@/components/ui/stats-dashboard'
import { NeighborhoodCompare } from '@/components/features' // ADD THIS
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { laNeighborhoods } from '@/lib/data/neighborhoods'
import { calculateCrimeStats } from '@/lib/utils/crime-stats'
import { CrimeMetric } from '@/lib/data/types'

export default function Home() {
  const [selectedMetric, setSelectedMetric] = useState<CrimeMetric>('violentCrime')
  const stats = calculateCrimeStats(laNeighborhoods)

  return (
    <ErrorBoundary>
      <MainLayout>
        <motion.div
          initial="initial"
          animate="animate"
          className="min-h-screen"
        >
          {/* Hero Section */}
          <motion.section className="...">
            {/* Your existing hero content */}
          </motion.section>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

            {/* Stats Dashboard */}
            <StatsDashboard stats={stats} />

            {/* Metric Selector */}
            <MetricSelector
              selectedMetric={selectedMetric}
              onChange={setSelectedMetric}
            />

            {/* Map */}
            <div className="bg-white dark:bg-dark-bg-secondary rounded-xl shadow-lg overflow-hidden">
              <div className="h-[600px] sm:h-[700px] lg:h-[800px]">
                <MapWrapper
                  data={laNeighborhoods}
                  selectedMetric={selectedMetric}
                />
              </div>
            </div>

            {/* ADD THIS: Neighborhood Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <NeighborhoodCompare />
            </motion.div>

            {/* Rest of your content */}
          </div>
        </motion.div>
      </MainLayout>
    </ErrorBoundary>
  )
}
```

## Alternative: Floating Action Button

Add a floating button that opens the comparison in a modal:

```tsx
'use client'

import { useState } from 'react'
import { NeighborhoodCompare } from '@/components/features'
import { motion, AnimatePresence } from 'framer-motion'

export default function Home() {
  const [showComparison, setShowComparison] = useState(false)

  return (
    <>
      {/* Your existing page content */}

      {/* Floating Action Button */}
      <button
        onClick={() => setShowComparison(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-neon-cyan to-neon-purple text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-neon-purple/50 transition-all z-40 font-semibold"
      >
        Compare Neighborhoods
      </button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {showComparison && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowComparison(false)}
            />
            <div className="relative min-h-screen flex items-start justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-gray-50 dark:bg-dark-bg-primary rounded-2xl shadow-2xl w-full max-w-7xl my-8 p-6"
              >
                <NeighborhoodCompare onClose={() => setShowComparison(false)} />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
```

## Test It Out

1. **Start the dev server**:
   ```bash
   cd /Users/joelnewton/Desktop/2026-Code/la-crime-map
   npm run dev
   ```

2. **Open your browser**:
   ```
   http://localhost:3000
   ```

3. **Test features**:
   - Click "Start Comparing" button
   - Select 2-4 neighborhoods from dropdown
   - View side-by-side comparison
   - Check charts and recommendations
   - Click "Share" to generate shareable URL
   - Test on mobile (resize browser)

## Pre-selected Comparison

To start with specific neighborhoods already selected:

```tsx
<NeighborhoodCompare
  initialNeighborhoods={['Beverly Hills', 'Downtown LA', 'Santa Monica', 'Compton']}
/>
```

## Share URL Example

When users share a comparison, the URL looks like:
```
http://localhost:3000/?compare=Beverly%20Hills,Downtown%20LA,Santa%20Monica
```

The component automatically detects this parameter and loads the comparison!

## Styling Notes

The component uses your existing Tailwind config:
- Dark mode: `dark:bg-dark-bg-secondary`
- Neon colors: `from-neon-cyan to-neon-purple`
- Responsive: `lg:grid-cols-2`, `md:text-xl`

No additional styling needed!

## Next Steps

1. Add the component to your main page
2. Test all features
3. Optional: Add "Add to Compare" buttons on map popups
4. Optional: Customize recommendations
5. Optional: Add real population data
6. Optional: Implement PDF export

Need help? Check:
- `NEIGHBORHOOD_COMPARE_README.md` - Full documentation
- `INTEGRATION_EXAMPLE.tsx` - Code examples
- `neighborhood-compare.tsx` - Source code
