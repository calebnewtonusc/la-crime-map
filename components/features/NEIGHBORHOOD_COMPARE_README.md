# Neighborhood Comparison Tool

A comprehensive, interactive neighborhood comparison component for the LA Crime Map application. Built with React, TypeScript, Framer Motion, and Recharts.

## Features

### Core Functionality
- **Multi-select Interface**: Choose 2-4 neighborhoods to compare using an elegant dropdown
- **Smart Scoring System**: Automatic safety score calculation (0-100) based on crime metrics
- **Trend Analysis**: Real-time trend indicators (↑↓→) comparing neighborhoods against each other
- **Population Metrics**: Integrated population density data for context

### Data Visualization
- **Side-by-side Comparison Table**: Desktop-optimized table view with winner badges
- **Mobile-responsive Cards**: Stacked card layout on smaller screens
- **Interactive Bar Charts**: Crime metrics comparison using Recharts
- **Radar Charts**: Multi-dimensional safety profile visualization
- **Color-coded Metrics**: Visual distinction for each neighborhood

### Intelligent Recommendations
- **Best/Worst Feature Analysis**: Automatically identifies strongest and weakest aspects
- **Contextual Recommendations**: Safety-score-based suggestions
  - 80+: "Excellent for families and young professionals"
  - 65-79: "Good overall, exercise normal caution"
  - 50-64: "Moderate safety, be aware of surroundings"
  - 35-49: "Higher crime area, avoid walking alone at night"
  - <35: "High crime area, take extra precautions"
- **Winner Summary**: Highlights overall best neighborhood in comparison

### Sharing & Export
- **Shareable URLs**: Generate URLs with comparison pre-selected
  - Example: `?compare=Beverly%20Hills,Downtown%20LA,Santa%20Monica`
  - Auto-loads from URL parameters on page load
- **Export Functionality**: Placeholder for PDF/image export (extensible)
- **Copy URL Button**: One-click sharing with visual feedback

### UX/UI Features
- **Framer Motion Animations**: Smooth transitions and micro-interactions
- **Dark Mode Support**: Full theme compatibility
- **Responsive Design**: Mobile-first approach with breakpoint optimizations
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Loading States**: Graceful empty states and loading indicators
- **Visual Feedback**: Hover effects, active states, selection indicators

## Installation & Setup

The component is already installed at:
```
/Users/joelnewton/Desktop/2026-Code/la-crime-map/components/features/neighborhood-compare.tsx
```

### Dependencies
All required dependencies are already in your `package.json`:
- `framer-motion` - Animations
- `recharts` - Charts and data visualization
- `lucide-react` - Icons

## Usage Examples

### Basic Usage
```tsx
import { NeighborhoodCompare } from '@/components/features/neighborhood-compare'

function MyPage() {
  return <NeighborhoodCompare />
}
```

### Pre-selected Neighborhoods
```tsx
<NeighborhoodCompare
  initialNeighborhoods={['Beverly Hills', 'Downtown LA', 'Santa Monica']}
/>
```

### With Close Handler (Modal)
```tsx
<NeighborhoodCompare
  onClose={() => setShowModal(false)}
/>
```

### Integration with Main Page
```tsx
// Add to app/page.tsx after the map section
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.5, duration: 0.5 }}
  className="mt-12"
>
  <NeighborhoodCompare />
</motion.div>
```

### Modal Overlay Pattern
```tsx
'use client'

import { useState } from 'react'
import { NeighborhoodCompare } from '@/components/features/neighborhood-compare'
import { motion, AnimatePresence } from 'framer-motion'

export function ComparisonModal() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-neon-cyan to-neon-purple text-white px-6 py-3 rounded-full shadow-2xl z-50"
      >
        Compare Neighborhoods
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <div className="relative min-h-screen flex items-start justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-gray-50 dark:bg-dark-bg-primary rounded-2xl shadow-2xl w-full max-w-7xl my-8 p-6"
              >
                <NeighborhoodCompare onClose={() => setIsOpen(false)} />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
```

### Map Popup Integration
Add "Add to Compare" buttons in your map neighborhood popups:

```tsx
function MapPopup({ neighborhoodName }: { neighborhoodName: string }) {
  const [compareList, setCompareList] = useState<string[]>([])

  const addToCompare = (name: string) => {
    if (!compareList.includes(name) && compareList.length < 4) {
      setCompareList([...compareList, name])
    }
  }

  return (
    <div className="space-y-2">
      <h3 className="font-bold">{neighborhoodName}</h3>
      {/* Crime stats */}

      <button
        onClick={() => addToCompare(neighborhoodName)}
        disabled={compareList.includes(neighborhoodName) || compareList.length >= 4}
        className="w-full bg-neon-cyan hover:bg-neon-cyan/90 disabled:bg-gray-300 text-white py-2 rounded-lg"
      >
        {compareList.includes(neighborhoodName) ? '✓ Added' : 'Add to Compare'}
      </button>
    </div>
  )
}
```

## Component Props

```typescript
interface NeighborhoodCompareProps {
  // Optional: Pre-select neighborhoods on load
  initialNeighborhoods?: string[]

  // Optional: Close handler for modal/overlay usage
  onClose?: () => void
}
```

## Data Structure

The component uses the existing neighborhood data from:
```typescript
import { laNeighborhoods } from '@/lib/data/neighborhoods'
import { NeighborhoodData } from '@/lib/data/types'
```

### Safety Score Calculation
```typescript
// Lower crime = higher safety score
const totalCrime = violentCrime + carTheft + breakIns + pettyTheft
const maxCrime = 100 // Approximate maximum
const safetyScore = Math.max(0, Math.min(100, 100 - (totalCrime / maxCrime) * 100))
```

### Trend Indicators
```typescript
// Compares each neighborhood against the average of selected neighborhoods
if (value < avg * 0.9) return 'down'  // Good - below average
if (value > avg * 1.1) return 'up'    // Bad - above average
return 'stable'                        // Neutral
```

## Responsive Breakpoints

- **Mobile (<1024px)**: Stacked card layout
- **Desktop (≥1024px)**: Full table layout with all columns
- **Charts**: Responsive containers adapt to screen size

## Color Scheme

```typescript
const colors = [
  '#00f5ff',  // Neon cyan
  '#b537f2',  // Neon purple
  '#ff2d95',  // Neon pink
  '#10b981'   // Green
]
```

## Customization

### Modify Safety Score Thresholds
Edit the `calculateSafetyScore` function to adjust scoring:

```typescript
const safetyScore = Math.max(0, Math.min(100, 100 - (totalCrime / maxCrime) * 100))
```

### Change Recommendations
Update the recommendation logic in the `comparisons` useMemo:

```typescript
if (safetyScore >= 80) {
  recommendation = 'Your custom message'
  recommendationType = 'positive'
}
```

### Add Population Data
Update the `getPopulationDensity` function with real data:

```typescript
const densityMap: Record<string, number> = {
  'Downtown LA': 18000,
  // Add more neighborhoods...
}
```

### Customize Charts
Modify the Recharts components in the Charts section:

```typescript
<BarChart data={barChartData}>
  {/* Customize bars, colors, axes */}
</BarChart>
```

## Performance Optimization

- **useMemo**: Comparison calculations only run when selections change
- **Lazy rendering**: Charts render only when 2+ neighborhoods selected
- **Efficient animations**: Framer Motion optimized for 60fps
- **Conditional rendering**: Mobile/desktop views don't both render

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader friendly
- Color contrast compliant
- Focus management

## Future Enhancements

### Export as PDF/Image
Install html2canvas and jsPDF:
```bash
npm install html2canvas jspdf
```

Update the `exportComparison` function:
```typescript
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

const exportComparison = async () => {
  const element = document.getElementById('comparison-content')
  const canvas = await html2canvas(element)
  const imgData = canvas.toDataURL('image/png')

  const pdf = new jsPDF()
  pdf.addImage(imgData, 'PNG', 0, 0)
  pdf.save('neighborhood-comparison.pdf')
}
```

### Additional Metrics
Add new comparison metrics by extending the NeighborhoodData type:

```typescript
// In lib/data/types.ts
export interface NeighborhoodData {
  // Existing fields...
  walkScore?: number
  transitScore?: number
  schoolRating?: number
  medianIncome?: number
}
```

### Historical Trends
Add time-based trend analysis:

```typescript
const [timeRange, setTimeRange] = useState<'1month' | '3months' | '1year'>('1month')
// Fetch historical data based on range
```

### Save Comparisons
Add localStorage persistence:

```typescript
const [savedComparisons, setSavedComparisons] = useState<string[][]>([])

const saveComparison = () => {
  const saved = JSON.parse(localStorage.getItem('comparisons') || '[]')
  saved.push(selectedNeighborhoods)
  localStorage.setItem('comparisons', JSON.stringify(saved))
}
```

## Troubleshooting

### Charts Not Rendering
Ensure Recharts is installed:
```bash
npm install recharts
```

### Dark Mode Issues
Check that `next-themes` provider wraps the app:
```tsx
// In app/layout.tsx
import { ThemeProvider } from 'next-themes'

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
```

### URL Sharing Not Working
Ensure the component is client-side rendered:
```tsx
'use client' // At the top of your file
```

### Mobile Layout Issues
Check Tailwind breakpoints are configured:
```typescript
// tailwind.config.ts
theme: {
  screens: {
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
  }
}
```

## Support

For issues or questions:
1. Check the INTEGRATION_EXAMPLE.tsx file for usage patterns
2. Review the TypeScript types in lib/data/types.ts
3. Inspect the component props and state management
4. Test in development mode with React DevTools

## License

Part of the LA Crime Map project.
